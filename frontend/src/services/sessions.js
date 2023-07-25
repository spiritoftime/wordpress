import { makeRequest } from "./makeRequest";

export function getSessions(accessToken, conferenceId) {
  return makeRequest(`/sessions/conference/${conferenceId}`, accessToken);
}

export function getSymposiaCount(accessToken, conferenceId) {
  return makeRequest(`/sessions/symposia-count/${conferenceId}`, accessToken);
}

export function getMasterclassCount(accessToken, conferenceId) {
  return makeRequest(
    `/sessions/masterclass-count/${conferenceId}`,
    accessToken
  );
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

export function updateSession(accessToken, conferenceId, sessionId, data) {
  return makeRequest(
    `/sessions/conference/${sessionId}/${conferenceId}`,
    accessToken,
    {
      method: "PATCH",
      data: data,
    }
  );
}
export function updateProgram(accessToken, data) {
  return makeRequest(`/sessions/program-overview`, accessToken, {
    method: "POST",
    data: data,
  });
}

export function deleteSession(sessionId, conferenceId, accessToken) {
  console.log("sessionId", sessionId);
  console.log("conferenceId", conferenceId);
  return makeRequest(
    `/sessions/conference/${sessionId}/${conferenceId}`,
    accessToken,
    {
      method: "DELETE",
    }
  );
}
