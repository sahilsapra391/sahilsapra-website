import { profile } from "@/lib/profile";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Wordmark } from "@/components/layout/Wordmark";
import { ResumeIcon } from "@/components/ui/icons";

const NAV_LINKS = [
  { label: "work", href: "#work" },
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
          <TrackedLink
            href={links.resume}
            event="resume_viewed"
            newTab
            download
            ariaLabel="Download résumé"
            className="h-pillbtn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              height: 34,
              padding: "0 12px",
              border: "1px solid var(--line)",
              borderRadius: 999,
              background: "var(--surface)",
              color: "var(--text-lo)",
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              textDecoration: "none",
              transition: "border-color .15s, color .15s",
            }}
          >
            <ResumeIcon />
            resume
          </TrackedLink>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
