import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { I18n } from '@kineticdata/react';

const DefaultAppComponent = ({ render, space, kapp, kapps, profile }) => {
  return render({
    main: (
      <I18n>
        <main className={`package-layout`}>
          <div className="page-container container">
            <h1>
              <I18n>{space.name}</I18n>
            </h1>
            {kapp && (
              <div className="alert alert-warning">
                <h4>
                  <I18n>{kapp.name}</I18n>
                </h4>
                <hr />
                <div>
                  <I18n>This Kapp does not have a Bundle Package defined.</I18n>
                </div>
              </div>
            )}
            <ul>
              {kapps.map(k => (
                <li key={k.slug}>
                  <Link to={`/kapps/${k.slug}`}>
                    <I18n>{k.name}</I18n>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </I18n>
    ),
  });
};

const mapStateToProps = state => ({
  space: state.app.space,
  kapp: state.app.kapp,
  kapps: state.app.kapps,
  profile: state.app.profile,
});

export const DefaultAppProvider = connect(mapStateToProps)(DefaultAppComponent);
