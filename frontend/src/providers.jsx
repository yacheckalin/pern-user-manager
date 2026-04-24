import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if ([400, 401, 403, 404, 409].includes(error?.status)) return false;
        return failureCount < 2; // for 500 — 2 repeat
      },
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const Providers = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {/* <RouterProvider router={router} /> */}
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
