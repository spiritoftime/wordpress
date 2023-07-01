import { makeRequest } from "./makeRequest";

export function getConferences(accessToken) {
  return makeRequest("/conferences", accessToken);
}

export function deleteConference(conferenceId, accessToken) {
  return makeRequest(`/conferences/${conferenceId}`, accessToken, {
    method: "DELETE",
  });
}

export function getConference(accessToken, conferenceId) {
  return makeRequest(`/conferences/${conferenceId}`, accessToken);


export function addConference(accessToken, data) {
  return makeRequest(`/conferences`, accessToken, {
    method: "POST",
    data: data,
  });

}
