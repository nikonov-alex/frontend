var e,t={d:(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},n={};t.d(n,{B:()=>f,s9:()=>C,Cy:()=>v});var r="undefined"==typeof document?void 0:document,a=!!r&&"content"in r.createElement("template"),o=!!r&&r.createRange&&"createContextualFragment"in r.createRange();function i(e,t){var n,r,a=e.nodeName,o=t.nodeName;return a===o||(n=a.charCodeAt(0),r=o.charCodeAt(0),n<=90&&r>=97?a===o.toUpperCase():r<=90&&n>=97&&o===a.toUpperCase())}function d(e,t,n){e[n]!==t[n]&&(e[n]=t[n],e[n]?e.setAttribute(n,""):e.removeAttribute(n))}var l={OPTION:function(e,t){var n=e.parentNode;if(n){var r=n.nodeName.toUpperCase();"OPTGROUP"===r&&(r=(n=n.parentNode)&&n.nodeName.toUpperCase()),"SELECT"!==r||n.hasAttribute("multiple")||(e.hasAttribute("selected")&&!t.selected&&(e.setAttribute("selected","selected"),e.removeAttribute("selected")),n.selectedIndex=-1)}d(e,t,"selected")},INPUT:function(e,t){d(e,t,"checked"),d(e,t,"disabled"),e.value!==t.value&&(e.value=t.value),t.hasAttribute("value")||e.removeAttribute("value")},TEXTAREA:function(e,t){var n=t.value;e.value!==n&&(e.value=n);var r=e.firstChild;if(r){var a=r.nodeValue;if(a==n||!n&&a==e.placeholder)return;r.nodeValue=n}},SELECT:function(e,t){if(!t.hasAttribute("multiple")){for(var n,r,a=-1,o=0,i=e.firstChild;i;)if("OPTGROUP"===(r=i.nodeName&&i.nodeName.toUpperCase()))i=(n=i).firstChild;else{if("OPTION"===r){if(i.hasAttribute("selected")){a=o;break}o++}!(i=i.nextSibling)&&n&&(i=n.nextSibling,n=null)}e.selectedIndex=a}}};function s(){}function c(e){if(e)return e.getAttribute&&e.getAttribute("id")||e.id}const u=function(t,n,d){if(d||(d={}),"string"==typeof n)if("#document"===t.nodeName||"HTML"===t.nodeName||"BODY"===t.nodeName){var u=n;(n=r.createElement("html")).innerHTML=u}else f=(f=n).trim(),n=a?function(e){var t=r.createElement("template");return t.innerHTML=e,t.content.childNodes[0]}(f):o?function(t){return e||(e=r.createRange()).selectNode(r.body),e.createContextualFragment(t).childNodes[0]}(f):function(e){var t=r.createElement("body");return t.innerHTML=e,t.childNodes[0]}(f);else 11===n.nodeType&&(n=n.firstElementChild);var f,p=d.getNodeKey||c,v=d.onBeforeNodeAdded||s,m=d.onNodeAdded||s,h=d.onBeforeElUpdated||s,N=d.onElUpdated||s,b=d.onBeforeNodeDiscarded||s,E=d.onNodeDiscarded||s,C=d.onBeforeElChildrenUpdated||s,A=d.skipFromChildren||s,S=d.addChild||function(e,t){return e.appendChild(t)},y=!0===d.childrenOnly,g=Object.create(null),T=[];function w(e){T.push(e)}function O(e,t){if(1===e.nodeType)for(var n=e.firstChild;n;){var r=void 0;t&&(r=p(n))?w(r):(E(n),n.firstChild&&O(n,t)),n=n.nextSibling}}function x(e,t,n){!1!==b(e)&&(t&&t.removeChild(e),E(e),O(e,n))}function U(e){if(1===e.nodeType||11===e.nodeType)for(var t=e.firstChild;t;){var n=p(t);n&&(g[n]=t),U(t),t=t.nextSibling}}function L(e){m(e);for(var t=e.firstChild;t;){var n=t.nextSibling,r=p(t);if(r){var a=g[r];a&&i(t,a)?(t.parentNode.replaceChild(a,t),R(a,t)):L(t)}else L(t);t=n}}function R(e,t,n){var a=p(t);if(a&&delete g[a],!n){var o=h(e,t);if(!1===o)return;if(o instanceof HTMLElement&&U(e=o),function(e,t){var n,r,a,o,i=t.attributes;if(11!==t.nodeType&&11!==e.nodeType){for(var d=i.length-1;d>=0;d--)r=(n=i[d]).name,a=n.namespaceURI,o=n.value,a?(r=n.localName||r,e.getAttributeNS(a,r)!==o&&("xmlns"===n.prefix&&(r=n.name),e.setAttributeNS(a,r,o))):e.getAttribute(r)!==o&&e.setAttribute(r,o);for(var l=e.attributes,s=l.length-1;s>=0;s--)r=(n=l[s]).name,(a=n.namespaceURI)?(r=n.localName||r,t.hasAttributeNS(a,r)||e.removeAttributeNS(a,r)):t.hasAttribute(r)||e.removeAttribute(r)}}(e,t),N(e),!1===C(e,t))return}"TEXTAREA"!==e.nodeName?function(e,t){var n,a,o,d,s,c=A(e,t),u=t.firstChild,f=e.firstChild;e:for(;u;){for(d=u.nextSibling,n=p(u);!c&&f;){if(o=f.nextSibling,u.isSameNode&&u.isSameNode(f)){u=d,f=o;continue e}a=p(f);var m=f.nodeType,h=void 0;if(m===u.nodeType&&(1===m?(n?n!==a&&((s=g[n])?o===s?h=!1:(e.insertBefore(s,f),a?w(a):x(f,e,!0),a=p(f=s)):h=!1):a&&(h=!1),(h=!1!==h&&i(f,u))&&R(f,u)):3!==m&&8!=m||(h=!0,f.nodeValue!==u.nodeValue&&(f.nodeValue=u.nodeValue))),h){u=d,f=o;continue e}a?w(a):x(f,e,!0),f=o}if(n&&(s=g[n])&&i(s,u))c||S(e,s),R(s,u);else{var N=v(u);!1!==N&&(N&&(u=N),u.actualize&&(u=u.actualize(e.ownerDocument||r)),S(e,u),L(u))}u=d,f=o}!function(e,t,n){for(;t;){var r=t.nextSibling;(n=p(t))?w(n):x(t,e,!0),t=r}}(e,f,a);var b=l[e.nodeName];b&&b(e,t)}(e,t):l.TEXTAREA(e,t)}U(t);var B,P,V=t,I=V.nodeType,j=n.nodeType;if(!y)if(1===I)1===j?i(t,n)||(E(t),V=function(e,t){for(var n=e.firstChild;n;){var r=n.nextSibling;t.appendChild(n),n=r}return t}(t,(B=n.nodeName,(P=n.namespaceURI)&&"http://www.w3.org/1999/xhtml"!==P?r.createElementNS(P,B):r.createElement(B)))):V=n;else if(3===I||8===I){if(j===I)return V.nodeValue!==n.nodeValue&&(V.nodeValue=n.nodeValue),V;V=n}if(V===n)E(t);else{if(n.isSameNode&&n.isSameNode(V))return;if(R(V,n,y),T)for(var _=0,D=T.length;_<D;_++){var k=g[T[_]];k&&x(k,k.parentNode,!1)}}return!y&&V!==t&&t.parentNode&&(V.actualize&&(V=V.actualize(t.ownerDocument||r)),t.parentNode.replaceChild(V,t)),V};class f{_data;_listeners=new Set;constructor(e){this._data=e}get data(){return this._data}set data(e){this._data=e,this._listeners.forEach((e=>e()))}addListener(e){this._listeners.add(e)}removeListener(e){this._listeners.delete(e)}}let p={};const v=e=>{p=e},m={},h=e=>Array.from(e.querySelectorAll(".viewport")).reduce(((e,t)=>({...e,[t.id]:t})),{}),N=(e,t)=>Object.entries(t).forEach((([t,n])=>{n.hasChildNodes()?delete e[t]:t in m?(n.append(m[t].draw()),t in e&&delete e[t]):t in p&&C(p[t],{viewport:n})})),b=e=>{Object.entries(e).forEach((([e,t])=>{e in p&&C(p[e],{viewport:t})}))},E=e=>e.map((e=>e.data)),C=(e,t)=>{const n=t=>e.render(t,...E(e.sharedStates));let r=e.initialState,a=n(r);b(h(a));let o=!1;const i=()=>{o||(setTimeout((()=>{(()=>{const e=n(r);if(console.log("rendered",e.cloneNode(!0)),!a.isEqualNode(e)){const t=h(a);a.nodeName!==e.nodeName?(a.replaceWith(e),a=e):u(a,e,{onBeforeElUpdated:(e,t)=>!e.isEqualNode(t),onBeforeNodeDiscarded:e=>(console.log("discarded",e.cloneNode(!0)),!e.parentElement?.classList.contains("viewport"))});const n=h(a);N(t,n),(e=>{Object.keys(e).forEach((t=>{m[t].destroy(),delete m[t],delete e[t]}))})(t)}})(),o=!1}),0),o=!0)},d=(t,n)=>{(t=>{if(r!==t){const n=r;r=t,i(),e.updateSharedStates?.forEach((({sharedState:e,when:t,update:a})=>{t(n,r)&&(e.data=a(r))}))}})(n(r,t,...E(e.sharedStates)))},l=t=>{["submit"].includes(t.type)&&t.preventDefault(),t.stopImmediatePropagation(),d(t,e.events.local[t.type])},s=t=>{d(t,e.events.window[t.type])},c=(e,t,n)=>Object.keys(e).forEach((e=>t.addEventListener(e,n))),f=(e,t,n)=>Object.keys(e).forEach((e=>t.removeEventListener(e,n))),p=()=>{i()};c(e.events?.local??{},a,l),c(e.events?.window??{},window,s),e.sharedStates.forEach((e=>e.addListener(p))),t.viewport.append(a),m[t.viewport.id]={draw:()=>a,destroy:()=>{f(e.events?.local??{},a,l),f(e.events?.window??{},window,s),e.sharedStates.forEach((e=>e.removeListener(p)))}}};var A=n.B,S=n.s9,y=n.Cy;export{A as SharedState,S as component,y as registerComponents};