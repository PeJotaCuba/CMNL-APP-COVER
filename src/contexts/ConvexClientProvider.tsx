import React from 'react';
import { ConvexReactClient, ConvexProvider } from 'convex/react';

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
export const convexClient = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

export const ConvexClientProvider: React.FC<ConvexClientProviderProps> = ({ children }) => {
  if (!convexClient) {
    return <>{children}</>;
  }

  return (
    <ConvexProvider client={convexClient}>
      {children}
    </ConvexProvider>
  );
};

export default ConvexClientProvider;
