import { makeRequest } from "./makeRequest";

export function getSessions(accessToken) {
  return makeRequest("/sessions", accessToken);
}
