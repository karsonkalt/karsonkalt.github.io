(()=>{"use strict";var e,t,n=[{input:"echo Hi, I'm Karson ツ",execute:!0,backspace:!1,typeSpeed:120,initialDelay:3e3,endActionDelay:1e3},{input:"help",execute:!0,backspace:!1,typeSpeed:120,initialDelay:1e3,endActionDelay:1e3},{input:"whoami",execute:!0,backspace:!1,typeSpeed:200,initialDelay:4e3,endActionDelay:1e3},{input:"about",execute:!0,backspace:!1,typeSpeed:120,initialDelay:3e3,endActionDelay:1e3},{input:"experience",execute:!0,backspace:!1,typeSpeed:120,initialDelay:3e3,endActionDelay:1e3},{input:"export BG_COLOR=".concat((t=["#1C4590","#163E70","#0F5C8C","#134F5C","#0D4B4E"],t[Math.floor(Math.random()*t.length)])),execute:!0,backspace:!1,typeSpeed:120,initialDelay:0,endActionDelay:1e3},{input:"skills",execute:!0,backspace:!1,typeSpeed:120,initialDelay:3e3,endActionDelay:1e3},{input:"(✿◠‿◠)",execute:!1,backspace:!0,typeSpeed:200,initialDelay:4e3,endActionDelay:2e3},{input:"education",execute:!0,backspace:!1,typeSpeed:120,initialDelay:3e3,endActionDelay:1e3},{input:"export PS1=".concat((e=["$","%","🐸","💥"],e[Math.floor(Math.random()*e.length)])),execute:!0,backspace:!1,typeSpeed:200,initialDelay:4e3,endActionDelay:1e3},{input:"(^-^)/",execute:!1,backspace:!0,typeSpeed:200,initialDelay:4e3,endActionDelay:2e3},{input:"(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧",execute:!1,backspace:!0,typeSpeed:200,initialDelay:4e3,endActionDelay:3e3}],r=function(e,t,n,r){return new(n||(n=Promise))((function(o,a){function i(e){try{s(r.next(e))}catch(e){a(e)}}function c(e){try{s(r.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,c)}s((r=r.apply(e,t||[])).next())}))},o=function(e,t){var n,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,c[0]&&(i=0)),i;)try{if(n=1,r&&(o=2&c[0]?r.return:c[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,c[1])).done)return o;switch(r=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return i.label++,{value:c[1],done:!1};case 5:i.label++,r=c[1],c=[0];continue;case 7:c=i.ops.pop(),i.trys.pop();continue;default:if(!((o=(o=i.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){i=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){i.label=c[1];break}if(6===c[0]&&i.label<o[1]){i.label=o[1],o=c;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(c);break}o[2]&&i.ops.pop(),i.trys.pop();continue}c=t.call(e,i)}catch(e){c=[6,e],r=0}finally{n=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}},a=function(){function e(e,t,r){this.abortController=null,this.currentItemIndex=0,this.currentText="",this.currentAutoTypeOption=n[this.currentItemIndex],this.deleteSpeed=100,this.prompt=e,this.mirrorElement=r,this.terminal=t,this.startAutoType()}return e.prototype.sleep=function(e,t){return new Promise((function(n,r){var o=setTimeout((function(){return n(!0)}),e);t.addEventListener("abort",(function(){clearTimeout(o),r(new DOMException("Aborted","AbortError"))}))}))},e.prototype.setPromptValue=function(e){this.prompt.value=e,this.mirrorElement.textContent=e},e.prototype.startAutoType=function(){return r(this,void 0,void 0,(function(){var e;return o(this,(function(t){switch(t.label){case 0:this.abortController&&this.abortController.abort(),this.abortController=new AbortController,this.currentText="",this.currentAutoTypeOption=n[this.currentItemIndex],t.label=1;case 1:return t.trys.push([1,3,,4]),[4,this.autoType(this.abortController.signal)];case 2:return t.sent(),[3,4];case 3:return(e=t.sent())instanceof Error&&e.name,[3,4];case 4:return[2]}}))}))},e.prototype.autoType=function(e){return r(this,void 0,void 0,(function(){var t,r,a,i;return o(this,(function(o){switch(o.label){case 0:t=this.currentItemIndex,o.label=1;case 1:return t<n.length?(this.currentItemIndex=t,this.currentAutoTypeOption=n[this.currentItemIndex],this.currentText="",[4,this.sleep(this.currentAutoTypeOption.initialDelay,e)]):[3,12];case 2:o.sent(),r=0,a=this.currentAutoTypeOption.input,o.label=3;case 3:return r<a.length?(i=a[r],this.currentText+=i,this.setPromptValue(this.currentText),[4,this.sleep(this.currentAutoTypeOption.typeSpeed,e)]):[3,6];case 4:o.sent(),o.label=5;case 5:return r++,[3,3];case 6:return[4,this.sleep(this.currentAutoTypeOption.endActionDelay,e)];case 7:return o.sent(),this.currentAutoTypeOption.execute&&this.executeCommand(this.currentAutoTypeOption.input),this.currentAutoTypeOption.backspace?[4,this.backspace(this.currentText.length,e)]:[3,9];case 8:return o.sent(),[3,11];case 9:return[4,this.moveToNextItem(e)];case 10:o.sent(),o.label=11;case 11:return t++,[3,1];case 12:return[2]}}))}))},e.prototype.backspace=function(e,t){return r(this,void 0,void 0,(function(){var n;return o(this,(function(r){switch(r.label){case 0:n=e,r.label=1;case 1:return n>0?(this.currentText=this.currentText.substring(0,n-1),this.setPromptValue(this.currentText),[4,this.sleep(this.deleteSpeed,t)]):[3,4];case 2:r.sent(),r.label=3;case 3:return n--,[3,1];case 4:return[2]}}))}))},e.prototype.moveToNextItem=function(e){return r(this,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this.sleep(this.deleteSpeed,e)];case 1:return t.sent(),[2]}}))}))},e.prototype.executeCommand=function(e){var t=new CustomEvent("executeCommand",{detail:{command:e}});window.dispatchEvent(t)},e.prototype.stopAutoType=function(){this.abortController&&this.abortController.abort()},e}(),i=function(e){var t,n,r,o,a=e[0],i=function(e,t){localStorage.setItem(e,t)};if(a.startsWith("PS1=")){var c=a.slice(4).trim();return document.querySelectorAll(".system-prompt").forEach((function(e){e.textContent=c})),i("PS1",c),"Prompt character changed to ".concat(c)}if(a.startsWith("BG_COLOR=")){var s=e.join(" ").slice(9).trim(),u=function(e){var t=document.createElement("div");document.body.appendChild(t),t.style.backgroundColor=e;var n=window.getComputedStyle(t).backgroundColor;return document.body.removeChild(t),n}(s);if(""===u)return"Invalid color format";i("BG_COLOR",u);var l=(t=u.match(/\d+/g).map(Number),n=t[0],r=t[1],o=t[2],(.299*n+.587*r+.114*o)/255<=.5?"rgb(".concat(n,", ").concat(r,", ").concat(o,")"):"rgb(".concat(Math.max(0,n-100),", ").concat(Math.max(0,r-100),", ").concat(Math.max(0,o-100),")")),d=document.querySelector(".wrapper"),p="linear-gradient(30deg, #000 0%, ".concat(function(e,t){var n=e.match(/\d+/g).map(Number),r=n[0],o=n[1],a=n[2],i=Math.round(.7*r),c=Math.round(.7*o),s=Math.round(.7*a);return"rgb(".concat(i,", ").concat(c,", ").concat(s,")")}(l)," 70%, ").concat(l," 100%)");return d&&(d.style.background=p),"Background changed to ".concat(s)}return"Invalid color format"},c=function(){var e=Math.floor(Math.random()*l.length);return l[e]},s={clear:{execute:function(e){for(var t=document.querySelector(".stdout-log");null==t?void 0:t.firstChild;)t.removeChild(t.firstChild);return"Console cleared"},description:"Clears the terminal screen",flags:{}},echo:{execute:function(e){return t=e.join(" "),(n=document.createElement("div")).classList.add("oval"),n.innerText=t,n.style.display="flex",n.style.alignItems="center",n.style.justifyContent="center",n.style.zIndex="500",n.style.left="50px",n.style.top="50px",document.body.appendChild(n),n.classList.add("oval-animate"),n.addEventListener("animationend",(function(){document.body.removeChild(n)})),"Echo effect triggered for ".concat(e.join(" "));var t,n},description:"Prints back the input received",flags:{}},ls:{execute:function(e){return"file1.txt\nfile2.txt\nfile3.txt"},description:"Lists all available files",flags:{}},about:{execute:function(e){return'I’m a passionate software engineer dedicated to crafting interfaces that delight users and make a difference. Currently, I’m a Software Engineer at <a href="https://www.jupiterone.com/"target="_blank">JupiterOne</a> , where I advocate for user experience and get to build impactful features every day.'},description:"Displays about information",flags:{}},help:{execute:function(e){for(var t="Available commands:\n",n=0,r=Object.entries(s);n<r.length;n++){var o=r[n],a=o[0],i=o[1];t+="- ".concat(a,": ").concat(i.description,"\n");for(var c=0,u=Object.entries(i.flags);c<u.length;c++){var l=u[c],d=l[0],p=l[1];t+="  - ".concat(d,": ").concat(p,"\n")}}return t.replace(/\n/g,"<br/>")},description:"Shows help information about all commands",flags:{}},date:{execute:function(e){return(new Date).toString()},description:"Displays the current date and time",flags:{}},whoami:{execute:function(e){return"Karson, Frontend Developer"},description:"Displays user information",flags:{}},add:{execute:function(e){var t=e.indexOf("--tab");if(-1!==t&&e[t+1]){var n=e[t+1];return["stdout","blog","notes"].includes(n)?function(e){var t=document.querySelector("#".concat(e));return t?(t.removeAttribute("hidden"),'Tab "'.concat(e,'" is now visible.')):'Error: Tab "'.concat(e,'" does not exist.')}(n):'Error: Tab "'.concat(n,'" cannot be added. Only "stdout", "blog", and "about" can be added.')}return"Usage: tab --add <name>"},description:"Adds content to the website",flags:{"--tab":"Adds a tab"}},skills:{execute:function(e){return e.includes("--languages")?"TypeScript, JavaScript, CSS":e.includes("-l")?"Frontend Development, React, UX Design, TypeScript, JavaScript, Node A11y, Agile, User-Centered Design":"Frontend Development, React, UX Design, TypeScript, JavaScript"},description:"Lists all my skills",flags:{"--languages":"Lists programming languages I know","-l":"Lists all my skills"}},projects:{execute:function(e){return"Projects: "},description:"Lists all my projects",flags:{}},education:{execute:function(e){return'<strong>B.S. Digital Marketing</strong>, <a href="https://www.uvu.edu/"target="_blank">Utah Valley University</a> (2010 - 2014)\n    <strong>Software Engineering Immersive</strong> Flatiron School (2017)\n  '},description:"Displays my educational background",flags:{}},experience:{execute:function(e){return'<strong>Software Engineer, Applications</strong>, <a href="https://www.jupiterone.com/"target="_blank">JupiterOne</a> (October 2021 - Present)\n    Natural Language Querying\n    − Designed and developed the integration of generative AI into our search experience, converting natural language to our query language. Resulted in one of our highest adoption rates and helped accelerate platform time-to-value.\n    − Implemented a vector database embedding cache, improving query response times and reducing operational costs.\n    − Implemented Natural Language Processing (NLP) techniques including fuzzy matching and stop word filtering to enhance search precision.\n\n    Design System Development\n    − Spearheaded the development of JupiterOne’s design system, including creation of a comprehensive component library, design tokens, and theming system. Helping to streamline the development process and enabling engineers to focus on core feature development.\n    − Crafted standardized-yet-customizable component APIs through a mix of composability, customization, and "component slots". Balanced flexibility with ease-of-use, allowing for customization without excessive rigidity. Leveraged standard naming conventions and JSDoc for streamlined development.\n      '},description:"Displays my work experience",flags:{}},export:{execute:i,description:"Exports a variable",flags:{}},restore:{execute:function(e){var t=localStorage.getItem("PS1");t&&i(["PS1="+t]);var n=localStorage.getItem("BG_COLOR");return n&&i(["BG_COLOR="+n]),"Restored terminal settings"},description:"Restores terminal settings",flags:{}}},u={cd:{execute:c},rm:{execute:c},sudo:{execute:c},mv:{execute:c},chmod:{execute:c},chown:{execute:c},mkdir:{execute:c},ls:{execute:c},cat:{execute:c},ps:{execute:c},top:{execute:c},vi:{execute:c},nano:{execute:c},exit:{execute:c},man:{execute:c},grep:{execute:c},find:{execute:c},pwd:{execute:c},df:{execute:c},du:{execute:c},curl:{execute:c},wget:{execute:c},ping:{execute:c},ifconfig:{execute:c}},l=["Nice try, but this isn't a real terminal!","You're not fooling anyone.","Did you really think that would work?","You must think you're pretty clever, huh?","You must be new here.","I'm sorry, Dave. I'm afraid I can't do that.","You must be mistaken, this isn't a real terminal.","That command is about as useful here as a chocolate teapot."],d=function(){function e(e,t,n,r){this.prompt=e,this.terminal=t,this.autoTypeManager=n,this.mirrorElement=r,this.initialize()}return e.prototype.createRipple=function(){var e=document.querySelector(".ripple-container"),t=1.1*Math.max(e.offsetWidth,e.offsetHeight),n=document.createElement("span");n.className="ripple",n.style.setProperty("--ripple-size","".concat(t,"px")),e.appendChild(n),n.addEventListener("animationend",(function(){n.remove()}))},e.prototype.setPromptValue=function(e){this.prompt.value=e,this.mirrorElement.textContent=e},e.prototype.handleBashCommand=function(e,t){void 0===t&&(t=!0),t&&this.createRipple();var n,r,o=e.split(" "),a=(n=o[0],r=o.slice(1),n in u?u[n].execute(r):n in s?s[n].execute(r):"Command not found: ".concat(n)).replace(/\n/g,"<br/>");this.setPromptValue(""),t&&this.addToStdoutLog(e,a)},e.prototype.addToStdoutLog=function(e,t){var n,r=document.querySelector(".tab-panels").querySelector(".stdout-log"),o=document.createElement("li");o.innerHTML='\n      <div class="stdout-entry">\n        <div class="stdout-entry-wrapper">\n          <span class="stdout-command">'.concat(e,'</span>\n          <div class="stdout-output">').concat(t,"</div>\n        </div>\n      </div>\n    "),r.insertBefore(o,r.firstChild);var a=null===(n=document.querySelector('button[role="tab"][aria-selected="true"]'))||void 0===n?void 0:n.id;a&&this.updateBadge("stdout"!==a)},e.prototype.updateBadge=function(e){var t=document.querySelector("#stdout").querySelector(".unread-badge");e&&t.classList.add("show")},e.prototype.switchTab=function(e){var t;if("stdout"===e){var n=null===(t=document.querySelector('button[role="tab"][aria-selected="true"]'))||void 0===t?void 0:t.id;n&&this.updateBadge("stdout"!==n)}},e.prototype.initialize=function(){var e=this;this.prompt.addEventListener("keydown",(function(t){"Enter"===t.key&&e.prompt.value.trim()&&(t.preventDefault(),e.handleBashCommand(e.prompt.value.trim()),e.setPromptValue(""),e.autoTypeManager.stopAutoType())})),document.querySelectorAll(".tab").forEach((function(t){t.addEventListener("click",(function(t){var n,r=null===(n=t.target)||void 0===n?void 0:n.getAttribute("data-tab");r&&e.switchTab(r)}))})),this.prompt.addEventListener("focus",(function(){e.autoTypeManager.stopAutoType()})),this.prompt.addEventListener("blur",(function(){e.autoTypeManager.startAutoType()})),this.terminal.addEventListener("click",(function(){e.prompt.focus()})),this.prompt.addEventListener("input",(function(t){var n=t.target;e.setPromptValue(n.value)})),window.addEventListener("executeCommand",(function(t){var n=t.detail.command;e.handleBashCommand(n)}))},e}(),p=document.querySelector(".prompt"),m=document.querySelector(".input-mirror"),h=document.querySelector(".terminal"),f=new d(p,h,new a(p,h,m),m);document.addEventListener("DOMContentLoaded",(function(){f.handleBashCommand("restore",!1)}))})();