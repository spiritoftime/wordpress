import { makeRequest } from "./makeRequest";
export function getConferences(accessToken) {
  return makeRequest("/conferences", accessToken);
}
