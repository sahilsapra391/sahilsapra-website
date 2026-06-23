"use client";

import type { Links } from "@/lib/types";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { EmailButton } from "@/components/ui/EmailButton";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/icons";
import { useChat } from "@/components/chat/ChatProvider";

const circle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 53,
  height: 53,
  borderRadius: "50%",
  border: "1px solid var(--line)",
  color: "var(--text-lo)",
  textDecoration: "none",
  transition: "color .15s, border-color .15s",
};

export function HeroActions({ links }: { links: Links }) {
  const { openChat } = useChat();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
      }}
    >
      <TrackedLink
        href={links.scheduleCall}
        event="schedule_call_clicked"
        newTab
        className="h-primary"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          height: 53,
          padding: "0 24px",
          borderRadius: 999,
          background: "var(--brand)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
          transition: "background .15s, transform .15s",
        }}
      >
        Schedule a call ↗
      </TrackedLink>

      <button
        onClick={openChat}
        className="h-ghost"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          height: 53,
          padding: "0 22px",
          borderRadius: 999,
          background: "var(--surface)",
          border: "1px solid var(--line)",
          color: "var(--text-hi)",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          transition: "border-color .15s",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--pass)",
          }}
        />
        Ask Sahil
      </button>

      <div style={{ display: "flex", gap: 9, marginLeft: 2 }}>
        <TrackedLink
          href={links.linkedin}
          event="linkedin_clicked"
          newTab
          ariaLabel="LinkedIn"
          className="h-social"
          style={circle}
        >
          <LinkedInIcon />
        </TrackedLink>
        <TrackedLink
          href={links.github}
          event="github_clicked"
          newTab
          ariaLabel="GitHub"
          className="h-social"
          style={circle}
        >
          <GitHubIcon />
        </TrackedLink>
        <EmailButton email={links.email} className="h-social" style={circle} />
      </div>
    </div>
  );
}
