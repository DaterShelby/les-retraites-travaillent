import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        /*
         * Palette "Mixboard — Engaged Adulthood"
         * Primary: Executive Navy (#2C3E50) — confiance, autorité
         * Secondary: Golden Sunset (#CC8800) — chaleur, succès, aspiration
         * Accent: Forest Green (#38761D) — croissance, santé, vitalité
         * Fond: Warm Ivory (#F5F2EE) — élégance, chaleur naturelle
         * Texte: Deep Walnut (#3B2F2F) — lisible, sophistiqué
         */
        primary: {
          DEFAULT: "#2C3E50",
          foreground: "#FFFFFF",
          50: "#EEF1F4",
          100: "#D5DBE2",
          200: "#ABB7C5",
          300: "#8193A8",
          400: "#576F8B",
          500: "#2C3E50",
          600: "#253544",
          700: "#1E2B38",
          800: "#17222C",
          900: "#101820",
        },
        secondary: {
          DEFAULT: "#CC8800",
          foreground: "#FFFFFF",
          50: "#FFF8E6",
          100: "#FFEDB3",
          200: "#FFE180",
          300: "#FFD54D",
          400: "#E6A300",
          500: "#CC8800",
          600: "#A66E00",
          700: "#805500",
          800: "#593B00",
          900: "#332200",
        },
        accent: {
          DEFAULT: "#38761D",
          foreground: "#FFFFFF",
          50: "#EDF5EA",
          100: "#D4E8CD",
          200: "#A9D19B",
          300: "#7EBA69",
          400: "#53A337",
          500: "#38761D",
          600: "#2E6318",
          700: "#245013",
          800: "#1A3D0E",
          900: "#102A09",
        },
        neutral: {
          cream: "#F5F2EE",
          text: "#3B2F2F",
        },
        success: "#38761D",
        error: "#C0392B",
        warning: "#CC8800",
        info: "#2C3E50",
        destructive: {
          DEFAULT: "#C0392B",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        serif: ["var(--font-libre-baskerville)", "Georgia", "serif"],
        sans: ["var(--font-source-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.7" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body-xl": ["1.25rem", { lineHeight: "1.7" }],
      },
      spacing: {
        touch: "48px",
      },
      borderRadius: {
        none: "0px",
        sm: "8px",
        DEFAULT: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "28px",
        "3xl": "32px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        md: "0 4px 12px 0 rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
        lg: "0 12px 28px 0 rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.04)",
        xl: "0 20px 40px 0 rgba(0, 0, 0, 0.12), 0 8px 16px -8px rgba(0, 0, 0, 0.06)",
        subtle: "0 2px 4px rgba(0, 0, 0, 0.04)",
        elevated: "0 8px 24px rgba(0, 0, 0, 0.08)",
        focus: "0 0 0 3px rgba(44, 62, 80, 0.2)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.06)",
        card: "0 1px 4px 0 rgba(0, 0, 0, 0.04)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "20px",
        "2xl": "40px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(12px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          from: { transform: "translateY(-12px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          from: { transform: "translateX(16px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          from: { transform: "scale(0.96)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.4s ease-out",
        slideUp: "slideUp 0.4s ease-out",
        slideDown: "slideDown 0.3s ease-out",
        slideInRight: "slideInRight 0.3s ease-out",
        scaleIn: "scaleIn 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
