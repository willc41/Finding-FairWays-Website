document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("is-open");
    });
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => navLinks.classList.remove("is-open"));
    });
  }

  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("is-active");
    }
  });

  initHero();
  initLightbox();
});

function initHero() {
  const slidesEl = document.getElementById("heroSlides");
  const dotsEl = document.getElementById("heroDots");
  if (!slidesEl || !window.HERO_PHOTOS || !window.HERO_PHOTOS.length) return;

  const photos = window.HERO_PHOTOS;
  slidesEl.innerHTML = photos
    .map((p, i) => {
      const src = typeof p === "string" ? p : p.src;
      const position = typeof p === "string" ? "" : p.position;
      const size = typeof p === "string" ? "" : p.size;
      const style = (position ? `background-position:${position};` : "") + (size ? `background-size:${size};` : "");
      return `<div class="hero-slide${i === 0 ? " is-active" : ""}" style="background-image:url('${src}');${style}"></div>`;
    })
    .join("");

  if (dotsEl && photos.length > 1) {
    dotsEl.innerHTML = photos
      .map((_, i) => `<button data-i="${i}" class="${i === 0 ? "is-active" : ""}" aria-label="Slide ${i + 1}"></button>`)
      .join("");
  }

  const slides = slidesEl.querySelectorAll(".hero-slide");
  const dots = dotsEl ? dotsEl.querySelectorAll("button") : [];
  let current = 0;

  function show(i) {
    slides[current].classList.remove("is-active");
    if (dots[current]) dots[current].classList.remove("is-active");
    current = i;
    slides[current].classList.add("is-active");
    if (dots[current]) dots[current].classList.add("is-active");
  }

  dots.forEach((d) => d.addEventListener("click", () => show(Number(d.dataset.i))));

  if (photos.length > 1) {
    setInterval(() => show((current + 1) % photos.length), 6000);
  }
}

function initLightbox() {
  const items = document.querySelectorAll("[data-lightbox]");
  if (!items.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `<button class="lightbox-close" aria-label="Close">&times;</button><img alt="" />`;
  document.body.appendChild(lightbox);
  const img = lightbox.querySelector("img");

  items.forEach((el) => {
    el.addEventListener("click", () => {
      img.src = el.dataset.lightbox;
      img.alt = el.alt || "";
      lightbox.classList.add("is-open");
    });
  });

  function close() {
    lightbox.classList.remove("is-open");
  }
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-close")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
