import React from 'react';
import { Provider } from 'react-redux';
import { Avatar } from './components/Avatar';
import { ProfileCard } from './components/ProfileCard';
import { ModalFormContainer } from './components/ModalFormContainer';
import { TimeAgo } from './components/TimeAgo';
import { importLocale } from './components/Moment';
import { Icon } from './components/Icon';
import { Loading } from './components/Loading';
import { PageTitle } from './components/PageTitle';
import { ErrorNotFound } from './components/ErrorNotFound';
import { ErrorUnauthorized } from './components/ErrorUnauthorized';
import { ErrorUnexpected } from './components/ErrorUnexpected';
import { WallySpinner } from './components/WallySpinner';
import { SchedulersList } from './components/scheduler/SchedulersList';
import { Scheduler } from './components/scheduler/Scheduler';
import { CreateScheduler } from './components/scheduler/CreateScheduler';
import { Table, PaginationControl, FilterControl } from './components/Table';
import { GroupDivider } from './components/GroupDivider';
import { Discussion } from './components/discussions/Discussion';
import { CreateDiscussionModal } from './components/discussions/CreateDiscussionModal';
import { UserMessageGroup as MessagesGroup } from '@kineticdata/react';
import { DiscussionCard } from './components/discussions/summary/DiscussionCard';
import { DiscussionsList } from './components/discussions/summary/DiscussionsList';
import { DiscussionsPanel } from './components/discussions/summary/DiscussionsPanel';
import { ViewDiscussionsModal } from './components/discussions/summary/ViewDiscussionsModal';
import { store, context } from './redux/store';

import {
  selectCurrentKapp,
  selectCurrentKappSlug,
  selectDiscussionsEnabled,
} from './redux/modules/common';

import * as Utils from './utils';
import * as Constants from './constants';
import * as AttributeSelectors from './components/attribute_selectors';
import * as TaskActions from './helpers/taskActions';
import FormComponents from './components/forms';
import TableComponents from './components/tables';

const CommonProvider = props => (
  <Provider store={store} context={context}>
    {props.children}
  </Provider>
);

// Common Helpers
export * from './redux/selectors';

// Common Actions
export { openModalForm } from './redux/modules/modalForm';
export {
  enableSearchHistory,
  recordSearchHistory,
} from './redux/modules/searchHistory';
export {
  addSuccess,
  addError,
  addInfo,
  addNormal,
  addWarn,
  addToast,
  addToastAlert,
  removeToastAlert,
  openConfirm,
  closeConfirm,
} from './redux/modules/toasts';

// Common Components
export { AutoFocusInput } from './components/AutoFocusInput';
export {
  EmptyMessage,
  ErrorMessage,
  InfoMessage,
  LoadingMessage,
  StateListWrapper,
} from './components/StateMessages';
export {
  DateRangeSelector,
  DateRangeDropdown,
} from './components/DateRangeSelector';
export { TeamCard } from './components/TeamCard';
export { FormComponents, TableComponents };
export { LockableCoreForm } from './components/LockableCoreForm';
export { PromiseButton } from './components/PromiseButton';
export { Countdown } from './components/Countdown';
export {
  ToastsContainer,
  LocalToast,
  LocalToastsContainer,
} from './components/ToastsContainer';
export { ActivityFeed } from './components/ActivityFeed';
export { ModalButton } from './components/ModalButton';
export {
  SubmissionExport,
  SubmissionExportModalButton,
} from './components/submissions/SubmissionExport';

export {
  CommonProvider,
  Avatar,
  ProfileCard,
  ModalFormContainer,
  TimeAgo,
  importLocale,
  Icon,
  Loading,
  PageTitle,
  selectCurrentKapp,
  selectCurrentKappSlug,
  selectDiscussionsEnabled,
  Utils,
  Constants,
  ErrorNotFound,
  ErrorUnauthorized,
  ErrorUnexpected,
  WallySpinner,
  AttributeSelectors,
  SchedulersList,
  Scheduler,
  CreateScheduler,
  TaskActions,
  Table,
  PaginationControl,
  FilterControl,
  GroupDivider,
  Discussion,
  MessagesGroup,
  DiscussionsList,
  DiscussionsPanel,
  DiscussionCard,
  ViewDiscussionsModal,
  CreateDiscussionModal,
};
