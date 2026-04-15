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
         * Palette "Brume & Pêche" — Les Retraités Travaillent
         * Primary: bleu brume (#4A6670) — confiance, calme
         * Secondary: pêche rosé (#F0917B) — chaleur, action
         * Accent: menthe douce (#8FBFAD) — fraîcheur, succès
         * Fond: crème rosé (#FAF7F5) — doux, accueillant
         * Texte: bleu charbon (#2F3D42) — lisible, élégant
         */
        primary: {
          DEFAULT: "#4A6670",
          foreground: "#FFFFFF",
          50: "#F0F4F5",
          100: "#D8E2E5",
          200: "#B1C5CC",
          300: "#8AA8B2",
          400: "#6A8B97",
          500: "#4A6670",
          600: "#3E5760",
          700: "#334850",
          800: "#283A40",
          900: "#1D2B30",
        },
        secondary: {
          DEFAULT: "#F0917B",
          foreground: "#FFFFFF",
          50: "#FEF2EF",
          100: "#FCDDD6",
          200: "#F9BBAD",
          300: "#F0917B",
          400: "#ED7A60",
          500: "#E86345",
          600: "#D14A2E",
          700: "#A03822",
          800: "#6F2718",
          900: "#3E150D",
        },
        accent: {
          DEFAULT: "#8FBFAD",
          foreground: "#FFFFFF",
          50: "#F0F7F4",
          100: "#DCEEE6",
          200: "#BADDCE",
          300: "#8FBFAD",
          400: "#74B09A",
          500: "#5A9F86",
          600: "#47816C",
          700: "#366252",
          800: "#254338",
          900: "#14241E",
        },
        neutral: {
          cream: "#FAF7F5",
          text: "#2F3D42",
        },
        success: "#2D6A4F",
        error: "#E63946",
        warning: "#F4A261",
        info: "#457B9D",
        destructive: {
          DEFAULT: "#E63946",
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
        focus: "0 0 0 3px rgba(74, 102, 112, 0.2)",
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
