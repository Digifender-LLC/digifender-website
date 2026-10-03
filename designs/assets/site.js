(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  let paused = false;
  const motionAllowed = () => !reduced.matches && !paused;
  function animate(element, frames, options) {
    if (!motionAllowed() || !element?.animate) return null;
    const animation = element.animate(frames, {duration: 550, easing: 'cubic-bezier(.2,.75,.25,1)', ...options});
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
    return animation;
  }
  const motionButton = document.querySelector('.motion-toggle');
  function updateMotion() {
    root.classList.toggle('motion-paused', paused || reduced.matches);
    if (paused || reduced.matches) {
      for (const animation of running) animation.cancel();
      running.clear();
    }
    motionButton.disabled = reduced.matches;
    motionButton.setAttribute('aria-pressed', String(paused || reduced.matches));
    motionButton.querySelector('[data-motion-label]').textContent = reduced.matches ? 'Reduced motion on' : paused ? 'Resume motion' : 'Pause motion';
  }
  motionButton.hidden = false;
  motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reduced.addEventListener('change', updateMotion);
  updateMotion();
  document.addEventListener('visibilitychange', () => root.classList.toggle('page-idle', document.hidden));

  // A nonmodal navigation disclosure. The links remain available without JavaScript.
  const header = document.querySelector('.masthead');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const mobile = matchMedia('(max-width: 760px)');
  const setMenu = open => {
    header.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.querySelector('span').textContent = open ? 'Close' : 'Menu';
  };
  menu.hidden = false;
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {setMenu(false);menu.focus();}
  });
  document.addEventListener('click', event => {if (!header.contains(event.target)) setMenu(false);});
  mobile.addEventListener('change', () => setMenu(false));

  // The anchor directory becomes accessible tabs; without scripts all products are visible.
  const explorer = document.querySelector('[data-explorer]');
  const tabs = [...explorer.querySelectorAll('[data-product]')];
  const panels = tabs.map(tab => document.getElementById('product-' + tab.dataset.product));
  const tablist = explorer.querySelector('.product-tabs');
  const stage = explorer.querySelector('.product-stage');
  const announcement = document.querySelector('.product-switch-status');
  let active = 0;
  let productAnimations = [];
  tablist.setAttribute('role', 'tablist');
  const setOrientation = () => tablist.setAttribute('aria-orientation', document.body.classList.contains('design-blueprint') && !mobile.matches ? 'vertical' : 'horizontal');
  setOrientation();
  mobile.addEventListener('change', setOrientation);
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
  });
  function selectProduct(index, {focus = false, motion = true, announce = true} = {}) {
    const previous = active;
    const oldHeight = stage.getBoundingClientRect().height;
    productAnimations.forEach(animation => animation?.cancel());
    productAnimations = [];
    active = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus({preventScroll:true});
    if (announce) announcement.textContent = tabs[index].querySelector('b').textContent + ' selected.';
    if (motion && previous !== index && motionAllowed()) {
      const direction = index > previous ? 1 : -1;
      const panel = panels[index];
      productAnimations.push(animate(panel.querySelector('.product-copy'), [
        {opacity:0, transform:`translateY(${direction * 15}px)`}, {opacity:1, transform:'translateY(0)'}
      ], {duration:420}));
      productAnimations.push(animate(panel.querySelector('.product-visual'), [
        {opacity:0, transform:`translateX(${direction * 35}px) scale(.97)`}, {opacity:1, transform:'translateX(0) scale(1)'}
      ], {duration:600}));
      const newHeight = stage.getBoundingClientRect().height;
      if (Math.abs(oldHeight - newHeight) > 1) productAnimations.push(animate(stage,[{height:oldHeight+'px'},{height:newHeight+'px'}],{duration:420}));
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => {event.preventDefault();selectProduct(index);});
    tab.addEventListener('keydown', event => {
      const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
      let next;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
      if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index + tabs.length - 1) % tabs.length;
      if (event.key === ' ' || event.key === 'Enter') next = index;
      if (next !== undefined) {event.preventDefault();selectProduct(next,{focus:true});}
    });
  });
  function productFromHash({initial = false} = {}) {
    const index = panels.findIndex(panel => '#' + panel.id === location.hash);
    if (index >= 0) {
      selectProduct(index,{motion:false,announce:!initial});
      requestAnimationFrame(() => panels[index].scrollIntoView({block:'start',behavior:'instant'}));
    }
  }
  selectProduct(0,{motion:false,announce:false});
  window.addEventListener('hashchange', () => productFromHash());
  root.classList.add('enhanced');
  productFromHash({initial:true});

  // Reveal only as a section enters; static HTML never depends on an animation to be readable.
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animate(entry.target,[{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:700});
        reveal.unobserve(entry.target);
      });
    },{threshold:.12});
    document.querySelectorAll('[data-reveal]').forEach(element => reveal.observe(element));
    const ambience = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('page-idle',!entry.isIntersecting));
    },{threshold:0});
    document.querySelectorAll('.signal-emblem,.foundation-drawing,.product-panel').forEach(element => ambience.observe(element));
  }

  const detailStates = new WeakMap();
  document.querySelectorAll('.approach-details details').forEach(details => {
    details.querySelector('summary').addEventListener('click', event => {
      if (!motionAllowed() || !details.animate) return;
      event.preventDefault();
      const current = detailStates.get(details);
      const opening = current ? !current.opening : !details.open;
      const start = details.getBoundingClientRect().height;
      current?.animation?.cancel();
      if (opening) details.open = true;
      const end = opening ? details.scrollHeight : details.querySelector('summary').getBoundingClientRect().height + 1;
      const animation = animate(details,[{height:start+'px',overflow:'hidden'},{height:end+'px',overflow:'hidden'}],{duration:320});
      const state = {opening, animation};
      detailStates.set(details,state);
      animation?.finished.then(() => {
        if (detailStates.get(details) === state) {details.open = opening;detailStates.delete(details);}
      }).catch(() => {
        if (detailStates.get(details) === state) {details.open = opening;detailStates.delete(details);}
      });
    });
  });

  const progress = document.querySelector('.reading-progress');
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  function updateScroll() {
    scheduled = false;
    const range = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, scrollY/range)) : 0})`;
    let current = -1;
    sections.forEach((section, index) => {if (section.getBoundingClientRect().top <= 160) current = index;});
    navLinks.forEach((link,index) => {if (index===current) link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  }
  const requestScroll = () => {if (!scheduled) {scheduled=true;requestAnimationFrame(updateScroll);}};
  addEventListener('scroll',requestScroll,{passive:true});
  addEventListener('resize',requestScroll,{passive:true});
  updateScroll();
  const copyButton = document.querySelector('[data-copy-email]');
  if (navigator.clipboard?.writeText) {
    copyButton.hidden = false;
    let reset;
    copyButton.addEventListener('click',async () => {
      const status = document.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText('hello@digifender.com');
        copyButton.textContent = 'Email address copied';
        status.textContent = 'hello@digifender.com copied to clipboard.';
      } catch {
        status.textContent = 'Could not copy automatically. The email address is hello@digifender.com.';
        copyButton.textContent = 'Select the address above to copy';
      }
      clearTimeout(reset);
      reset = setTimeout(() => {copyButton.textContent='Copy email address';},4000);
    });
  }
})();
