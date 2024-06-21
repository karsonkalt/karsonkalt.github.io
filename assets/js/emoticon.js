document.addEventListener("DOMContentLoaded", function () {
  let emoticonElement = document.querySelector(".emoticon");
  let textElement = document.createElement("span");
  emoticonElement.appendChild(textElement);
  let cursorElement = document.createElement("span");
  cursorElement.classList.add("cursor");
  cursorElement.textContent = "_";
  emoticonElement.appendChild(cursorElement);

  setTimeout(function () {
    let emoticons = [
      "(^-^)/",
      "ツ",
      "(づ｡◕‿‿◕｡)づ",
      "(✿◠‿◠)",
      "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧",
      "(☉ ‿ ⚆)",
      "(◉‿◉)つ",
    ];

    let currentEmoticon = "";
    let isDeleting = false;
    let isWaiting = false;
    let targetEmoticon = "";

    function animateEmoticon() {
      if (
        !isDeleting &&
        !isWaiting &&
        currentEmoticon.length < targetEmoticon.length
      ) {
        currentEmoticon += targetEmoticon[currentEmoticon.length];
      } else if (
        !isDeleting &&
        !isWaiting &&
        currentEmoticon.length === targetEmoticon.length
      ) {
        isWaiting = true;
        setTimeout(() => {
          isWaiting = false;
          isDeleting = true;
        }, 8000);
      }

      if (isDeleting && currentEmoticon.length > 0) {
        currentEmoticon = currentEmoticon.substring(
          0,
          currentEmoticon.length - 1
        );
      } else if (isDeleting && currentEmoticon.length === 0) {
        isDeleting = false;
        let randomIndex = Math.floor(Math.random() * emoticons.length);
        targetEmoticon = emoticons[randomIndex];
      }

      textElement.textContent = currentEmoticon;

      let timeout = isDeleting ? 100 : 200;
      setTimeout(animateEmoticon, timeout);
    }

    let randomIndex = Math.floor(Math.random() * emoticons.length);
    targetEmoticon = emoticons[randomIndex];
    animateEmoticon();
  }, 3500);
});
