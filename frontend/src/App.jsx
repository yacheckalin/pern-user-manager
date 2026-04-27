import "./App.css";
import UsersPage from "./pages/UsersPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <UsersPage />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
