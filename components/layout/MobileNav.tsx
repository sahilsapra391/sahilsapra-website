"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import type { Links } from "@/lib/types";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ResumeButton } from "@/components/layout/ResumeButton";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { EmailButton } from "@/components/ui/EmailButton";
import { LinkedInIcon, GitHubIcon, YouTubeIcon } from "@/components/ui/icons";
import { logEvent } from "@/lib/analytics";

type NavLink = { label: string; href: string };

const social: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 46,
  height: 46,
  borderRadius: 10,
  border: "1px solid var(--line)",
  background: "var(--surface)",
  color: "var(--text-hi)",
  textDecoration: "none",
};

export function MobileNav({
  navLinks,
  links,
}: {
  navLinks: NavLink[];
  links: Links;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // lock body scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // close on Escape, and auto-close if the viewport grows to desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 720 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // close, then smooth-scroll to the section once the scroll lock has released
  const go = (href: string) => {
    setOpen(false);
    const id = href.slice(1);
    window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 90);
  };

  return (
    <div className="nav-mobile">
      <button
        className="hamburger"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {mounted &&
        createPortal(
          <div
            id="mobile-menu"
            className="mobile-menu"
            data-open={open}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
        <div className="mobile-menu-top">
          <span className="mobile-menu-brand">menu</span>
          <button
            className="hamburger is-x"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav className="mobile-menu-links">
          {navLinks.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                go(l.href);
              }}
              style={{ transitionDelay: open ? `${0.05 + i * 0.06}s` : "0s" }}
            >
              <span className="idx">0{i + 1}</span>
              {l.label}
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </nav>

        <div className="mobile-menu-actions">
          <a
            className="mobile-cta"
            href={links.scheduleCall}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              logEvent("schedule_call_clicked");
              setOpen(false);
            }}
          >
            Schedule a call <span aria-hidden="true">↗</span>
          </a>
          <div className="mobile-menu-row">
            <ResumeButton href={links.resume} />
            <ThemeToggle />
          </div>
          <div className="mobile-menu-socials">
            <TrackedLink
              href={links.linkedin}
              event="linkedin_clicked"
              newTab
              ariaLabel="LinkedIn"
              style={social}
            >
              <LinkedInIcon size={18} />
            </TrackedLink>
            <TrackedLink
              href={links.github}
              event="github_clicked"
              newTab
              ariaLabel="GitHub"
              style={social}
            >
              <GitHubIcon size={18} />
            </TrackedLink>
            <EmailButton email={links.email} style={social} iconSize={18} />
            <TrackedLink
              href={links.youtube}
              event="youtube_clicked"
              newTab
              ariaLabel="YouTube"
              style={social}
            >
              <YouTubeIcon size={18} />
            </TrackedLink>
          </div>
          </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
