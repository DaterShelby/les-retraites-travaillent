import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "light" | "dark";
}

export function Logo({ size = "md", showText = true, className = "", variant = "dark" }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-base" },
    md: { icon: 38, text: "text-lg" },
    lg: { icon: 48, text: "text-xl" },
  };

  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-primary";
  const accentColor = variant === "light" ? "#FFFFFF" : "#4A6670";
  const secondaryAccent = "#F0917B";

  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* SVG Logo Mark */}
      <div className="relative flex-shrink-0">
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Rounded square background */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="14"
            fill={accentColor}
          />
          {/* Abstract connection mark — two overlapping rounded shapes */}
          <circle cx="20" cy="20" r="8" fill={secondaryAccent} opacity="0.9" />
          <circle cx="28" cy="28" r="8" fill={secondaryAccent} opacity="0.9" />
          {/* Overlap highlight */}
          <path
            d="M24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28C21.7909 28 20 26.2091 20 24C20 21.7909 21.7909 20 24 20Z"
            fill="white"
            opacity="0.95"
          />
          {/* Small accent dot */}
          <circle cx="36" cy="14" r="3" fill="#8FBFAD" />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className={`flex flex-col leading-none ${textColor}`}>
          <span className={`font-serif font-bold ${s.text} tracking-tight`}>
            Les Retraités
          </span>
          <span className={`font-serif font-bold ${s.text} tracking-tight opacity-70`}>
            Travaillent
          </span>
        </div>
      )}
    </Link>
  );
}
