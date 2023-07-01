import { makeRequest } from "./makeRequest";

export function addContact(accessToken, data) {
  return makeRequest(`/speakers`, accessToken, {
    method: "POST",
    data: data,
  });
}
