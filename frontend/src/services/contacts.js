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

export function deleteContact(data, accessToken) {
  return makeRequest(`/speakers/${data.id}`, accessToken, {
    method: "DELETE",
    data: data,
  });
}
