import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
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
import CreateEssay from "./pages/createEssay/CreateEssay";
import EssayFull from "./pages/essayFull/EssayFull";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<LogIn />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="home" element={<HomeLayout />}>
          <Route index element={<Feed />} />
          <Route path="create-essay" element={<CreateEssay />} />
          <Route path="profile" element={<Profil />} />
          <Route path="my-essays" element={<MyEssays />}>
            <Route path=":id" element={<EssayFull />} /> {/* Handle :id for my-essays */}
          </Route>
          <Route path=":id" element={<EssayFull />} /> {/* Handle :id at the top level */}
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};


export default App;
