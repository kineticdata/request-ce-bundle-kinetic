import { compose, withState, withHandlers, withProps } from 'recompose';

import {
  selectMyTeamForms,
  selectAssignments,
} from '../../redux/modules/queueApp';
import { actions } from '../../redux/modules/queue';
import { NewItemMenu } from './NewItemMenu';
import { connect } from '../../redux/store';

const mapStateToProps = state => ({
  myTeamForms: !state.queue.newItemMenuOptions.get('parentId')
    ? selectMyTeamForms(state).filter(form => form.type === 'Task')
    : selectMyTeamForms(state).filter(
        form => form.type === 'Task' || form.type === 'Subtask',
      ),
  isOpen: state.queue.newItemMenuOpen,
  options: state.queue.newItemMenuOptions,
  allTeams: state.queueApp.allTeams,
  kappSlug: state.app.kappSlug,
});

const mapDispatchToProps = {
  closeNewItemMenu: actions.closeNewItemMenu,
  fetchCurrentItem: actions.fetchCurrentItem,
};

const handleFormClick = ({ setCurrentForm }) => form => () =>
  setCurrentForm(form);
const handleAssignmentClick = ({ setAssignment }) => form => () =>
  setAssignment(form);
const handleSave = ({ kForm }) => () => kForm.submitPage();
const handleClosed = ({ setCurrentForm, setKForm, setAssignment }) => () => {
  setAssignment(null);
  setCurrentForm(null);
  setKForm(null);
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

const onCreated = ({ options, fetchCurrentItem, closeNewItemMenu }) => (
  submission,
  actions,
) => {
  // Prevent loading the next page of the embedded form since we are just going
  // to close the dialog anyways.
  actions.stop();
  // If the new queue item that just was created has a parent we fetch the
  // parent again because we want its subtask list to contain this new queue
  // item.
  if (options.get('parentId')) {
    fetchCurrentItem(options.get('parentId'));
  }
  closeNewItemMenu();
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
    handleFormClick,
    handleAssignmentClick,
    handleSave,
    handleClosed,
    handleSelect,
    onFormLoaded,
    onCreated,
  }),
)(NewItemMenu);
