(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{3:function(t,e,c){"use strict";function n(t){const e=new Uint8Array(t),c=String.fromCharCode(...e);return console.log("string",c),c}function o(t){const e=t.length,c=new ArrayBuffer(e),n=new Uint8Array(c);for(let c=0;c<e;c++)n[c]=t.charCodeAt(c),console.log({i:c},n[c]);return c}c.d(e,"a",function(){return f}),c.d(e,"f",function(){return d}),c.d(e,"c",function(){return h}),c.d(e,"b",function(){return g}),c.d(e,"e",function(){return w}),c.d(e,"h",function(){return p}),c.d(e,"g",function(){return v}),c.d(e,"d",function(){return y});const r="00010000-89bd-43c8-9231-40f6e305f96d",s="00010001-89bd-43c8-9231-40f6e305f96d",i="00010002-89bd-43c8-9231-40f6e305f96d",a="00010005-89bd-43c8-9231-40f6e305f96d",l="00010004-89bd-43c8-9231-40f6e305f96d",u=!0,b=!1;let j,O;const f={COMPLETED:"COMPLETED",DISCONNECTED:"DISCONNECTED",SCANNING:"SCANNING",ASSOCIATING:"ASSOCIATING"};function d(){return!!navigator.bluetooth&&!!navigator.bluetooth.requestDevice}async function h(){return j=await navigator.bluetooth.requestDevice({filters:[{name:["IoT Gateway WiFi Setup"]}],optionalServices:[r]}),console.log("device",j),j}async function g(){return j?(O=await j.gatt.connect(),console.log("server",O),!0):(console.log("Device not established yet"),null)}async function w(){if(!O)return console.log("Server not established. Try to (re-)connect first."),null;const t=await O.getPrimaryService(r);console.log("service",t);const e=await t.getCharacteristic(l);console.log("characteristic",e);try{const t=await e.readValue();console.log("Wifi SSIDs value...",t);const c=n(t.buffer).split(",");return console.log("ssids",c),c}catch(t){return console.error("Error getting SSIDs",t),null}}async function p(t){if(console.log("setWifiSSID",`"${t}"`),!O)return console.log("Server not established. Try to (re-)connect first."),b;const e=await O.getPrimaryService(r);console.log("service",e);const c=await e.getCharacteristic(s);console.log("characteristic",c);const n=o(t);console.log("Write buffer",n);try{const e=await c.writeValue(n);return console.log({response:e}),u}catch(e){console.error("Error setting wifi ssid",t,e)}return b}async function v(t){if(console.log("setWifiPassword",t),!O)return console.log("Server not established. Try to (re-)connect first."),null;const e=await O.getPrimaryService(r);console.log("service",e);const c=await e.getCharacteristic(i);console.log("characteristic",c);const n=o(t);console.log("Write buffer",n);try{const e=await c.writeValue(n);return console.log({response:e}),u}catch(e){console.error("Error setting wifi password",t,e)}return b}async function y(){if(console.log("getNetworkState"),!O)return console.log("Server not established. Try to (re-)connect first."),null;const t=await O.getPrimaryService(r);console.log("service",t);const e=await t.getCharacteristic(a);console.log("characteristic",e);try{const t=await e.readValue();console.log("Network status value...",t);const c=n(t.buffer);console.log("Network status string",c);const o=c.split(",");return o.length<2?(console.error("Invalid network status",c,o),null):{status:o[0],ipAddress:o[1]}}catch(t){return console.error("Error getting network state",t),null}}},5:function(t,e,c){"use strict";c.r(e);var n=c(0),o=(c(1),c(3),{onClickContinue(){const t=`https://${this.store.get().ipAddress}:4443`;console.log("Redirecting to",t),location.href=t}});function r(t){if(Object(n.t)(this,t),this._state=Object(n.e)({},t.data),this._intro=!0,document.getElementById("svelte-9b6d0c-style")||function(){var t=Object(n.m)("style");t.id="svelte-9b6d0c-style",t.textContent="#continue.svelte-9b6d0c{width:100%}",Object(n.d)(t,document.head)}(),this._fragment=function(t,e){var c,o,r,s,i,a,l,u,b,j,O,f,d,h,g,w,p,v,y,S,m;function C(e){t.onClickContinue()}return{c(){c=Object(n.n)("\n\n\n\n"),o=Object(n.m)("h1"),r=Object(n.m)("a"),s=Object(n.n)("Setup "),i=Object(n.m)("strong"),a=Object(n.n)("Things"),l=Object(n.n)(" "),u=Object(n.m)("img"),b=Object(n.n)("\n\n"),j=Object(n.m)("h2"),O=Object(n.n)("Success"),f=Object(n.n)("\n\n"),d=Object(n.m)("p"),h=Object(n.n)("You will now be redirected to your Gateway. Please ensure that you are \n\tconnected to your chosen wifi network and press Continue."),g=Object(n.n)("\n\n"),w=Object(n.m)("button"),p=Object(n.n)("Continue"),v=Object(n.n)("\n\n"),y=Object(n.m)("p"),S=Object(n.m)("a"),m=Object(n.n)("Start again"),this.h()},l(t){c=Object(n.k)(t,"\n\n\n\n"),o=Object(n.j)(t,"H1",{},!1);var e=Object(n.i)(o);r=Object(n.j)(e,"A",{href:!0},!1);var C=Object(n.i)(r);s=Object(n.k)(C,"Setup "),i=Object(n.j)(C,"STRONG",{},!1);var k=Object(n.i)(i);a=Object(n.k)(k,"Things"),k.forEach(n.p),l=Object(n.k)(C," "),u=Object(n.j)(C,"IMG",{src:!0,alt:!0,width:!0,height:!0},!1),Object(n.i)(u).forEach(n.p),C.forEach(n.p),e.forEach(n.p),b=Object(n.k)(t,"\n\n"),j=Object(n.j)(t,"H2",{},!1);var E=Object(n.i)(j);O=Object(n.k)(E,"Success"),E.forEach(n.p),f=Object(n.k)(t,"\n\n"),d=Object(n.j)(t,"P",{class:!0},!1);var N=Object(n.i)(d);h=Object(n.k)(N,"You will now be redirected to your Gateway. Please ensure that you are \n\tconnected to your chosen wifi network and press Continue."),N.forEach(n.p),g=Object(n.k)(t,"\n\n"),w=Object(n.j)(t,"BUTTON",{id:!0,class:!0},!1);var T=Object(n.i)(w);p=Object(n.k)(T,"Continue"),T.forEach(n.p),v=Object(n.k)(t,"\n\n"),y=Object(n.j)(t,"P",{class:!0},!1);var I=Object(n.i)(y);S=Object(n.j)(I,"A",{href:!0},!1);var A=Object(n.i)(S);m=Object(n.k)(A,"Start again"),A.forEach(n.p),I.forEach(n.p),this.h()},h(){document.title="Setup Things - Success",u.src="logo-light.svg",u.alt="Things logo",u.width="50",u.height="50",r.href="/",d.className="instruction",Object(n.c)(w,"click",C),w.id="continue",w.className="svelte-9b6d0c",S.href="/",y.className="footer"},m(t,e){Object(n.u)(c,t,e),Object(n.u)(o,t,e),Object(n.d)(r,o),Object(n.d)(s,r),Object(n.d)(i,r),Object(n.d)(a,i),Object(n.d)(l,r),Object(n.d)(u,r),Object(n.u)(b,t,e),Object(n.u)(j,t,e),Object(n.d)(O,j),Object(n.u)(f,t,e),Object(n.u)(d,t,e),Object(n.d)(h,d),Object(n.u)(g,t,e),Object(n.u)(w,t,e),Object(n.d)(p,w),Object(n.u)(v,t,e),Object(n.u)(y,t,e),Object(n.d)(S,y),Object(n.d)(m,S)},p:n.v,d(t){t&&(Object(n.p)(c),Object(n.p)(o),Object(n.p)(b),Object(n.p)(j),Object(n.p)(f),Object(n.p)(d),Object(n.p)(g),Object(n.p)(w)),Object(n.z)(w,"click",C),t&&(Object(n.p)(v),Object(n.p)(y))}}}(this,this._state),t.target){var e=Object(n.i)(t.target);t.hydrate?this._fragment.l(e):this._fragment.c(),e.forEach(n.p),this._mount(t.target,t.anchor)}}Object(n.e)(r.prototype,n.x),Object(n.e)(r.prototype,o),e.default=r}}]);