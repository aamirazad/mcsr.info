import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "aamirazad",
  repo: "mcsr.info",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "MCSR Info",
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
