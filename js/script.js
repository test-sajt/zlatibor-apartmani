/* ==========================================================================
   Tomi Lux Zlatibor - skripta
   Prevod SR/EN, navigacija, hero efekti, prikaz apartmana, galerija sa
   lightbox-om, brojaci, kopiranje i formular za upit.
   ========================================================================== */
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

/* ---------- i18n ---------- */
var EN={
n_about:"About",n_stay:"Stay",n_gallery:"Gallery",n_loc:"Location",n_contact:"Contact",n_cta:"Send inquiry",
h1a:"Tomi Lux apartment",h1b:"in Zlatibor",
lead:"A 4-star apartment for up to 4 guests, with Wellness & Spa, parking and Wi-Fi. To book, message us on Instagram.",
c1:"4-star apartment",b1:"Send inquiry",b2:"View the apartment",
f1:"rating",f2:"guests",f3:"bookings",
a_eye:"About us",a_h:"Comfortable stay in Zlatibor",
a_p:"Tomi Lux is a 4-star apartment at Hajdučka 2b in Zlatibor, for up to 4 guests. Wellness & Spa, parking and Wi-Fi are included in the offer, and we take bookings through Instagram messages.",
a1t:"4-star apartment",a1p:"Accommodation rated 4 stars, at Hajdučka 2b.",
a2p:"Wellness & Spa is part of the Tomi Lux offer.",a3p:"Parking is available to apartment guests.",a4p:"Wi-Fi internet in the apartment.",
s_eye:"Accommodation",s_h:"Tomi Lux apartment",ph_soon:"Photo coming soon",
sp1:"Capacity",v1:"guests",sp2:"Rating",sp3:"Address",sp4:"Bookings",
s_note:"For free dates and the price, send an inquiry or message us on Instagram.",s_btn:"Check availability",
g_eye:"Gallery",g_h:"See the apartment",
w_h:"Relaxation in Zlatibor",w_p:"Wellness & Spa is part of the Tomi Lux offer.",w_note:"Opening hours and terms of use: ask us when booking.",
l_eye:"Location",l_h:"Hajdučka 2b",l_p:"The Tomi Lux apartment is at Hajdučka 2b in Zlatibor.",l_btn:"Open in Google Maps",
i_p:"Photos of the apartment and news are on our Instagram profile. We also take bookings by direct message.",i_btn:"Open Instagram",i_f:"followers",i_o:"posts",i_g:"following",
k_eye:"Contact",k_h:"Ask about your dates",k_p:"Tell us your dates and number of guests and we will reply. You can also call us or message us on Instagram.",
k_phone:"Phone",k_addr:"Address",
fl_name:"Full name",fl_phone:"Phone",fl_in:"Check-in",fl_out:"Check-out",fl_g:"Guests",fl_msg:"Message (optional)",ph_msg:"E.g. we are coming with a child and need parking.",fl_btn:"Prepare inquiry",
o_ready:"Your inquiry is ready. Choose how to send it to us.",o_copy:"Copy message",o_hint:"For Instagram: the message is copied, then paste it into the chat.",
ft_p:"A 4-star apartment with Wellness & Spa in Zlatibor.",d1:"Call",d3:"Inquiry",g_vid:"Video tour",vid_soon:"Video coming soon"
};
var SR={},SRPH={},lang='sr',T_SR=document.title,T_EN='Tomi Lux Apartment Zlatibor – Hajdučka 2b, 4-star stay';
$$('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n'); if(!(k in SR)) SR[k]=el.innerHTML;});
$$('[data-i18n-ph]').forEach(function(el){SRPH[el.getAttribute('data-i18n-ph')]=el.getAttribute('placeholder');});
var MSG={
 sr:{err:"Izaberite datum odlaska posle datuma dolaska.",copied:"Kopirano",nights:["noćenje","noćenja","noćenja"],
  hello:"Poštovani, zanima me smeštaj u apartmanu Tomi Lux.",name:"Ime",phone:"Telefon",ci:"Dolazak",co:"Odlazak",gu:"Broj gostiju",nt:"Broj noćenja",note:"Napomena",thx:"Hvala unapred!"},
 en:{err:"Pick a check-out date after check-in.",copied:"Copied",nights:["night","nights","nights"],
  hello:"Hello, I am interested in staying at the Tomi Lux apartment.",name:"Name",phone:"Phone",ci:"Check-in",co:"Check-out",gu:"Guests",nt:"Nights",note:"Note",thx:"Thank you in advance!"}
};
function setLang(l){
  lang=l; document.title=(l==='en'?T_EN:T_SR); document.documentElement.setAttribute('data-lang',l); document.documentElement.lang=(l==='en'?'en':'sr-Latn');
  $$('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n'); var v=(l==='en'&&(k in EN))?EN[k]:SR[k]; if(v!=null) el.innerHTML=v;});
  $$('[data-i18n-ph]').forEach(function(el){var k=el.getAttribute('data-i18n-ph'); el.setAttribute('placeholder',(l==='en'&&EN[k])?EN[k]:SRPH[k]);});
  store.set('tl-lang',l); counters(true); if(!$('#out').hidden) build(true); updNights();
}
$('#lang').addEventListener('click',function(){setLang(lang==='sr'?'en':'sr')});

