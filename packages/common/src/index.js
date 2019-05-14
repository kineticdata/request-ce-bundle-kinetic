import React from 'react';
import { Provider } from 'react-redux';
import { Avatar } from './components/Avatar';
import { ProfileCard } from './components/ProfileCard';
import { ToastsContainer } from './components/ToastsContainer';
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
import {
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  selectHasRoleSchedulerAgent,
} from './redux/selectors';

import * as Utils from './utils';
import * as Constants from './constants';
import * as AttributeSelectors from './components/attribute_selectors';
import * as TaskActions from './helpers/taskActions';

const CommonProvider = props => (
  <Provider store={store} context={context}>
    {props.children}
  </Provider>
);

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
} from './redux/modules/toasts';

export {
  CommonProvider,
  Avatar,
  ProfileCard,
  ToastsContainer,
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
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  selectHasRoleSchedulerAgent,
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
};
