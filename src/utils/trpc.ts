import { AppRouter } from "@/server/routers";
import { createReactQueryHooks } from "@trpc/react";

export default createReactQueryHooks<AppRouter>();