/* ---------- nav ---------- */
var nav=$('#nav'),prog=$('#progress'),strips=$('#strips'),ticking=false;
function onScroll(){
  var y=window.scrollY||0,h=document.documentElement.scrollHeight-window.innerHeight;
  nav.classList.toggle('scrolled',y>12);
  prog.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
  if(strips&&!reduce&&window.innerWidth>900) strips.style.setProperty('--sy',(Math.min(y,900)*-.06).toFixed(1)+'px');
  ticking=false;
}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();
var burger=$('#burger');
function menu(open){nav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);burger.setAttribute('aria-expanded',open?'true':'false')}
burger.addEventListener('click',function(){menu(!nav.classList.contains('open'))});
document.addEventListener('keydown',function(e){if(e.key==='Escape')menu(false)});
$$('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){
  var id=a.getAttribute('href').slice(1); var t=id==='top'?document.body:document.getElementById(id);
  if(!t) return; e.preventDefault(); menu(false);
  if(id==='top') window.scrollTo({top:0,behavior:reduce?'auto':'smooth'}); else t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
});});
if('IntersectionObserver' in window){
  var spy=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){
    $$('.links a').forEach(function(a){a.classList.toggle('act',a.getAttribute('data-sec')===en.target.id)});}});},{rootMargin:'-45% 0px -50% 0px'});
  ['about','stay','gallery','wellness','location','contact'].forEach(function(id){var s=document.getElementById(id); if(s) spy.observe(s)});
}

/* ---------- reveal ---------- */
if('IntersectionObserver' in window){
  var rv=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var t=en.target;t.classList.add('in');rv.unobserve(t);setTimeout(function(){t.classList.remove('rv','in','d1','d2','d3')},1500)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $$('.rv').forEach(function(el){rv.observe(el)});
}else{$$('.rv').forEach(function(el){el.classList.add('in')})}

/* ---------- pointer effects ---------- */
var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
if(fine&&!reduce&&strips){
  window.addEventListener('pointermove',function(e){var hero=$('.hero').getBoundingClientRect();
    if(e.clientY<hero.bottom&&e.clientY>hero.top){strips.style.setProperty('--mx',((e.clientX/window.innerWidth)-.5)*2);strips.style.setProperty('--my',((e.clientY-hero.top)/hero.height-.5)*2);}
  },{passive:true});
}
$$('.spot').forEach(function(el){
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx2',(e.clientX-r.left)+'px');el.style.setProperty('--my2',(e.clientY-r.top)+'px');},{passive:true});
});
$$('.btn-gold,.btn-ghost').forEach(function(b){ if(!fine||reduce) return;
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.12).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.2).toFixed(1)+'px';});
  b.addEventListener('pointerleave',function(){b.style.translate=''});
});

