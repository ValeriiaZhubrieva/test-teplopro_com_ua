import { b as bodyUnlock, g as gotoBlock, a as getHash } from "./common.min.js";
function formQuantity() {
  document.addEventListener("click", quantityActions);
  document.addEventListener("input", quantityActions);
  function updateButtons(container) {
    const valueElement = container.querySelector("[data-fls-quantity-value]");
    const plusBtn = container.querySelector("[data-fls-quantity-plus]");
    const minusBtn = container.querySelector("[data-fls-quantity-minus]");
    const min = +valueElement.dataset.flsQuantityMin || 1;
    const max = +valueElement.dataset.flsQuantityMax || Infinity;
    const value = +valueElement.value;
    if (minusBtn) {
      if (value <= min) {
        minusBtn.classList.add("disabled");
      } else {
        minusBtn.classList.remove("disabled");
      }
    }
    if (plusBtn) {
      if (value >= max) {
        plusBtn.classList.add("disabled");
      } else {
        plusBtn.classList.remove("disabled");
      }
    }
  }
  function quantityActions(e) {
    const type = e.type;
    const targetElement = e.target;
    if (type === "click") {
      if (targetElement.closest("[data-fls-quantity-plus]") || targetElement.closest("[data-fls-quantity-minus]")) {
        const container = targetElement.closest("[data-fls-quantity]");
        const valueElement = container.querySelector("[data-fls-quantity-value]");
        let value = parseInt(valueElement.value);
        const min = +valueElement.dataset.flsQuantityMin || 1;
        const max = +valueElement.dataset.flsQuantityMax || Infinity;
        if (targetElement.hasAttribute("data-fls-quantity-plus")) {
          value++;
          if (value > max) value = max;
        } else {
          value--;
          if (value < min) value = min;
        }
        valueElement.value = value;
        updateButtons(container);
      }
    } else if (type === "input") {
      if (targetElement.closest("[data-fls-quantity-value]")) {
        const valueElement = targetElement.closest("[data-fls-quantity-value]");
        const min = +valueElement.dataset.flsQuantityMin || 1;
        if (valueElement.value == 0 || /[^0-9]/gi.test(valueElement.value)) {
          valueElement.value = min;
        }
        updateButtons(valueElement.closest("[data-fls-quantity]"));
      }
    }
  }
  document.querySelectorAll("[data-fls-quantity]").forEach((container) => {
    updateButtons(container);
  });
}
document.querySelector("[data-fls-quantity]") ? window.addEventListener("load", formQuantity) : null;
function pageNavigation() {
  document.addEventListener("click", pageNavigationAction);
  document.addEventListener("watcherCallback", pageNavigationAction);
  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      if (targetElement.closest("[data-fls-scrollto]")) {
        const gotoLink = targetElement.closest("[data-fls-scrollto]");
        const gotoLinkSelector = gotoLink.dataset.flsScrollto ? gotoLink.dataset.flsScrollto : "";
        const noHeader = gotoLink.hasAttribute("data-fls-scrollto-header") ? true : false;
        const gotoSpeed = gotoLink.dataset.flsScrolltoSpeed ? gotoLink.dataset.flsScrolltoSpeed : 500;
        const offsetTop = gotoLink.dataset.flsScrolltoTop ? parseInt(gotoLink.dataset.flsScrolltoTop) : 0;
        if (window.fullpage) {
          const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fls-fullpage-section]");
          const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.flsFullpageId : null;
          if (fullpageSectionId !== null) {
            window.fullpage.switchingSection(fullpageSectionId);
            if (document.documentElement.hasAttribute("data-fls-menu-open")) {
              bodyUnlock();
              document.documentElement.removeAttribute("data-fls-menu-open");
            }
          }
        } else {
          gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        }
        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;
      if (targetElement.dataset.flsWatcher === "navigator") {
        document.querySelector(`[data-fls-scrollto].--navigator-active`);
        let navigatorCurrentItem;
        if (targetElement.id && document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`)) {
          navigatorCurrentItem = document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`);
        } else if (targetElement.classList.length) {
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index];
            if (document.querySelector(`[data-fls-scrollto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(`[data-fls-scrollto=".${element}"]`);
              break;
            }
          }
        }
        if (entry.isIntersecting) {
          navigatorCurrentItem ? navigatorCurrentItem.classList.add("--navigator-active") : null;
        } else {
          navigatorCurrentItem ? navigatorCurrentItem.classList.remove("--navigator-active") : null;
        }
      }
    }
  }
  if (getHash()) {
    let goToHash;
    if (document.querySelector(`#${getHash()}`)) {
      goToHash = `#${getHash()}`;
    } else if (document.querySelector(`.${getHash()}`)) {
      goToHash = `.${getHash()}`;
    }
    goToHash ? gotoBlock(goToHash) : null;
  }
}
document.querySelector("[data-fls-scrollto]") ? window.addEventListener("load", pageNavigation) : null;
