interface ScoreRingProps {
  score: number; // 1-5
  size?: "sm" | "md" | "lg";
  label?: string;
}

const SCORE_COLORS = [
  "", // 0 - unused
  "#e74c3c", // 1 - red
  "#e67e22", // 2 - orange
  "#f1c40f", // 3 - yellow
  "#2ecc71", // 4 - green
  "#27ae60", // 5 - dark green
];

export default function ScoreRing({ score, size = "md", label }: ScoreRingProps) {
  const radius = size === "sm" ? 18 : size === "lg" ? 36 : 26;
  const stroke = size === "sm" ? 3 : size === "lg" ? 6 : 4;
  const dim = radius * 2 + stroke * 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 5) * circumference;
  const color = SCORE_COLORS[Math.round(score)] || SCORE_COLORS[3];
  const fontSize = size === "sm" ? 10 : size === "lg" ? 18 : 14;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="#2d3748"
          strokeWidth={stroke}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="#f5efe6"
          fontSize={fontSize}
          fontFamily="JetBrains Mono, monospace"
          fontWeight="500"
        >
          {score.toFixed(1)}
        </text>
      </svg>
      {label && (
        <span className="text-acier text-xs text-center font-sans leading-tight max-w-[70px]">
          {label}
        </span>
      )}
    </div>
  );
}
