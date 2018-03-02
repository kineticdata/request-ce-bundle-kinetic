import React from 'react';

export const App = ({ render }) =>
  render({
    main: (
      <div style={{ marginTop: '49px' }} className="space">
        Space Content
      </div>
    ),
    sidebar: (
      <div style={{ marginTop: '49px' }} className="space-sidebar">
        Space Sidebar
      </div>
    ),
  });
