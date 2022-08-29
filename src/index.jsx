import './styles/index.scss'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppContextProvider } from './components/Provider';
import AppRouter from './router';


const isLogin = localStorage.getItem('isLogin')
const gradeType = localStorage.getItem('gradeType') ?? false
if (isLogin && !gradeType) {
  localStorage.setItem('gradeType', 'i')
}


const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  </StrictMode>
);
