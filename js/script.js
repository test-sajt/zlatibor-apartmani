/* ==========================================================================
   Zlatibor Apartmani - skripta
   Prevod SR/EN, navigacija, hero efekti, prikaz smestaja, galerija sa
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
h1a:"Luxury apartments",h1b:"in the heart of Zlatibor",
lead:"Leather beds, warm wood interiors, a private garage and a Wellness & Spa centre right in the building. The lake is only 3–5 minutes away.",
c1:"3–5 min to the lake",c2:"Wellness & Spa on site",c3:"Private garage",b1:"Send inquiry",b2:"View gallery",
f1:"guests",f2:"bedrooms",f3:"garage space",
a_eye:"About us",a_h:"A home away from home, close to the lake",
a_p:"Zlatibor Apartmani offers modern apartments for families and groups who want a proper mountain break. We chose every detail, from the leather headboard to the warm lighting, so you feel like you are in a small boutique hotel, with the space and privacy of a whole flat.",
a1t:"3–5 min to the lake",a1p:"Krfska 17 puts you at Lake Zlatibor within minutes, and a warm apartment waits for you after your walk.",
a2t:"Wellness & Spa on site",a2p:"A sauna and a pool inside the building, no need to step outside. Perfect for mountain evenings.",
a3t:"Private garage parking",a3p:"Your car stays under cover and safe, with no hunting for a space in high season.",
a4t:"Modern interior",a4p:"Leather beds, wooden details, warm lighting and a fully equipped kitchen.",
s_eye:"Accommodation",s_h:"Apartments for families and groups",
apt_word:"Apartment",ph_soon:"Photo coming soon",cap1:"A leather bed, mirrors and warm lighting for restful sleep.",cap2:"A round table and leather chairs for shared meals.",cap3:"A fully equipped kitchen with built-in appliances.",cap4:"Leather seating, plants and natural light.",
cap5:"A comfortable bedroom for a restful break.",cap6:"Space for shared meals.",cap7:"An equipped kitchen with everything you need.",cap8:"A living room for relaxing together.",
t1:"Bedroom",t2:"Dining",t3:"Kitchen",t4:"Living room",
sp1:"Capacity",v1:"guests",sp2:"Bedrooms",sp3:"Bathroom",sp4:"Garage",v4:"1 space",sp5:"Address",
am2:"Private garage",am3:"Equipped kitchen",am4:"Leather beds",am5:"Living room with TV",am6:"Balcony",
s_note:"Capacity and layout depend on the apartment. Message us and we will suggest the best fit.",s_btn:"Check availability",
g_eye:"Gallery",g_h:"See what a stay looks like",
gc1:"Bedroom",gc2:"Bed and mirrors",gc3:"Dining",gc4:"Kitchen",gc5:"Living room",gc6:"Lounge",gc7:"Balcony",
w_h:"Relaxation without leaving the building",w_p:"After a walk around the lake or a day in the mountains, the sauna and the pool are a short way from your apartment.",
w1:"Sauna",w2:"Pool",w3:"On site, at the same address",w_note:"Opening hours and terms of use: ask us when booking.",
l_eye:"Location",l_h:"Close to the lake",l_p:"The apartments are at Krfska 17 in Zlatibor. The lake is 3–5 minutes away.",l_btn:"Open in Google Maps",l_lake:"Lake · 3–5 min",
i_p:"Photos and videos of the apartments, plus guest reviews in the “Reviews” highlights, are on our profile.",i_btn:"Open Instagram",i_f:"followers",i_o:"posts",
k_eye:"Contact",k_h:"Ask about your dates",k_p:"Tell us your dates and number of guests, and we will reply with available apartments and the price.",
k_phone:"Phone",k_mail:"Email",k_addr:"Address",
fl_name:"Full name",fl_phone:"Phone",fl_in:"Check-in",fl_out:"Check-out",fl_g:"Guests",fl_msg:"Message (optional)",ph_msg:"E.g. we are coming with a child and need parking.",fl_btn:"Prepare inquiry",
o_ready:"Your inquiry is ready. Choose how to send it to us.",o_mail:"Email",o_copy:"Copy message",
ft_p:"Luxury apartments with a Wellness & Spa centre in Zlatibor.",d1:"Call",d3:"Inquiry"
};
var SR={},SRPH={},lang='sr';
$$('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n'); if(!(k in SR)) SR[k]=el.innerHTML;});
$$('[data-i18n-ph]').forEach(function(el){SRPH[el.getAttribute('data-i18n-ph')]=el.getAttribute('placeholder');});
var MSG={
 sr:{err:"Izaberite datum odlaska posle datuma dolaska.",copied:"Kopirano",nights:["noćenje","noćenja","noćenja"],
  hello:"Poštovani, zanima me smeštaj u Zlatibor Apartmanima.",name:"Ime",phone:"Telefon",ci:"Dolazak",co:"Odlazak",gu:"Broj gostiju",nt:"Broj noćenja",note:"Napomena",thx:"Hvala unapred!",sub:"Upit za smeštaj"},
 en:{err:"Pick a check-out date after check-in.",copied:"Copied",nights:["night","nights","nights"],
  hello:"Hello, I am interested in staying at Zlatibor Apartmani.",name:"Name",phone:"Phone",ci:"Check-in",co:"Check-out",gu:"Guests",nt:"Nights",note:"Note",thx:"Thank you in advance!",sub:"Accommodation inquiry"}
};
function setLang(l){
  lang=l; document.documentElement.setAttribute('data-lang',l); document.documentElement.lang=(l==='en'?'en':'sr-Latn');
  $$('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n'); var v=(l==='en'&&(k in EN))?EN[k]:SR[k]; if(v!=null) el.innerHTML=v;});
  $$('[data-i18n-ph]').forEach(function(el){var k=el.getAttribute('data-i18n-ph'); el.setAttribute('placeholder',(l==='en'&&EN[k])?EN[k]:SRPH[k]);});
  store.set('za-lang',l); counters(true); if(!$('#out').hidden) build(true); updNights(); syncLb();
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
function menu(open){nav.classList.toggle('open',open);burger.setAttribute('aria-expanded',open?'true':'false')}
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
if(fine&&!reduce){
  var cg=$('#cg'),cx=-999,cy=-999,tx=-999,ty=-999,run=false;
  window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;cg.style.opacity=1;if(!run){run=true;requestAnimationFrame(loop)}
    var hero=$('.hero').getBoundingClientRect();
    if(e.clientY<hero.bottom&&e.clientY>hero.top&&strips){strips.style.setProperty('--mx',((e.clientX/window.innerWidth)-.5)*2);strips.style.setProperty('--my',((e.clientY-hero.top)/hero.height-.5)*2);}
  },{passive:true});
  function loop(){cx+=(tx-cx)*.14;cy+=(ty-cy)*.14;cg.style.transform='translate3d('+cx+'px,'+cy+'px,0)';
    if(Math.abs(tx-cx)>.5||Math.abs(ty-cy)>.5)requestAnimationFrame(loop);else run=false;}
  document.addEventListener('mouseleave',function(){cg.style.opacity=0});
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
  var c=$('#dust'); if(!c||!c.getContext) return; var ctx=c.getContext('2d'),dpr=Math.min(window.devicePixelRatio||1,2),W=0,H=0,P=[],on=true,raf=0;
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

/* ---------- stars in the location art ---------- */
(function(){var gEl=$('#stars'); if(!gEl) return; var s=7,h='';function r(){s=(s*9301+49297)%233280;return s/233280}
  for(var i=0;i<46;i++){h+='<circle class="star" cx="'+(r()*640).toFixed(0)+'" cy="'+(r()*190).toFixed(0)+'" r="'+(r()*1.1+.4).toFixed(1)+'" fill="#f4dca2" style="animation-delay:'+(-r()*4).toFixed(1)+'s"/>'}
  gEl.innerHTML=h;})();

