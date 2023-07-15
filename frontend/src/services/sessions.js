import { makeRequest } from "./makeRequest";

export function getSessions(accessToken, conferenceId) {
  return makeRequest(`/sessions/conference/${conferenceId}`, accessToken);
}
export function addSession(accessToken, conferenceId, data) {
  return makeRequest(`/sessions/conference/${conferenceId}`, accessToken, {
    method: "POST",
    data: data,
  });
}
