import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const raiz = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App path={window.location.pathname} />
  </StrictMode>
);

// O build pré-renderiza cada rota (scripts/prerender.mjs); o servidor de desenvolvimento parte da raiz vazia.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app);
else createRoot(raiz).render(app);
