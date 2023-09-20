import { requireBuildEnv } from "@/server/utils";
import axios from "axios";

export function getStrapiURL(path = "") {
  const strapiUrl = requireBuildEnv(
    "NEXT_PUBLIC_STRAPI_API_URL",
    process.env.NEXT_PUBLIC_STRAPI_API_URL,
  );
  return `${strapiUrl}${path}`;
}

export async function fetchAPI(path: string, urlParamsObject = {}) {
  const requestUrl = getStrapiURL(`/api${path}`);
  const response = await axios.request({
    headers: { "Content-Type": "application/json" },
    params: urlParamsObject,
    url: requestUrl,
    method: "GET",
  });

  return response.data;
}
