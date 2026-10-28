import { FaixaCta } from "../components/layout/FaixaCta";
import CatalogoCapa from "../sections/catalogo/CatalogoCapa";
import LinhaEquipamentos from "../sections/catalogo/LinhaEquipamentos";

/** `/catalogo-digital/` (design-final §10.4). */
export default function Catalogo() {
  return (
    <>
      <CatalogoCapa />
      <LinhaEquipamentos />
      <FaixaCta page="catalogo" />
    </>
  );
}
