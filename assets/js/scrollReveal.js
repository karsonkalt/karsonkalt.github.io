const slideUpOptions = {
  distance: "10%",
  origin: "bottom",
  delay: 200,
  viewOffset: {
    bottom: 100,
  },
};

ScrollReveal().reveal(".post-link", { reset: true });
ScrollReveal().reveal("div.highlight", slideUpOptions);
ScrollReveal().reveal("img", slideUpOptions);
