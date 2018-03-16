import React from 'react';

export const RequiresSpaceAdmin = ({ profile, children, component }) => {
  if (profile.data.spaceAdmin) {
    return <div>{children}</div>;
  }

  const FailureComponent = component;

  return (
    <h2 style={{ color: 'red' }}>
      {FailureComponent ? <FailureComponent /> : 'Access denied.'}
    </h2>
  );
};
