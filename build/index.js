var e,t={d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},n={};t.d(n,{s:()=>b,C:()=>p});var r="undefined"==typeof document?void 0:document,o=!!r&&"content"in r.createElement("template"),i=!!r&&r.createRange&&"createContextualFragment"in r.createRange();function a(e,t){var n,r,o=e.nodeName,i=t.nodeName;return o===i||(n=o.charCodeAt(0),r=i.charCodeAt(0),n<=90&&r>=97?o===i.toUpperCase():r<=90&&n>=97&&i===o.toUpperCase())}function d(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var l={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}d(e,t,"selected")},INPUT:function(e,t){d(e,t,"checked"),d(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var o=r.nodeValue;if(o==n||!n&&o==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,o=-1,i=0,a=e.firstChild;a;)if("OPTGROUP"===(r=a.nodeName&&a.nodeName.toUpperCase()))a=(n=a).firstChild;else{if("OPTION"===r){if(a.hasAttribute("selected")){o=i;break}i++}!(a=a.nextSibling)&&n&&(a=n.nextSibling,n=null)}e.selectedIndex=o}}};function c(){}function s(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}const u=function(t,n,d){if(d||(d={}),"string"==typeof n)if("#document"===t.nodeName||"HTML"===t.nodeName||"BODY"===t.nodeName){var u=n;(n=r.createElement("html")).innerHTML=u}else f=(f=n).trim(),n=o?function(e){var t=r.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(f):i?function(t){return e||(e=r.createRange()).selectNode(r.body),e.createContextualFragment(t).childNodes[0]}(f):function(e){var t=r.createElement("body");return t.innerHTML=e,t.childNodes[0]}(f);else 11===n.nodeType&&(n=n.firstElementChild);var f,p=d.getNodeKey||s,v=d.onBeforeNodeAdded||c,m=d.onNodeAdded||c,h=d.onBeforeElUpdated||c,N=d.onElUpdated||c,b=d.onBeforeNodeDiscarded||c,C=d.onNodeDiscarded||c,A=d.onBeforeElChildrenUpdated||c,E=d.skipFromChildren||c,g=d.addChild||function(e,t){return e.appendChild(t)},y=!0===d.childrenOnly,T=Object.create(null),w=[];function S(e){w.push(e)}function O(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=p(n))?S(r):(C(n),n.firstChild&&O(n,t)),n=n.nextSibling}}function x(e,t,n){!1!==b(e)&&(t&&t.removeChild(e),C(e),O(e,n))}function U(e){if(1===e.nodeType||11===e.nodeType)for(var t=e.firstChild;t;){var n=p(t);n&&(T[n]=t),U(t),t=t.nextSibling}}function R(e){m(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=p(t);if(r){var o=T[r];o&&a(t,o)?(t.parentNode.replaceChild(o,t),P(o,t)):R(t)}else R(t);t=n}}function P(e,t,n){var o=p(t);if(o&&delete T[o],!n){var i=h(e,t);if(!1===i)return;if(i instanceof HTMLElement&&U(e=i),function(e,t){var n,r,o,i,a=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var d=a.length-1;d>=0;d--)r=(n=a[d]).name,o=n.namespaceURI,i=n.value,o?(r=n.localName||r,e.getAttributeNS(o,r)!==i&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(o,r,i))):e.getAttribute(r)!==i&&e.setAttribute(r,i);for(var l=e.attributes,c=l.length-1;c>=0;c--)r=(n=l[c]).name,(o=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(o,r)||e.removeAttributeNS(o,r)):t.hasAttribute(r)||e.removeAttribute(r)}}(e,t),N(e),!1===A(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,o,i,d,c,s=E(e,t),u=t.firstChild,f=e.firstChild;e:for(;u;){for(d=u.nextSibling,n=p(u);!s&&f;){if(i=f.nextSibling,u.isSameNode&&u.isSameNode(f)){u=d,f=i;continue e}o=p(f);var m=f.nodeType,h=void 0;if(m===u.nodeType&&(1===m?(n?n!==o&&((c=T[n])?i===c?h=!1:(e.insertBefore(c,f),o?S(o):x(f,e,!0),o=p(f=c)):h=!1):o&&(h=!1),(h=!1!==h&&a(f,u))&&P(f,u)):3!==m&&8!=m||(h=!0,f.nodeValue!==u.nodeValue&&(f.nodeValue=u.nodeValue))),h){u=d,f=i;continue e}o?S(o):x(f,e,!0),f=i}if(n&&(c=T[n])&&a(c,u))s||g(e,c),P(c,u);else{var N=v(u);!1!==N&&(N&&(u=N),u.actualize&&(u=u.actualize(e.ownerDocument||r)),g(e,u),R(u))}u=d,f=i}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=p(t))?S(n):x(t,e,!0),t=r}}(e,f,o);var b=l[e.nodeName];b&&b(e,t)}(e,t):l.TEXTAREA(e,t)}U(t);var V,I,L=t,j=L.nodeType,B=n.nodeType;if(!y)if(1===j)1===B?a(t,n)||(C(t),L=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(t,(V=n.nodeName,(I=n.namespaceURI)&&"http://www.w3.org/1999/xhtml"!==I?r.createElementNS(I,V):r.createElement(V)))):L=n;else if(3===j||8===j){if(B===j)return L.nodeValue!==n.nodeValue&&(L.nodeValue=n.nodeValue),L;L=n}if(L===n)C(t);else{if(n.isSameNode&&n.isSameNode(L))return;if(P(L,n,y),w)for(var D=0,k=w.length;D<k;D++){var H=T[w[D]];H&&x(H,H.parentNode,!1)}}return!y&&L!==t&&t.parentNode&&(L.actualize&&(L=L.actualize(t.ownerDocument||r)),t.parentNode.replaceChild(L,t)),L};let f={};const p=e=>{f=e},v={},m=e=>Array.from(e.querySelectorAll(".viewport")).reduce(((e,t)=>({...e,[t.id]:t})),{}),h=(e,t)=>Object.entries(t).forEach((([t,n])=>{n.hasChildNodes()?delete e[t]:t in v?(n.append(v[t].draw()),t in e&&delete e[t]):t in f&&b(f[t],{viewport:n})})),N=e=>{Object.entries(e).forEach((([e,t])=>{e in f&&b(f[e],{viewport:t})}))},b=(e,t)=>{let n=e.initialState,r=e.render(n);N(m(r));let o=!1;const i=t=>{n!==t&&(n=t,o||(setTimeout((()=>{(()=>{const t=e.render(n);if(console.log("rendered",t.cloneNode(!0)),!r.isEqualNode(t)){const e=m(r);r.nodeName!==t.nodeName?(r.replaceWith(t),r=t):u(r,t,{onBeforeElUpdated:(e,t)=>!e.isEqualNode(t),onBeforeNodeDiscarded:e=>(console.log("discarded",e.cloneNode(!0)),!0)});const n=m(r);h(e,n),(e=>{Object.keys(e).forEach((t=>{v[t].destroy(),delete v[t],delete e[t]}))})(e)}})(),o=!1}),0),o=!0))},a=t=>{["submit"].includes(t.type)&&t.preventDefault(),t.stopImmediatePropagation();const r=e.events.local[t.type];i(r(n,t))},d=t=>{const r=e.events.window[t.type];i(r(n,t))},l=(e,t,n)=>Object.keys(e).forEach((e=>t.addEventListener(e,n))),c=(e,t,n)=>Object.keys(e).forEach((e=>t.removeEventListener(e,n)));l(e.events?.local??{},r,a),l(e.events?.window??{},window,d),t.viewport.append(r),v[t.viewport.id]={draw:()=>r,destroy:()=>{c(e.events?.local??{},r,a),c(e.events?.window??{},window,d)}}};var C=n.s,A=n.C;export{C as component,A as registerComponents};