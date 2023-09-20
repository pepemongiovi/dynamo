import { AppRouter } from "@/server/routers";
import { requireBuildEnv } from "@/server/utils";
import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import { FC } from "react";
import superjson from "superjson";
import AppLayout from "@/layouts/app";
import { withPasswordProtect } from "next-password-protect";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

const App: FC<AppProps> = (props) => {
  return <AppLayout {...props} />;
};

const AppWithTRPC = withTRPC<AppRouter>({
  config() {
    return {
      transformer: superjson,
      url: `${getBaseUrl()}/api/trpc`,
      headers: { "X-Same-Origin": "1" },
      async fetch(input, init) {
        const headers = new Headers(init?.headers);
        if (init?.method === "POST") {
          headers.set("X-Recaptcha-Token", await getRecaptchaToken("api_update"));
        }
        return fetch(input, { ...init, headers });
      },
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: false,
            cacheTime: 0,
            refetchOnMount: "always",
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          },
        },
      },
    };
  },
})(App);

export default process.env.PASSWORD_PROTECT
  ? withPasswordProtect(AppWithTRPC, {
      loginApiUrl: "/api/staging-login",
      checkApiUrl: "/api/staging-password-check",
    })
  : AppWithTRPC;

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  // if (process.env.VERCEL_URL) {
  //   return `https://${process.env.VERCEL_URL}`;
  // }
  return `${process.env.baseURL}${process.env.PORT ?? 3000}`;
}

const recaptchaSiteKey = requireBuildEnv(
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
);

function getRecaptchaToken(action: string): Promise<string> {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== "production") {
    return new Promise((resolve) => resolve("staging-recaptcha-token"));
  }
  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(recaptchaSiteKey, { action }).then(resolve, reject);
    });
  });
}
