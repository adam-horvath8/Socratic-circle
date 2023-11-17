import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// import pages
import LogIn from "./pages/logIn/LogIn";
import HomeLayout from "./layouts/home/HomeLayout";
import Home from "./pages/feed/Home";
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
        <Route path="home" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="create-essay/:id" element={<CreateEssay />} />
          <Route path="create-essay" element={<CreateEssay />} />
          <Route path="profile" element={<Profil />} />
          <Route path="my-essays" element={<MyEssays />}>
            <Route path=":id" element={<EssayFull />} />
          </Route>
          <Route path=":id" element={<EssayFull />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
