import axios from 'axios';
import { bundle } from 'react-kinetic-core';

export const DEFAULT_MESSAGE_LIMIT = 25;
export const DEFAULT_DISCUSSION_LIMIT = 10;

const baseUrl = () => `${bundle.spaceLocation()}/app/discussions`;

export const sendMessage = (params, token) =>
  axios.request({
    url: `${baseUrl()}/api/v1/discussions/${params.id}/messages`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      content: [
        {
          type: 'text',
          value: params.message,
        },
      ],
    },
  });

export const fetchMessages = (id, token, pageToken) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/messages`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pageToken,
        limit: DEFAULT_MESSAGE_LIMIT,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchDiscussion = ({ id, token }) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchDiscussions = ({
  token,
  pageToken,
  user,
  title,
  relatedItem = {},
}) => {
  const { type, key } = relatedItem;
  return axios
    .get(`${baseUrl()}/api/v1/discussions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        // user,
        title: title && title.length > 0 ? title : null,
        limit: DEFAULT_DISCUSSION_LIMIT,
        type,
        key,
        pageToken,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));
};
export const createDiscussion = ({
  title,
  description,
  token,
  isPrivate = false,
  owningUsers,
  owningTeams,
}) =>
  axios
    .request({
      method: 'post',
      url: `${baseUrl()}/api/v1/discussions`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        title,
        description,
        archived: false,
        owningUsers,
        owningTeams,
        is_private: isPrivate,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const updateDiscussion = (id, data, token) =>
  axios
    .request({
      method: 'put',
      url: `${baseUrl()}/api/v1/discussions/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchInvites = (id, token) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/invitations`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const createInvite = ({ discussionId, type, value, token }) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${discussionId}/invitations`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { [type]: value },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const resendInvite = (id, inviteId, token) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/invitations/${inviteId}`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const removeInvite = (id, inviteId, token) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/invitations/${inviteId}`,
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchParticipants = (id, token) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/participants`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const createRelatedItem = (id, relatedItem, token) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/relatedItems`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: relatedItem,
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));
