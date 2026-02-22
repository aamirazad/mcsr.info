import { redirect } from "@tanstack/react-router";
import { createMiddleware, createStart } from "@tanstack/react-start";
import { rewritePath } from "fumadocs-core/negotiation";
import { FastResponse } from "srvx";

globalThis.Response = FastResponse;

const { rewrite: rewriteLLM } = rewritePath(
  "/wiki{/*path}.mdx",
  "/llms.mdx/wiki{/*path}",
);

const llmMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);
  const path = rewriteLLM(url.pathname);

  if (path) {
    throw redirect(new URL(path, url));
  }

  return next();
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [llmMiddleware],
  };
});
