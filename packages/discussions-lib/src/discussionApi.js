import { axios } from './redux/store';
import { bundle } from '@kineticdata/react';
import { List } from 'immutable';

export const DEFAULT_MESSAGE_LIMIT = 25;
export const DEFAULT_DISCUSSION_LIMIT = 10;

const isExistingAttachment = attachment => attachment.type === 'attachment';
const baseUrl = () => `${bundle.spaceLocation()}/app/discussions`;

export const sendMessage = params => {
  const message = {
    content: [
      {
        type: 'text',
        value: params.message,
      },
    ],
    ...(params.parentId ? { parent: { id: params.parentId } } : {}),
  };

  if (params.attachment) {
    const formData = new FormData();
    formData.append('message', JSON.stringify(message));
    params.attachment.forEach(attachment => {
      formData.append('attachments', attachment);
    });

    axios.request({
      url: `${baseUrl()}/api/v1/discussions/${params.id}/messages`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
  } else {
    return axios.request({
      url: `${baseUrl()}/api/v1/discussions/${params.id}/messages`,
      method: 'post',
      data: message,
    });
  }
};

export const updateMessage = params => {
  const attachments = params.attachment || [];

  const message = {
    content: [
      {
        type: 'text',
        value: params.message,
      },
      ...attachments.filter(isExistingAttachment),
    ],
  };
  const newAttachments = attachments.filter(a => !isExistingAttachment(a));

  const formData = new FormData();
  formData.append('message', JSON.stringify(message));
  newAttachments.forEach(attachment => {
    formData.append('attachments', attachment);
  });

  axios.request({
    url: `${baseUrl()}/api/v1/discussions/${params.discussionId}/messages/${
      params.id
    }`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
};

export const deleteMessage = params =>
  axios.request({
    url: `${baseUrl()}/api/v1/discussions/${params.discussionId}/messages/${
      params.id
    }`,
    method: 'delete',
  });

export const fetchMessages = (id, pageToken) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/messages`,
      method: 'get',
      params: {
        pageToken,
        limit: DEFAULT_MESSAGE_LIMIT,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchMessage = ({ discussionId, id }) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${discussionId}/messages/${id}`,
      method: 'get',
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchMessageHistory = ({ discussionId, id }) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${discussionId}/messages/${id}/versions`,
      method: 'get',
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchDiscussion = ({ id }) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}`,
      method: 'get',
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchDiscussions = ({
  pageToken,
  user,
  title,
  relatedItem = {},
  isArchived,
  start,
  end,
}) => {
  const { type, key } = relatedItem;
  return axios
    .get(`${baseUrl()}/api/v1/discussions`, {
      params: {
        // user,
        title: title && title.length > 0 ? title : null,
        limit: DEFAULT_DISCUSSION_LIMIT,
        type,
        key,
        pageToken,
        archived: isArchived ? true : undefined,
        start,
        end,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));
};
export const createDiscussion = ({
  title,
  description,
  isPrivate = false,
  owningUsers,
  owningTeams,
  joinPolicy,
}) =>
  axios
    .request({
      method: 'post',
      url: `${baseUrl()}/api/v1/discussions`,
      data: {
        title,
        description,
        isArchived: false,
        owningUsers,
        owningTeams,
        isPrivate,
        joinPolicy,
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const updateDiscussion = (id, data) =>
  axios
    .request({
      method: 'put',
      url: `${baseUrl()}/api/v1/discussions/${id}`,
      data,
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchInvites = id =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/invitations`,
      method: 'get',
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const createInvite = ({ discussionId, type, value, message }) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${discussionId}/invitations`,
      method: 'post',
      data:
        type === 'email'
          ? { email: value, message }
          : { user: { username: value } },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const resendInvite = ({ discussionId, email, username }) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${discussionId}/invitations/${email ||
        username}`,
      method: 'put',
      params: {
        // If we are looking up by email add an email parameter to the object
        ...(email ? { email: '' } : {}),
      },
      data: {},
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const removeInvite = ({ discussionId, email, username }) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${discussionId}/invitations/${email ||
        username}`,
      method: 'delete',
      params: {
        // If we are looking up by email add an email parameter to the object
        ...(email ? { email: '' } : {}),
      },
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const fetchParticipants = id =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/participants`,
      method: 'get',
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const removeParticipant = (id, username) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/participants/${username}`,
      method: 'delete',
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const updateParticipant = (id, username, data) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/participants/${username}`,
      method: 'put',
      data,
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const createRelatedItem = (id, relatedItem) =>
  axios
    .request({
      url: `${baseUrl()}/api/v1/discussions/${id}/relatedItems`,
      method: 'post',
      data: relatedItem,
    })
    .then(response => response.data)
    .catch(response => ({ error: response }));

export const sendInvites = (discussion, values) => {
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
