/* =============================================================
   ページの動き
   1. 開いた瞬間の演出（灯り → 線 → 色 → 絵が浮かぶ）
   2. 最初の画面のスクロール（絵が速さを変えて流れ、1 枚に集まる）
   3. 作品の章を組み立てる
   4. 作品を大きく見る
   ============================================================= */

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const narrow = matchMedia("(max-width: 720px)").matches;
const flat = window.CHAPTERS.flatMap((c) => c.works.map((w) => ({ ...w, year: c.year })));

const src = (id, big) => `img/works/${id}${big ? "" : "-m"}.webp`;
const CLOUD =
  '<svg class="cloud" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">' +
  '<path d="M0 60V34C28.6 4 101.4 4 130 34C160.8 4 239.2 4 270 34C298.6 4 371.4 4 400 34C433 4 517 4 550 34C576.4 4 643.6 4 670 34C700.8 4 779.2 4 810 34C837.72 4 908.28 4 936 34C963.28 4 1032.72 4 1060 34C1090.8 4 1169.2 4 1200 34V60z"/>' +
  "</svg>";

/* ---- 1. 開いた瞬間の演出 ---- */
function opening() {
  const body = document.body;
  const finish = () => body.classList.add("is-lit", "is-done");
  if (reduced) return finish();

  const timers = [
    setTimeout(() => body.classList.add("is-lit"), 350),
    setTimeout(() => body.classList.add("is-done"), 3000),
  ];
  // 待ちたくない人のために、どこかを押せばすぐ終わる
  const skip = () => {
    timers.forEach(clearTimeout);
    finish();
  };
  addEventListener("pointerdown", skip, { once: true });
  addEventListener("keydown", skip, { once: true });
  addEventListener("wheel", skip, { once: true, passive: true });
  addEventListener("touchmove", skip, { once: true, passive: true });
}

/* ---- 線がふるえる（手描きのアニメーションのような動き） ---- */
function boil() {
  if (reduced) return;
  const noise = document.getElementById("boilNoise");
  const hero = document.querySelector(".hero");
  let seed = 1;
  setInterval(() => {
    if (scrollY > hero.offsetHeight) return;
    seed = (seed % 4) + 1;
    noise.setAttribute("seed", seed);
  }, 170);
}

/* ---- 2. 最初の画面のスクロール ---- */
const FLOATS = [
  // id, left, top, 幅, 流れる速さ
  { id: "lotus", x: 2, y: 62, w: 25, speed: 1.15 },
  { id: "tropical", x: 70, y: 74, w: 27, speed: 1.5 },
  { id: "apple", x: 5, y: 120, w: 17, speed: 1.9 },
  { id: "giraffe", x: 40, y: 104, w: 21, speed: 1.3 },
  { id: "horse", x: 76, y: 136, w: 17, speed: 1.75 },
  { id: "two", x: 18, y: 158, w: 23, speed: 1.05 },
  { id: "butterfly", x: 56, y: 170, w: 24, speed: 1.6 },
];

function setupHero() {
  const wrap = document.getElementById("floats");
  const finale = document.getElementById("finale");
  const hero = document.querySelector(".hero");
  const center = document.querySelector(".hero__center");
  const moon = document.querySelector(".hero__moon");
  const glow = document.querySelector(".hero__glow");
  const cue = document.querySelector(".hero__cue");
  if (reduced) return;

  const items = FLOATS.map((f, i) => {
    const [w, h] = window.SIZES[f.id];
    const el = document.createElement("div");
    el.className = "float";
    const width = narrow ? f.w * 1.7 : f.w;
    el.style.left = `${narrow ? Math.min(f.x, 100 - width - 3) : f.x}vw`;
    el.style.top = `${narrow ? f.y + 16 : f.y}svh`;
    el.style.width = `${width}vw`;
    el.innerHTML = `<img src="${src(f.id)}" alt="" width="${w}" height="${h}" style="transition-delay:${i * 0.12}s">`;
    wrap.append(el);
    return { el, speed: f.speed };
  });

  finale.src = src("koi", true);

  const ease = (t) => t * t * (3 - 2 * t);
  const clamp = (t) => Math.min(1, Math.max(0, t));
  let ticking = false;

  const draw = () => {
    ticking = false;
    const range = hero.offsetHeight - innerHeight;
    const p = clamp(scrollY / range);
    const vh = innerHeight;

    items.forEach(({ el, speed }) => {
      el.style.transform = `translate3d(0, ${-p * vh * 2.1 * speed}px, 0)`;
    });

    center.style.transform = `translateY(${-p * vh * 0.5}px) scale(${1 - p * 0.18})`;
    center.style.opacity = clamp(1 - (p - 0.3) / 0.22);
    moon.style.transform = `translateY(${p * vh * 0.32}px)`;
    glow.style.transform = `translateY(${p * vh * 0.32}px)`;
    cue.style.opacity = p > 0.04 ? 0 : "";

    // 見せたい 1 枚に、視線を集める
    const f = ease(clamp((p - 0.58) / 0.36));
    finale.style.opacity = clamp((p - 0.56) / 0.1);
    finale.style.transform = `translate(-50%, -50%) scale(${0.3 + f * 0.7})`;
  };

  const request = () => {
    if (!ticking) requestAnimationFrame(draw);
    ticking = true;
  };
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  draw();
}

