'use strict';
(() => {
  const steps = Array.from(document.querySelectorAll('.step'));
  const labels = ['Predict', 'Network', 'Restriction', 'Responses', 'Investigate', 'Discuss'];
  const answers = {prediction: null, priority: null};
  const texts = {
    prediction: {a: 'Usually yes', b: 'Only under certain conditions', c: 'Usually no', d: 'Need more information'},
    priority: {a: 'Who controls the technology', b: 'Whether the US can enforce it', c: 'Whether others go along', d: 'What China can do instead'}
  };
  let current = 0;
  let all = false;
  const el = id => document.getElementById(id);
  function updateSummary() {
    for (const name of ['prediction', 'priority']) {
      el(`${name}-summary`).textContent = answers[name] ? texts[name][answers[name]] : 'No choice selected.';
      el(`${name}-feedback`).textContent = answers[name] ? 'Selected on this device. You can change your choice.' : '';
    }
  }
  function render(focus = true) {
    document.body.classList.toggle('all-view', all);
    steps.forEach((step, index) => {step.hidden = !all && index !== current;});
    document.querySelectorAll('[data-go]').forEach(button => {
      if (!all && Number(button.dataset.go) === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    el('progress').textContent = all ? 'All content · Read at your own pace' : `Step ${current + 1} of 6 · ${labels[current]}`;
    el('view-toggle').textContent = all ? 'Step-by-step' : 'All content';
    el('view-toggle').setAttribute('aria-pressed', String(all));
    el('controls').hidden = all;
    el('back').disabled = current === 0;
    el('next').hidden = current === steps.length - 1;
    el('end-actions').hidden = !all && current !== steps.length - 1;
    if (focus) el(`heading-${all ? 0 : current}`).focus({preventScroll: false});
  }
  function reset() {
    answers.prediction = null; answers.priority = null;
    document.querySelectorAll('input[type="radio"]').forEach(input => {input.checked = false;});
    current = 0; all = false; el('copy-status').textContent = '';
    updateSummary(); render(false);
  }
  document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = false;
    input.addEventListener('change', () => {answers[input.name] = input.value; updateSummary();});
  });
  el('back').addEventListener('click', () => {current = Math.max(0, current - 1); render();});
  el('next').addEventListener('click', () => {current = Math.min(steps.length - 1, current + 1); render();});
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => {current = Number(button.dataset.go); render();}));
  el('view-toggle').addEventListener('click', () => {all = !all; render();});
  el('restart').addEventListener('click', () => {reset();el('heading-0').focus();});
  el('print').addEventListener('click', () => window.print());
  el('copy').addEventListener('click', async () => {
    const url = new URL(window.location.href); url.hash = ''; url.search = '';
    try {await navigator.clipboard.writeText(url.href); el('copy-status').textContent = 'Page link copied.';}
    catch {el('copy-status').textContent = `Copy the address from your browser: ${url.href}`;}
  });
  // Browser history restoration must not resurrect an earlier choice.
  window.addEventListener('pageshow', event => {if (event.persisted) reset();});
  ['view-toggle', 'print', 'step-nav'].forEach(id => {el(id).hidden = false;});
  reset();
})();