/* ---------- gold dust ---------- */
(function(){
  var c=$('#dust'); if(!c||!c.getContext||!fine) return; var ctx=c.getContext('2d'),dpr=Math.min(window.devicePixelRatio||1,2),W=0,H=0,P=[],on=true,raf=0;
  var sp=document.createElement('canvas');sp.width=sp.height=32;var sx=sp.getContext('2d');var g=sx.createRadialGradient(16,16,0,16,16,16);
  g.addColorStop(0,'rgba(255,238,196,1)');g.addColorStop(.25,'rgba(244,220,162,.55)');g.addColorStop(1,'rgba(212,173,99,0)');sx.fillStyle=g;sx.fillRect(0,0,32,32);
  function mk(init){return{x:Math.random()*W,y:init?Math.random()*H:H+12,r:Math.random()*4.5+2,vy:-(Math.random()*.28+.08),vx:(Math.random()-.5)*.12,a:Math.random()*.6+.2,ph:Math.random()*6.28,s:Math.random()*.02+.006}}
  function size(){var r=c.getBoundingClientRect();W=r.width;H=r.height;c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);var n=Math.round(Math.min(64,Math.max(24,W/20)));P=[];for(var i=0;i<n;i++)P.push(mk(true));draw()}
  function draw(){ctx.clearRect(0,0,W,H);for(var i=0;i<P.length;i++){var p=P[i];p.y+=p.vy;p.ph+=p.s;p.x+=p.vx+Math.sin(p.ph)*.18;if(p.y<-14){P[i]=mk(false);continue}
    ctx.globalAlpha=p.a*(.6+.4*Math.sin(p.ph*2));ctx.drawImage(sp,p.x-p.r*2,p.y-p.r*2,p.r*4,p.r*4)}ctx.globalAlpha=1}
  function tick(){if(on&&!document.hidden){draw();raf=requestAnimationFrame(tick)}else raf=0}
  size();
  if(!reduce){raf=requestAnimationFrame(tick);
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){on=es[0].isIntersecting;if(on&&!raf)raf=requestAnimationFrame(tick)}).observe(c);
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&on&&!raf)raf=requestAnimationFrame(tick)});}
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(size,200)});
})();

/* ---------- stay viewer: 5 fotografija, strelice + prevlacenje ---------- */
(function(){
  var v=$('#viewer'); if(!v) return;
  var tr=$('.track',v),n=$$('figure',tr).length,dots=$$('.dot'),cnt=$('.vcount',v),cur=0,raf=0;
  function mark(){dots.forEach(function(t,k){t.setAttribute('aria-selected',k===cur?'true':'false')});cnt.textContent=(cur+1)+' / '+n}
  function go(i){cur=(i+n)%n;tr.scrollTo({left:cur*tr.clientWidth,behavior:reduce?'auto':'smooth'});mark()}
  tr.addEventListener('scroll',function(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){var i=Math.round(tr.scrollLeft/tr.clientWidth);if(i!==cur&&i>=0&&i<n){cur=i;mark()}})},{passive:true});
  $('.pv',v).addEventListener('click',function(){go(cur-1)});
  $('.nx',v).addEventListener('click',function(){go(cur+1)});
  dots.forEach(function(t,k){t.addEventListener('click',function(){go(k)})});
  v.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}if(e.key==='ArrowRight'){e.preventDefault();go(cur+1)}});
  window.addEventListener('resize',function(){tr.scrollTo({left:cur*tr.clientWidth,behavior:'auto'})});
  /* dok nema fotografija, nema ni strelica ni tackica */
  window.addEventListener('load',function(){if($$('img',tr).length)return;$$('.vnav,.vcount,.dots').forEach(function(x){x.hidden=true})});
})();

