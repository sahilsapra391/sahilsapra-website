import { profile } from "@/lib/profile";
import { ProjectCard } from "./ProjectCard";

export function ProjectsSection() {
  return (
    <section id="projects" style={{ padding: "64px 0 24px", scrollMarginTop: 88 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 14,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--display)",
            fontWeight: 400,
            fontSize: 34,
            letterSpacing: "-.01em",
          }}
        >
          featured projects
        </h2>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>
      {/* Two independent columns so expanding a card only pushes cards in its
          own column down — the other column stays put. */}
      <div
        className="projects-cols"
        style={{
          display: "flex",
          gap: 18,
          marginTop: 30,
          alignItems: "flex-start",
        }}
      >
        <div className="projects-col">
          {profile.projects
            .filter((_, i) => i % 2 === 0)
            .map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
        </div>
        <div className="projects-col">
          {profile.projects
            .filter((_, i) => i % 2 === 1)
            .map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
        </div>
      </div>
    </section>
  );
}
