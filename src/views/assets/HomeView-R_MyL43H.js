var E=(y,p,r)=>new Promise((g,u)=>{var x=s=>{try{c(r.next(s))}catch(m){u(m)}},b=s=>{try{c(r.throw(s))}catch(m){u(m)}},c=s=>s.done?g(s.value):Promise.resolve(s.value).then(x,b);c((r=r.apply(y,p)).next())});import{a as V,r as $,C as X,o as _,D as A,E as F,e as k,g as l,F as N,G as q,l as w,p as C,m as M,R as L,f as z,n as H,t as I,q as T}from"./vue-vendors-BgzxvA44.js";import{a as e}from"./anime-DaNXu8ZO.js";import{_ as Q}from"./index-DcgwpPrI.js";import"./socket-CF4wHI2V.js";const G={class:"xyz"},P={class:"page-container bg"},U={class:"floating-symbols-container","aria-hidden":"true"},j={class:"text-center"},J={class:"space-x-4"},K=V({__name:"HomeView",setup(y){const p=$(),r=$([]),g=X([]),u=a=>{a!=null&&a.$el&&r.value.push(a.$el)},x="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),b="的是不在有我他这中来国到说们为和你地出时年得就那要英文语生会自着去之过家学对可里后天多而心见能好起发成如事把经法当作工用同还主行然都面定起现公老动想实再东事字言".split(""),c=x.concat(b),s=()=>c[Math.floor(Math.random()*c.length)],m=()=>{const a=document.createElement("div");a.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  `;const o=document.documentElement.classList.contains("dark");return Array.from({length:40}).forEach(()=>{const t=document.createElement("div"),n=e.random(8,15),i=Math.random()>.5?"96, 165, 250":"225, 29, 72",d=o?[.2,.4]:[.3,.5];t.style.cssText=`
      position: absolute;
      width: ${n}px;
      height: ${n}px;
      background: rgba(${i}, ${e.random(...d)});
      border-radius: 50%;
      filter: blur(${o?3:2}px);
      left: ${e.random(0,100)}%;
      top: ${e.random(0,100)}%;
    `,a.appendChild(t),g.value.push(e({targets:t,translateY:[0,e.random(-250,250)],translateX:[0,e.random(-250,250)],rotate:e.random(-360,360),scale:[1,e.random(.8,1.4)],opacity:[1,e.random(.3,.7)],duration:e.random(6e3,1e4),easing:"easeInOutQuad",loop:!0,delay:e.random(0,3e3),direction:"alternate"}))}),document.body.appendChild(a),a},B=()=>{const a=o=>{const t=document.documentElement.classList.contains("dark"),n=document.createElement("div");n.style.cssText=`
      position: fixed;
      width: 40px;
      height: 40px;
      background: radial-gradient(circle, 
        ${t?"rgba(96, 165, 250, 0.15)":"rgba(96, 165, 250, 0.1)"} 20%,
        ${t?"rgba(225, 29, 72, 0.1)":"rgba(225, 29, 72, 0.05)"} 80%
      );
      border-radius: 50%;
      pointer-events: none;
      left: ${o.clientX-20}px;
      top: ${o.clientY-20}px;
      filter: blur(${t?5:3}px);
      z-index: 1;
    `,document.body.appendChild(n),e({targets:n,scale:2,opacity:0,duration:1e3,easing:"easeOutExpo",complete:()=>n.remove()})};return window.addEventListener("mousemove",a),()=>window.removeEventListener("mousemove",a)};return _(()=>{document.querySelectorAll(".floating-symbol").forEach(o=>{e({targets:o,translateY:[e.random(-800,-1e3),e.random(800,1200)],opacity:[0,.5,0],duration:e.random(5e3,9e3),delay:e.random(0,4e3),easing:"linear",loop:!0})})}),_(()=>E(null,null,function*(){const a=m(),o=B();yield A(),e.timeline({easing:"easeOutExpo"}).add({targets:p.value,scale:[.4,1],opacity:[0,1],duration:800}).add({targets:r.value,translateY:["30px","0"],opacity:[0,1],delay:e.stagger(100),duration:600,elasticity:300},"-=400"),r.value.forEach(t=>{t.addEventListener("mouseenter",n=>{const i=t.classList.contains("language-button-english"),d=document.documentElement.classList.contains("dark"),v=t.getBoundingClientRect(),R=n.clientX-v.left,Y=n.clientY-v.top;e({targets:t,scale:1.1,duration:250,easing:"spring(1, 80, 10, 0)"}),Array.from({length:12},()=>document.createElement("span")).forEach((f,O)=>{const S=i?d?"rgba(96, 165, 250, 0.4), rgba(59, 130, 246, 0.6)":"rgba(96, 165, 250, 0.6), rgba(37, 99, 235, 0.8)":d?"rgba(225, 29, 72, 0.4), rgba(190, 18, 60, 0.6)":"rgba(225, 29, 72, 0.6), rgba(159, 18, 57, 0.8)";f.style.cssText=`
          position: absolute;
          pointer-events: none;
          left: ${R}px;
          top: ${Y}px;
          background: linear-gradient(45deg, ${S});
          width: ${i?"20px":"18px"};
          height: ${i?"20px":"18px"};
          border-radius: ${i?"50%":"4px 8px"};
          mix-blend-mode: ${d?"screen":"normal"};
          z-index: 10;
        `,t.appendChild(f),e({targets:f,translateX:e.random(-60,60),translateY:e.random(-80,-120),rotate:e.random(-180,180),scale:[1,e.random(.5,2)],opacity:[1,0],duration:1200,delay:O*20,easing:"easeOutQuad",complete:()=>f.remove()})});const D=i?d?"rgba(59, 130, 246, 0.15)":"rgba(59, 130, 246, 0.3)":d?"rgba(225, 29, 72, 0.15)":"rgba(225, 29, 72, 0.3)",h=document.createElement("div");h.style.cssText=`
        position: absolute;
        inset: -8px;
        border-radius: 12px;
        filter: blur(20px);
        z-index: -1;
        background: ${D};
        opacity: 0;
      `,t.appendChild(h),e({targets:h,opacity:[0,1],duration:300,easing:"easeOutExpo",complete:()=>h.remove()})}),t.addEventListener("mouseleave",()=>{e({targets:t,scale:1,duration:200})})}),F(()=>{a.remove(),o(),g.value.forEach(t=>t.pause())})})),(a,o)=>(z(),k("div",G,[l("div",P,[l("div",U,[(z(),k(N,null,q(30,t=>l("div",{key:t,class:"floating-symbol",style:H({left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,fontSize:`${Math.random()*1.5+1}rem`})},I(s()),5)),64))]),l("div",j,[l("div",null,[l("h3",{ref_key:"heading",ref:p,class:"heading opacity-0"},"Choose a Language",512)]),l("div",J,[w(M(L),{ref:u,to:"/en/words",class:"language-button language-button-english opacity-0"},{default:C(()=>o[0]||(o[0]=[T("English")])),_:1}),w(M(L),{ref:u,to:"/ch/hanzi",class:"language-button language-button-mandarin opacity-0"},{default:C(()=>o[1]||(o[1]=[T("Mandarin")])),_:1})])])])]))}}),ne=Q(K,[["__scopeId","data-v-9d4a50db"]]);export{ne as default};
