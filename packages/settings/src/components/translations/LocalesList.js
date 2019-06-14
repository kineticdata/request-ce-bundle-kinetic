import React from 'react';
import { Link } from '@reach/router';
import { push } from 'redux-first-history';
import { connect } from 'react-redux';
import {
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { actions } from '../../redux/modules/settingsTranslations';
import { context } from '../../redux/store';
import { I18n } from '@kineticdata/react';

export const LocalesListComponent = ({
  defaultLocale,
  enabledLocales,
  availableLocales,
  availableLocalesMap,
  openDropdown,
  toggleDropdown,
  localeToEnable,
  handleLocaleToEnableChange,
  handleEnableLocale,
  handleDisableLocale,
  handleSetDefaultLocale,
}) => {
  return (
    <table className="table table-sm table-striped table--settings">
      <thead className="header">
        <tr>
          <th scope="col">
            <I18n>Locale Name</I18n>
          </th>
          <th scope="col">
            <I18n>Code</I18n>
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {enabledLocales.map(locale => {
          const isDefault = locale.code === defaultLocale.code;
          return (
            <tr key={locale.code}>
              <td scope="row">
                <Link to={`/settings/translations/locale/${locale.code}`}>
                  {availableLocalesMap[locale.code]}
                </Link>
              </td>
              <td>
                <Badge color={isDefault ? 'info' : 'secondary'}>
                  {locale.code}
                </Badge>
              </td>
              <td className="text-right" width="1%">
                {isDefault ? (
                  <em className="text-info">
                    <I18n>Default Locale</I18n>
                  </em>
                ) : (
                  <Dropdown
                    toggle={toggleDropdown(locale.code)}
                    isOpen={openDropdown === locale.code}
                  >
                    <DropdownToggle color="link" className="btn-sm">
                      <span className="fa fa-ellipsis-h fa-2x" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem onClick={handleDisableLocale(locale.code)}>
                        <I18n>Disable Locale</I18n>
                      </DropdownItem>
                      <DropdownItem
                        onClick={handleSetDefaultLocale(locale.code)}
                      >
                        <I18n>Make Default</I18n>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <select
              name="locale-to-enable-select"
              id="locale-to-enable-select"
              className="form-control"
              value={localeToEnable}
              onChange={handleLocaleToEnableChange}
            >
              <option />
              {availableLocales
                .filter(
                  locale => !enabledLocales.find(el => el.code === locale.code),
                )
                .map((locale, index) => (
                  <option key={`${locale.code}-${index}`} value={locale.code}>
                    {locale.name}
                  </option>
                ))}
            </select>
          </td>
          <td>
            {localeToEnable && (
              <Badge color="secondary">{localeToEnable}</Badge>
            )}
          </td>
          <td className="text-right">
            <button
              disabled={!localeToEnable}
              className={`btn btn-success`}
              onClick={handleEnableLocale}
            >
              <I18n>Enable Locale</I18n>
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export const mapStateToProps = state => ({
  loading: state.settingsTranslations.locales.loading,
  errors: state.settingsTranslations.locales.errors,
  defaultLocale: state.settingsTranslations.locales.default,
  enabledLocales: state.settingsTranslations.locales.enabled,
  availableLocales: state.settingsTranslations.locales.available,
  availableLocalesMap: state.settingsTranslations.locales.available.reduce(
    (map, locale) => ({ ...map, [locale.code]: locale.name }),
    {},
  ),
});

export const mapDispatchToProps = {
  push,
  enableLocale: actions.enableLocale,
  disableLocale: actions.disableLocale,
  setDefaultLocale: actions.setDefaultLocale,
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? '' : dropdownSlug);

const handleLocaleToEnableChange = ({ setLocaleToEnable }) => e => {
  setLocaleToEnable(e.target.value);
};

const handleEnableLocale = ({
  enableLocale,
  localeToEnable,
  setLocaleToEnable,
}) => () => {
  enableLocale({ localeCode: localeToEnable });
  setLocaleToEnable('');
};

const handleDisableLocale = ({ disableLocale }) => localeCode => () => {
  disableLocale({ localeCode });
};

const handleSetDefaultLocale = ({ setDefaultLocale }) => localeCode => () => {
  setDefaultLocale({ localeCode });
};

export const LocalesList = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context },
  ),
  withState('openDropdown', 'setOpenDropdown', ''),
  withState('localeToEnable', 'setLocaleToEnable', ''),
  withHandlers({
    toggleDropdown,
    handleLocaleToEnableChange,
    handleEnableLocale,
    handleDisableLocale,
    handleSetDefaultLocale,
  }),
  lifecycle({
    componentDidMount() {},
  }),
)(LocalesListComponent);
