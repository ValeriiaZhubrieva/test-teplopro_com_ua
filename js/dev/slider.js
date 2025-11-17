import { S as Swiper, N as Navigation, P as Pagination, A as Autoplay, T as Thumb } from "./vendor.min.js";
function toggleLockSliderClass(swiper) {
  const nextBtn = swiper.el.parentElement.querySelector(".swiper-button-next");
  const pagination = swiper.el.parentElement.querySelector(".swiper-pagination");
  const myBlock = swiper.el.parentElement.querySelector("[data-swiper-lock]");
  if (!myBlock) return;
  if (nextBtn && nextBtn.classList.contains("swiper-button-lock") || pagination && pagination.classList.contains("swiper-pagination-lock")) {
    myBlock.classList.add("swiper-block-lock");
  } else {
    myBlock.classList.remove("swiper-block-lock");
  }
}
const resizableSwiper = (breakpoint, swiperElementOrClass, swiperSettings, callback) => {
  const swiperElement = typeof swiperElementOrClass === "string" ? document.querySelector(swiperElementOrClass) : swiperElementOrClass;
  if (swiperElement) {
    let swiper;
    breakpoint = window.matchMedia(breakpoint);
    const enableSwiper = function(element, settings) {
      swiper = new Swiper(element, settings);
    };
    const checker = function() {
      if (breakpoint.matches) {
        return enableSwiper(swiperElement, swiperSettings);
      } else {
        if (swiper !== void 0) swiper.destroy(true, true);
        return;
      }
    };
    breakpoint.addEventListener("change", checker);
    checker();
  }
};
function checkLastSlideVisible(swiper) {
  const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : swiper.params.slidesPerView;
  const totalSlides = swiper.slides.length;
  const activeIndex = swiper.activeIndex;
  if (activeIndex + slidesPerView >= totalSlides) {
    swiper.el.classList.add("last-slide-visible");
  } else {
    swiper.el.classList.remove("last-slide-visible");
  }
}
function initSliders() {
  if (document.querySelector(".hero__slider")) {
    new Swiper(".hero__slider", {
      // <- Вказуємо склас потрібного слайдера
      // Підключаємо модулі слайдера
      // для конкретного випадку
      modules: [Navigation, Pagination, Autoplay],
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 16,
      //autoHeight: true,
      speed: 800,
      //touchRatio: 0,
      //simulateTouch: false,
      //loop: true,
      //preloadImages: false,
      //lazy: true,
      // Ефекти
      // effect: 'fade',
      autoplay: {
        delay: 3e3,
        disableOnInteraction: false
      },
      // Пагінація
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      // Скроллбар
      /*
      scrollbar: {
      	el: '.swiper-scrollbar',
      	draggable: true,
      },
      */
      // Кнопки "вліво/вправо"
      navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next"
      },
      /*
      // Брейкпоінти
      breakpoints: {
      	640: {
      		slidesPerView: 1,
      		spaceBetween: 0,
      		autoHeight: true,
      	},
      	768: {
      		slidesPerView: 2,
      		spaceBetween: 20,
      	},
      	992: {
      		slidesPerView: 3,
      		spaceBetween: 20,
      	},
      	1268: {
      		slidesPerView: 4,
      		spaceBetween: 30,
      	},
      },
      */
      // Події
      on: {}
    });
  }
  if (document.querySelector(".new-products__slider")) {
    const newsProdSliders = document.querySelectorAll(".new-products__slider");
    newsProdSliders.forEach((slider) => {
      resizableSwiper("(max-width: 991.98px)", slider, {
        modules: [Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 2,
        spaceBetween: 24,
        speed: 800,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        breakpoints: {
          319: {
            slidesPerView: 2,
            spaceBetween: 0
          },
          549.98: {
            slidesPerView: 2,
            spaceBetween: 8
          },
          767.98: {
            slidesPerView: 3,
            spaceBetween: 8
          }
        },
        on: {}
      });
    });
  }
  if (document.querySelector(".ourcertificates__slider")) {
    const ourCertificatesSliders = document.querySelectorAll(".ourcertificates__slider");
    ourCertificatesSliders.forEach((slider) => {
      const parentSlider = slider.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      new Swiper(slider, {
        modules: [Pagination, Navigation],
        observer: true,
        observeParents: true,
        slidesPerView: 4.1,
        spaceBetween: 16,
        speed: 800,
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        breakpoints: {
          319: {
            slidesPerView: 1.8,
            spaceBetween: 8
          },
          369.98: {
            slidesPerView: 2.03,
            spaceBetween: 8
          },
          549.98: {
            slidesPerView: 3.05,
            spaceBetween: 8
          },
          991.98: {
            slidesPerView: 4,
            spaceBetween: 16
          },
          1399.98: {
            slidesPerView: 4.2,
            spaceBetween: 16
          }
        },
        on: {
          init(sw) {
            toggleLockSliderClass(this);
            checkLastSlideVisible(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
            checkLastSlideVisible(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
            checkLastSlideVisible(this);
          }
        }
      });
    });
  }
  if (document.querySelector(".articles__slider")) {
    const articlesSliders = document.querySelectorAll(".articles__slider");
    articlesSliders.forEach((slider) => {
      const parentSlider = slider.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      new Swiper(slider, {
        modules: [Pagination, Navigation],
        observer: true,
        observeParents: true,
        slidesPerView: 4,
        spaceBetween: 16,
        speed: 800,
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        breakpoints: {
          319: {
            slidesPerView: 1.8,
            spaceBetween: 8
          },
          369.98: {
            slidesPerView: 2,
            spaceBetween: 8
          },
          549.98: {
            slidesPerView: 3,
            spaceBetween: 8
          },
          991.98: {
            slidesPerView: 4,
            spaceBetween: 16
          },
          1399.98: {
            slidesPerView: 4,
            spaceBetween: 16
          }
        },
        on: {
          init(sw) {
            toggleLockSliderClass(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
          }
        }
      });
    });
  }
  if (document.querySelector(".proposals__slider")) {
    const proposalsSliders = document.querySelectorAll(".proposals__slider");
    proposalsSliders.forEach((slider) => {
      const parentSlider = slider.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      new Swiper(slider, {
        modules: [Pagination, Navigation],
        observer: true,
        observeParents: true,
        slidesPerView: 4,
        spaceBetween: 16,
        speed: 800,
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        breakpoints: {
          319: {
            slidesPerView: 2,
            spaceBetween: 0
          },
          549.98: {
            slidesPerView: 2,
            spaceBetween: 8
          },
          849.98: {
            slidesPerView: 3,
            spaceBetween: 8
          },
          1199.98: {
            slidesPerView: 4,
            spaceBetween: 8
          }
        },
        on: {
          init(sw) {
            toggleLockSliderClass(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
          }
        }
      });
    });
  }
  const productSlider = document.querySelectorAll(".product-detail__slider");
  if (productSlider.length) {
    const pageProductThumbs = new Swiper(".product-detail__thumbs", {
      modules: [],
      observer: true,
      observeParents: true,
      slidesPerView: 8,
      spaceBetween: 8,
      speed: 800,
      breakpoints: {
        319.98: {
          spaceBetween: 2
        },
        649.98: {
          spaceBetween: 8
        }
      }
    });
    productSlider.forEach((slider) => {
      const parentSlider = slider.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      new Swiper(slider, {
        modules: [Navigation, Pagination, Thumb],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 600,
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        thumbs: {
          swiper: pageProductThumbs,
          autoScrollOffset: 1
        },
        on: {}
      });
    });
  }
}
document.querySelector("[data-fls-slider]") ? window.addEventListener("load", initSliders) : null;
