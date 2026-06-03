import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { PanelLeft } from "lucide-react";
import { useEffect } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mon Ambassadeur — SIRH" },
      {
        name: "description",
        content:
          "SIRH Mon Ambassadeur pour centraliser les commandes clients, les recrutements, le pipeline talents et le suivi collaborateurs.",
      },
      { name: "author", content: "Mon Ambassadeur" },
      { property: "og:title", content: "Mon Ambassadeur — SIRH" },
      {
        property: "og:description",
        content:
          "Interface de démonstration SIRH Mon Ambassadeur pour piloter les processus Sales et RH.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Mon Ambassadeur — SIRH" },
      {
        name: "twitter:description",
        content:
          "Interface de démonstration SIRH Mon Ambassadeur pour piloter les processus Sales et RH.",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isStandaloneForm = location.pathname.startsWith("/commandes/formulaire-fcc");

  return (
    <QueryClientProvider client={queryClient}>
      {isStandaloneForm ? (
        <Outlet />
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <SidebarTrigger className="text-foreground/80 hover:text-foreground">
                <PanelLeft className="h-4 w-4" />
              </SidebarTrigger>
              <div className="h-5 w-px bg-border" />
              <p className="text-sm font-medium text-muted-foreground">
                <span className="text-foreground">SIRH</span> · Démo
              </p>
            </header>
            <main className="min-h-[calc(100svh-3.5rem)] bg-background">
              {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </QueryClientProvider>
  );
}
