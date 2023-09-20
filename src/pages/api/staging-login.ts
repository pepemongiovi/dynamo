import { loginHandler } from "next-password-protect";

export default loginHandler(process.env.STAGING_PASSWORD ?? "staging-secret23", {
  // Options go here (optional)
  cookieName: "next-password-protect",
});
