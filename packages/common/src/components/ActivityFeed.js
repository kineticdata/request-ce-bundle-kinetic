import React, { Component } from 'react';
import t from 'prop-types';
import { generateKey } from '@kineticdata/react';
import { connect } from '../redux/store';
import { actions } from '../redux/modules/activityFeed';

export class ActivityFeed extends Component {
  constructor(props) {
    super(props);
    this.feedKey = this.props.feedKey || generateKey();
  }

  render() {
    return <ActivityFeedImpl {...this.props} feedKey={this.feedKey} />;
  }
}

export class ActivityFeedImplComponent extends Component {
  init = () => {
    this.props.initActivityFeed(this.props);
  };

  componentDidMount() {
    if (this.props.init) {
      this.init();
    }
  }

  componentWillUnmount() {
    this.props.deleteActivityFeed({ feedKey: this.props.feedKey });
  }

  render() {
    const { feedKey, feed, pageSize, children: renderFn } = this.props;
    return renderFn(
      feed
        ? {
            reset: this.init,
            loading: feed.loading,
            errors: feed.errors,
            data: feed.pageData,
            dataElements: feed.pageDataElements,
            startIndex:
              feed.index +
              ((feed.pageData && feed.pageData.length) || feed.index ? 1 : 0),
            endIndex:
              feed.index +
              ((feed.pageData && feed.pageData.length) || (feed.index ? 1 : 0)),
            hasPreviousPage: feed.index > 0,
            getPreviousPage: () => {
              this.props.previousPage({ feedKey });
            },
            hasNextPage:
              feed.data.size > feed.index + feed.pageSize ||
              feed.dataSources.some(s => !s.completed || s.data.size),
            getNextPage: () => {
              this.props.nextPage({ feedKey });
            },
            resetPaging: () => {
              this.props.resetPaging({
                feedKey,
                pageSize: pageSize,
              });
            },
          }
        : {
            init: this.init,
          },
    );
  }
}

const mapDispatchToProps = {
  initActivityFeed: actions.initActivityFeed,
  resetPaging: actions.resetPaging,
  previousPage: actions.previousPage,
  nextPage: actions.nextPage,
  deleteActivityFeed: actions.deleteActivityFeed,
};

const mapStateToProps = (state, props) => {
  return {
    feed: state.activityFeed.get(props.feedKey),
  };
};

const ActivityFeedImpl = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActivityFeedImplComponent);

ActivityFeed.propTypes = {
  // Optional string key for initializing the activity feed
  feedKey: t.string,
  // Function that will render the content of the feed
  children: t.func.isRequired,
  // Boolean value specifying if data should be fetched immediately on mount
  init: t.bool,
  // Number of results to show per page
  pageSize: t.number,
  // Property or function that determines what value the sources should be
  // joined by
  joinBy: t.oneOfType([t.string, t.func]),
  // Sort function for sorting the next value from each source to determine
  // the next one to add to the join list
  joinByComparator: t.func,
  // Direction to sort joinBy value if joinByComparator is not provided
  joinByDirection: t.oneOf(['ASC', 'DESC']),
  // Sources from which data should be fetched
  dataSources: t.objectOf(
    t.oneOf([
      t.shape({
        // Static list of data
        data: t.array.isRequired,
        // Component for rendering the element of each record in this source
        component: t.func.isRequired,
        // Overwrite of the joinBy provided to the ActivityFeed
        joinBy: t.oneOfType([t.string, t.func]),
      }),
      t.shape({
        // @kineticdata/react api function for fetching data
        fn: t.func.isRequired,
        // Function which build the params object to the api call based on the
        // previous params and results
        params: t.func.isRequired,
        // Function that transforms the results of the api call into an object
        // containing a data property
        transform: t.func.isRequired,
        // Component for rendering the element of each record in this source
        component: t.func.isRequired,
        // Overwrite of the joinBy provided to the ActivityFeed
        joinBy: t.oneOfType([t.string, t.func]),
      }),
    ]),
  ),
};
