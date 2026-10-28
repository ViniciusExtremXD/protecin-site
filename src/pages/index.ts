import type { ComponentType } from "react";
import type { PageId } from "../data/site";
import Catalogo from "./Catalogo";
import Clientes from "./Clientes";
import Contato from "./Contato";
import Creditos from "./Creditos";
import Home from "./Home";
import Institucional from "./Institucional";
import NaoEncontrada from "./NaoEncontrada";
import NossoApp from "./NossoApp";
import Servicos from "./Servicos";

/** Página de cada PageId (design-final §8). */
export const PAGINAS: Record<PageId, ComponentType> = {
  home: Home,
  institucional: Institucional,
  servicos: Servicos,
  clientes: Clientes,
  catalogo: Catalogo,
  app: NossoApp,
  contato: Contato,
  creditos: Creditos,
  "404": NaoEncontrada,
};
