const resizableScrollBlock = () => {
  const scrollContainers = document.querySelectorAll("[data-scrollnav]");
  if (!scrollContainers.length) return;
  scrollContainers.forEach((container) => {
    const prevScrollBtn = container.querySelector("[data-scrollnav-prev]");
    const nextScrollBtn = container.querySelector("[data-scrollnav-next]");
    const parentBlock = container.querySelector("[data-scrollnav-container]");
    const scrollingBlock = container.querySelector("[data-scrollnav-block]");
    if (!parentBlock || !scrollingBlock) return;
    let isDown = false;
    let startX;
    let scrollLeftStart;
    const handleResize = () => {
      const widthParentBlock = parentBlock.offsetWidth;
      const widthNavigationBlock = scrollingBlock.offsetWidth;
      if (widthNavigationBlock > widthParentBlock) {
        container.classList.add("scroll");
      } else {
        container.classList.remove("scroll");
      }
    };
    const handleScroll = () => {
      const scrollLeft = parentBlock.scrollLeft;
      const scrollWidth = parentBlock.scrollWidth;
      const clientWidth = parentBlock.clientWidth;
      const scrollEndThreshold = 1;
      if (scrollLeft === 0) {
        container.classList.remove("scroll-end");
        container.classList.add("scroll-start");
      } else if (Math.abs(scrollLeft + clientWidth - scrollWidth) <= scrollEndThreshold) {
        container.classList.remove("scroll-start");
        container.classList.add("scroll-end");
      } else {
        container.classList.remove("scroll-start");
        container.classList.remove("scroll-end");
      }
    };
    if (prevScrollBtn) {
      prevScrollBtn.addEventListener("click", () => {
        parentBlock.scrollLeft -= 200;
      });
    }
    if (nextScrollBtn) {
      nextScrollBtn.addEventListener("click", () => {
        parentBlock.scrollLeft += 200;
      });
    }
    parentBlock.addEventListener("mousedown", (e) => {
      isDown = true;
      parentBlock.classList.add("is-dragging");
      startX = e.pageX - parentBlock.offsetLeft;
      scrollLeftStart = parentBlock.scrollLeft;
    });
    parentBlock.addEventListener("mouseleave", () => {
      isDown = false;
      parentBlock.classList.remove("is-dragging");
    });
    parentBlock.addEventListener("mouseup", () => {
      isDown = false;
      parentBlock.classList.remove("is-dragging");
    });
    parentBlock.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - parentBlock.offsetLeft;
      const walk = (x - startX) * 1.5;
      parentBlock.scrollLeft = scrollLeftStart - walk;
    });
    window.addEventListener("resize", handleResize);
    parentBlock.addEventListener("scroll", handleScroll);
    window.addEventListener("load", () => {
      handleResize();
      handleScroll();
    });
    handleResize();
    handleScroll();
  });
};
resizableScrollBlock();
