import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthProvider } from 'app/store/AuthContext';
import ScreenWrapper from 'app/components/molecules/ScreenWrapper';

const RenderWrapper = ({ children }) => (
  <AuthProvider>
    <ScreenWrapper>{children}</ScreenWrapper>
  </AuthProvider>
);

const customRender = ui => render(ui, { wrapper: RenderWrapper });

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };
