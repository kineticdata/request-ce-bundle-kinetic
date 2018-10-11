import axios from 'axios';
import { bundle } from 'react-kinetic-core';
import { List } from 'immutable';

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
      ...(params.parentId ? { parent: { id: params.parentId } } : {}),
    },
  });

export const updateMessage = (params, token) =>
  axios.request({
    url: `${baseUrl()}/api/v1/discussions/${params.discussionId}/messages/${
      params.id
    }`,
    method: 'put',
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

export const deleteMessage = (params, token) =>
  axios.request({
    url: `${baseUrl()}/api/v1/discussions/${params.discussionId}/messages/${
      params.id
    }`,
    method: 'delete',
    headers: {
      Authorization: `Bearer ${token}`,
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

export const createInvite = ({ discussionId, type, value, token, message }) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${discussionId}/invitations`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { [type]: value, message },
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

export const removeParticipant = (id, username, token) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/participants/${username}`,
      method: 'delete',
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

export const sendInvites = (token, discussion, values) => {
  const participants = discussion.participants || List();
  const invitations = discussion.invitations || List();
  const existingUsernames = participants
    .concat(invitations)
    .filter(involvement => involvement.user)
    .map(involvement => involvement.user.username);
  const existingEmails = invitations.map(invitation => invitation.email);

  return Promise.all(
    values.invitees
      .flatMap(item => (item.team ? item.team.memberships : [item]))
      .map(item => ({
        token,
        discussionId: discussion.id,
        type: item.user ? 'username' : 'email',
        value: item.user ? item.user.username : item.label,
        message: values.message,
      }))
      .filter(
        args =>
          args.type === 'username'
            ? !existingUsernames.contains(args.value)
            : !existingEmails.contains(args.value),
      )
      .map(createInvite),
  );
};
