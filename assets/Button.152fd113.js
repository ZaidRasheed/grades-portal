import{r as d,j as p}from"./index.965fb01d.js";import{c as m,u as y}from"./Container.3c6c2f9a.js";const v=["as","disabled"];function B(t,n){if(t==null)return{};var e={},r=Object.keys(t),o,s;for(s=0;s<r.length;s++)o=r[s],!(n.indexOf(o)>=0)&&(e[o]=t[o]);return e}function C(t){return!t||t.trim()==="#"}function P({tagName:t,disabled:n,href:e,target:r,rel:o,role:s,onClick:a,tabIndex:l=0,type:i}){t||(e!=null||r!=null||o!=null?t="a":t="button");const c={tagName:t};if(t==="button")return[{type:i||"button",disabled:n},c];const f=u=>{if((n||t==="a"&&C(e))&&u.preventDefault(),n){u.stopPropagation();return}a==null||a(u)},x=u=>{u.key===" "&&(u.preventDefault(),f(u))};return t==="a"&&(e||(e="#"),n&&(e=void 0)),[{role:s!=null?s:"button",disabled:void 0,tabIndex:n?void 0:l,href:e,target:t==="a"?r:void 0,"aria-disabled":n||void 0,rel:t==="a"?o:void 0,onClick:f,onKeyDown:x},c]}const j=d.exports.forwardRef((t,n)=>{let{as:e,disabled:r}=t,o=B(t,v);const[s,{tagName:a}]=P(Object.assign({tagName:e,disabled:r},o));return p(a,Object.assign({},o,s,{ref:n}))});j.displayName="Button";const R=t=>d.exports.forwardRef((n,e)=>p("div",{...n,ref:e,className:m(n.className,t)}));var w=/-(.)/g;function $(t){return t.replace(w,function(n,e){return e.toUpperCase()})}const N=t=>t[0].toUpperCase()+$(t).slice(1);function K(t,{displayName:n=N(t),Component:e,defaultProps:r}={}){const o=d.exports.forwardRef(({className:s,bsPrefix:a,as:l=e||"div",...i},c)=>{const f=y(a,t);return p(l,{ref:c,className:m(s,f),...i})});return o.defaultProps=r,o.displayName=n,o}const k={variant:"primary",active:!1,disabled:!1},b=d.exports.forwardRef(({as:t,bsPrefix:n,variant:e,size:r,active:o,className:s,...a},l)=>{const i=y(n,"btn"),[c,{tagName:f}]=P({tagName:t,...a});return p(f,{...c,...a,ref:l,className:m(s,i,o&&"active",e&&`${i}-${e}`,r&&`${i}-${r}`,a.href&&a.disabled&&"disabled")})});b.displayName="Button";b.defaultProps=k;const W=b;export{W as B,j as a,K as c,R as d,P as u};
