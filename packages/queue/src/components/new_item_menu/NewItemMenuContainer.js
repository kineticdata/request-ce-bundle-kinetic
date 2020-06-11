import {
  compose,
  lifecycle,
  withState,
  withHandlers,
  withProps,
} from 'recompose';
import { push } from 'redux-first-history';
import {
  selectMyTeamForms,
  selectAssignments,
  getFilterByPath,
} from '../../redux/modules/queueApp';
import { actions } from '../../redux/modules/queue';
import { NewItemMenu } from './NewItemMenu';
import { connect } from '../../redux/store';
import { refreshFilter } from '../../utils';

const mapStateToProps = state => {
  const filter = getFilterByPath(state, state.router.location.pathname);

  return {
    myTeamForms: !state.queue.newItemMenuOptions.get('parentId')
      ? selectMyTeamForms(state).filter(form => form.type === 'Task')
      : selectMyTeamForms(state).filter(
          form => form.type === 'Task' || form.type === 'Subtask',
        ),
    isOpen: state.queue.newItemMenuOpen,
    options: state.queue.newItemMenuOptions,
    allTeams: state.queueApp.allTeams,
    kappSlug: state.app.kappSlug,
    username: state.app.profile && state.app.profile.username,
    location: state.app.location,
    filter,
  };
};

const mapDispatchToProps = {
  closeNewItemMenu: actions.closeNewItemMenu,
  fetchCurrentItem: actions.fetchCurrentItem,
  push,
  fetchList: actions.fetchList,
};

const handleFormClick = ({ setCurrentForm }) => form => () =>
  setCurrentForm(form);
const handleAssignmentClick = ({ setAssignment }) => form => () =>
  setAssignment(form);
const handleSave = ({
  kForm,
  setCurrentForm,
  setKForm,
  setAssignment,
}) => () => {
  kForm.submitPage();
};
const handleClosed = ({
  setCurrentForm,
  setKForm,
  setAssignment,
  closeNewItemMenu,
}) => () => {
  closeNewItemMenu();
};
const handleSelect = ({ setAssignment }) => (_value, state) => {
  const teamParts = state.team.split('::');
  let values = {
    'Assigned Individual Display Name': state.displayName,
    'Assigned Team': state.team,
    'Assigned Team Display Name': teamParts[teamParts.length - 1],
  };

  if (state.username) {
    values['Assigned Individual'] = state.username;
  }

  setAssignment(values);
};

const onFormLoaded = ({ setKForm }) => form => setKForm(form);

const onCreated = ({
  options,
  fetchCurrentItem,
  closeNewItemMenu,
  username,
  location,
  push,
  refreshFilter,
}) => (submission, actions) => {
  // Prevent loading the next page of the embedded form since we are just going
  // to close the dialog anyways.
  actions.stop();
  // Close the new item menu
  closeNewItemMenu();
  // Refresh the current filter
  refreshFilter && refreshFilter();

  // Check if this is assigned to me if so, go to submission
  if (
    username &&
    submission.submission.values &&
    submission.submission.values['Assigned Individual'] === username
  ) {
    push(`${location}/item/${submission.submission.id}`);
  }
  // Else if the new queue item that was just created has a parent we fetch the
  // parent again because we want its subtask list to contain this new queue
  // item.
  else if (options.get('parentId')) {
    fetchCurrentItem(options.get('parentId'));
  }
};

export const NewItemMenuContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('currentAssignment', 'setAssignment', null),
  withState('currentForm', 'setCurrentForm', null),
  withState('kForm', 'setKForm', null),
  withProps(props => {
    const assignmentType =
      props.currentForm &&
      props.currentForm.attributes['Assignment Type'] &&
      props.currentForm.attributes['Assignment Type'][0];
    return {
      assignmentRequired:
        !assignmentType || assignmentType.toLowerCase() !== 'none',
      assignments: selectAssignments(props.allTeams, props.currentForm).toJS(),
    };
  }),
  withHandlers({
    refreshFilter,
  }),
  withHandlers({
    handleFormClick,
    handleAssignmentClick,
    handleSave,
    handleClosed,
    handleSelect,
    onFormLoaded,
    onCreated,
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (!this.props.isOpen && prevProps.isOpen) {
        // Reset form when it is closed
        this.props.setAssignment(null);
        this.props.setCurrentForm(null);
        this.props.setKForm(null);
      }
    },
  }),
)(NewItemMenu);
