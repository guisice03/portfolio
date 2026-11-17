'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



/*-----------------------------------*\
  #ACCENT COLOUR (cyan / orange)
\*-----------------------------------*/

const root = document.documentElement;
const accentBtns = document.querySelectorAll("[data-accent-btn]");

const setAccent = function (accent) {
  root.dataset.accent = accent;
  accentBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.accentBtn === accent));
  try { localStorage.setItem("accent", accent); } catch (e) { /* storage unavailable */ }
}

let savedAccent = null;
try { savedAccent = localStorage.getItem("accent"); } catch (e) { /* storage unavailable */ }
setAccent(savedAccent === "orange" || savedAccent === "cyan" ? savedAccent : (root.dataset.accent || "cyan"));

accentBtns.forEach(btn => btn.addEventListener("click", () => setAccent(btn.dataset.accentBtn)));



/*-----------------------------------*\
  #SIDEBAR
\*-----------------------------------*/

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



/*-----------------------------------*\
  #PROJECT SPEC SHEET MODAL
\*-----------------------------------*/

const projectBtns = document.querySelectorAll("[data-project-btn]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCategory = document.querySelector("[data-modal-category]");
const modalId = document.querySelector("[data-modal-id]");
const modalTools = document.querySelector("[data-modal-tools]");
const modalProblem = document.querySelector("[data-modal-problem]");
const modalOutcome = document.querySelector("[data-modal-outcome]");
const modalDwg = document.querySelector("[data-modal-dwg]");
const modalRev = document.querySelector("[data-modal-rev]");
const modalDate = document.querySelector("[data-modal-date]");

let lastFocused = null;

// copy the <li> items of one spec list from the project's <template> into the modal
const fillList = function (target, spec, selector) {
  const source = spec ? spec.querySelector(selector) : null;
  target.innerHTML = source ? source.innerHTML : "<li>—</li>";
}

const openModal = function (item) {
  const img = item.querySelector(".project-img img");
  const template = item.querySelector("template[data-spec]");
  const spec = template ? template.content : null;

  modalImg.src = img.src;
  modalImg.alt = img.alt;
  modalTitle.textContent = item.querySelector(".project-title").textContent;
  modalCategory.textContent = item.querySelector(".project-category").textContent;
  modalId.textContent = item.dataset.id || "";
  modalDwg.textContent = item.dataset.id || "—";
  modalRev.textContent = item.dataset.rev || "—";
  modalDate.textContent = item.dataset.date || "—";

  fillList(modalTools, spec, "[data-spec-tools]");
  fillList(modalProblem, spec, "[data-spec-problem]");
  fillList(modalOutcome, spec, "[data-spec-outcome]");

  lastFocused = document.activeElement;
  modalContainer.classList.add("active");
  modalContainer.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalContainer.scrollTop = 0;
  modalCloseBtn.focus();
}

const closeModal = function () {
  if (!modalContainer.classList.contains("active")) return;
  modalContainer.classList.remove("active");
  modalContainer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
}

projectBtns.forEach(btn => {
  btn.addEventListener("click", function () { openModal(this.closest("[data-filter-item]")); });
});

modalCloseBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });



/*-----------------------------------*\
  #PORTFOLIO FILTER
\*-----------------------------------*/

const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

// filter by data-category ("all", "cad", "fea", "hardware")
const filterFunc = function (selectedValue) {
  filterItems.forEach(item => {
    item.classList.toggle("active", selectedValue === "all" || selectedValue === item.dataset.category);
  });
}

// keep the mobile dropdown and desktop buttons in sync
const setFilter = function (value, label) {
  selectValue.textContent = label;
  filterBtn.forEach(btn => btn.classList.toggle("active", btn.dataset.filterBtn === value));
  filterFunc(value);
}

select.addEventListener("click", function () { elementToggleFunc(this); });

selectItems.forEach(item => {
  item.addEventListener("click", function () {
    elementToggleFunc(select);
    setFilter(this.dataset.selectItem, this.textContent);
  });
});

filterBtn.forEach(btn => {
  btn.addEventListener("click", function () { setFilter(this.dataset.filterBtn, this.textContent); });
});



/*-----------------------------------*\
  #CONTACT FORM
\*-----------------------------------*/

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// enable the button only when the form is valid
formInputs.forEach(input => {
  input.addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
});

// no backend needed: open the visitor's email app with the message filled in
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent("Portfolio enquiry from " + data.get("fullname"));
  const body = encodeURIComponent(data.get("message") + "\n\n— " + data.get("fullname") + " (" + data.get("email") + ")");
  window.location.href = "mailto:" + form.dataset.mailto + "?subject=" + subject + "&body=" + body;
});



/*-----------------------------------*\
  #PAGE NAVIGATION
\*-----------------------------------*/

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach(link => {
  link.addEventListener("click", function () {
    const target = this.dataset.navLink;

    pages.forEach(page => page.classList.toggle("active", page.dataset.page === target));
    navigationLinks.forEach(l => l.classList.toggle("active", l === this));

    window.scrollTo(0, 0);
  });
});
