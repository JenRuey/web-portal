import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import APIList from "./components/APIList";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Login from "./components/Login";
import Notification from "./components/Notification";
import UserManagement from "./components/UserManagement";
import { localstoragetext } from "./constants/localstorage-text";
import buildpath from "./constants/route-path";
import { logout } from "./functions/misc";

type PrivateRouteType = {
  children: JSX.Element;
};
function PrivateRoute({ children }: PrivateRouteType): JSX.Element {
  if (!localStorage.getItem(localstoragetext.accesstoken)) {
    // not logged in so redirect to login page with the return url
    logout();
    return <Navigate to="/login" state={{ from: "/" }} />;
  }

  // authorized so return child components
  return children;
}

function App() {
  useEffect(() => {
    toast("Welcome to Liteon web portal.", {
      type: "success",
      autoClose: 1000,
    });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={buildpath.home}
          element={
            <PrivateRoute>
              <div>
                <React.Suspense fallback={<>...</>}>
                  <Home />
                </React.Suspense>
              </div>
            </PrivateRoute>
          }
        >
          <Route path={buildpath.dashboard} element={<Dashboard />} />
          <Route path={buildpath.notification} element={<Notification />} />
          <Route path={buildpath.usermanagement} element={<UserManagement />} />
          <Route path={buildpath.api} element={<APIList />} />
          <Route
            path={buildpath.home}
            element={<Navigate to={buildpath.dashboard} replace={true} />}
          />
        </Route>
        <Route path={buildpath.login} element={<Login />} />
        <Route
          path={"*"}
          element={
            <PrivateRoute>
              <React.Suspense fallback={<>...</>}>
                <Navigate to={buildpath.dashboard} replace={true} />
              </React.Suspense>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
