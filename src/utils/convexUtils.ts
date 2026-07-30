import { useQuery } from 'convex/react';
import { FunctionReference } from 'convex/server';

/**
 * A wrapper around convex/react useQuery that catches runtime errors
 * (e.g., when a function is not yet deployed on the remote Convex instance)
 * and safely returns undefined instead of crashing the React tree.
 */
export function useSafeQuery<Query extends FunctionReference<"query">>(
  queryFunc: Query,
  args?: Query["_args"] | "skip"
): Query["_returnType"] | undefined {
  try {
    // If args is provided as 'skip' or object, pass appropriately
    if (args === "skip") {
      // @ts-ignore
      return useQuery(queryFunc, "skip");
    }
    // @ts-ignore
    return useQuery(queryFunc, args);
  } catch (err) {
    console.warn('[Convex Safe Query] Query execution failed or function not deployed:', err);
    return undefined;
  }
}
