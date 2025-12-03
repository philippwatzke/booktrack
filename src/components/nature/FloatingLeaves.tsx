import { useEffect, useState } from "react";

interface Leaf {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  type: "maple" | "oak" | "simple";
}

const LeafSVG = ({ type, size }: { type: Leaf["type"]; size: number }) => {
  if (type === "maple") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-forest-light/40"
      >
        <path d="M12 2C12 2 9.5 5 9.5 8C9.5 8 7 7 5 9C5 9 7 11 7 13C7 13 4 13 3 15C3 15 6 16 7 17C7 17 5 19 6 21C6 21 9 19 12 20C15 19 18 21 18 21C19 19 17 17 17 17C18 16 21 15 21 15C20 13 17 13 17 13C17 11 19 9 19 9C17 7 14.5 8 14.5 8C14.5 5 12 2 12 2Z" />
      </svg>
    );
  }
  if (type === "oak") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-amber-warm/50"
      >
        <path d="M12 2C8 6 6 10 8 14C6 14 4 15 4 17C6 17 8 17 10 16C10 18 10 20 12 22C14 20 14 18 14 16C16 17 18 17 20 17C20 15 18 14 16 14C18 10 16 6 12 2Z" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-moss/40"
    >
      <ellipse cx="12" cy="12" rx="6" ry="10" />
    </svg>
  );
};

export function FloatingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const types: Leaf["type"][] = ["maple", "oak", "simple"];
    const newLeaves: Leaf[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      size: 16 + Math.random() * 16,
      rotation: Math.random() * 360,
      type: types[Math.floor(Math.random() * types.length)],
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-leaf-fall"
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            transform: `rotate(${leaf.rotation}deg)`,
          }}
        >
          <LeafSVG type={leaf.type} size={leaf.size} />
        </div>
      ))}
    </div>
  );
}
