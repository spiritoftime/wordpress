import { makeRequest } from "./makeRequest";

export function getSessions(accessToken, conferenceId) {
  return makeRequest(`/sessions/conference/${conferenceId}`, accessToken);
}

export function updateProgram(accessToken, data) {
  return makeRequest(`/sessions/program-overview`, accessToken, {
    method: "POST",
    data: data,
  });
}
