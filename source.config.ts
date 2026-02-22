import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/wiki",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig();