/* ---------- galerija video: autoplay samo dok je video na ekranu ---------- */
(function(){
  var vs=$$('#vids .vid video'); if(!vs.length) return;
  var conn=navigator.connection||{},still=reduce||conn.saveData;
  function load(v){if(!v.getAttribute('src')&&v.getAttribute('data-src')){v.src=v.getAttribute('data-src');v.load()}}
  vs.forEach(function(v){
    var box=v.parentNode;
    v.addEventListener('playing',function(){box.classList.add('ok')});
    v.addEventListener('loadeddata',function(){if(still)box.classList.add('ok')});
    v.addEventListener('error',function(){box.classList.remove('ok');v.removeAttribute('src')});
    v.addEventListener('click',function(){if(!v.getAttribute('src'))return;if(v.paused){v._m=false;v.play().catch(function(){})}else{v._m=true;v.pause()}});
    if(still){v.controls=true;v.preload='metadata'}
  });
  if(!('IntersectionObserver' in window)) return;
  var near=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){load(en.target);near.unobserve(en.target)}})},{rootMargin:'300px 0px'});
  var seen=new IntersectionObserver(function(es){es.forEach(function(en){var v=en.target;
    if(en.isIntersecting&&!still){load(v);if(!v._m&&v.paused&&v.getAttribute('src'))v.play().catch(function(){})}
    else if(!en.isIntersecting&&!v.paused)v.pause()})},{threshold:.45});
  vs.forEach(function(v){near.observe(v);seen.observe(v)});
})();

/* ---------- lightbox ---------- */
var items=$$('#gal .g'),lb=$('#lb'),lbImg=$('#lb-img'),lbCap=$('#lb-cap'),li=0,lastFocus=null;
function lbShape(im){var r=imgRatio(im);if(r)lbImg.style.setProperty('--r',clampN(r,.3,4).toFixed(3))}
lbImg.addEventListener('load',function(){lbShape(lbImg)});
function avail(){return items.filter(function(b){return b.querySelector('img')})}
function syncLb(){if(lb.hidden)return;var list=avail();if(list[li])lbCap.textContent=list[li].querySelector('span').textContent}
function openLb(i){var list=avail();if(!list.length)return;li=(i+list.length)%list.length;var im=list[li].querySelector('img');lbShape(im);lbImg.src=im.currentSrc||im.src;lbImg.alt=im.alt;syncLb();
  if(lb.hidden){lastFocus=document.activeElement;lb.hidden=false;requestAnimationFrame(function(){lb.classList.add('show')});document.body.style.overflow='hidden';$('.x',lb).focus()}}
function closeLb(){lb.classList.remove('show');document.body.style.overflow='';setTimeout(function(){lb.hidden=true},380);if(lastFocus)lastFocus.focus()}
items.forEach(function(b){b.addEventListener('click',function(){var idx=avail().indexOf(b);if(idx>-1)openLb(idx)})});
$('.x',lb).addEventListener('click',closeLb);$('.pv',lb).addEventListener('click',function(){openLb(li-1)});$('.nx',lb).addEventListener('click',function(){openLb(li+1)});
lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')openLb(li-1);if(e.key==='ArrowRight')openLb(li+1)});
var sx0=null;lb.addEventListener('pointerdown',function(e){sx0=e.clientX});
lb.addEventListener('pointerup',function(e){if(sx0===null)return;var d=e.clientX-sx0;sx0=null;if(Math.abs(d)>50)openLb(li+(d<0?1:-1))});

/* ==========================================================================
   Pametni okviri za fotografije
   Okviri citaju stvarnu sirinu i visinu svake fotografije i prilagodjavaju se njoj:
   - prikaz apartmana: okvir dobija oblik koji odgovara vecini fotografija, a fotografija
     koja se u njega ne uklapa prikaze se cela preko zamucene pozadine (bez secenja)
   - galerija: fotografije se slazu u redove, svaka zadrzava svoj oblik
   - lightbox: okvir prati oblik fotografije
   - hero trake: duzina trake prati oblik fotografije
   ========================================================================== */
