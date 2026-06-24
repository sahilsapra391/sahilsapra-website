import { buildSystemPrompt } from "@/lib/system-prompt";
import { profile } from "@/lib/profile";
import { limit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_CHARS = 1000; // per user message
const MAX_MESSAGES = 20; // per conversation
// .trim() guards against keys/slugs pasted with a stray space or newline —
// a trailing newline in the key makes the Authorization header throw.
const MODEL = (process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-haiku").trim();

type ClientMessage = { role: "user" | "assistant"; content: string };

const encoder = new TextEncoder();

function textStream(message: string): Response {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(message));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  // 1) rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anon";
  const { success } = await limit(ip);
  if (!success) {
    return new Response(
      "You've hit the message limit for now — reach Sahil on LinkedIn or book a call.",
      { status: 429 },
    );
  }

  // 2) parse + validate
  let messages: ClientMessage[];
  try {
    const body = await req.json();
    messages = body?.messages;
  } catch {
    return new Response("Invalid request.", { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Invalid request.", { status: 400 });
  }
  const trimmed = messages.slice(-MAX_MESSAGES).filter(
    (m): m is ClientMessage =>
      !!m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string",
  );
  const last = trimmed.at(-1);
  if (!last || last.role !== "user") {
    return new Response("Invalid request.", { status: 400 });
  }
  if (last.content.length > MAX_CHARS) {
    return new Response("Message too long.", { status: 400 });
  }

  // 3) no key configured → graceful escalation (keeps local dev + previews alive)
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return textStream(
      `The live assistant isn't configured in this environment yet. ${profile.chatbot.escalationNote}`,
    );
  }

  // 4) call OpenRouter (OpenAI-compatible) and stream content deltas as plain text
  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": profile.identity.links.website,
        // Header values must be Latin-1 (ASCII) — a non-ASCII char like an
        // em-dash here makes fetch throw before the request is even sent.
        "X-Title": "Ask Sahil - sahilsapra.com",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...trimmed.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
  } catch (err) {
    console.error(
      "[chat] OpenRouter request threw — check OPENROUTER_API_KEY for stray whitespace/newlines:",
      err,
    );
    return textStream(
      `Sorry — the assistant is unreachable right now. ${profile.chatbot.escalationNote}`,
    );
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(
      `[chat] OpenRouter responded ${upstream.status} for model "${MODEL}":`,
      detail.slice(0, 500),
    );
    return textStream(
      `Sorry — the assistant hit an error. ${profile.chatbot.escalationNote}`,
    );
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine.startsWith("data:")) continue;
        const data = trimmedLine.slice(5).trim();
        if (data === "[DONE]") {
          controller.close();
          return;
        }
        try {
          const json = JSON.parse(data);
          const delta = json?.choices?.[0]?.delta?.content;
          if (typeof delta === "string" && delta.length) {
            controller.enqueue(encoder.encode(delta));
          }
        } catch {
          // ignore keep-alive / partial frames
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
