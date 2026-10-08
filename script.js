(() => {
'use strict';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('.work-item')];
const tabList = document.querySelector('.experience-tabs');
tabList.setAttribute('role', 'tablist');
function selectTab(index, focus = false) {
 tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; panels[i].hidden = i !== index; });
 if (focus) tabs[index].focus();
}
tabs.forEach((tab, i) => {
 tab.id = `tab-${i}`; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', panels[i].id);
 panels[i].setAttribute('role', 'tabpanel'); panels[i].setAttribute('aria-labelledby', tab.id); panels[i].tabIndex = 0;
 tab.addEventListener('click', () => selectTab(i));
 tab.addEventListener('keydown', event => {
  let next;
  if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
  if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = tabs.length - 1;
  if (next !== undefined) { event.preventDefault(); selectTab(next, true); }
 });
});
document.querySelector('.work-grid').classList.add('tabs-ready'); selectTab(0);
const links = [...document.querySelectorAll('.nav-links a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href')));
const intro = document.querySelector('.cinematic-intro');
const stage = document.querySelector('.intro-stage');
const siteNav = document.querySelector('.nav');
let queued = false;
function updateScroll() {
 const offset = document.querySelector('.nav').offsetHeight + 100;
 let current = 0;
 sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= offset) current = i; });
 links.forEach((link, i) => { if(i === current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
 const distance = Math.max(1, intro.offsetHeight - stage.offsetHeight);
 const progress = Math.max(0, Math.min(1, -intro.getBoundingClientRect().top / distance));
 siteNav.classList.toggle('past-intro', intro.getBoundingClientRect().bottom < stage.offsetHeight * .28);
 if (!reduced) {
  stage.style.setProperty('--intro-progress', progress.toFixed(4));
  stage.style.setProperty('--copy-opacity', Math.max(0, 1 - progress * 1.5).toFixed(4));
  stage.style.setProperty('--copy-y', `${-progress * 90}px`);
  stage.style.setProperty('--side-shift', `${progress * 130}%`);
  stage.style.setProperty('--image-scale', String(1.03 + progress * .14));
 }

 queued = false;
}
window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }, {passive:true});
window.addEventListener('resize', updateScroll); updateScroll();
if (!reduced && 'IntersectionObserver' in window) {
 document.documentElement.classList.add('js-motion');
 const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);} }), {threshold:.08});
 document.querySelectorAll('.section-header, .introduction > div, .about-layout, .contact-content').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}
})();
