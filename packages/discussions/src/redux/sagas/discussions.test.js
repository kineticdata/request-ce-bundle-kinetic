import { delay } from 'redux-saga';
import { put, call, all, race, take } from 'redux-saga/effects';
import { List } from 'immutable';
import { actions, types } from '../modules/discussions';
import { toastTypes } from 'common';

global.bundle = {
  apiLocation: () => '/acme/app/api/v1',
};

const {
  sendMessage,
  sendAttachment,
  fetchMessages,
  fetchUploads,
  fetchIssue,
  createIssue,
  fetchParticipants,
  fetchInvites,
  createInvite,
  fetchResponseProfile,
  getResponseAuthentication,
  touchIssuePresence,
} = require('../../discussionApi');

const {
  updateSubmissionDiscussionId,
  sendMessageTask,
  fetchMoreMessagesTask,
  registerChannel,
  incomingMessages,
  uploadProcessingPoller,
  queueProcessingUploadsTask,
  presenceKeepAlive,
  joinDiscussionTask,
  createInviteTask,
  createIssueTask,
  watchDiscussionSocket,
  openWebSocket,
} = require('./discussions');

const ISSUE_GUID = 'issue-guid';
const RESPONSE_URL = 'http://response.url';

describe('discussion saga', () => {
  describe('selectors', () => {
    describe('#selectFetchMessageSettings', () => {});
    describe('#selectServerUrl', () => {});
    describe('#selectProcessingUploads', () => {});
  });

  describe('#sendMessageTask', () => {
    const responseUrl = '/space-slug/kinetic-response';
    let action;

    beforeEach(() => {
      action = {
        payload: {
          guid: 'guid',
          message: 'message',
        },
      };
    });

    describe('when sending an attachment', () => {
      test('it calls sendAttachment', () => {
        // Set up the attachment object.
        action.payload.attachment = { name: 'file.txt' };
        // Start the saga with the action.
        const saga = sendMessageTask(action);
        // Next call the correct function to send.
        let step = saga.next().value;
        expect(step.CALL.fn).toBe(sendAttachment);

        step = saga.next({ messages: [] }).value;
      });
    });

    describe('when sending text', () => {
      test('it calls sendMessage', () => {
        const saga = sendMessageTask(action);
        const step = saga.next().value;
        expect(step.CALL.fn).toBe(sendMessage);
      });
    });
  });

  describe('#fetchMoreMessagesTask', () => {
    let action;
    beforeEach(() => {
      action = { payload: {} };
    });

    describe('when successful', () => {
      test('it puts the "has more" actions', () => {
        const messageSettings = {};
        const saga = fetchMoreMessagesTask(action);
        saga.next(); // Simulate selecting message parameters.

        const step = saga.next(messageSettings).value;
        expect(step.CALL.fn).toBe(fetchMessages);
      });
    });
  });

  describe('#registerChannel', () => {
    let socket;

    beforeEach(() => {
      socket = {};
    });

    describe('onopen', () => {
      test('emits a "connected" action', () => {
        const channel = registerChannel(socket);
        const taken = new Promise(resolve => channel.take(resolve));
        socket.onopen();
        return taken.then(event => expect(event.action).toBe('connected'));
      });
    });

    describe('onclose', () => {
      test('emits a "reconnect" action', () => {
        const channel = registerChannel(socket);
        const taken = new Promise(resolve => channel.take(resolve));
        socket.onopen();
        return taken.then(event => expect(event.action).toBe('connected'));
      });
    });

    describe('onerror', () => {
      test('emits nothing', () => {
        // We're not doing anyting here yet.
      });
    });

    describe('onmessage', () => {
      test('parses and emits the event data', () => {
        const channel = registerChannel(socket);
        const taken = new Promise(resolve => channel.take(resolve));
        socket.onmessage({ data: '{ "test": "event data" }' });
        return taken.then(event => expect(event.test).toBe('event data'));
      });
    });

    describe('when channel is closed', () => {
      test('the channel closes the socket', () => {
        socket.close = jest.fn();
        const channel = registerChannel(socket);
        channel.close();
        expect(socket.close).toHaveBeenCalled();
      });
    });
  });

  describe('incoming message handler', () => {
    let socket;
    let channel;
    let saga;
    const guid = 'fake-guid';

    beforeEach(() => {
      socket = {};
      channel = registerChannel(socket);
      saga = incomingMessages(channel, guid);
    });

    test('on message:create', () => {
      const emitted = { action: 'message:create', message: 'message' };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.receiveMessage(guid, emitted.message)),
      );
    });

    test('on message:update', () => {
      const emitted = { action: 'message:update', message: 'message' };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.updateMessage(guid, emitted.message)),
      );
    });

    test('on presence:add', () => {
      const emitted = { action: 'presence:add', user: 'user' };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.addPresence(guid, emitted.user)),
      );
    });

    test('on presence:remove', () => {
      const emitted = { action: 'presence:remove', user: 'user' };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.removePresence(guid, emitted.user)),
      );
    });

    test('on participant:create', () => {
      const emitted = {
        action: 'participant:create',
        participant: 'participant',
      };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.addParticipant(guid, emitted.participant)),
      );
    });

    test('on participant:delete', () => {
      const emitted = {
        action: 'participant:delete',
        participant: 'participant',
      };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.removeParticipant(guid, emitted.participant)),
      );
    });

    test('on invite:create', () => {
      const emitted = {
        action: 'invite:create',
        invite: 'invite',
      };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.addInvite(guid, emitted.invite)),
      );
    });

    test('on invite:delete', () => {
      const emitted = {
        action: 'invite:delete',
        invite: 'invite',
      };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.removeInvite(guid, emitted.invite)),
      );
    });

    test('on reconnect', () => {
      const emitted = { action: 'reconnect' };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(put(actions.reconnect(guid)));
    });

    test('on connected', () => {
      const emitted = { action: 'connected' };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.setConnected(guid, true)),
      );
    });

    test('on unknown message type', () => {
      const emitted = { action: 'neverwillexist' };
      expect(saga.next().value.TAKE).toBeDefined();
      expect(saga.next(emitted).value).toEqual(
        put(actions.receiveBadMessage(guid, emitted)),
      );
    });

    // Unsure how to accomplish this.
    test('closes channel when cancelled', () => {
      socket.close = jest.fn();
      // // const result = saga.next(cancelled());
      // saga.throw(new Error('cancel.'));
      // const result = saga.next(cancelled());
      // console.log(result);
    });
  });

  describe('#watchDiscussionSocket', () => {
    let action;
    let socket;
    let socketChannel;

    beforeEach(() => {
      action = { payload: ISSUE_GUID };
      socket = {};
      socketChannel = {};
    });

    test('happy path', () => {
      const saga = watchDiscussionSocket(action);
      expect(saga.next().value).toEqual(call(openWebSocket, ISSUE_GUID));
      expect(saga.next(socket).value).toEqual(call(registerChannel, socket));

      // Enter the loop - the first thing that should happen is to kick off the race.
      expect(saga.next(socketChannel).value).toEqual(
        race({
          task: all([
            call(incomingMessages, socketChannel, ISSUE_GUID),
            call(presenceKeepAlive, ISSUE_GUID),
            call(uploadProcessingPoller, ISSUE_GUID),
          ]),
          reconnect: take(types.RECONNECT),
          disconnect: take(types.DISCONNECT),
        }),
      );
    });
  });

  describe('#uploadProcessingPoller', () => {
    let message;
    let upload;

    beforeEach(() => {
      message = {
        guid: 'message-guid',
        messageable: {
          guid: 'upload-guid',
        },
      };

      upload = {
        guid: 'upload-guid',
        file_processing: true,
      };
    });

    describe('when there are file uploads', () => {
      test('it fetches uploads', () => {
        const saga = uploadProcessingPoller(ISSUE_GUID, RESPONSE_URL);
        expect(saga.next().value.SELECT).toBeDefined();
        expect(saga.next(List([message])).value).toEqual(
          call(fetchUploads, ISSUE_GUID, RESPONSE_URL),
        );
      });

      describe('when there are no matches', () => {
        test('it does not apply uploads and delays for the next cycle', () => {
          const saga = uploadProcessingPoller(ISSUE_GUID, RESPONSE_URL);
          expect(saga.next().value.SELECT).toBeDefined();
          expect(saga.next(List([message])).value).toEqual(
            call(fetchUploads, ISSUE_GUID, RESPONSE_URL),
          );

          // Change the upload guid so it does not match.
          upload.guid = 'no-match';

          expect(saga.next({ data: [upload] }).value).toEqual(
            call(delay, 3000),
          );
        });
      });

      describe('when there matches', () => {
        test('it does not apply uploads that are still processing', () => {
          const saga = uploadProcessingPoller(ISSUE_GUID, RESPONSE_URL);
          expect(saga.next().value.SELECT).toBeDefined();
          expect(saga.next(List([message])).value).toEqual(
            call(fetchUploads, ISSUE_GUID, RESPONSE_URL),
          );

          expect(saga.next({ data: [upload] }).value).toEqual(
            call(delay, 3000),
          );
        });
        test('it applies uploads that are not processing', () => {
          const saga = uploadProcessingPoller(ISSUE_GUID, RESPONSE_URL);
          expect(saga.next().value.SELECT).toBeDefined();
          expect(saga.next(List([message])).value).toEqual(
            call(fetchUploads, ISSUE_GUID, RESPONSE_URL),
          );

          // Set the upload to not be processing.
          upload.file_processing = false;

          expect(saga.next({ data: [upload] }).value).toEqual(
            all([put(actions.applyUpload(ISSUE_GUID, message.guid, upload))]),
          );
        });
      });
    });

    describe('when there are no file uploads', () => {
      test('it delays 3 seconds and tries again', () => {
        const saga = uploadProcessingPoller(ISSUE_GUID, RESPONSE_URL);
        expect(saga.next().value.SELECT).toBeDefined();
        expect(saga.next(List([])).value).toEqual(call(delay, 3000));
        expect(saga.next().value.SELECT).toBeDefined();
      });
    });
  });

  describe('queueProcessingUploadsTask', () => {
    describe('when action is a collection of messages', () => {
      test('it queues only uploads in processing', () => {
        const messages = [
          // Not processing, isn't the correct type.
          {
            messageable_type: 'NotUpload',
            messageable: { file_processing: true },
          },
          // Not processing, is flagged as completed.
          {
            messageable_type: 'Upload',
            messageable: { file_processing: false },
          },
          // Processing, is flagged as processing.
          {
            messageable_type: 'Upload',
            messageable: { file_processing: true },
          },
          // Processing, awaiting processing job.
          {
            messageable_type: 'Upload',
            messageable: { file_processing: null },
          },
        ];

        const saga = queueProcessingUploadsTask({
          payload: { guid: ISSUE_GUID, messages },
        });
        const result = saga.next().value;
        expect(result.PUT).toBeDefined();
        expect(result.PUT.action.payload.uploads).toBeDefined();
        expect(result.PUT.action.payload.uploads).toHaveLength(2);
      });
    });
  });

  describe('#presenceKeepAlive', () => {
    test('it touches presence and delays 3s', () => {
      const saga = presenceKeepAlive(ISSUE_GUID, RESPONSE_URL);
      expect(saga.next().value).toEqual(
        call(touchIssuePresence, ISSUE_GUID, RESPONSE_URL),
      );
      expect(saga.next().value).toEqual(call(delay, 3000));
    });
  });

  describe('#joinDiscussionTask', () => {
    describe('all calls occur successfully', () => {
      test('when fetching Response profile fails it attempts to reauthenticate', () => {
        const action = { payload: ISSUE_GUID };

        const saga = joinDiscussionTask(action);
        expect(saga.next().value).toEqual(call(fetchResponseProfile));
        expect(saga.next({ error: 'error message ' }).value).toEqual(
          call(getResponseAuthentication),
        );
      });

      test('happy path', () => {
        const action = { payload: ISSUE_GUID };
        const messageParams = { guid: ISSUE_GUID, params: 'abc' };
        const apiResults = {
          issue: { issue: { guid: ISSUE_GUID } },
          messages: { messages: [{ message: 'text' }] },
          participants: { participants: [{ participant: 'person' }] },
          invites: { invites: [{ invites: 'vendor' }] },
        };

        const saga = joinDiscussionTask(action);
        expect(saga.next().value).toEqual(call(fetchResponseProfile));
        // This is the selectFetchMessageSettings call.
        expect(saga.next({ notAnError: true }).value.SELECT).toBeDefined();
        expect(saga.next(messageParams).value).toEqual(
          all({
            issue: call(fetchIssue, ISSUE_GUID),
            participants: call(fetchParticipants, ISSUE_GUID),
            invites: call(fetchInvites, ISSUE_GUID),
            messages: call(fetchMessages, messageParams),
          }),
        );

        expect(saga.next(apiResults).value).toEqual(
          all([
            put(actions.setIssue(apiResults.issue.issue)),
            put(actions.setMessages(ISSUE_GUID, apiResults.messages.messages)),
            put(actions.setHasMoreMessages(ISSUE_GUID, false)),
            put(
              actions.setParticipants(
                ISSUE_GUID,
                apiResults.participants.participants,
              ),
            ),
            put(actions.setInvites(ISSUE_GUID, apiResults.invites.invites)),
            put(actions.startConnection(ISSUE_GUID)),
          ]),
        );
      });
    });
  });

  describe('#createIssueTask', () => {
    let action;
    let issue;

    beforeEach(() => {
      action = {
        payload: {
          name: 'name',
          description: 'description',
        },
      };

      issue = { guid: ISSUE_GUID };
    });
    describe('when not authenticated with Response', () => {
      test('it attempts to authenticate with Response', () => {
        const saga = createIssueTask(action);
        expect(saga.next().value).toEqual(call(fetchResponseProfile));

        expect(saga.next({ error: 'error message ' }).value).toEqual(
          call(getResponseAuthentication),
        );
      });
    });

    test('it creates an issue', () => {
      const saga = createIssueTask(action);
      expect(saga.next().value).toEqual(call(fetchResponseProfile));
      expect(saga.next({}).value).toEqual(
        call(createIssue, {
          name: action.payload.name,
          description: action.payload.description,
        }),
      );
    });
    describe('when successful', () => {
      describe('when there is a submission', () => {
        test('it updates the submission', () => {
          action.payload.submission = { id: 'submissionId' };

          const saga = createIssueTask(action);
          expect(saga.next().value).toEqual(call(fetchResponseProfile));
          expect(saga.next({}).value).toEqual(
            call(createIssue, {
              name: action.payload.name,
              description: action.payload.description,
            }),
          );

          expect(saga.next({ issue }).value).toEqual(
            call(updateSubmissionDiscussionId, {
              id: action.payload.submission.id,
              guid: ISSUE_GUID,
            }),
          );
        });
      });

      describe('when there is a success callback', () => {
        test('it calls the callback', () => {
          action.payload.onSuccess = jest.fn();

          const saga = createIssueTask(action);
          expect(saga.next().value).toEqual(call(fetchResponseProfile));
          expect(saga.next({}).value).toEqual(
            call(createIssue, {
              name: action.payload.name,
              description: action.payload.description,
            }),
          );

          saga.next({ issue });
          expect(action.payload.onSuccess).toHaveBeenCalledWith(
            issue,
            undefined,
          );
        });

        test('it calls the callback with the updated submission', () => {
          action.payload.submission = { id: 'submissionId' };
          action.payload.onSuccess = jest.fn();

          const saga = createIssueTask(action);
          expect(saga.next().value).toEqual(call(fetchResponseProfile));
          expect(saga.next({}).value).toEqual(
            call(createIssue, {
              name: action.payload.name,
              description: action.payload.description,
            }),
          );

          expect(saga.next({ issue }).value).toEqual(
            call(updateSubmissionDiscussionId, {
              id: action.payload.submission.id,
              guid: ISSUE_GUID,
            }),
          );

          saga.next({ submission: action.payload.submission });
          expect(action.payload.onSuccess).toHaveBeenCalledWith(
            issue,
            action.payload.submission,
          );
        });
      });
    });
  });

  describe('#createInviteTask', () => {
    let action;

    beforeEach(() => {
      action = {
        payload: {
          guid: ISSUE_GUID,
          email: 'fake@email.com',
          note: 'please join',
        },
      };
    });

    describe('when successful', () => {
      test('sets the invite creation as done and closes the modal', () => {
        const saga = createInviteTask(action);
        expect(saga.next().value).toEqual(
          call(
            createInvite,
            action.payload.guid,
            action.payload.email,
            action.payload.note,
          ),
        );

        expect(saga.next({}).value).toEqual(
          all([
            put(actions.createInviteDone()),
            put(actions.closeModal('invitation')),
          ]),
        );
      });
    });

    describe('when unsuccessful', () => {
      test('it toasts an error notification', () => {
        const saga = createInviteTask(action);
        expect(saga.next().value).toEqual(
          call(
            createInvite,
            action.payload.guid,
            action.payload.email,
            action.payload.note,
          ),
        );

        expect(
          saga.next({ error: 'error message ' }).value.PUT.action.type,
        ).toEqual(toastTypes.ADD_TOAST);
      });
    });
  });
});