/* ---------- stay viewer (svaki apartman ima svoj prikaz) ---------- */
$$('.apt').forEach(function(apt){
  var figs=$$('.viewer figure',apt),tabs=$$('.tabs .tab',apt),v=$('.viewer',apt),cur=0,timer=null;
  function show(i){cur=i;figs.forEach(function(f,j){f.classList.toggle('on',j===i)});tabs.forEach(function(t,j){t.setAttribute('aria-selected',j===i?'true':'false')})}
  tabs.forEach(function(t,i){t.addEventListener('click',function(){stop();show(i)})});
  function stop(){if(timer){clearInterval(timer);timer=null}}
  function start(){if(reduce||timer)return;timer=setInterval(function(){show((cur+1)%figs.length)},5200)}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){es[0].isIntersecting?start():stop()},{threshold:.4}).observe(v)}
  v.addEventListener('pointerdown',stop);
});

/* ---------- lightbox ---------- */
var items=$$('#gal .g'),lb=$('#lb'),lbImg=$('#lb-img'),lbCap=$('#lb-cap'),li=0,lastFocus=null;
function syncLb(){if(lb.hidden)return;lbCap.textContent=items[li].querySelector('span').textContent}
function openLb(i){li=(i+items.length)%items.length;var im=items[li].querySelector('img');lbImg.src=im.currentSrc||im.src;lbImg.alt=im.alt;syncLb();
  if(lb.hidden){lastFocus=document.activeElement;lb.hidden=false;requestAnimationFrame(function(){lb.classList.add('show')});document.body.style.overflow='hidden';$('.x',lb).focus()}}
function closeLb(){lb.classList.remove('show');document.body.style.overflow='';setTimeout(function(){lb.hidden=true},380);if(lastFocus)lastFocus.focus()}
items.forEach(function(b,i){b.addEventListener('click',function(){openLb(i)})});
$('.x',lb).addEventListener('click',closeLb);$('.pv',lb).addEventListener('click',function(){openLb(li-1)});$('.nx',lb).addEventListener('click',function(){openLb(li+1)});
lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')openLb(li-1);if(e.key==='ArrowRight')openLb(li+1)});
var sx0=null;lb.addEventListener('pointerdown',function(e){sx0=e.clientX});
lb.addEventListener('pointerup',function(e){if(sx0===null)return;var d=e.clientX-sx0;sx0=null;if(Math.abs(d)>50)openLb(li+(d<0?1:-1))});

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
  $('#o-wa').href='https://wa.me/381653294507?text='+encodeURIComponent(msg);
  $('#o-mail').href='mailto:zlatiborapartmani06@gmail.com?subject='+encodeURIComponent(M.sub)+'&body='+encodeURIComponent(msg);
  var was=outEl.hidden;outEl.hidden=false;if(was&&!quiet)outEl.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
}
$('#inq').addEventListener('submit',function(e){e.preventDefault();build(false)});
$('#o-copy').addEventListener('click',function(){var t=$('#msg-out');copyText(t.value,t)});

/* init */
var saved=store.get('za-lang');setLang(saved==='en'?'en':'sr');
})();
