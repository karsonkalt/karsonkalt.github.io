import anime from "animejs/lib/anime.es.js";

export const addM110Effect = () => {
  var textWrapper = document.querySelector(".ml10 .letters") as HTMLElement;
  textWrapper.innerHTML = (textWrapper.textContent as string).replace(
    /\S/g,
    "<span class='letter'>$&</span>"
  );

  anime.timeline({ autoplay: true }).add({
    targets: ".ml10 .letter",
    rotateY: [-90, 0],
    duration: 1300,
    delay: (_: any, i: number) => 80 * i,
  });
};
