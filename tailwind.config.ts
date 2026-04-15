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
        primary: {
          DEFAULT: "#1B4965",
          foreground: "#FFFFFF",
          50: "#E8F0F5",
          100: "#C5D9E6",
          200: "#8FB3CD",
          300: "#5A8DB4",
          400: "#2E6A8C",
          500: "#1B4965",
          600: "#163C54",
          700: "#112F42",
          800: "#0C2231",
          900: "#071520",
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
          cream: "#F4F1DE",
          text: "#3D405B",
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
        "touch": "48px",
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "4px",
        md: "4px",
        lg: "8px",
      },
      boxShadow: {
        subtle: "0 2px 4px rgba(61, 64, 91, 0.08)",
        elevated: "0 8px 16px rgba(0, 0, 0, 0.12)",
        focus: "0 0 0 3px rgba(27, 73, 101, 0.4)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
