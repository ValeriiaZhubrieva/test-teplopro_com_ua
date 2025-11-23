import { i as isMobile } from "./common.min.js";
window.enableFocusTrap = function(menu, { openClass = "is-open" } = {}) {
  const focusableSelector = 'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';
  const guardStart = document.createElement("span");
  const guardEnd = document.createElement("span");
  guardStart.tabIndex = 0;
  guardEnd.tabIndex = 0;
  guardStart.className = "focus-guard";
  guardEnd.className = "focus-guard";
  guardStart.setAttribute("aria-hidden", "true");
  guardEnd.setAttribute("aria-hidden", "true");
  menu.prepend(guardStart);
  menu.append(guardEnd);
  const getFocusable = () => Array.from(menu.querySelectorAll(focusableSelector)).filter((el) => {
    const style = window.getComputedStyle(el);
    const notHidden = style.visibility !== "hidden" && style.display !== "none";
    const rect = typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : { width: 1, height: 1 };
    const hasSize = rect.width > 0 && rect.height > 0;
    return notHidden && hasSize && !el.hasAttribute("disabled");
  });
  function handleGuardFocus(e) {
    const focusable = getFocusable();
    if (!focusable.length) return;
    if (e.target === guardStart) {
      focusable[focusable.length - 1].focus();
    } else {
      focusable[0].focus();
    }
  }
  guardStart.addEventListener("focus", handleGuardFocus);
  guardEnd.addEventListener("focus", handleGuardFocus);
  function onKeydown(e) {
    if (e.key !== "Tab") return;
    if (!menu.classList.contains(openClass)) return;
    const isInside = menu.contains(document.activeElement);
    const focusable = getFocusable();
    if (!focusable.length) {
      e.preventDefault();
      return;
    }
    if (!isInside) {
      e.preventDefault();
      (e.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus();
      return;
    }
  }
  document.addEventListener("keydown", onKeydown, true);
  return function cleanup() {
    document.removeEventListener("keydown", onKeydown, true);
    guardStart.removeEventListener("focus", handleGuardFocus);
    guardEnd.removeEventListener("focus", handleGuardFocus);
    guardStart.remove();
    guardEnd.remove();
  };
};
window.initMenu = function() {
  const activeClass = "is-open";
  const activeBtnClass = "is-active";
  const html = document.documentElement;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  let removeTrap = null;
  let lastActiveButton = null;
  let focusReturnNeeded = false;
  function closeAllMenus() {
    document.querySelectorAll("[data-menu-target]." + activeClass).forEach((menu) => {
      menu.classList.remove(activeClass);
    });
    document.querySelectorAll("[data-menu]." + activeBtnClass).forEach((btn) => {
      btn.classList.remove(activeBtnClass);
    });
    html.classList.remove("menu-open");
    html.className = [...html.classList].filter((cls) => !cls.startsWith("menu-open--")).join(" ");
    if (removeTrap) {
      removeTrap();
      removeTrap = null;
    }
    if (focusReturnNeeded && lastActiveButton) {
      lastActiveButton.focus();
    }
    lastActiveButton = null;
    focusReturnNeeded = false;
  }
  function openMenu(menuName, { withFocusReturn = true } = {}) {
    closeAllMenus();
    const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
    const button = document.querySelector(`[data-menu="${menuName}"]`);
    if (menu && button) {
      const menuBlockRect = menu.parentElement.getBoundingClientRect();
      lastActiveButton = button;
      focusReturnNeeded = withFocusReturn;
      menu.classList.add(activeClass);
      button.classList.add(activeBtnClass);
      html.classList.add("menu-open");
      html.classList.add(`menu-open--${menuName}`);
      menu.style.setProperty("--menu-height", `${window.innerHeight - menuBlockRect.bottom}px`);
      removeTrap = enableFocusTrap(menu, { openClass: "is-open" });
    }
  }
  function toggleMenu(menuName) {
    const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
    const isOpen = menu?.classList.contains(activeClass);
    if (isOpen) {
      closeAllMenus();
    } else {
      openMenu(menuName);
    }
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllMenus();
    }
  });
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "data-fls-popup-open") {
        if (html.hasAttribute("data-fls-popup-open")) {
          closeAllMenus();
        }
      }
    }
  });
  observer.observe(html, { attributes: true });
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-menu]");
    const isInsideMenu = e.target.closest("[data-menu-target]." + activeClass);
    if (btn) {
      if (btn.hasAttribute("data-menu-click") || isTouch && isMobile.any()) {
        e.preventDefault();
      }
      const menuName = btn.dataset.menu;
      toggleMenu(menuName);
    } else if (!isInsideMenu) {
      closeAllMenus();
    }
  });
  document.querySelectorAll("[data-menu-close]").forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeAllMenus();
    });
  });
  if (!isTouch && !isMobile.any()) {
    document.querySelectorAll("[data-menu]").forEach((button) => {
      if (button.hasAttribute("data-menu-click")) return;
      const menuName = button.dataset.menu;
      const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
      if (!menu) return;
      let overBtn = false;
      let overMenu = false;
      let localCloseTimer = null;
      const startCloseTimer = () => {
        clearTimeout(localCloseTimer);
        localCloseTimer = setTimeout(() => {
          if (!overBtn && !overMenu) {
            menu.classList.remove(activeClass);
            button.classList.remove(activeBtnClass);
            html.classList.remove(`menu-open--${menuName}`);
            if (!document.querySelector("[data-menu-target]." + activeClass)) {
              html.classList.remove("menu-open");
            }
          }
        }, 300);
      };
      button.addEventListener("mouseenter", () => {
        overBtn = true;
        openMenu(menuName, { withFocusReturn: false });
      });
      button.addEventListener("mouseleave", () => {
        overBtn = false;
        startCloseTimer();
      });
      menu.addEventListener("mouseenter", () => {
        overMenu = true;
      });
      menu.addEventListener("mouseleave", () => {
        overMenu = false;
        startCloseTimer();
      });
    });
  }
};
document.addEventListener("DOMContentLoaded", window.initMenu);
window.initSubmenu = function() {
  const submenuActiveClass = "is-open";
  const submenuBtnActiveClass = "is-active";
  const html = document.documentElement;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  let removeTrap = null;
  let lastActiveSubmenuBtn = null;
  let focusReturnNeeded = false;
  const submenuLinksWrapper = document.querySelector("[data-submenu-links]");
  const submenuItemsWrapper = document.querySelector("[data-submenu-items]");
  if (!submenuLinksWrapper || !submenuItemsWrapper) return;
  function closeAllSubmenus() {
    document.querySelectorAll("[data-submenu-item]." + submenuActiveClass).forEach((submenu) => {
      submenu.classList.remove(submenuActiveClass);
    });
    document.querySelectorAll("[data-submenu-link]." + submenuBtnActiveClass).forEach((btn) => {
      btn.classList.remove(submenuBtnActiveClass);
    });
    html.classList.remove("submenu-open");
    html.className = [...html.classList].filter((cls) => !cls.startsWith("submenu-open--")).join(" ");
    submenuItemsWrapper.classList.remove(submenuActiveClass);
    submenuLinksWrapper.classList.remove(submenuBtnActiveClass);
    if (removeTrap) {
      removeTrap();
      removeTrap = null;
    }
    if (focusReturnNeeded && lastActiveSubmenuBtn) {
      lastActiveSubmenuBtn.focus();
    }
    lastActiveSubmenuBtn = null;
    focusReturnNeeded = false;
  }
  function openSubmenu(submenuName, { withFocusReturn = true } = {}) {
    closeAllSubmenus();
    const submenu = document.querySelector(`[data-submenu-item="${submenuName}"]`);
    const button = document.querySelector(`[data-submenu-link="${submenuName}"]`);
    if (submenu && button) {
      lastActiveSubmenuBtn = button;
      focusReturnNeeded = withFocusReturn;
      submenu.classList.add(submenuActiveClass);
      button.classList.add(submenuBtnActiveClass);
      html.classList.add("submenu-open");
      html.classList.add(`submenu-open--${submenuName}`);
      submenuLinksWrapper.classList.add(submenuBtnActiveClass);
      submenuItemsWrapper.classList.add(submenuActiveClass);
      const submenuLinksWrapperHeight = submenuLinksWrapper ? submenuLinksWrapper.offsetHeight : 0;
      submenuItemsWrapper.style.setProperty("--submenu-height", `${submenuLinksWrapperHeight}px`);
      removeTrap = enableFocusTrap(submenu, { openClass: submenuActiveClass });
    }
  }
  function toggleSubmenu(submenuName) {
    const submenu = document.querySelector(`[data-submenu-item="${submenuName}"]`);
    const isOpen = submenu?.classList.contains(submenuActiveClass);
    if (isOpen) {
      closeAllSubmenus();
    } else {
      openSubmenu(submenuName);
    }
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllSubmenus();
  });
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-submenu-link]");
    const isInsideSubmenu = e.target.closest("[data-submenu-item]." + submenuActiveClass);
    if (btn) {
      if (btn.hasAttribute("data-submenu-click") || isTouch && isMobile.any()) {
        e.preventDefault();
      }
      const submenuName = btn.dataset.submenuLink;
      toggleSubmenu(submenuName);
    } else if (!isInsideSubmenu) {
      closeAllSubmenus();
    }
  });
  document.querySelectorAll("[data-submenu-close]").forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeAllSubmenus();
    });
  });
  if (!isTouch && !isMobile.any()) {
    document.querySelectorAll("[data-submenu-link]").forEach((button) => {
      if (button.hasAttribute("data-submenu-click")) return;
      const submenuName = button.dataset.submenuLink;
      const submenu = document.querySelector(`[data-submenu-item="${submenuName}"]`);
      if (!submenu) return;
      let overBtn = false;
      let overSubmenu = false;
      let closeTimer = null;
      const startCloseTimer = () => {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          if (!overBtn && !overSubmenu) {
            submenu.classList.remove(submenuActiveClass);
            button.classList.remove(submenuBtnActiveClass);
            html.classList.remove(`submenu-open--${submenuName}`);
            submenuItemsWrapper.classList.remove(submenuActiveClass);
            submenuLinksWrapper.classList.remove(submenuBtnActiveClass);
            if (!document.querySelector("[data-submenu-item]." + submenuActiveClass)) {
              html.classList.remove("submenu-open");
            }
          }
        }, 300);
      };
      button.addEventListener("mouseenter", () => {
        overBtn = true;
        openSubmenu(submenuName, { withFocusReturn: false });
      });
      button.addEventListener("mouseleave", () => {
        overBtn = false;
        startCloseTimer();
      });
      submenuItemsWrapper.addEventListener("mouseenter", () => overSubmenu = true);
      submenuItemsWrapper.addEventListener("mouseleave", () => {
        overSubmenu = false;
        startCloseTimer();
      });
      submenuLinksWrapper.addEventListener("mouseenter", () => overSubmenu = true);
      submenuLinksWrapper.addEventListener("mouseleave", () => {
        overSubmenu = false;
        startCloseTimer();
      });
    });
  }
};
document.addEventListener("DOMContentLoaded", window.initSubmenu);
function headerScroll() {
  const header = document.querySelector("[data-fls-header-scroll]");
  const headerShow = header.hasAttribute("data-fls-header-scroll-show");
  const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
  const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
  let scrollDirection = 0;
  let timer;
  function updateHeaderClasses() {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !header.classList.contains("--header-scroll") ? header.classList.add("--header-scroll") : null;
      if (headerShow) {
        if (scrollTop > scrollDirection) {
          header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
        } else {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }
        timer = setTimeout(() => {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }, headerShowTimer);
      }
    } else {
      header.classList.contains("--header-scroll") ? header.classList.remove("--header-scroll") : null;
      if (headerShow) {
        header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
      }
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  }
  updateHeaderClasses();
  document.addEventListener("scroll", updateHeaderClasses);
}
document.querySelector("[data-fls-header-scroll]") ? window.addEventListener("load", headerScroll) : null;
