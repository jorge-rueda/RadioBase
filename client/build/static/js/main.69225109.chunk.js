(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{12:function(e,t,a){e.exports=a(30)},21:function(e,t,a){},22:function(e,t,a){},30:function(e,t,a){"use strict";a.r(t);var n=a(3),r=a.n(n),c=a(11),l=a.n(c),o=(a(21),a(32)),s=(a(22),a(9)),m=a(8);var i=()=>{const[e,t]=Object(n.useState)([]),[a,c]=Object(n.useState)(""),l=Object(n.useRef)(null);Object(n.useEffect)(()=>{i(a)},[a]);const i=e=>{o.a.get("http://localhost:3000/api/radiobases",{params:{searchTerm:e}}).then(e=>t(e.data)).catch(e=>console.error("Error fetching data:",e))},u=e.length?Object.keys(e[0].traffic):[],h=e=>{const t=l.current;"left"===e?t.scrollBy({left:-200,behavior:"smooth"}):"right"===e&&t.scrollBy({left:200,behavior:"smooth"})};return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"navbar"},r.a.createElement("div",{className:"navbar-container"},r.a.createElement("h1",null,"Gerencia Corporativa de Ingenier\xeda y Planeaci\xf3n de RAN"),r.a.createElement("nav",null,r.a.createElement("img",{src:"/images/logo.png",className:"logo",alt:"Logo"})))),r.a.createElement("div",{className:"search-container"},r.a.createElement("div",{className:"search-box"},r.a.createElement("input",{type:"text",placeholder:"Buscar por radiobase...",value:a,onChange:e=>{c(e.target.value)},className:"search-input"}),r.a.createElement("button",{className:"search-button"},r.a.createElement(s.a,{icon:m.c})))),r.a.createElement("div",{className:"table-wrapper"},r.a.createElement("div",{className:"carousel-controls"},r.a.createElement("button",{onClick:()=>h("left"),className:"carousel-button"},r.a.createElement(s.a,{icon:m.a})),r.a.createElement("button",{onClick:()=>h("right"),className:"carousel-button"},r.a.createElement(s.a,{icon:m.b}))),r.a.createElement("div",{className:"table-container",ref:l},r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Radiobases"),u.map(e=>r.a.createElement("th",{key:e},(e=>{try{const t=new Date(e),a={weekday:"short",month:"short",day:"2-digit",year:"numeric"};return t.toLocaleDateString("es-MX",a)}catch(t){return console.error("Error formatting date:",t),e}})(e))))),r.a.createElement("tbody",null,e.map(e=>r.a.createElement("tr",{key:e.name},r.a.createElement("td",null,e.name),u.map(t=>{return r.a.createElement("td",{key:t,className:(a=e.traffic[t],void 0===a?"grey":a<=15?"red":a>15&&a<=40?"orange":a>40&&a<=90?"yellow":a>90?"green":void 0)},e.traffic[t]||"");var a}))))))))};var u=e=>{e&&e instanceof Function&&a.e(3).then(a.bind(null,33)).then(t=>{let{getCLS:a,getFID:n,getFCP:r,getLCP:c,getTTFB:l}=t;a(e),n(e),r(e),c(e),l(e)})};l.a.createRoot(document.getElementById("root")).render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(i,null))),u()}},[[12,1,2]]]);
//# sourceMappingURL=main.69225109.chunk.js.map