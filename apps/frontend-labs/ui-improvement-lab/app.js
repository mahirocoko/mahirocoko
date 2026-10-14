const form = document.querySelector('#configurator');
const rail = document.querySelector('#rail');
const finish = document.querySelector('#finish');
const modules = [...form.querySelectorAll('input[name="modules"]')];
const total = document.querySelector('#total');
const summary = document.querySelector('#configuration-summary');
const finishNote = document.querySelector('#finish-note');
const detailButtons = [...form.querySelectorAll('.detail-toggle')];
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const finishNotes = {
  graphite: 'Quiet, low-reflection anodized aluminum',
  silver: 'Soft satin aluminum with a warm cast',
};

function updateConfiguration() {
  const selected = modules.filter((module) => module.checked);
  const price = selected.reduce(
    (sum, module) => sum + Number(module.dataset.price),
    Number(rail.selectedOptions[0].dataset.price),
  );
  total.textContent = money.format(price);
  summary.textContent = `${rail.value} cm · ${finish.selectedOptions[0].textContent} · ${selected.length} ${selected.length === 1 ? 'module' : 'modules'} selected`;
  finishNote.textContent = finishNotes[finish.value];
}

form.addEventListener('change', updateConfiguration);
form.addEventListener('submit', (event) => event.preventDefault());
form.addEventListener('reset', () => {
  // A browser-triggered reset can flush microtasks before restoring controls.
  // Recalculate in the next task, after the native reset default action.
  setTimeout(updateConfiguration, 0);
  for (const button of detailButtons) {
    button.setAttribute('aria-expanded', 'false');
    document.getElementById(button.getAttribute('aria-controls')).hidden = true;
  }
});

for (const button of detailButtons) {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !expanded;
  });
}

updateConfiguration();
