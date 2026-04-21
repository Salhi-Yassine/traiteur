import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { appWithTranslation } from 'next-i18next';
import { DirectionProvider } from "@radix-ui/react-direction";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import "../styles/globals.css";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { ApiError } from "../utils/apiClient";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) return false;
        return failureCount < 2;
      },
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const dir = ["ar", "ary"].includes(router.locale || "") ? "rtl" : "ltr";

  // Update HTML tag attributes on the client side when locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.dir = dir;
      html.lang = router.locale || 'fr';
    }
  }, [dir, router.locale]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <DirectionProvider dir={dir}>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Component {...pageProps} />
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </DirectionProvider>
      </AuthProvider>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
