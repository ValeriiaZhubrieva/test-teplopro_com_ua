const isMobile = { Android: function() {
  return navigator.userAgent.match(/Android/i);
}, BlackBerry: function() {
  return navigator.userAgent.match(/BlackBerry/i);
}, iOS: function() {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}, Opera: function() {
  return navigator.userAgent.match(/Opera Mini/i);
}, Windows: function() {
  return navigator.userAgent.match(/IEMobile/i);
}, any: function() {
  return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
} };
function getHash() {
  if (location.hash) {
    return location.hash.replace("#", "");
  }
}
let slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};
let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = "";
      });
      document.body.style.paddingRight = "";
      document.documentElement.removeAttribute("data-fls-scrolllock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
    const [value, type = "max"] = item.dataset[dataSetValue].split(",");
    return { value, type, item };
  });
  if (media.length === 0) return [];
  const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
  const uniqueQueries = [...new Set(breakpointsArray)];
  return uniqueQueries.map((query) => {
    const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
    const matchMedia = window.matchMedia(mediaQuery);
    const itemsArray = media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType);
    return { itemsArray, matchMedia };
  });
}
const gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
  const targetBlockElement = document.querySelector(targetBlock);
  if (targetBlockElement) {
    let headerItem = "";
    let headerItemHeight = 0;
    if (noHeader) {
      headerItem = "header.header";
      const headerElement = document.querySelector(headerItem);
      if (!headerElement.classList.contains("--header-scroll")) {
        headerElement.style.cssText = `transition-duration: 0s;`;
        headerElement.classList.add("--header-scroll");
        headerItemHeight = headerElement.offsetHeight;
        headerElement.classList.remove("--header-scroll");
        setTimeout(() => {
          headerElement.style.cssText = ``;
        }, 0);
      } else {
        headerItemHeight = headerElement.offsetHeight;
      }
    }
    if (document.documentElement.hasAttribute("data-fls-menu-open")) {
      bodyUnlock();
      document.documentElement.removeAttribute("data-fls-menu-open");
    }
    let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
    targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
    targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
    window.scrollTo({
      top: targetBlockElementPosition,
      behavior: "smooth"
    });
  }
};
function miniSelect() {
  const selParents = document.querySelectorAll("[data-sel-block]");
  if (selParents.length) {
    selParents.forEach((selBlock) => {
      const selDropdownButton = selBlock.querySelector("[data-sel-block-current]");
      const selDropdownValueSpan = selDropdownButton.querySelector("[data-sel-block-value] span");
      const selDropdownInput = selDropdownButton.querySelector("[data-sel-block-input]");
      const selOptions = selBlock.querySelectorAll("[data-sel-block-btn]");
      const placeholderText = selBlock.getAttribute("data-sel-block-placeholder");
      const selCloseBtns = selBlock.querySelectorAll("[data-sel-block-close]");
      let isOpen = false;
      function checkAndSetPlaceholder() {
        if (placeholderText) {
          const hasActiveOption = Array.from(selOptions).some(
            (option) => option.classList.contains("is-active")
          );
          if (!hasActiveOption) {
            selBlock.classList.add("is-placeholder");
            if (selDropdownValueSpan) {
              selDropdownValueSpan.innerHTML = placeholderText;
            }
          } else {
            selBlock.classList.remove("is-placeholder");
          }
        }
      }
      checkAndSetPlaceholder();
      function closeDropdown() {
        selBlock.classList.remove("sel-open");
        isOpen = false;
        document.removeEventListener("click", handleDocumentClick);
      }
      function handleDocumentClick(e) {
        if (!selBlock.contains(e.target)) {
          closeDropdown();
        }
      }
      selCloseBtns.forEach((selCloseBtn) => {
        selCloseBtn.addEventListener("click", (e) => {
          closeDropdown();
        });
      });
      selDropdownButton.addEventListener("click", (e) => {
        isOpen = !isOpen;
        const parentWithAttr = selBlock.closest("[data-one-sel-block]");
        if (parentWithAttr && isOpen) {
          const allSelBlocks = parentWithAttr.querySelectorAll("[data-sel-block]");
          allSelBlocks.forEach((block) => {
            if (block !== selBlock) {
              block.classList.remove("sel-open");
            }
          });
        }
        selBlock.classList.toggle("sel-open", isOpen);
        if (isOpen) {
          document.addEventListener("click", handleDocumentClick);
        } else {
          document.removeEventListener("click", handleDocumentClick);
        }
      });
      selOptions.forEach((item) => {
        item.addEventListener("click", function(e) {
          const selectedText = item.textContent.replace(/\s+/g, " ").trim();
          if (selDropdownInput) {
            selDropdownInput.value = selectedText;
            selDropdownInput.dispatchEvent(new Event("input"));
          } else if (selDropdownValueSpan) {
            selDropdownValueSpan.innerHTML = selectedText;
          }
          closeDropdown();
          selOptions.forEach((otherItem) => otherItem.classList.toggle("is-active", otherItem === item));
          checkAndSetPlaceholder();
        });
      });
    });
  }
}
miniSelect();
const topPositionBlocks = document.querySelectorAll("[data-top-position]");
if (topPositionBlocks.length) {
  let updateTopPositions = function() {
    const headerHeight = header ? header.offsetHeight : 0;
    topPositionBlocks.forEach((block) => {
      const blockRect = block.getBoundingClientRect();
      const topPosition = Math.max(headerHeight, blockRect.top);
      block.style.setProperty("--top-position", `${topPosition}px`);
      block.style.setProperty("--header-height", `${headerHeight}px`);
    });
  };
  const header = document.querySelector("header");
  updateTopPositions();
  window.addEventListener("scroll", updateTopPositions);
  window.addEventListener("resize", updateTopPositions);
  if (header && "ResizeObserver" in window) {
    const headerObserver = new ResizeObserver(() => {
      updateTopPositions();
    });
    headerObserver.observe(header);
  }
}
window.initInputEffects = function() {
  const inputFields = document.querySelectorAll("input, textarea");
  if (!inputFields.length) return;
  inputFields.forEach((input) => {
    const parent = input.parentElement;
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        parent.classList.add("is-filled");
      } else {
        parent.classList.remove("is-filled");
      }
    });
    input.addEventListener("focus", () => {
      parent.classList.add("is-focused");
    });
    input.addEventListener("blur", () => {
      parent.classList.remove("is-focused");
    });
  });
};
initInputEffects();
const searchBlock = document.querySelectorAll("[data-search-block]");
if (searchBlock.length) {
  searchBlock.forEach((item) => {
    const itemInput = item.querySelector("[data-search-input]");
    const clearBtn = item.querySelector("[data-search-input-clear]");
    clearBtn.addEventListener("click", () => {
      itemInput.value = "";
      itemInput.parentElement.classList.remove("is-filled");
    });
  });
}
const toggleActiveBtns = document.querySelectorAll("[data-toggle-active]");
if (toggleActiveBtns.length) {
  toggleActiveBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-active");
    });
  });
}
const toggleActiveParentBtns = document.querySelectorAll("[data-toggle-parent-active]");
if (toggleActiveParentBtns.length) {
  toggleActiveParentBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      btn.classList.toggle("is-active");
      btn.parentElement.classList.toggle("is-active");
    });
  });
}
function initScrollBlocks() {
  const scrollContainers = document.querySelectorAll("[data-scroll-block]");
  if (!scrollContainers.length) return;
  scrollContainers.forEach((container) => {
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const containerParent = container.parentElement;
      const scrollEndThreshold = 1;
      if (scrollTop === 0) {
        containerParent.classList.remove("scroll-end");
        containerParent.classList.add("scroll-start");
      } else if (Math.abs(scrollTop + clientHeight - scrollHeight) <= scrollEndThreshold) {
        containerParent.classList.remove("scroll-start");
        containerParent.classList.add("scroll-end");
      } else {
        containerParent.classList.remove("scroll-start");
        containerParent.classList.remove("scroll-end");
      }
    };
    window.addEventListener("resize", handleScroll);
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("load", () => {
      handleScroll();
    });
    handleScroll();
  });
}
initScrollBlocks();
document.addEventListener("DOMContentLoaded", () => {
  const totalElements = document.querySelectorAll(".fixed-block-hide");
  const fixedElement = document.querySelector(".fixed-block");
  if (!totalElements.length || !fixedElement) return;
  const observer = new IntersectionObserver(
    (entries) => {
      let anyVisible = false;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anyVisible = true;
        }
      });
      if (anyVisible) {
        fixedElement.classList.add("hide");
      } else {
        fixedElement.classList.remove("hide");
      }
    },
    { threshold: 0.1 }
  );
  totalElements.forEach((el) => observer.observe(el));
});
function buildLocalNavigation() {
  const sections = document.querySelectorAll("[data-scroll-section]");
  window.addEventListener("scroll", function() {
    let offset = 100;
    let scroll_y = window.pageYOffset + offset;
    sections.forEach((current) => {
      const section_height = current.offsetHeight;
      const section_top = current.offsetTop - 100;
      const sectionId = current.getAttribute("id");
      const links = document.querySelectorAll(`[data-fls-scrollto="#${sectionId}"]`);
      if (links.length > 0) {
        if (scroll_y > section_top && scroll_y <= section_top + section_height) {
          links.forEach((link) => link.classList.add("is-active"));
        } else {
          links.forEach((link) => link.classList.remove("is-active"));
        }
      }
    });
  });
}
if (document.querySelectorAll("[data-scroll-section]").length && document.querySelectorAll("[data-fls-scrollto]").length) {
  buildLocalNavigation();
}
export {
  getHash as a,
  bodyUnlock as b,
  slideUp as c,
  dataMediaQueries as d,
  gotoBlock as g,
  isMobile as i,
  slideToggle as s
};
