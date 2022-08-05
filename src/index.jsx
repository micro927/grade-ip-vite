import './styles/index.scss'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  // Link,
  // useNavigate,
  // useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";

import Welcome from "./components/Welcome";
import { Error401, Error404 } from './components/ErrorWarning';
import { Authentication } from "./components/Authentication";
import AdvisorListCourse from "./components/Advisor/listCourse";

const roleLevel = 3 // loginInfo.role

function roleLeveltoEnter(roleLevelRequired) {
  const result = roleLevel >= roleLevelRequired
    ? <Outlet />
    : <Navigate to='/401' />
  return result
}

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path='/advisor' element={roleLeveltoEnter(1)} >
          <Route index element={<AdvisorListCourse />} />
        </Route>
        <Route path='/department' element={roleLeveltoEnter(2)} >
          <Route index element={<Welcome />} />
        </Route>
        <Route path='/faculty' element={roleLeveltoEnter(3)} >
          <Route index element={<Welcome />} />
        </Route>
        <Route path='/verify' element={roleLeveltoEnter(4)} >
          <Route index element={<Welcome />} />
        </Route>
        <Route path='/summary' element={<Welcome />} />
        <Route path='/authentication' element={<Authentication />} />
        <Route path='*' element={<Error404 />} />
        <Route path='401' element={<Error401 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);