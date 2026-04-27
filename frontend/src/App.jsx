import "./App.css";
import UsersPage from "@pages/users-page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "@layouts/admin";
import NotFound from "@layouts/components/not-found";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/users" replace />,
    },
    {
      element: <AdminLayout />,
      children: [
        {
          path: "users",
          element: <UsersPage />,
          handle: { title: "Management Users" },
        },
        {
          path: "settings",
          element: <div>Settings</div>,
          handle: { title: "Settings" },
        },
        { path: "*", element: <NotFound /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
