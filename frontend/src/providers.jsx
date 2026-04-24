import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
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
