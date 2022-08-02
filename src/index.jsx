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
  // Navigate,
  // Outlet,
} from "react-router-dom";
// import Layout from "./Layout";

import Welcome from "./components/Welcome";
import { Authentication } from "./components/Authentication";

// const Navbar = () => <h1>Navbar</h1>
// const Atest = () => <h1>TestA</h1>
// const Btest = () => <h1>bTest</h1>
// const Ctest = () => <h1>CTest for fac</h1>
// const Dtest = () => <h1>DTest for fac</h1>
// const FirstPage = () => <h1>Welcome Please Login</h1>
// // const Login = () => <h1>Please Login</h1>
// // const UnAuthPage = () => <h1>แกไม่มีสิทธ์</h1>

// var stateRole = 9
// // 5 = fac, 9 = reg

// function RequireFac() {
//   let role = 5;
//   let auth = stateRole >= role

//   return (
//     auth ? <Outlet />
//       : <Navigate to='/' />
//   )
// }

// function RequireReg() {
//   let role = 9;
//   let auth = stateRole >= role

//   return (
//     auth ? <Outlet />
//       : <Navigate to='/' />
//   )
// }


const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Welcome />} />
        {/* 
        
        <Route element={<RequireFac />}>
          <Route path='/a' element={<Atest />} />
          <Route path='/b' element={<Btest />} />
          <Route element={<RequireReg />}>
            <Route path='/c' element={<Ctest />} />
            <Route path='/d' element={<Dtest />} />
          </Route>
        </Route>
        <Route path='*' element={<ErrorPage />} />
        */}
        <Route path='/authentication' element={<Authentication />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);