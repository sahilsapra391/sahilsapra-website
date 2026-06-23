import { profile } from "@/lib/profile";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Wordmark } from "@/components/layout/Wordmark";
import { ResumeButton } from "@/components/layout/ResumeButton";

const NAV_LINKS = [
  { label: "experience", href: "#work" },
  { label: "projects", href: "#projects" },
  { label: "stack", href: "#stack" },
  { label: "contact", href: "#contact" },
];

export function Nav() {
  const { links } = profile.identity;
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "color-mix(in srgb, var(--bg) 82%, transparent)",
        backdropFilter: "blur(14px) saturate(120%)",
        WebkitBackdropFilter: "blur(14px) saturate(120%)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="nav-pad"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Wordmark />

        <nav
          className="nav-links"
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="h-navlink"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                letterSpacing: ".04em",
                color: "var(--text-lo)",
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: 7,
                transition: "color .15s, background .15s",
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div
          className="nav-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ResumeButton href={links.resume} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
