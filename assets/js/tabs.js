(()=>{"use strict";var e=Array.from(document.querySelectorAll("[role='tab']")),t=document.querySelector(".bottom-drawer");function o(o){var r,n,c;r="console"===o.getAttribute("id"),c=null==(n=document.querySelector("#console"))?void 0:n.querySelector(".unread-badge"),r&&(null==c||c.classList.remove("show")),e.forEach((function(e){var t=e===o;e.setAttribute("aria-selected",t.toString());var r=e.getAttribute("aria-controls"),n=document.getElementById(r||"");n&&(t?n.removeAttribute("hidden"):n.setAttribute("hidden",""))})),"console"===o.getAttribute("id")?null==t||t.setAttribute("open",""):null==t||t.removeAttribute("open")}if(e.forEach((function(e){e.addEventListener("click",(function(){history.replaceState(null,"","#"+e.id),o(e)}))})),window.onhashchange=function(){var e=document.querySelector(location.hash);e&&o(e)},location.hash){var r=document.querySelector(location.hash);r&&o(r)}})();