const slideUpOptions = {
  distance: "10%",
  origin: "bottom",
  delay: 100,
  reset: true,
};

ScrollReveal().reveal(".post-link", slideUpOptions);
ScrollReveal().reveal("div.highlight", {
  ...slideUpOptions,
  distance: "5%",
});
ScrollReveal().reveal("img", slideUpOptions);
