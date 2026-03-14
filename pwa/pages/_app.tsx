import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/globals.css";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { appWithTranslation } from 'next-i18next';
import { DirectionProvider } from "@radix-ui/react-direction";

import { useEffect } from "react";

const queryClient = new QueryClient();

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
      <AuthProvider>
        <DirectionProvider dir={dir}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </DirectionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
