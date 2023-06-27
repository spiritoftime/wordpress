import { makeRequest } from "./makeRequest";
export function getConferences(accessToken) {
  return makeRequest("/conferences", accessToken);
}
export function deleteConference(conferenceId, accessToken) {
  return makeRequest(`/conferences/${conferenceId}`, accessToken, {
    method: "DELETE",
  });
}