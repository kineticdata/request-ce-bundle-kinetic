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
import { Schedulers } from './components/scheduler/Schedulers';
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
  actions as toastActions,
  types as toastTypes,
} from './redux/modules/toasts';
import { actions as modalFormActions } from './redux/modules/modalForm';
import { actions as searchHistoryActions } from './redux/modules/searchHistory';
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
  toastActions,
  toastTypes,
  modalFormActions,
  searchHistoryActions,
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
  Schedulers,
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
