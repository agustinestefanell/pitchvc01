import { pitchDeck } from "./data/pitchDeck.js";

const slideCount = pitchDeck.length;
const slideImage = document.getElementById("slideImage");
const slideCounter = document.getElementById("slideCounter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const ribbon = document.getElementById("ribbon");

const sections = pitchDeck
  .filter((item, index) => index === 0 || item.sectionStart !== pitchDeck[index - 1].sectionStart)
  .map((item) => ({ label: item.section, slide: item.sectionStart }));

let currentSlide = getSlideFromUrl();

function getSlideFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const value = Number(params.get("slide"));
  if (!Number.isInteger(value) || value < 1 || value > slideCount) {
    return 1;
  }
  return value;
}

function updateUrl(slide, replace = false) {
  const url = new URL(window.location.href);
  url.searchParams.set("slide", slide);
  if (replace) {
    window.history.replaceState({}, "", url);
  } else {
    window.history.pushState({}, "", url);
  }
}

function getSlideData(slide) {
  return pitchDeck.find((item) => item.slide === slide);
}

function getActiveSection(slide) {
  return sections.reduce((active, section) => {
    return slide >= section.slide ? section : active;
  }, sections[0]);
}

function renderSlide(slide, replaceUrl = false) {
  const slideData = getSlideData(slide);
  if (!slideData) {
    return;
  }

  currentSlide = slide;
  slideImage.src = slideData.path;
  slideImage.alt = `Slide ${slideData.slide} del pitch deck`;
  slideCounter.textContent = `Slide ${slideData.slide} / ${slideCount}`;
  prevBtn.disabled = slide === 1;
  nextBtn.disabled = slide === slideCount;
  updateUrl(slide, replaceUrl);

  const activeSection = getActiveSection(slide);
  Array.from(ribbon.children).forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.slide) === activeSection.slide);
  });

  preloadSlide(slide - 1);
  preloadSlide(slide + 1);
}

function preloadSlide(slide) {
  if (slide < 1 || slide > slideCount) {
    return;
  }
  const item = getSlideData(slide);
  if (!item) {
    return;
  }
  const img = new Image();
  img.src = item.path;
}

function createRibbon() {
  sections.forEach((section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = section.label;
    button.dataset.slide = section.slide;
    button.addEventListener("click", () => renderSlide(section.slide));
    ribbon.appendChild(button);
  });
}

function onKeyDown(event) {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    if (currentSlide < slideCount) {
      renderSlide(currentSlide + 1);
    }
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    if (currentSlide > 1) {
      renderSlide(currentSlide - 1);
    }
  }
  if (event.key === "Home") {
    event.preventDefault();
    renderSlide(1);
  }
  if (event.key === "End") {
    event.preventDefault();
    renderSlide(slideCount);
  }
}

prevBtn.addEventListener("click", () => {
  if (currentSlide > 1) {
    renderSlide(currentSlide - 1);
  }
});
nextBtn.addEventListener("click", () => {
  if (currentSlide < slideCount) {
    renderSlide(currentSlide + 1);
  }
});
window.addEventListener("keydown", onKeyDown);
window.addEventListener("popstate", () => renderSlide(getSlideFromUrl(), true));

createRibbon();
renderSlide(currentSlide, true);
