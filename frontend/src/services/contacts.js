import { makeRequest } from "./makeRequest";

export function getContacts(accessToken) {
  return makeRequest("/speakers", accessToken);
}

export function getContactsForAddingSpeakers(accessToken, conferenceId) {
  return makeRequest(`/speakers/input/${conferenceId}`, accessToken);
}

export function getSpeakers(accessToken, conferenceId) {
  return makeRequest(`/speakers/conference/${conferenceId}`, accessToken);
}

export function getSpeaker(accessToken, speakerId, conferenceId) {
  return makeRequest(
    `/speakers/conference/${speakerId}/${conferenceId}`,
    accessToken
  );
}

export function getContact(id, accessToken) {
  return makeRequest(`/speakers/${id}`, accessToken);
}

export function addContact(accessToken, data) {
  return makeRequest(`/speakers`, accessToken, {
    method: "POST",
    data: data,
  });
}

export function addContactToConference(accessToken, data, conferenceId) {
  return makeRequest(
    `/speakers/add-to-conference/${conferenceId}`,
    accessToken,
    {
      method: "POST",
      data: data,
    }
  );
}

export function deleteContact(data, accessToken) {
  return makeRequest(`/speakers/${data.id}`, accessToken, {
    method: "DELETE",
    data: data,
  });
}

export function updateContact(id, data, accessToken) {
  return makeRequest(`/speakers/${id}`, accessToken, {
    method: "PUT",
    data: data,
  });
}

export function removeSpeaker(accessToken, speakerId, conferenceId) {
  return makeRequest(
    `/speakers/conference/${speakerId}/${conferenceId}`,
    accessToken,
    {
      method: "DELETE",
    }
  );
}
