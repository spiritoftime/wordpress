import { makeRequest } from "./makeRequest";

export function getSessions(accessToken, conferenceId) {
  return makeRequest(`/sessions/conference/${conferenceId}`, accessToken);
}
