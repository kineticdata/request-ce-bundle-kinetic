import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bundle, fetchSubmission } from '@kineticdata/react';
import { Map, Set } from 'immutable';
import isarray from 'isarray';
import semver from 'semver';
const MINIMUM_CE_VERSION = '2.3.0';

const I18nContext = React.createContext();

export class I18nProvider extends React.Component {
  constructor(props) {
    super();
    this.state = { translations: Map() };
    this.loading = Map();
    this.mergeTranslations = !!props.mergeTranslations;
  }

  componentDidMount() {
    if (this.props.validVersion) {
      this.loadTranslations(this.props.locale, 'shared');
    } else if (this.props.version) {
      console.warn(
        `You are currently running Kinetic CE ${
          this.props.version
        }. Translations require Kinetic CE ${MINIMUM_CE_VERSION} or greater.`,
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.validVersion) {
      if (prevProps.locale !== this.props.locale || !prevProps.validVersion) {
        this.loadTranslations(this.props.locale, 'shared');
      }
      if (
        !this.state.translations.equals(prevState.translations) &&
        this.state.translations.get(this.props.locale)
      ) {
        window.bundle.config.translations = this.mergeTranslations
          ? {
              ...window.bundle.config.translations,
              ...this.state.translations.get(this.props.locale).toJS(),
            }
          : this.state.translations.get(this.props.locale).toJS();
      }
    } else if (this.props.version) {
      console.warn(
        `You are currently running Kinetic CE ${
          this.props.version
        }. Translations require Kinetic CE ${MINIMUM_CE_VERSION} or greater.`,
      );
    }
  }

  loadTranslations = (locale, context) => {
    if (!this.loading.hasIn([locale, context])) {
      this.loading = this.loading.setIn([locale, context], true);
      const url = `${bundle.apiLocation()}/translations/entries?cache&context=${context}&locale=${locale ||
        ''}`;
      axios
        .get(url)
        .then(response => {
          this.setState(state => ({
            translations: state.translations.setIn(
              [locale, context],
              Map(response.data.entries.map(entry => [entry.key, entry.value])),
            ),
          }));
        })
        .catch(error => {
          this.setState(state => ({
            translations: state.translations.setIn([locale, context], Map()),
          }));
        });
    }
  };

  render() {
    if (this.state.translations) {
      return (
        <I18nContext.Provider
          value={{
            context: this.props.context || 'shared',
            locale: this.props.locale || 'en',
            translations: this.state.translations,
            loadTranslations: this.loadTranslations,
            disabled: !this.props.validVersion,
          }}
        >
          {this.props.children}
        </I18nContext.Provider>
      );
    } else {
      return null;
    }
  }
}

export const ConnectedI18nProvider = connect(state => ({
  locale: state.app.locale,
  version: state.app.coreVersion,
  validVersion:
    state.app.coreVersion &&
    semver.satisfies(
      semver.coerce(state.app.coreVersion),
      `>=${MINIMUM_CE_VERSION}`,
    ),
}))(({ children, ...props }) => (
  <I18nProvider {...props}>{children}</I18nProvider>
));

const submissionContexts = {};
export class I18n extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: !!props.submissionId,
      context: props.context,
    };
  }

  componentDidMount() {
    if (this.state.loading) {
      console.log(
        'loading i18n',
        this.props.submissionId,
        submissionContexts[this.props.submissionId],
      );
      // If submissionId is passed in, we need to fetch the submission to build the context
      if (this.props.submissionId) {
        // If submission was already fetched, use previous result
        if (submissionContexts.hasOwnProperty(this.props.submissionId)) {
          this.setState(state => ({
            loading: false,
            context:
              submissionContexts[this.props.submissionId] || this.state.context,
          }));
        } else {
          // Otherwise fetch the submission
          fetchSubmission({
            id: this.props.submissionId,
            datastore: !!this.props.datastore,
            include: 'form,form.kapp',
          }).then(({ submission }) => {
            // Build context using submission data
            const context = submission
              ? !!this.props.datastore
                ? `datastore.forms.${submission.form.slug}`
                : `kapps.${submission.form.kapp.slug}.forms.${
                    submission.form.slug
                  }`
              : null;
            // Store the context for the submissionId
            submissionContexts[this.props.submissionId] = context;
            // Update loading state to false and set correct context
            this.setState(state => ({
              loading: false,
              context: context || this.state.context,
            }));
          });
        }
      } else {
        this.setState(state => ({
          ...state,
          loading: false,
        }));
      }
    }
  }

  render() {
    return !this.state.loading ? (
      <I18nContext.Consumer>
        {({ context, locale, translations, loadTranslations, disabled }) => {
          // If Translations are disabled, return noop component
          if (disabled) {
            return (
              <I18nDisabled render={this.props.render}>
                {this.props.children}
              </I18nDisabled>
            );
          }
          // If render funtion is passed, or children is a string or array of strings,
          // return the translation of the children string
          else if (
            typeof this.props.render === 'function' ||
            typeof this.props.children === 'string' ||
            (isarray(this.props.children) &&
              this.props.children.every(c => typeof c === 'string'))
          ) {
            return (
              <I18nTranslate
                context={this.state.context || context}
                locale={locale}
                translations={translations}
                loadTranslations={loadTranslations}
                render={this.props.render}
              >
                {this.props.children}
              </I18nTranslate>
            );
          }
          // Otherwise wrap children in a new instance of I18nProvider with the new context
          else if (this.state.context) {
            return (
              <I18nContext.Provider
                value={{
                  context: this.state.context,
                  locale: locale,
                  translations: translations,
                  loadTranslations: loadTranslations,
                }}
              >
                <I18nTranslate
                  context={this.state.context}
                  locale={locale}
                  translations={translations}
                  loadTranslations={loadTranslations}
                >
                  {this.props.children}
                </I18nTranslate>
              </I18nContext.Provider>
            );
          }
          // Otherwise return children
          else {
            return this.props.children;
          }
        }}
      </I18nContext.Consumer>
    ) : null;
  }
}

