import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import Router from "./router/Router.jsx";
import { AuthProvider } from "./contexts/Auth";
export default function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}