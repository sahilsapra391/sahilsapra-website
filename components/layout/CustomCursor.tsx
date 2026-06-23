"use client";

import { useEffect, useRef } from "react";

// A small dot that tracks the pointer 1:1 plus a ring that lags and grows
// over interactive elements. Desktop / fine-pointer only, and fully disabled
// under prefers-reduced-motion.
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    document.documentElement.style.cursor = "none";
    const cur = { x: -200, y: -200, rx: -200, ry: -200 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cur.x = e.clientX;
      cur.y = e.clientY;
      const dot = dotRef.current;
      if (dot) dot.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };
    const tick = () => {
      cur.rx += (cur.x - cur.rx) * 0.1;
      cur.ry += (cur.y - cur.ry) * 0.1;
      const ring = ringRef.current;
      if (ring) ring.style.transform = `translate(${cur.rx}px,${cur.ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    const onOver = (e: MouseEvent) => {
      const ring = ringRef.current;
      if (!ring) return;
      const target = (e.target as HTMLElement)?.closest?.(
        'a,button,[role="button"],input',
      );
      if (target) {
        ring.style.width = "48px";
        ring.style.height = "48px";
        ring.style.marginTop = "-24px";
        ring.style.marginLeft = "-24px";
        ring.style.borderColor = "var(--brand-soft)";
      } else {
        ring.style.width = "28px";
        ring.style.height = "28px";
        ring.style.marginTop = "-14px";
        ring.style.marginLeft = "-14px";
        ring.style.borderColor = "";
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "var(--text-hi)",
          pointerEvents: "none",
          transform: "translate(-200px,-200px)",
          marginTop: -2.5,
          marginLeft: -2.5,
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9998,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid color-mix(in srgb, var(--text-hi) 40%, transparent)",
          pointerEvents: "none",
          transform: "translate(-200px,-200px)",
          marginTop: -14,
          marginLeft: -14,
          willChange: "transform",
          transition: "width .18s, height .18s, border-color .18s, margin .18s",
        }}
      />
    </>
  );
}
