import React from 'react';
import { ConvexReactClient, ConvexProvider } from 'convex/react';

// Dynamically construct the Convex URL based on the current domain and path
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || (window.location.origin + '/api/convex');
export const convexClient = new ConvexReactClient(CONVEX_URL);

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

export const ConvexClientProvider: React.FC<ConvexClientProviderProps> = ({ children }) => {
  return (
    <ConvexProvider client={convexClient}>
      {children}
    </ConvexProvider>
  );
};

export default ConvexClientProvider;
