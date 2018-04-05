import React from 'react';
import { shallow } from 'enzyme';
import { KappLink } from 'common';
import { QueueItemDetails } from './QueueItemDetails';
import { ViewOriginalRequest } from './ViewOriginalRequest';

describe('<QueueItemDetails />', () => {
  let props;

  beforeEach(() => {
    props = {
      queueItem: {
        id: 'id',
        handle: 'handle',
        coreState: 'Draft',
        values: {
          Summary: 'this is the summary',
        },
        form: {
          name: 'test form',
        },
        children: [],
      },
      isAssigning: false,
      toggleAssigning: jest.fn(),
      setIsAssigning: jest.fn(),
      setAssignment: jest.fn(),
      assignments: [],
      openNewItemMenu: jest.fn(),
      prohibitSubtasks: false,
      kappSlug: 'queue',
    };
  });

  test('snapshot', () => {
    const wrapper = shallow(<QueueItemDetails {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  describe('View Original Item action button', () => {
    describe('when there is no parent', () => {
      test('it does not render the button', () => {
        props.queueItem.parent = null;
        props.queueItem.origin = null;
        const wrapper = shallow(<QueueItemDetails {...props} />);
        expect(wrapper.find('a.request-button')).toHaveLength(0);
      });
    });

    describe('when the parent form is not a queue form', () => {
      test('it renders the button with the appropriate text', () => {
        props.queueItem.parent = {
          id: 'id1',
          form: { kapp: { slug: 'services' } },
        };
        props.queueItem.origin = { id: 'id1' };
        const wrapper = shallow(<QueueItemDetails {...props} />);
        const originButton = wrapper.find(ViewOriginalRequest);
        expect(originButton).toHaveLength(1);
        expect(originButton.first().prop('queueItem')).toBe(props.queueItem);
      });
    });

    describe('when the parent form is a queue form', () => {
      test('it renders the button with the appropriate text', () => {
        props.queueItem.parent = {
          id: 'id1',
          form: { kapp: { slug: 'queue' } },
        };
        props.queueItem.origin = { id: 'id1' };
        const wrapper = shallow(<QueueItemDetails {...props} />);
        const originButton = wrapper.find(KappLink);
        expect(originButton).toHaveLength(1);
        expect(originButton.first().prop('children')).toBe('View Parent');
        expect(originButton.first().prop('to')).toContain(
          props.queueItem.parent.id,
        );
      });
    });
  });
});
