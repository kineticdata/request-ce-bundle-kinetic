import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { PageTitle as CommonPageTitle } from 'common';

export const mapStateToProps = state => ({
  space: state.app.space || 'Home',
  kapp: state.app.kapps.find(kapp => kapp.slug === state.app.kappSlug),
});

export const mapDispatchToProps = {};

export const PageTitle = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => {
    return {
      pageTitleParts: props.parts.concat([
        props.kapp && props.kapp.name,
        props.space && props.space.name,
        'kinops',
      ]),
    };
  }),
)(CommonPageTitle);
