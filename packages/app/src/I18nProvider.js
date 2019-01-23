import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bundle } from 'react-kinetic-core';
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
      axios.get(url).then(response => {
        this.setState(state => ({
          translations: state.translations.setIn(
            [locale, context],
            Map(response.data.entries.map(entry => [entry.key, entry.value])),
          ),
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
  locale: state.app.config.locale,
  version: state.app.config.version,
  validVersion:
    state.app.config.version &&
    semver.satisfies(
      semver.coerce(state.app.config.version),
      `>=${MINIMUM_CE_VERSION}`,
    ),
}))(({ children, ...props }) => (
  <I18nProvider {...props}>{children}</I18nProvider>
));

export class I18n extends React.Component {
  render() {
    return (
      <I18nContext.Consumer>
        {({ context, locale, translations, loadTranslations, disabled }) =>
          disabled ? (
            <I18nDisabled render={this.props.render}>
              {this.props.children}
            </I18nDisabled>
          ) : typeof this.props.render === 'function' ||
          typeof this.props.children === 'string' ||
          (isarray(this.props.children) &&
            this.props.children.every(c => typeof c === 'string')) ? (
            <I18nTranslate
              context={this.props.context || context}
              locale={locale}
              translations={translations}
              loadTranslations={loadTranslations}
              render={this.props.render}
            >
              {this.props.children}
            </I18nTranslate>
          ) : this.props.context ? (
            <I18nContext.Provider
              value={{
                context: this.props.context,
                locale: locale,
                translations: translations,
                loadTranslations: loadTranslations,
              }}
            >
              <I18nTranslate
                context={this.props.context}
                locale={locale}
                translations={translations}
                loadTranslations={loadTranslations}
              >
                {this.props.children}
              </I18nTranslate>
            </I18nContext.Provider>
          ) : (
            this.props.children
          )
        }
      </I18nContext.Consumer>
    );
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
  /* Uncomment to wrap translated text for easily seeing what's wrapped. */
  // return `*${translations.getIn([locale, context, key]) ||
  //   translations.getIn([locale, 'shared', key]) ||
  //   key}*`;
  /* End */
  return (
    translations.getIn([locale, context, key]) ||
    translations.getIn([locale, 'shared', key]) ||
    key
  );
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
