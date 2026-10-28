import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { UI } from "../../data/site";
import { VIDEOS, type VideoId } from "../../data/videos.gen";
import { useCanPlayVideo, useMediaQuery } from "../../lib/media";
import { pushEvent } from "../../lib/track";
import { videoUrl } from "../../lib/urls";
import { Img } from "./Img";

export interface LazyVideoProps {
  id: VideoId;
  label: string; // descrição do vídeo (aria-label)
  className?: string;
  fit?: "cover" | "contain";
  when?: "idle" | "near" | "active";
  active?: boolean;
  posterPriority?: boolean;
  sizes?: string;
  onPlayingChange?: (p: boolean) => void;
}

// No máximo 1 vídeo tocando além do hero.
let tocandoAgora: HTMLVideoElement | null = null;
function registrar(v: HTMLVideoElement, hero: boolean) {
  if (hero) return;
  if (tocandoAgora && tocandoAgora !== v) tocandoAgora.pause();
  tocandoAgora = v;
}

/**
 * Vídeo de fundo mudo e em loop. O poster <Img> vai sempre no HTML (SSR); o <video> só existe no cliente, entra
 * com crossfade no "playing" e pausa com menos de 15% visível. Sem permissão de vídeo (reduzido, saveData, 2g/3g)
 * ou com autoplay bloqueado, fica o poster com o botão Play.
 */
export function LazyVideo({ id, label, className, fit = "cover", when = "near", active = true, posterPriority = false, sizes = "100vw", onPlayingChange }: LazyVideoProps) {
  const info = VIDEOS[id];
  const hero = id === "hero";
  const raiz = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const podeAuto = useCanPlayVideo();
  const celular = useMediaQuery("(max-width: 767px)");
  const [carregar, setCarregar] = useState(false);
  const [manual, setManual] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const liberado = (podeAuto && !bloqueado) || manual;

  // quando carregar a fonte
  useEffect(() => {
    if (!podeAuto || carregar) return;
    if (when === "idle") {
      let cancelado = false;
      let idleId = 0;
      let timer = 0;
      const agendar = () => {
        const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
        if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => !cancelado && setCarregar(true), { timeout: 2000 });
        else timer = window.setTimeout(() => !cancelado && setCarregar(true), 1200);
      };
      if (document.readyState === "complete") agendar();
      else window.addEventListener("load", agendar, { once: true });
      return () => {
        cancelado = true;
        window.removeEventListener("load", agendar);
        window.clearTimeout(timer);
        const w = window as Window & { cancelIdleCallback?: (n: number) => void };
        if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      };
    }
    if (when === "active") {
      if (active) setCarregar(true);
      return;
    }
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setCarregar(true), { rootMargin: "100% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [podeAuto, carregar, when, active]);

  // visibilidade (pausa com < 15% na tela)
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.intersectionRatio >= 0.15), { threshold: [0, 0.15, 0.5] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // tocar / pausar
  useEffect(() => {
    const v = video.current;
    if (!v || !(carregar || manual)) return;
    const deve = liberado && visivel && (when !== "active" || active || manual);
    if (deve) {
      v.muted = true;
      registrar(v, hero);
      // só a recusa do navegador (NotAllowedError) conta como bloqueio; um play() interrompido por pause() (AbortError,
      // ao rolar rápido) não mostra o botão Play
      v.play().catch((e: unknown) => {
        if (!manual && (e as { name?: string } | null)?.name === "NotAllowedError") setBloqueado(true);
      });
    } else if (!v.paused) v.pause();
  }, [carregar, manual, liberado, visivel, when, active, hero]);

  useEffect(() => onPlayingChange?.(tocando), [tocando, onPlayingChange]);

  const arquivo = celular && info.arquivoMobile ? info.arquivoMobile : info.arquivo;
  const mostraVideo = (carregar && liberado) || manual;
  const mostraPlay = montado && !manual && (!podeAuto || bloqueado);

  return (
    <div ref={raiz} className={`relative overflow-clip ${className ?? ""}`} data-motion="video">
      <Img
        id={info.poster}
        mobile={info.posterMobile ?? undefined}
        alt=""
        sizes={sizes}
        priority={posterPriority}
        className="absolute inset-0 block h-full w-full"
        imgClassName={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
      />
      {mostraVideo && (
        <video
          ref={video}
          key={arquivo}
          data-lazy-video=""
          className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"} ${tocando ? "is-playing" : ""}`}
          src={videoUrl(arquivo)}
          muted
          playsInline
          loop
          preload="none"
          aria-label={label}
          onPlaying={() => setTocando(true)}
          onPause={() => setTocando(false)}
        />
      )}
      {mostraPlay && (
        <button
          type="button"
          aria-label={UI.reproduzirVideo}
          className="absolute bottom-4 right-4 z-[2] grid h-11 w-11 place-items-center rounded-full border border-papel-50/40 bg-noite-950/60 text-papel-50 transition-colors duration-200 hover:border-papel-50/90 hover:bg-noite-950/80"
          onClick={() => {
            setManual(true);
            setBloqueado(false);
            pushEvent("video_play", { video: id });
          }}
        >
          <Play size={18} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
