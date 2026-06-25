import Image from "next/image";

// Sahil's transparent memoji, used as the "Ask Sahil" avatar. Rendered at the
// source aspect (106×134) and centered in a square slot so it sits cleanly
// wherever the old "SS" monogram did — no background.
const RATIO = 106 / 134;

export function MemojiAvatar({ size = 34 }: { size?: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <Image
        src="/sahil-memoji.png"
        alt="Sahil"
        width={Math.round(size * RATIO)}
        height={size}
        style={{ display: "block" }}
      />
    </span>
  );
}
