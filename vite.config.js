import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserSite = repositoryName?.endsWith(".github.io");
const base =
  process.env.GITHUB_ACTIONS && repositoryName && !isUserSite ? `/${repositoryName}/` : "/";

export default defineConfig({
  plugins: [react()],
  // The full problem dataset is intentionally kept in its own dynamic chunk.
  build: { chunkSizeWarningLimit: 2200 },
  base,
});
