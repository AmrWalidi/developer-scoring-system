import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase";
import "./App.css";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Scoring from "./pages/Scoring";
import DeveloperScore from "./pages/DeveloperScore";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? <Users /> : <Login />,
    },
    {
      path: "/admin",
      element: <Users />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/scoring/:id",
      element: <Scoring />,
    },

    {
      path: "/developer/:id",
      element: <DeveloperScore />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
