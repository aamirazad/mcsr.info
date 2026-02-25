import { createFileRoute } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-col flex-1 justify-center px-4 py-8 text-center">
        <h1 className="font-medium text-xl mb-4">
          Minecraft Speedrunning Knowledge Base
        </h1>
        <div className="flex justify-center">
          <p className="max-w-2xl">
            This community made wiki will be a central database for everything
            there is to know about speedrunning Minecraft. The site is currently
            a work in progress, feel free to contribute on GitHub.
          </p>
        </div>

        {/* <Link
          to="/wiki/$"
          params={{
            _splat: "",
          }}
          className="px-3 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm mx-auto"
        >
          Open Wiki
        </Link> */}
      </div>
    </HomeLayout>
  );
}