function imgRatio(im){return im&&im.naturalWidth&&im.naturalHeight?im.naturalWidth/im.naturalHeight:0}
function clampN(x,a,b){return Math.min(b,Math.max(a,x))}
/* pozovi cb cim je poznata velicina slike (odmah ako je vec ucitana) */
function whenSized(im,cb){if(!im)return;if(imgRatio(im))cb();else im.addEventListener('load',cb)}

/* ---------- pametni okvir: prikaz apartmana ---------- */
(function(){
  var v=$('#viewer'); if(!v) return;
  var figs=$$('.track figure',v),raf=0;
  function fit(){
    raf=0;
    var rs=[];
    figs.forEach(function(f){var r=imgRatio($('img',f)); if(r) rs.push(r)});
    if(!rs.length) return;
    rs.sort(function(a,b){return a-b});
    /* oblik okvira = srednji oblik svih fotografija, u razumnim granicama */
    var mid=(rs[Math.floor((rs.length-1)/2)]+rs[Math.ceil((rs.length-1)/2)])/2;
    var narrow=window.innerWidth<=600;
    var fr=Math.round(clampN(mid,narrow?1:1.15,narrow?1.4:1.6)*100)/100;
    v.style.setProperty('--vr',fr);
    figs.forEach(function(f){
      var im=$('img',f),r=imgRatio(im); if(!r) return;
      /* koliki deo slike bi ostao vidljiv kad bi se secila da popuni okvir */
      var shown=Math.min(r/fr,fr/r);
      f.setAttribute('data-fit',shown>=.8?'cover':'contain');
      f.style.setProperty('--bg','url("'+(im.currentSrc||im.src).replace(/"/g,'%22')+'")');
    });
  }
  function sched(){if(!raf) raf=requestAnimationFrame(fit)}
  figs.forEach(function(f){whenSized($('img',f),sched)});
  window.addEventListener('resize',sched);
})();

/* ---------- pametni okvir: galerija ---------- */
(function(){
  var gal=$('#gal'); if(!gal) return;
  var tiles=$$('.g',gal),GAP=12,rowEls=[],sig='',lastW=0,raf=0;
  tiles.forEach(function(t){t._r=1.5}); /* dok se slika ne ucita, pretpostavi pejzaz */

  /* najbolji raspored u redove: svaki red puni celu sirinu, a visine redova
     su sto blize zeljenoj visini (dinamicko programiranje, redosled se ne menja) */
  function partition(rs,W,T){
    var n=rs.length,best=[0],cut=[0],i,j,sum,h,c;
    for(j=1;j<=n;j++){
      best[j]=Infinity;sum=0;
      for(i=j-1;i>=0;i--){
        sum+=rs[i];h=(W-GAP*(j-i-1))/sum; if(h<=0) break;
        c=Math.pow(Math.log(h/T),2);
        if(best[i]+c<best[j]){best[j]=best[i]+c;cut[j]=i}
      }
    }
    var parts=[];j=n;while(j>0){parts.unshift([cut[j],j]);j=cut[j]}
    return parts;
  }

  function layout(){
    raf=0;
    var W=gal.clientWidth; if(!W) return;
    lastW=W;
    var list=[];
    tiles.forEach(function(t){var has=!!$('img',t);t.classList.toggle('is-empty',!has);if(has) list.push(t)});
    if(!list.length) return;
    var T=W<600?clampN(W*.6,210,300):clampN(W/3.6,180,360),maxH=T*1.6; /* telefon: veće fotografije, 1-2 u redu */
    var rs=list.map(function(t){return clampN(t._r,.6,2.2)});
    var parts=partition(rs,W,T);
    var nsig=parts.map(function(p){return p.join('-')}).join('|')+'#'+list.length;
    if(nsig!==sig){
      sig=nsig;
      while(rowEls.length<parts.length){var d=document.createElement('div');d.className='gal-row';gal.appendChild(d);rowEls.push(d)}
      parts.forEach(function(p,k){for(var q=p[0];q<p[1];q++) rowEls[k].appendChild(list[q])});
      while(rowEls.length>parts.length) gal.removeChild(rowEls.pop());
    }
    gal.classList.add('is-ready');
    parts.forEach(function(p,k){
      var sum=0,cnt=p[1]-p[0],q;
      for(q=p[0];q<p[1];q++){sum+=rs[q];list[q].style.setProperty('--ar',rs[q].toFixed(3))}
      var h=(W-GAP*(cnt-1))/sum,w=W;
      if(h>maxH){h=maxH;w=h*sum+GAP*(cnt-1)} /* premalo slika za pun red: ne razvlacimo ih */
      rowEls[k].style.height=h.toFixed(1)+'px';
      rowEls[k].style.width=w.toFixed(1)+'px';
    });
  }
  function sched(){if(!raf) raf=requestAnimationFrame(layout)}

  tiles.forEach(function(t){whenSized($('img',t),function(){t._r=imgRatio($('img',t));sched()})});
  if('MutationObserver' in window) new MutationObserver(sched).observe(gal,{childList:true,subtree:true}); /* slika koja ne postoji se uklanja */
  if('ResizeObserver' in window) new ResizeObserver(function(){if(gal.clientWidth!==lastW) sched()}).observe(gal);
  else window.addEventListener('resize',sched);
  sched();
})();

/* ---------- pametni okvir: hero trake ---------- */
(function(){
  var st=$$('#strips .strip'); if(!st.length) return;
  var mq=window.matchMedia?matchMedia('(max-width: 900px)'):null;
  function apply(){
    var row=!!(mq&&mq.matches);
    st.forEach(function(s){
      var r=imgRatio($('img',s));
      if(!r){s.style.removeProperty('--fw');return}
      /* uspravne trake: visoka slika dobija vise visine; trake u nizu: siroka slika dobija vise sirine */
      s.style.setProperty('--fw',(row?clampN(r,.8,1.5):clampN(1/r,.8,1.6)).toFixed(2));
    });
  }
  st.forEach(function(s){whenSized($('img',s),apply)});
  if(mq){if(mq.addEventListener) mq.addEventListener('change',apply); else if(mq.addListener) mq.addListener(apply)}
  apply();
})();

/* ---------- logo (slike/logo.png): prikazi ga u pravom obliku; siroki logo zamenjuje ime pored sebe ---------- */
$$('.mono .logo').forEach(function(im){
  whenSized(im,function(){
    var r=imgRatio(im),m=im.parentNode;
    m.classList.add('has-logo');
    if(m.parentNode) m.parentNode.classList.toggle('logo-wide',r>1.5);
  });
});

/* galerija se sakriva dok nema nijedne fotografije u folderu slike/ */
window.addEventListener('load',function(){
  if($$('#gal img').length) return;
  var g=$('#gal');if(g)g.hidden=true;
});

/* ---------- counters ---------- */
var counted=false;
function fmt(n){return n.toLocaleString(lang==='en'?'en-US':'de-DE')}
function counters(force){
  $$('[data-to]').forEach(function(el){var to=+el.getAttribute('data-to'),suf=el.getAttribute('data-suf')||'';
    if(counted||force){if(counted)el.textContent=fmt(to)+suf}});
}
if('IntersectionObserver' in window){
  var cio=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;cio.unobserve(en.target);var el=en.target,to=+el.getAttribute('data-to'),suf=el.getAttribute('data-suf')||'',t0=performance.now(),d=reduce?1:1600;
    (function step(t){var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=fmt(Math.round(to*e))+suf;if(p<1)requestAnimationFrame(step);else counted=true})(t0)})},{threshold:.6});
  $$('[data-to]').forEach(function(el){cio.observe(el)});
}else{counted=true;counters(true)}
/* show final numbers if the observer never fires (static captures) */
setTimeout(function(){if(!counted){$$('[data-to]').forEach(function(el){if(el.textContent==='0')el.textContent=fmt(+el.getAttribute('data-to'))+(el.getAttribute('data-suf')||'')})}},2500);

