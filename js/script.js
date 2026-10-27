/* Jaqueline Gomes | Nutricionista */
const CONFIG = {
  whatsapp: "5573988418931", // número do link da bio do Instagram
};

// WhatsApp: todos os botões .js-wa usam a mensagem do data-msg
document.querySelectorAll(".js-wa").forEach((el) => {
  const msg = el.dataset.msg || "Olá, Jaqueline! Vim pelo site.";
  el.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  el.target = "_blank";
  el.rel = "noopener";
});

// Header ao rolar
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Menu mobile
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const toggleMenu = (open) => {
  burger.setAttribute("aria-expanded", open);
  nav.classList.toggle("is-open", open);
  document.body.style.overflow = open ? "hidden" : "";
};
burger.addEventListener("click", () => toggleMenu(burger.getAttribute("aria-expanded") !== "true"));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  io.observe(el);
});

// Carrossel de depoimentos
(() => {
  const root = document.getElementById("carousel");
  if (!root) return;
  const track = root.querySelector(".carousel__track");
  const slides = [...track.children];
  const dotsWrap = document.getElementById("dots");
  let index = 0;

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Depoimento ${i + 1}`);
    b.addEventListener("click", () => go(i));
    dotsWrap.appendChild(b);
    return b;
  });

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: "smooth" });
    update();
  };
  const update = () => dots.forEach((d, i) => d.classList.toggle("is-active", i === index));

  root.querySelector(".carousel__btn--prev").addEventListener("click", () => go(index - 1));
  root.querySelector(".carousel__btn--next").addEventListener("click", () => go(index + 1));
  track.addEventListener("scroll", () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== index) { index = i; update(); }
  }, { passive: true });

  let timer = setInterval(() => go(index + 1), 7000);
  root.addEventListener("pointerenter", () => clearInterval(timer));
  root.addEventListener("pointerleave", () => { timer = setInterval(() => go(index + 1), 7000); });
  update();
})();

// FAQ: só um aberto por vez
document.querySelectorAll(".faq__item").forEach((d) => {
  d.addEventListener("toggle", () => {
    if (d.open) document.querySelectorAll(".faq__item").forEach((o) => o !== d && (o.open = false));
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// "Para você": cards empilhando + linha de progresso
(() => {
  const stack = document.getElementById("stack");
  if (!stack) return;
  const cards = [...stack.querySelectorAll(".stack-card")];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ticking = false;

  const update = () => {
    ticking = false;
    const r = stack.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
    stack.style.setProperty("--progress", progress.toFixed(3));
    if (reduce) return;

    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) { card.style.setProperty("--scale", 1); card.style.setProperty("--bright", 1); return; }
      // quanto o próximo card já cobriu este
      const a = card.getBoundingClientRect();
      const b = next.getBoundingClientRect();
      const covered = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height));
      card.style.setProperty("--scale", (1 - covered * 0.06).toFixed(4));
      card.style.setProperty("--bright", (1 - covered * 0.35).toFixed(3));
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
