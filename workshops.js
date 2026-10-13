(function(){

var SITE=window.ANGILA_SITE||{

  waPhone:'',

  waDefault:'Hi Angela-Maria, I\'d like to book a private session.',

  igHandle:''

};

function waLink(msg){

  var m=msg||SITE.waDefault;

  if(!SITE.waPhone){

    var c=document.getElementById('contact');

    if(c&&!msg)return '#contact';

  }

  var base=SITE.waPhone?'https://wa.me/'+String(SITE.waPhone).replace(/\D/g,''):'https://wa.me/';

  return base+'?text='+encodeURIComponent(m);

}

function igLink(){

  return SITE.igHandle?'https://instagram.com/'+String(SITE.igHandle).replace(/^@/,''):'https://instagram.com/';

}

document.querySelectorAll('[data-contact="wa"]').forEach(function(a){

  a.href=waLink(a.getAttribute('data-wa-msg'));

  a.setAttribute('rel','noopener');

  if(a.getAttribute('href').indexOf('http')===0)a.setAttribute('target','_blank');

});

document.querySelectorAll('[data-contact="ig"]').forEach(function(a){

  a.href=igLink();

  a.setAttribute('rel','noopener noreferrer');

  a.setAttribute('target','_blank');

});

var nav=document.getElementById('nav'),sheet=document.getElementById('nav-sheet'),menuBtn=document.getElementById('menu-btn'),veil=document.getElementById('nav-veil'),menuPanel=sheet&&sheet.querySelector('.nav-sheet__panel');

var menuClosing=false;

function setMenu(open){

  if(open){

    menuClosing=false;

    sheet.classList.remove('closing');

    sheet.classList.add('o');

    menuBtn.setAttribute('aria-expanded','true');

    menuBtn.setAttribute('aria-label','Close menu');

    sheet.setAttribute('aria-hidden','false');

    document.body.classList.add('menu-open');

    var f=sheet.querySelector('.nav-sheet__list a');f&&f.focus({preventScroll:true});

    return;

  }

  if(!sheet.classList.contains('o')||menuClosing)return;

  menuBtn.setAttribute('aria-expanded','false');

  menuBtn.setAttribute('aria-label','Open menu');

  document.body.classList.remove('menu-open');

  if(matchMedia('(prefers-reduced-motion: reduce)').matches){

    sheet.classList.remove('o','closing');

    sheet.setAttribute('aria-hidden','true');

    return;

  }

  menuClosing=true;

  sheet.classList.add('closing');

  sheet.classList.remove('o');

}

function finishMenuClose(){

  if(!menuClosing)return;

  menuClosing=false;

  sheet.classList.remove('closing');

  sheet.setAttribute('aria-hidden','true');

}

if(menuPanel){

  menuPanel.addEventListener('transitionend',function(e){

    if(e.propertyName==='clip-path'&&menuClosing)finishMenuClose();

  });

  menuPanel.addEventListener('transitioncancel',function(e){

    if(e.propertyName==='clip-path'&&menuClosing)finishMenuClose();

  });

}

menuBtn.addEventListener('click',function(){

  setMenu(!sheet.classList.contains('o')&&!menuClosing);

});

veil.addEventListener('click',function(){setMenu(false)});

sheet.querySelectorAll('.nav-sheet__list a,.nav-sheet__foot .nav-cta').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});

document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('o')){setMenu(false);menuBtn.focus()}});

matchMedia('(min-width:861px)').addEventListener('change',function(m){if(m.matches)setMenu(false)});

addEventListener('scroll',function(){nav.classList.toggle('s',scrollY>60)},{passive:true});

var els=document.querySelectorAll('.rv');

if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){

  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('v');io.unobserve(e.target)}})},{threshold:.12});

  els.forEach(function(e){io.observe(e)});

}else{els.forEach(function(e){e.classList.add('v')})}

})();