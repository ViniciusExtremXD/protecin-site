import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { COMPANY, NOT_FOUND, ROUTES, SERVICOS, type Rota } from "./data/site";
import { assetUrl } from "./lib/urls";

/*
 * Só no build (design-final §8 e §17.8): o scripts/prerender.mjs chama render(url), head(url) e structuredData()
 * para gravar dist/<rota>/index.html e dist/404.html.
 */

export { ROUTES, NOT_FOUND };

export function rotaDe(url: string): Rota {
  return ROUTES.find((r) => r.path === url) ?? NOT_FOUND;
}

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <App path={url} />
    </StrictMode>,
  );
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Tags do <head> próprias da rota: title, description, canonical, Open Graph e Twitter (o resto vem do template). */
export function head(url: string, origem: string, previa = false): string {
  const r = rotaDe(url);
  const canonical = `${COMPANY.dominio}${r.path === NOT_FOUND.path ? "/" : r.path}`;
  const og = `${origem}${assetUrl("og-protecin.jpg")}`;
  const tags = [
    `<title>${esc(r.title)}</title>`,
    r.description ? `<meta name="description" content="${esc(r.description)}" />` : `<meta name="description" content="" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    r.noindex && !previa ? `<meta name="robots" content="noindex" />` : "", // na prévia o vite.config já pôs noindex, nofollow
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="Protecin" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${esc(og)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  return tags.filter(Boolean).join("\n    ");
}

/** JSON-LD: ProfessionalService (com os 8 serviços) e WebSite. Sem FAQPage (não há FAQ real). */
export function structuredData(): Record<string, unknown>[] {
  const site = `${COMPANY.dominio}/`;
  const empresa = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site}#empresa`,
    name: COMPANY.nome,
    legalName: COMPANY.razaoSocial,
    description: COMPANY.descritor,
    foundingDate: String(COMPANY.fundacao),
    url: site,
    telephone: COMPANY.phoneDisplay,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.endereco.rua,
      addressLocality: COMPANY.endereco.cidade,
      addressRegion: COMPANY.endereco.uf,
      postalCode: COMPANY.endereco.cep,
      addressCountry: "BR",
    },
    openingHours: "Mo-Fr 08:00-17:30",
    areaServed: "BR",
    sameAs: [COMPANY.instagram, COMPANY.linkedin],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de engenharia e proteção técnica contra incêndio",
      itemListElement: SERVICOS.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.nome, url: `${COMPANY.dominio}/servicos/#${s.slug}` },
      })),
    },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY.nome,
    url: site,
    inLanguage: "pt-BR",
    publisher: { "@id": `${site}#empresa` },
  };
  return [empresa, website];
}
