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
         * Updated palette — warmer, more refined
         * Primary: deep warm navy (not cold corporate blue)
         * Secondary: warm coral/terracotta
         * Accent: sage green
         */
        primary: {
          DEFAULT: "#1a1a2e",
          foreground: "#FFFFFF",
          50: "#f0f0f5",
          100: "#d8d8e5",
          200: "#b1b1cb",
          300: "#8a8ab1",
          400: "#5c5c86",
          500: "#3a3a5c",
          600: "#2d2d4a",
          700: "#232340",
          800: "#1a1a2e",
          900: "#10101e",
        },
        secondary: {
          DEFAULT: "#E07A5F",
          foreground: "#FFFFFF",
          50: "#FDF0EC",
          100: "#F9D9D0",
          200: "#F3B3A1",
          300: "#ED8D72",
          400: "#E07A5F",
          500: "#D4603F",
          600: "#B84A2E",
          700: "#8C3822",
          800: "#602717",
          900: "#34150C",
        },
        accent: {
          DEFAULT: "#81B29A",
          foreground: "#FFFFFF",
          50: "#EFF5F2",
          100: "#D7E9E0",
          200: "#B0D4C1",
          300: "#81B29A",
          400: "#6AA588",
          500: "#539876",
          600: "#437B60",
          700: "#335E49",
          800: "#234033",
          900: "#13231C",
        },
        neutral: {
          cream: "#FAF9F6",
          text: "#2D2D3F",
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
        focus: "0 0 0 3px rgba(26, 26, 46, 0.15)",
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
