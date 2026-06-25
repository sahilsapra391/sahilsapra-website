import Image from "next/image";

// Sahil's transparent memoji avatar for "Ask Sahil".
// - default ("thinking", hand-on-chin) is used for the launcher, the panel
//   header, the greeting, and a bot message while it's still streaming.
// - done ("winking") is swapped in only on a finished answer's avatar.
// object-fit: contain keeps either image undistorted regardless of its aspect.
export function MemojiAvatar({
  size = 34,
  done = false,
}: {
  size?: number;
  done?: boolean;
}) {
  const src = done ? "/sahil-memoji-done.png" : "/sahil-memoji.png";
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <Image
        src={src}
        alt="Sahil"
        fill
        sizes={`${size}px`}
        style={{ objectFit: "contain" }}
      />
    </span>
  );
}
