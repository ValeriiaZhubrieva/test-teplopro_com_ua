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
  var updateTopPositions2 = updateTopPositions;
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
