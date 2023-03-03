!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).dialogPolyfill=t()}(this,function(){"use strict";var e=window.CustomEvent;function t(e,t){var o="on"+t.type.toLowerCase();return"function"==typeof e[o]&&e[o](t),e.dispatchEvent(t)}function o(e){for(;e;){if("dialog"===e.localName)return e;e=e.parentElement?e.parentElement:e.parentNode?e.parentNode.host:null}return null}function i(e){for(;e&&e.shadowRoot&&e.shadowRoot.activeElement;)e=e.shadowRoot.activeElement;e&&e.blur&&e!==document.body&&e.blur()}function a(e,t){for(var o=0;o<e.length;++o)if(e[o]===t)return!0;return!1}function n(e){return!!(e&&e.hasAttribute("method"))&&"dialog"===e.getAttribute("method").toLowerCase()}function s(e){return e.isConnected||document.body.contains(e)}function r(e){if(e.submitter)return e.submitter;var t=e.target;if(!(t instanceof HTMLFormElement))return null;var o=c.formSubmitter;if(!o){var i=e.target;o=("getRootNode"in i&&i.getRootNode()||document).activeElement}return o&&o.form===t?o:null}function l(e){if(!e.defaultPrevented){var t=e.target,i=c.imagemapUseValue,a=r(e);null===i&&a&&(i=a.value);var n=o(t);if(n)"dialog"===(a&&a.getAttribute("formmethod")||t.getAttribute("method"))&&(e.preventDefault(),null!=i?n.close(i):n.close())}}function d(e){if(this.dialog_=e,this.replacedStyleTop_=!1,this.openAsModal_=!1,e.hasAttribute("role")||e.setAttribute("role","dialog"),e.show=this.show.bind(this),e.showModal=this.showModal.bind(this),e.close=this.close.bind(this),e.addEventListener("submit",l,!1),"returnValue"in e||(e.returnValue=""),"MutationObserver"in window)new MutationObserver(this.maybeHideModal.bind(this)).observe(e,{attributes:!0,attributeFilter:["open"]});else{var t,o=!1,i=(function(){o?this.downgradeModal():this.maybeHideModal(),o=!1}).bind(this),a=function(a){if(a.target===e){var n="DOMNodeRemoved";o|=a.type.substr(0,n.length)===n,window.clearTimeout(t),t=window.setTimeout(i,0)}};["DOMAttrModified","DOMNodeRemoved","DOMNodeRemovedFromDocument"].forEach(function(t){e.addEventListener(t,a)})}Object.defineProperty(e,"open",{set:this.setOpen.bind(this),get:e.hasAttribute.bind(e,"open")}),this.backdrop_=document.createElement("div"),this.backdrop_.className="backdrop",this.backdrop_.addEventListener("mouseup",this.backdropMouseEvent_.bind(this)),this.backdrop_.addEventListener("mousedown",this.backdropMouseEvent_.bind(this)),this.backdrop_.addEventListener("click",this.backdropMouseEvent_.bind(this))}e&&"object"!=typeof e||((e=function e(t,o){o=o||{};var i=document.createEvent("CustomEvent");return i.initCustomEvent(t,!!o.bubbles,!!o.cancelable,o.detail||null),i}).prototype=window.Event.prototype),d.prototype={get dialog(){return this.dialog_},maybeHideModal:function(){!(this.dialog_.hasAttribute("open")&&s(this.dialog_))&&this.downgradeModal()},downgradeModal:function(){this.openAsModal_&&(this.openAsModal_=!1,this.dialog_.style.zIndex="",this.replacedStyleTop_&&(this.dialog_.style.top="",this.replacedStyleTop_=!1),this.backdrop_.parentNode&&this.backdrop_.parentNode.removeChild(this.backdrop_),c.dm.removeDialog(this))},setOpen:function(e){e?this.dialog_.hasAttribute("open")||this.dialog_.setAttribute("open",""):(this.dialog_.removeAttribute("open"),this.maybeHideModal())},backdropMouseEvent_:function(e){if(this.dialog_.hasAttribute("tabindex"))this.dialog_.focus();else{var t=document.createElement("div");this.dialog_.insertBefore(t,this.dialog_.firstChild),t.tabIndex=-1,t.focus(),this.dialog_.removeChild(t)}var o=document.createEvent("MouseEvents");o.initMouseEvent(e.type,e.bubbles,e.cancelable,window,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget),this.dialog_.dispatchEvent(o),e.stopPropagation()},focus_:function(){var e=this.dialog_.querySelector("[autofocus]:not([disabled])");!e&&this.dialog_.tabIndex>=0&&(e=this.dialog_),e||(e=function e(t){var o=["button","input","keygen","select","textarea"].map(function(e){return e+":not([disabled])"});o.push('[tabindex]:not([disabled]):not([tabindex=""])');var i=t.querySelector(o.join(", "));if(!i&&"attachShadow"in Element.prototype)for(var a=t.querySelectorAll("*"),n=0;n<a.length&&!(a[n].tagName&&a[n].shadowRoot&&(i=e(a[n].shadowRoot)));n++);return i}(this.dialog_)),i(document.activeElement),e&&e.focus()},updateZIndex:function(e,t){if(e<t)throw Error("dialogZ should never be < backdropZ");this.dialog_.style.zIndex=e,this.backdrop_.style.zIndex=t},show:function(){this.dialog_.open||(this.setOpen(!0),this.focus_())},showModal:function(){if(this.dialog_.hasAttribute("open"))throw Error("Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally.");if(!s(this.dialog_))throw Error("Failed to execute 'showModal' on dialog: The element is not in a Document.");if(!c.dm.pushDialog(this))throw Error("Failed to execute 'showModal' on dialog: There are too many open modal dialogs.");(function e(t){for(;t&&t!==document.body;){var o=window.getComputedStyle(t),i=function(e,t){return!(void 0===o[e]||o[e]===t)};if(o.opacity<1||i("zIndex","auto")||i("transform","none")||i("mixBlendMode","normal")||i("filter","none")||i("perspective","none")||"isolate"===o.isolation||"fixed"===o.position||"touch"===o.webkitOverflowScrolling)return!0;t=t.parentElement}return!1})(this.dialog_.parentElement)&&console.warn("A dialog is being shown inside a stacking context. This may cause it to be unusable. For more information, see this link: https://github.com/GoogleChrome/dialog-polyfill/#stacking-context"),this.setOpen(!0),this.openAsModal_=!0,c.needsCentering(this.dialog_)?(c.reposition(this.dialog_),this.replacedStyleTop_=!0):this.replacedStyleTop_=!1,this.dialog_.parentNode.insertBefore(this.backdrop_,this.dialog_.nextSibling),this.focus_()},close:function(o){if(!this.dialog_.hasAttribute("open"))throw Error("Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed.");this.setOpen(!1),void 0!==o&&(this.dialog_.returnValue=o);var i=new e("close",{bubbles:!1,cancelable:!1});t(this.dialog_,i)}};var c={};if(c.reposition=function(e){var t=document.body.scrollTop||document.documentElement.scrollTop,o=t+(window.innerHeight-e.offsetHeight)/2;e.style.top=Math.max(t,o)+"px"},c.isInlinePositionSetByStylesheet=function(e){for(var t=0;t<document.styleSheets.length;++t){var o=document.styleSheets[t],i=null;try{i=o.cssRules}catch(n){}if(i)for(var s=0;s<i.length;++s){var r=i[s],l=null;try{l=document.querySelectorAll(r.selectorText)}catch(d){}if(l&&a(l,e)){var c=r.style.getPropertyValue("top"),h=r.style.getPropertyValue("bottom");if(c&&"auto"!==c||h&&"auto"!==h)return!0}}}return!1},c.needsCentering=function(e){return"absolute"===window.getComputedStyle(e).position&&("auto"===e.style.top||""===e.style.top)&&("auto"===e.style.bottom||""===e.style.bottom)&&!c.isInlinePositionSetByStylesheet(e)},c.forceRegisterDialog=function(e){if((window.HTMLDialogElement||e.showModal)&&console.warn("This browser already supports <dialog>, the polyfill may not work correctly",e),"dialog"!==e.localName)throw Error("Failed to register dialog: The element is not a dialog.");new d(e)},c.registerDialog=function(e){e.showModal||c.forceRegisterDialog(e)},c.DialogManager=function(){this.pendingDialogStack=[];var e=this.checkDOM_.bind(this);this.overlay=document.createElement("div"),this.overlay.className="_dialog_overlay",this.overlay.addEventListener("click",(function(t){this.forwardTab_=void 0,t.stopPropagation(),e([])}).bind(this)),this.handleKey_=this.handleKey_.bind(this),this.handleFocus_=this.handleFocus_.bind(this),this.zIndexLow_=1e5,this.zIndexHigh_=100150,this.forwardTab_=void 0,"MutationObserver"in window&&(this.mo_=new MutationObserver(function(t){var o=[];t.forEach(function(e){for(var t,i=0;t=e.removedNodes[i];++i)t instanceof Element&&("dialog"===t.localName&&o.push(t),o=o.concat(t.querySelectorAll("dialog")))}),o.length&&e(o)}))},c.DialogManager.prototype.blockDocument=function(){document.documentElement.addEventListener("focus",this.handleFocus_,!0),document.addEventListener("keydown",this.handleKey_),this.mo_&&this.mo_.observe(document,{childList:!0,subtree:!0})},c.DialogManager.prototype.unblockDocument=function(){document.documentElement.removeEventListener("focus",this.handleFocus_,!0),document.removeEventListener("keydown",this.handleKey_),this.mo_&&this.mo_.disconnect()},c.DialogManager.prototype.updateStacking=function(){for(var e,t=this.zIndexHigh_,o=0;e=this.pendingDialogStack[o];++o)e.updateZIndex(--t,--t),0===o&&(this.overlay.style.zIndex=--t);var i=this.pendingDialogStack[0];i?(i.dialog.parentNode||document.body).appendChild(this.overlay):this.overlay.parentNode&&this.overlay.parentNode.removeChild(this.overlay)},c.DialogManager.prototype.containedByTopDialog_=function(e){for(;e=o(e);){for(var t,i=0;t=this.pendingDialogStack[i];++i)if(t.dialog===e)return 0===i;e=e.parentElement}return!1},c.DialogManager.prototype.handleFocus_=function(e){var t=e.composedPath?e.composedPath()[0]:e.target;if(!this.containedByTopDialog_(t)&&document.activeElement!==document.documentElement){if(e.preventDefault(),e.stopPropagation(),i(t),void 0!==this.forwardTab_){var o=this.pendingDialogStack[0];return o.dialog.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING&&(this.forwardTab_?o.focus_():t!==document.documentElement&&document.documentElement.focus()),!1}}},c.DialogManager.prototype.handleKey_=function(o){if(this.forwardTab_=void 0,27===o.keyCode){o.preventDefault(),o.stopPropagation();var i=new e("cancel",{bubbles:!1,cancelable:!0}),a=this.pendingDialogStack[0];a&&t(a.dialog,i)&&a.dialog.close()}else 9===o.keyCode&&(this.forwardTab_=!o.shiftKey)},c.DialogManager.prototype.checkDOM_=function(e){this.pendingDialogStack.slice().forEach(function(t){-1!==e.indexOf(t.dialog)?t.downgradeModal():t.maybeHideModal()})},c.DialogManager.prototype.pushDialog=function(e){var t=(this.zIndexHigh_-this.zIndexLow_)/2-1;return!(this.pendingDialogStack.length>=t)&&(1===this.pendingDialogStack.unshift(e)&&this.blockDocument(),this.updateStacking(),!0)},c.DialogManager.prototype.removeDialog=function(e){var t=this.pendingDialogStack.indexOf(e);-1!==t&&(this.pendingDialogStack.splice(t,1),0===this.pendingDialogStack.length&&this.unblockDocument(),this.updateStacking())},c.dm=new c.DialogManager,c.formSubmitter=null,c.imagemapUseValue=null,void 0===window.HTMLDialogElement){var h=document.createElement("form");if(h.setAttribute("method","dialog"),"dialog"!==h.method){var u=Object.getOwnPropertyDescriptor(HTMLFormElement.prototype,"method");if(u){var p=u.get;u.get=function(){return n(this)?"dialog":p.call(this)};var g=u.set;u.set=function(e){return"string"==typeof e&&"dialog"===e.toLowerCase()?this.setAttribute("method",e):g.call(this,e)},Object.defineProperty(HTMLFormElement.prototype,"method",u)}}document.addEventListener("click",function(e){if(c.formSubmitter=null,c.imagemapUseValue=null,!e.defaultPrevented){var t=e.target;if("composedPath"in e&&(t=e.composedPath().shift()||t),t&&n(t.form)){if(!("submit"===t.type&&["button","input"].indexOf(t.localName)>-1)){if(!("input"===t.localName&&"image"===t.type))return;c.imagemapUseValue=e.offsetX+","+e.offsetY}o(t)&&(c.formSubmitter=t)}}},!1),document.addEventListener("submit",function(e){var t=e.target;if(!o(t)){var i=r(e);"dialog"===(i&&i.getAttribute("formmethod")||t.getAttribute("method"))&&e.preventDefault()}});var f=HTMLFormElement.prototype.submit,m=function(){if(!n(this))return f.call(this);var e=o(this);e&&e.close()};HTMLFormElement.prototype.submit=m}return c}),window.addEventListener("DOMContentLoaded",()=>{function e(e){e.addEventListener("assetChosen",async t=>{let i=void 0!==e.dataset.assetMultiple;if(i){let a=e.dataset.asset.split(",");a.push(t.detail),e.dataset.asset=a.join(",")}else e.dataset.asset=t.detail;await o(e)}),e.querySelectorAll("[data-asset-browse]").forEach(t=>{t.addEventListener("click",async t=>{t.preventDefault();let o="assetConstraintsAssetSources"in e.dataset?e.dataset.assetConstraintsAssetSources.split(","):[],a="assetConstraintsMediaTypes"in e.dataset?e.dataset.assetConstraintsMediaTypes.split(","):[];i(o,a,e)})}),e.querySelectorAll("[data-asset-replace]").forEach(t=>{t.addEventListener("click",async t=>{t.preventDefault(),e.dataset.asset="",e.dispatchEvent(new CustomEvent("assetRemoved")),await o(e)})})}async function t(e){let t=await fetch(`/neos/service/assets/${e}`),o=await t.text(),i=new DOMParser,a=i.parseFromString(o,"text/html"),n=a.querySelector("label.asset-label")?.textContent,s=a.querySelector('a[rel="preview"]')?.getAttribute("href");return{label:n,previewUrl:s}}async function o(e){let a=e.dataset.asset.split(",").filter(e=>e.length>0),n=a.length>0,s=e.querySelector("[data-asset-field]");s&&(s.value=n?a.join(","):""),e.querySelectorAll("[data-asset-hide-if-set]").forEach(e=>e.style.display=n?"none":""),e.querySelectorAll("[data-asset-hide-if-missing]").forEach(e=>e.style.display=n?"":"none");let r=e.querySelector("[data-asset-preview-template]"),l=e.querySelector("[data-asset-preview-container]");if(r&&l)l.innerText="",n&&a.forEach(async n=>{let s=r.content.cloneNode(!0),d=s.querySelector("img[data-asset-preview-image]"),c=s.querySelector("[data-asset-field]");c&&(c.value=n,c.disabled=!1),s.querySelectorAll("[data-asset-replace]").forEach(t=>{t.addEventListener("click",t=>{e.dataset.asset=a.filter(e=>e!==n).join(","),o(e)})}),s.querySelectorAll("[data-asset-browse]").forEach(t=>{t.addEventListener("click",async t=>{t.preventDefault();let o="assetConstraintsAssetSources"in e.dataset?e.dataset.assetConstraintsAssetSources.split(","):[],a="assetConstraintsMediaTypes"in e.dataset?e.dataset.assetConstraintsMediaTypes.split(","):[];i(o,a,e)})});let h=s.querySelector("[data-asset-preview-label]");l.appendChild(s);let{label:u,previewUrl:p}=await t(n);d&&d.setAttribute("src",p),h&&(h.textContent=u)})}function i(e,t,o){let i=void 0!==o.dataset.assetMultiple,a=o.dataset.asset,n=a&&!i?new URL("/neos/media/browser/images/edit.html?asset="+a,window.location.origin):new URL("/neos/media/browser/assets/index.html",window.location.origin);e.map(e=>n.searchParams.append("constraints[assetSources][]",e.trim())),t.map(e=>n.searchParams.append("constraints[mediaTypes][]",e.trim()));let s=document.createElement("dialog");s.style.padding="0",s.style.width="90%",s.style.height="720px";let r=document.createElement("a");r.innerText="X",r.style.fontSize="18px",r.style.padding="10px",r.style.position="absolute",r.style.cursor="pointer",r.style.right="25px",r.style.zIndex="1000",r.addEventListener("click",e=>s.close());let l=document.createElement("iframe");l.setAttribute("src",n.toString()),l.style.position="absolute",l.style.width="100%",l.style.height="100%",l.style.borderWidth="0",l.style.backgroundColor="#222",s.appendChild(r),s.appendChild(l),window.NeosMediaBrowserCallbacks={assetChosen(e){o.dispatchEvent(new CustomEvent("assetChosen",{detail:e})),i||s.close()}},s.addEventListener("cancel",e=>resolve(assetIds)),s.addEventListener("click",e=>{e.target===s&&s.close()}),o.appendChild(s),dialogPolyfill.registerDialog(s),s.showModal()}document.querySelectorAll("[data-asset]").forEach(async t=>{e(t),await o(t,t.dataset.asset)})});
