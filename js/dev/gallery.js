import { l as lightGallery, a as lgZoom } from "./vendor.min.js";
const KEY = "7EC452A9-0CFD441C-BD984C7C-17C8456E";
window.initGallery = function() {
  if (document.querySelector("[data-fls-gallery]")) {
    new lightGallery(document.querySelector("[data-fls-gallery]"), {
      plugins: [lgZoom],
      licenseKey: KEY,
      selector: "a",
      speed: 500,
      actualSize: false,
      showZoomInOutIcons: true,
      zoomFromOrigin: false,
      maxZoomLevel: 5,
      scaleUp: true,
      enableZoom: true,
      controls: true,
      toggleThumb: false,
      doubleClickZoom: true,
      mobileSettings: {
        controls: true,
        showCloseIcon: true,
        download: false,
        doubleClickZoom: true
      }
    });
  }
};
window.addEventListener("load", window.initGallery);
