import React from 'react';
import { ConvexReactClient, ConvexProvider } from 'convex/react';

const CONVEX_URL = (import.meta.env.VITE_CONVEX_URL as string) || (typeof window !== 'undefined' ? `${window.location.origin}/api/convex` : 'https://placeholder.convex.cloud');
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
