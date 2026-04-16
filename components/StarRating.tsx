"use client";

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
  description?: string;
  required?: boolean;
}

const LABELS = ["", "Très mauvais", "Mauvais", "Moyen", "Bon", "Excellent"];

export default function StarRating({
  value,
  onChange,
  label,
  description,
  required,
}: StarRatingProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-parchemin text-sm font-sans font-medium">
          {label} {required && <span className="text-brique">*</span>}
        </label>
        {value > 0 && (
          <span className="text-brique text-xs font-mono">{LABELS[value]}</span>
        )}
      </div>
      {description && (
        <p className="text-acier text-xs font-sans">{description}</p>
      )}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="star-btn text-2xl transition-all"
            title={LABELS[star]}
          >
            <span
              className={
                star <= value
                  ? "text-or drop-shadow-[0_0_6px_rgba(212,168,67,0.6)]"
                  : "text-[#2d3748]"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
