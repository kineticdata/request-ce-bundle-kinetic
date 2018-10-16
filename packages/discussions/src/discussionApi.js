import axios from 'axios';
import { bundle } from 'react-kinetic-core';

export const MESSAGE_LIMIT = 25;

export const sendMessage = params => {
  const { body, guid } = params;
  return axios.post(
    `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/messages`,
    { body },
    { withCredentials: true },
  );
};

export const sendAttachment = params => {
  const { message, attachment, guid } = params;
  const formData = new FormData();
  formData.append('upload[description]', message);
  formData.append('upload[file]', attachment);

  return axios.post(
    `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/uploads`,
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
};

export const fetchMessages = ({ guid, lastReceived, offset }) =>
  axios
    .get(
      `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/messages`,
      {
        withCredentials: true,
        params: {
          last_received: lastReceived || '2014-01-01',
          limit: MESSAGE_LIMIT,
          offset: offset ? offset : 0,
        },
      },
    )
    .then(response => ({ messages: response.data }))
    .catch(response => ({ error: response }));

export const fetchIssue = guid =>
  axios
    .get(`${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}`, {
      withCredentials: true,
    })
    .then(response => ({ issue: response.data }))
    .catch(response => ({ error: response }));

export const fetchMyOpenIssues = (limit = 10, offset = 0) =>
  axios
    .get(
      `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/my_open_issues`,
      {
        withCredentials: true,
        params: { limit, offset },
      },
    )
    .then(response => ({ issues: response.data }))
    .catch(response => ({ error: response }));

export const searchIssues = (search, limit = 10, offset = 0) =>
  axios
    .post(
      `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/search`,
      {
        query: {
          name_or_description_or_tags_name_cont: search,
          limit,
          offset,
        },
      },
      { withCredentials: true },
    )
    .then(response => ({
      issues: response.data.issues,
      totalCount: response.data.total_count,
    }))
    .catch(response => ({ error: response }));

export const createIssue = issue =>
  axios
    .post(`${bundle.spaceLocation()}/kinetic-response/api/v1/issues`, issue, {
      withCredentials: true,
    })
    .then(response => ({ issue: response.data }))
    .catch(response => ({ error: response }));

export const touchIssuePresence = guid =>
  axios.request({
    url: `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/present`,
    withCredentials: true,
  });

export const fetchUploads = guid =>
  axios.request({
    url: `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/uploads`,
    withCredentials: true,
  });

export const fetchInvites = guid =>
  axios
    .request({
      url: `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/invites`,
      method: 'get',
      withCredentials: true,
    })
    .then(response => ({ invites: response.data }))
    .catch(response => ({ error: response }));

export const createInvite = (guid, email, note) =>
  axios
    .request({
      url: `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/invites`,
      method: 'post',
      withCredentials: true,
      data: { email, note, group_invite: false },
    })
    .then(response => ({ invite: response.data }))
    .catch(response => ({ error: response }));

export const resendInvite = (guid, inviteId, note) =>
  axios
    .request({
      url: `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/invites/${inviteId}`,
      method: 'post',
      withCredentials: true,
    })
    .then(response => ({ invite: response.data }))
    .catch(response => ({ error: response }));

export const removeInvite = (guid, inviteId, note) =>
  axios
    .request({
      url: `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/invites/${inviteId}`,
      method: 'delete',
      withCredentials: true,
    })
    .then(response => ({ invite: response.data }))
    .catch(response => ({ error: response }));

export const fetchParticipants = guid =>
  axios
    .request({
      url: `${bundle.spaceLocation()}/kinetic-response/api/v1/issues/${guid}/participants`,
      withCredentials: true,
    })
    .then(response => ({ participants: response.data }))
    .catch(response => ({ error: response }));

export const fetchResponseProfile = () =>
  axios
    .get(`${bundle.spaceLocation()}/kinetic-response/api/v1/me`, {
      withCredentials: true,
      __bypassAuthInterceptor: true,
    })
    .then(response => ({ profile: response.data }))
    .catch(response => ({ error: response }));

export const getResponseAuthentication = () =>
  axios
    .get(`${bundle.spaceLocation()}/kinetic-response/users/auth/kinetic_core`, {
      withCredentials: true,
    })
    .then(response => ({ profile: response.data }))
    .catch(response => ({ error: response }));
