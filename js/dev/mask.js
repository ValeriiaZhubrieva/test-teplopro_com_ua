import "./vendor.min.js";
window.inputMask = function() {
  const inputMasks = document.querySelectorAll("input[data-fls-input-mask]");
  inputMasks.forEach((input) => {
    Inputmask({ mask: input.dataset.flsInputMask }).mask(input);
  });
};
if (document.querySelector("input[data-fls-input-mask]")) {
  window.addEventListener("load", window.inputMask);
}
