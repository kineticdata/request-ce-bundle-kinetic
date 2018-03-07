import axios from 'axios';

export const MESSAGE_LIMIT = 25;

export const sendMessage = params => {
  const { body, guid, responseUrl } = params;
  return axios.post(
    `${responseUrl}/api/v1/issues/${guid}/messages`,
    { body },
    { withCredentials: true },
  );
};

export const sendAttachment = params => {
  const { message, attachment, guid, responseUrl } = params;
  const formData = new FormData();
  formData.append('upload[description]', message);
  formData.append('upload[file]', attachment);

  return axios.post(`${responseUrl}/api/v1/issues/${guid}/uploads`, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchMessages = ({ guid, lastReceived, offset, responseUrl }) =>
  axios
    .get(`${responseUrl}/api/v1/issues/${guid}/messages`, {
      withCredentials: true,
      params: {
        last_received: lastReceived || '2014-01-01',
        limit: MESSAGE_LIMIT,
        offset: offset ? offset : 0,
      },
    })
    .then(response => ({ messages: response.data }))
    .catch(response => ({ error: response }));

export const fetchIssue = (guid, responseUrl) =>
  axios
    .get(`${responseUrl}/api/v1/issues/${guid}`, { withCredentials: true })
    .then(response => ({ issue: response.data }))
    .catch(response => ({ error: response }));

export const createIssue = (issue, responseUrl) =>
  axios
    .post(`${responseUrl}/api/v1/issues`, issue, { withCredentials: true })
    .then(response => ({ issue: response.data }))
    .catch(response => ({ error: response }));

export const touchIssuePresence = (guid, responseUrl) =>
  axios.request({
    url: `${responseUrl}/api/v1/issues/${guid}/present`,
    withCredentials: true,
  });

export const fetchUploads = (guid, responseUrl) =>
  axios.request({
    url: `${responseUrl}/api/v1/issues/${guid}/uploads`,
    withCredentials: true,
  });

export const fetchInvites = (guid, responseUrl) =>
  axios
    .request({
      url: `${responseUrl}/api/v1/issues/${guid}/invites`,
      method: 'get',
      withCredentials: true,
    })
    .then(response => ({ invites: response.data }))
    .catch(response => ({ error: response }));

export const createInvite = (guid, email, note, responseUrl) =>
  axios
    .request({
      url: `${responseUrl}/api/v1/issues/${guid}/invites`,
      method: 'post',
      withCredentials: true,
      data: { email, note, group_invite: false },
    })
    .then(response => ({ invite: response.data }))
    .catch(response => ({ error: response }));

export const resendInvite = (guid, inviteId, note, responseUrl) =>
  axios
    .request({
      url: `${responseUrl}/api/v1/issues/${guid}/invites/${inviteId}`,
      method: 'post',
      withCredentials: true,
    })
    .then(response => ({ invite: response.data }))
    .catch(response => ({ error: response }));

export const removeInvite = (guid, inviteId, note, responseUrl) =>
  axios
    .request({
      url: `${responseUrl}/api/v1/issues/${guid}/invites/${inviteId}`,
      method: 'delete',
      withCredentials: true,
    })
    .then(response => ({ invite: response.data }))
    .catch(response => ({ error: response }));

export const fetchParticipants = (guid, responseUrl) =>
  axios
    .request({
      url: `${responseUrl}/api/v1/issues/${guid}/participants`,
      withCredentials: true,
    })
    .then(response => ({ participants: response.data }))
    .catch(response => ({ error: response }));

export const fetchResponseProfile = responseUrl =>
  axios
    .get(`${responseUrl}/api/v1/me`, { withCredentials: true })
    .then(response => ({ profile: response.data }))
    .catch(response => ({ error: response }));

export const getResponseAuthentication = responseUrl =>
  axios
    .get(`${responseUrl}/users/auth/kinetic_core`, {
      withCredentials: true,
    })
    .then(response => ({ profile: response.data }))
    .catch(response => ({ error: response }));
