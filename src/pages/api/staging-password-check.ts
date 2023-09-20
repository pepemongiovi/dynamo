import { passwordCheckHandler } from "next-password-protect";

export default passwordCheckHandler(process.env.STAGING_PASSWORD ?? "staging-secret23", {
  // Options go here (optional)
  cookieName: "next-password-protect",
});
