function createModal(content: HTMLElement | string): HTMLElement {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  if (typeof content === "string") {
    const modalText = document.createElement("p");
    modalText.innerHTML = content;
    modalContent.appendChild(modalText);
  } else {
    modalContent.appendChild(content);
  }

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  window.onclick = function (event: MouseEvent) {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  };

  return modal;
}

export const closeModal = () => {
  const modal = document.querySelector(".modal") as HTMLElement;
  modal.parentNode?.removeChild(modal);
  document.body.classList.remove("modal-open");
};

export function attachModalTrigger(
  element: HTMLElement,
  content: HTMLElement | string
) {
  element.onclick = function () {
    const modal = createModal(content);
    modal.style.display = "block";
    document.body.classList.add("modal-open");
  };
}
