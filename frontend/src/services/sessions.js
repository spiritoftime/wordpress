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
export function getSession(accessToken, conferenceId, sessionId) {
  return makeRequest(
    `/sessions/conference/${sessionId}/${conferenceId}`,
    accessToken
  );
}
export function updateProgram(accessToken, data) {
  return makeRequest(`/sessions/program-overview`, accessToken, {
    method: "POST",
    data: data,
  });
}
