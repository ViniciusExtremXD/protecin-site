import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// O JS chegou e executou: o seguro anti-invisível do <head> (motion-failed) só age se esta marca faltar no
// DOMContentLoaded, se um script do site falhar ao carregar ou se a hidratação não terminar em 12 s a partir daqui.
(window as Window & { __ptBoot?: number }).__ptBoot = Date.now();

const raiz = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App path={window.location.pathname} />
  </StrictMode>
);

// O build pré-renderiza cada rota (scripts/prerender.mjs); o servidor de desenvolvimento parte da raiz vazia.
// A hidratação é a árvore inteira de uma vez, mas em transição: o React divide o trabalho em fatias e o navegador pinta
// e responde entre elas, em vez de ficar uma tarefa só de mais de 1 s no celular.
if (raiz.hasChildNodes()) startTransition(() => void hydrateRoot(raiz, app));
else createRoot(raiz).render(app);