/* ---------- copy + toast ---------- */
var toastEl=$('#toast'),tt;
function toast(m){toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('show')},1800)}
function copyText(txt,src){
  function fb(){try{var ta=src&&src.tagName==='TEXTAREA'?src:document.createElement('textarea');if(ta!==src){ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta)}ta.select();var ok=document.execCommand('copy');if(ta!==src)document.body.removeChild(ta);if(ok)toast(MSG[lang].copied)}catch(e){}}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){toast(MSG[lang].copied)},fb)}else fb();
}
$$('.cp').forEach(function(b){b.addEventListener('click',function(){copyText(b.getAttribute('data-copy'))})});

/* ---------- inquiry composer ---------- */
var fIn=$('#f-in'),fOut=$('#f-out'),errEl=$('#err'),nightsEl=$('#nights'),outEl=$('#out');
function iso(d){var m=d.getMonth()+1,dd=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(dd<10?'0':'')+dd}
fIn.min=iso(new Date());fOut.min=fIn.min;
fIn.addEventListener('change',function(){if(fIn.value){fOut.min=fIn.value;if(fOut.value&&fOut.value<=fIn.value)fOut.value=''}updNights()});
fOut.addEventListener('change',updNights);
function nCount(){if(!fIn.value||!fOut.value)return 0;return Math.round((new Date(fOut.value)-new Date(fIn.value))/864e5)}
function nWord(n){var w=MSG[lang].nights;if(lang==='en')return n===1?w[0]:w[1];var m10=n%10,m100=n%100;return(m10===1&&m100!==11)?w[0]:w[1]}
function updNights(){var n=nCount();if(n>0){nightsEl.hidden=false;nightsEl.textContent=n+' '+nWord(n)}else nightsEl.hidden=true}
function dmy(v){var p=v.split('-');return p[2]+'.'+p[1]+'.'+p[0]+'.'}
function build(quiet){
  var M=MSG[lang],name=$('#f-name').value.trim(),ph=$('#f-phone').value.trim(),g=$('#f-g').value,note=$('#f-msg').value.trim();
  if(!fIn.value||!fOut.value||nCount()<=0){errEl.hidden=false;errEl.textContent=M.err;outEl.hidden=true;if(!fIn.value)fIn.focus();else fOut.focus();return}
  errEl.hidden=true;
  var L=[M.hello,'',M.name+': '+(name||'—')];if(ph)L.push(M.phone+': '+ph);
  L.push(M.ci+': '+dmy(fIn.value),M.co+': '+dmy(fOut.value),M.nt+': '+nCount(),M.gu+': '+g);if(note)L.push(M.note+': '+note);L.push('',M.thx);
  var msg=L.join('\n');$('#msg-out').value=msg;
  $('#o-sms').href='sms:+38162577682?body='+encodeURIComponent(msg);
  var was=outEl.hidden;outEl.hidden=false;if(was&&!quiet)outEl.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
}
$('#inq').addEventListener('submit',function(e){e.preventDefault();build(false)});
$('#o-copy').addEventListener('click',function(){var t=$('#msg-out');copyText(t.value,t)});
/* Instagram ne prima unapred popunjenu poruku, pa se tekst kopira pre otvaranja razgovora */
$('#o-ig').addEventListener('click',function(){copyText($('#msg-out').value)});

/* init */
var saved=store.get('tl-lang');setLang(saved==='en'?'en':'sr');
})();
