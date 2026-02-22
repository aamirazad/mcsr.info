import browserCollections from "fumadocs-mdx:collections/browser";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGithubLastEdit } from "fumadocs-core/content/github";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Suspense } from "react";
import { EditPage } from "@/components/page-actions";
import { baseOptions, gitConfig } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export const Route = createFileRoute("/wiki/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? [];
    const data = await serverLoader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
});

const serverLoader = createServerFn({
  method: "GET",
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();
    let lastModifiedTime: Date | null = null;

    try {
      lastModifiedTime = await getGithubLastEdit({
        owner: gitConfig.user,
        repo: gitConfig.repo,
        path: `content${page.url}`,
      });
    } catch {
      console.log("Failed to fetch last modified time");
    }

    return {
      url: page.url,
      path: page.path,
      lastModifiedTime,
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    // you can define props for the component
    {
      path,
      lastModifiedTime,
    }: {
      path: string;
      lastModifiedTime: Date | null;
    },
  ) {
    return (
      <DocsPage tableOfContent={{ style: "clerk" }} toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={{
              ...defaultMdxComponents,
            }}
          />
        </DocsBody>
        <div className="flex items-center gap-2">
          {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
          <EditPage
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/wiki/${path}`}
          />
        </div>
      </DocsPage>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <DocsLayout {...baseOptions()} tree={data.pageTree}>
      <Suspense>{clientLoader.useContent(data.path, data)}</Suspense>
    </DocsLayout>
  );
}
