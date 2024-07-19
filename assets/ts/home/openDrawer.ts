const promptElement = document.querySelector(".prompt") as HTMLInputElement;
const htmlElement = document.querySelector("html") as HTMLElement;

export const openDrawer = (drawerNode: Element) => {
  drawerNode.setAttribute("open", "");
};

export const closeDrawer = (drawerNode: Element) => {
  drawerNode.removeAttribute("open");
};

export const toggleBottomDrawer = (drawerNode: Element) => {
  if (drawerNode.hasAttribute("open")) {
    closeDrawer(drawerNode);
  } else {
    openDrawer(drawerNode);
  }
};

export const addRecedeClass = (element: Element) => {
  element.classList.add("recede");
};

export const removeRecedeClass = (element: Element) => {
  element.classList.remove("recede");
};

export const toggleRecedeClass = (element: Element) => {
  element.classList.toggle("recede");
};
