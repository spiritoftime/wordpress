import { makeRequest } from "./makeRequest";

export function getConferenceRooms(accessToken, conferenceId) {
  return makeRequest(`/rooms/${conferenceId}`, accessToken);
}
