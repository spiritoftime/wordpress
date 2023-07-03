import { makeRequest } from "./makeRequest";

export function getContacts(accessToken) {
  return makeRequest("/speakers", accessToken);
}

export function addContact(accessToken, data) {
  return makeRequest(`/speakers`, accessToken, {
    method: "POST",
    data: data,
  });
}

export function deleteContact(contactId, accessToken) {
  return makeRequest(`/speakers/${contactId}`, accessToken, {
    method: "DELETE",
  });
}
