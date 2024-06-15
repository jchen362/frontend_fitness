import './App.css';
import ReactDom from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {LoginPage, LoginWithRouter} from "./pages/LoginPage";
import {SignUpPage, SignUpWithRouter} from './pages/SignUpPage';
import {Homepage, HomePageWithRouter} from './pages/Homepage';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route exact path = "/" element = {<LoginWithRouter/>}></Route>
        <Route exact path = "/signup" element = {<SignUpWithRouter/>}></Route>
        <Route exact path = "/homepage" element = {<HomePageWithRouter/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
