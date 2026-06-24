import { buildSystemPrompt } from "@/lib/system-prompt";
import { profile } from "@/lib/profile";
import { limit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_CHARS = 1000; // per user message
const MAX_MESSAGES = 20; // per conversation
// .trim() guards against keys/slugs pasted with a stray space or newline.
const MODEL = (process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-haiku").trim();

type ClientMessage = { role: "user" | "assistant"; content: string };

function text(message: string, status = 200): Response {
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
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
    return text(
      "You've hit the message limit for now — reach Sahil on LinkedIn or book a call.",
      429,
    );
  }

  // 2) parse + validate
  let messages: ClientMessage[];
  try {
    const body = await req.json();
    messages = body?.messages;
  } catch {
    return text("Invalid request.", 400);
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return text("Invalid request.", 400);
  }
  const trimmed = messages.slice(-MAX_MESSAGES).filter(
    (m): m is ClientMessage =>
      !!m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string",
  );
  const lastMsg = trimmed.at(-1);
  if (!lastMsg || lastMsg.role !== "user") {
    return text("Invalid request.", 400);
  }
  if (lastMsg.content.length > MAX_CHARS) {
    return text("Message too long.", 400);
  }

  // 3) no key configured → graceful escalation (keeps local dev + previews alive)
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return text(
      `The live assistant isn't configured in this environment yet. ${profile.chatbot.escalationNote}`,
    );
  }

  // 4) call OpenRouter (OpenAI-compatible). Non-streaming for reliability on the
  //    Node serverless runtime, plus an abort timeout so the function can't hang.
  const controller = new AbortController();
  const abortTimer = setTimeout(() => controller.abort(), 25_000);

  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": profile.identity.links.website,
        // Header values must be Latin-1 (ASCII) — a non-ASCII char (e.g. an
        // em-dash) makes fetch throw before the request is even sent.
        "X-Title": "Ask Sahil - sahilsapra.com",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...trimmed.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(abortTimer);
    console.error("[chat] OpenRouter request threw or timed out:", err);
    return text(
      `Sorry — the assistant is unreachable right now. ${profile.chatbot.escalationNote}`,
    );
  }
  clearTimeout(abortTimer);

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    console.error(
      `[chat] OpenRouter responded ${upstream.status} for model "${MODEL}":`,
      detail.slice(0, 500),
    );
    return text(
      `Sorry — the assistant hit an error. ${profile.chatbot.escalationNote}`,
    );
  }

  let content = "";
  try {
    const data = await upstream.json();
    const c = data?.choices?.[0]?.message?.content;
    content = typeof c === "string" ? c.trim() : "";
  } catch (err) {
    console.error("[chat] failed to parse OpenRouter response:", err);
  }

  if (!content) {
    return text(
      `Sorry — I couldn't generate a reply just now. ${profile.chatbot.escalationNote}`,
    );
  }

  return text(content);
}
