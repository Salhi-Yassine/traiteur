import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: ["./tests/setup.ts"],
        globals: true,
        include: [
            "tests/**/*.{test,spec}.{ts,tsx}",
            "**/__tests__/**/*.{ts,tsx}",
            "components/**/*.{test,spec}.{ts,tsx}",
            "pages/**/*.{test,spec}.{ts,tsx}",
            "lib/**/*.{test,spec}.{ts,tsx}",
            "utils/**/*.{test,spec}.{ts,tsx}",
            "context/**/*.{test,spec}.{ts,tsx}",
        ],
        exclude: ["node_modules", ".next"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
});
