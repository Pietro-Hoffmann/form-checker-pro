import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 8080,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 8080,
    strictPort: true,
    allowedHosts: [
      'form-checker-pro-production.up.railway.app',
      '.railway.app',
      'localhost'
    ]
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@mediapipe/pose/pose_solution_packed.js",
          dest: "mediapipe",
        },
        {
          src: "node_modules/@mediapipe/pose/pose_solution_simd_packed.js",
          dest: "mediapipe",
        },
        {
          src: "node_modules/@mediapipe/pose/pose.binarypb",
          dest: "mediapipe",
        },
        {
          src: "node_modules/@mediapipe/pose/pose_web.binarypb",
          dest: "mediapipe",
        },
      ],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
