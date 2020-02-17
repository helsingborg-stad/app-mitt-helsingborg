import React from 'react';

// TODO: Migrate to Redux. This is a temp fix.
// Create and set default values.
const StoreContext = React.createContext({
  language: 'en',
  badgeCount: 0,
});

export default StoreContext;
