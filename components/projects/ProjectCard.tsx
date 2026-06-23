"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { logEvent } from "@/lib/analytics";

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);

  function toggle() {
    setExpanded((prev) => {
      if (!prev) logEvent("project_expanded", { project: project.name });
      return !prev;
    });
  }

  return (
    <div
      className="h-card"
      style={{
        border: "1px solid var(--line)",
        borderRadius: 8,
        background: "var(--surface)",
        padding: 22,
        display: "flex",
        flexDirection: "column",
        transition: "border-color .15s, transform .15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 14,
        }}
      >
        {project.metric && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 999,
              background: "color-mix(in srgb, var(--pass) 14%, transparent)",
              color: "var(--pass)",
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              fontWeight: 500,
            }}
          >
            ✓ {project.metric}
          </span>
        )}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-lo)",
            whiteSpace: "nowrap",
            marginLeft: "auto",
          }}
        >
          {project.year}
        </span>
      </div>

      <h3
        style={{
          fontSize: 17,
          fontWeight: 600,
          lineHeight: 1.25,
          marginBottom: 5,
        }}
      >
        {project.name}
      </h3>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--brand-soft)",
          marginBottom: 12,
        }}
      >
        {project.role}
      </div>
      <p
        style={{
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--text-lo)",
          marginBottom: 14,
        }}
      >
        {project.blurb}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateRows: expanded ? "1fr" : "0fr",
          transition: "grid-template-rows .38s cubic-bezier(.4, 0, .2, 1)",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "var(--text-hi)",
              margin: "0 0 14px",
              padding: "12px 14px",
              borderLeft: "2px solid var(--brand)",
              background: "var(--surface-2)",
              borderRadius: "0 6px 6px 0",
              opacity: expanded ? 1 : 0,
              transition: "opacity .3s ease",
            }}
          >
            {project.detail}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 16,
          marginTop: "auto",
        }}
      >
        {project.tags.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--text-lo)",
              padding: "3px 8px",
              border: "1px solid var(--line)",
              borderRadius: 5,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <button
        onClick={toggle}
        aria-expanded={expanded}
        className="h-toggle"
        style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "none",
          border: "none",
          color: "var(--text-lo)",
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          cursor: "pointer",
          transition: "color .15s",
        }}
      >
        <span
          style={{
            color: "var(--brand-soft)",
            display: "inline-block",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform .3s cubic-bezier(.4, 0, .2, 1)",
          }}
        >
          ▸
        </span>
        {expanded ? "less" : "details"}
      </button>
    </div>
  );
}
