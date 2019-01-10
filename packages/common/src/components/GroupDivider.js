import React from 'react';

export const GroupDivider = ({ children, value, className = '', ...props }) => (
  <div className={`group-divider ${className}`} {...props}>
    <hr />
    <span>{children || value}</span>
    <hr />
  </div>
);
