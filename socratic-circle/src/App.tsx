import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Link,
  RouterProvider,
} from "react-router-dom";

// import pages
import LogIn from "./pages/logIn/LogIn";
import SignIn from "./pages/signIn/SignIn";
import HomeLayout from "./layouts/home/HomeLayout";
import Feed from "./pages/feed/Feed";
import Profil from "./pages/profil/Profil";
import MyEssays from "./pages/myEssays/MyEssays";
import ErrorPage from "./pages/error/ErrorPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<LogIn />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="home" element={<HomeLayout />}>
          <Route index element={<Feed />} />
          <Route path="profile" element={<Profil />} />
          <Route path="my-essays" element={<MyEssays />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