/* ---- 3. 作品の章を組み立てる ---- */
function plaqueHTML(w) {
  const meta = [w.tech, w.size, w.year].filter(Boolean).join(" / ");
  return `<figcaption class="plaque"><b>${w.title}</b><span>${meta}</span></figcaption>`;
}

function workHTML(w) {
  const [iw, ih] = window.SIZES[w.id];
  const steps = w.steps
    ? `<div class="steps" role="group" aria-label="${w.title}の描き進めた順">
         <span class="steps__label">かわりかた</span>
         ${w.steps
           .map(
             (id, i) =>
               `<button type="button" data-step="${id}" aria-pressed="${id === w.id}" aria-label="${i + 1} 枚目">${i + 1}</button>`
           )
           .join("")}
       </div>`
    : "";
  const midWidth = Math.round((iw * 1200) / Math.max(iw, ih, 1200));
  return `<figure class="work reveal" data-id="${w.id}" style="--ratio:${iw / ih};--max:${Math.round(iw * 1.7)}px">
    <button class="work__open" type="button" aria-label="${w.title}を大きく見る">
      <img src="${src(w.id)}" srcset="${src(w.id)} ${midWidth}w, ${src(w.id, true)} ${iw}w"
           sizes="(max-width: 720px) 100vw, 90vw" width="${iw}" height="${ih}" alt="${w.title}" loading="lazy">
    </button>
    ${plaqueHTML(w)}
    ${steps}
  </figure>`;
}

function buildChapters() {
  const root = document.getElementById("chapters");
  root.innerHTML = window.CHAPTERS.map(
    (c) => `<section class="chapter chapter--${c.wall}" aria-label="${c.year}年">
      ${CLOUD}
      <h2 class="chapter__year">${c.year}</h2>
      ${c.works.map((w) => workHTML({ ...w, year: c.year })).join("")}
    </section>`
  ).join("");

  document.querySelector(".me").insertAdjacentHTML("afterbegin", CLOUD);

  root.addEventListener("click", (e) => {
    const stepBtn = e.target.closest("[data-step]");
    if (stepBtn) return changeStep(stepBtn);
    const open = e.target.closest(".work__open");
    if (open) showLightbox(flat.findIndex((w) => w.id === open.closest(".work").dataset.id), open);
  });

  const seen = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        seen.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  root.querySelectorAll(".reveal").forEach((el) => seen.observe(el));
}

function changeStep(btn) {
  const figure = btn.closest(".work");
  const img = figure.querySelector(".work__open img");
  const id = btn.dataset.step;
  const [w, h] = window.SIZES[id];
  img.removeAttribute("srcset");
  img.src = src(id, true);
  img.width = w;
  img.height = h;
  figure.style.setProperty("--ratio", w / h);
  figure.style.setProperty("--max", `${Math.round(w * 1.7)}px`);
  figure.dataset.shown = id;
  figure.querySelectorAll("[data-step]").forEach((b) => b.setAttribute("aria-pressed", b === btn));
}

/* ---- 4. 作品を大きく見る ---- */
const lb = document.getElementById("lb");
const stage = document.getElementById("lbStage");
const lbImg = document.getElementById("lbImg");
let current = 0;
let returnTo = null;

function setZoom(on, e) {
  stage.classList.toggle("is-zoom", on);
  if (on) moveZoom(e);
  else lbImg.style.transform = "";
}
function moveZoom(e) {
  const box = stage.getBoundingClientRect();
  const x = ((e.clientX - box.left) / box.width - 0.5) * -100;
  const y = ((e.clientY - box.top) / box.height - 0.5) * -100;
  lbImg.style.transform = `scale(2.4) translate(${x * 0.6}%, ${y * 0.6}%)`;
}

function render() {
  const w = flat[current];
  const shown = document.querySelector(`.work[data-id="${w.id}"]`)?.dataset.shown || w.id;
  setZoom(false);
  lbImg.src = src(shown, true);
  lbImg.alt = w.title;
  document.getElementById("lbCap").textContent = [w.title, w.tech, w.size, w.year].filter(Boolean).join(" / ");
}
function showLightbox(i, from) {
  current = i;
  returnTo = from;
  render();
  lb.showModal();
}
function step(d) {
  current = (current + d + flat.length) % flat.length;
  render();
}

document.getElementById("lbClose").addEventListener("click", () => lb.close());
document.getElementById("lbPrev").addEventListener("click", () => step(-1));
document.getElementById("lbNext").addEventListener("click", () => step(1));
stage.addEventListener("click", (e) => setZoom(!stage.classList.contains("is-zoom"), e));
stage.addEventListener("pointermove", (e) => {
  if (stage.classList.contains("is-zoom")) moveZoom(e);
});
lb.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});
lb.addEventListener("close", () => returnTo?.focus());

/* ---- 連絡先 ---- */
function contact() {
  const { form, instagram } = window.SITE;
  const links = [];
  if (form) links.push(`<a href="${form}" target="_blank" rel="noopener">フォームから連絡する</a>`);
  if (instagram) links.push(`<a href="https://www.instagram.com/${instagram}/" target="_blank" rel="noopener">Instagram</a>`);
  document.getElementById("contactLinks").innerHTML = links.join("") || "<p>連絡先は準備中です</p>";
}

buildChapters();
setupHero();
contact();
boil();
opening();
