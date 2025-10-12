import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import Router from "./router/Router.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}