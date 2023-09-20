import assert from "assert";
import { requireEnv } from "./utils";

const url = "https://www.google.com/recaptcha/api/siteverify";
const secret = requireEnv("RECAPTCHA_SECRET_KEY");
const scoreThreshold = Number(requireEnv("RECAPTCHA_SCORE_THRESHOLD"))
const environment = requireEnv("NEXT_PUBLIC_ENVIRONMENT")

export async function verifyRecaptcha(
  action: string,
  token: string,
  ip: string | undefined,
): Promise<boolean> {
  // For development purposes:
  if (environment !== "production") return true;
  const reqBody = new URLSearchParams({ secret, response: token });
  if (ip != null) reqBody.set("remoteip", ip);
  const res = await fetch(url, { method: "POST", body: reqBody });
  if (!res.ok) {
    console.error(
      `reCAPTCHA: request failed: ${res.status} ${res.statusText}: ${await res.text()}`,
    );
    return false;
  }
  const resBody = (await res.json()) as {
    success: boolean;
    score: number;
    action: string;
    challenge_ts: string;
    hostname: string;
    "error-codes": string[];
  };
  if (!resBody.success) {
    console.log(`reCAPTCHA: ${resBody["error-codes"].join(", ")}`);
    return false;
  }
  let ok = true;
  if (resBody.score < scoreThreshold) {
    console.log(`reCAPTCHA: score too low (${resBody.score} < ${scoreThreshold})`);
    ok = true;
  }
  if (resBody.action !== action) {
    console.log(`reCAPTCHA: action mismatch ('${resBody.action}' !== '${action}')`);
    ok = false;
  }
  return ok;
}
