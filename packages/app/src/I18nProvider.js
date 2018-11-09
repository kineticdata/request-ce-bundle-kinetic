import React from 'react';
import axios from 'axios';
import { bundle } from 'react-kinetic-core';
import { Map } from 'immutable';

const I18nContext = React.createContext();

export class I18nProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { translations: Map() };
  }

  componentDidMount() {
    this.loadTranslations(this.props.locale, 'shared');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.locale !== this.props.locale) {
      this.loadTranslations(this.props.locale, 'shared');
    }
    if (!this.state.translations.equals(prevState.translations)) {
      window.bundle.config.translations = this.state.translations
        .get(this.props.locale)
        .toJS();
    }
  }

  loadTranslations = (locale, context) => {
    const url = `${bundle.apiLocation()}/translations/entries?cache&context=${context}&locale=${locale}`;
    axios.get(url).then(response => {
      this.setState(state => ({
        translations: state.translations.setIn(
          [locale, context],
          Map(response.data.entries.map(entry => [entry.key, entry.value])),
        ),
      }));
    });
  };

  render() {
    if (this.state.translations) {
      return (
        <I18nContext.Provider
          value={{
            locale: this.props.locale,
            translations: this.state.translations,
            loadTranslations: this.loadTranslations,
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

export class I18n extends React.Component {
  render() {
    return (
      <I18nContext.Consumer>
        {({ locale, translations, loadTranslations }) => (
          <I18nTranslate
            context={this.props.context}
            locale={locale}
            translations={translations}
            loadTranslations={loadTranslations}
          >
            {this.props.children}
          </I18nTranslate>
        )}
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
      return typeof this.props.children === 'string'
        ? this.props.translations.getIn([
            this.props.locale,
            this.props.context,
            this.props.children,
          ]) ||
            this.props.translations.getIn([
              this.props.locale,
              'shared',
              this.props.children,
            ]) ||
            this.props.children
        : this.props.children;
    } else {
      return null;
    }
  }
}