export class I18nTranslate extends React.Component {
  componentDidMount() {
    this.props.loadTranslations(this.props.locale, this.props.context);
  }

  componentDidUpdate(prevProps) {
    if (this.props.context !== prevProps.context) {
      this.props.loadTranslations(this.props.locale, this.props.context);
    }
  }

  render() {
    if (
      this.props.translations.hasIn([this.props.locale, this.props.context])
    ) {
      if (typeof this.props.render === 'function') {
        return this.props.render(translate(this.props));
      } else if (typeof this.props.children === 'string') {
        return translate(this.props)(this.props.children);
      } else if (
        isarray(this.props.children) &&
        this.props.children.every(c => typeof c === 'string')
      ) {
        return translate(this.props)(this.props.children.join(''));
      } else {
        return this.props.children;
      }
    } else {
      return null;
    }
  }
}

const translate = ({ context, locale, translations }) => key => {
  trackKeys(context, key);
  if (window.highlightTranslations) {
    // Surround translated text with asterisks to easily see what's wrapped
    return `*${translations.getIn([locale, context, key]) ||
      translations.getIn([locale, 'shared', key]) ||
      key}*`;
  } else {
    return (
      translations.getIn([locale, context, key]) ||
      translations.getIn([locale, 'shared', key]) ||
      key
    );
  }
};

let trackedKeys = Map();
const trackKeys = (context, key) => {
  trackedKeys = trackedKeys.has(key)
    ? trackedKeys.set(key, trackedKeys.get(key).add(context))
    : trackedKeys.set(key, Set([context]));
  window.bundle.config.translationKeys = trackedKeys.toJS();
};

const I18nDisabled = ({ render, children }) => {
  if (typeof render === 'function') {
    return render(t => t);
  } else {
    return children;
  }
};
