const form = document.querySelector('#request-form');
const details = form.elements.namedItem('details');
const services = form.elements.namedItem('service');
const hint = document.querySelector('#request-hint');

const examples = {
  'Клининг': {
    label: 'Что и где нужно убрать?',
    example: 'Например, квартира 55 м², кухня и санузел',
    title: 'Что поможет оценить уборку',
    note: 'Тип помещения, примерная площадь и что важно убрать в первую очередь.'
  },
  'Химчистка': {
    label: 'Какое изделие нужно почистить?',
    example: 'Например, двухместный диван и одно кресло',
    title: 'Что поможет оценить химчистку',
    note: 'Назовите изделие, материал и загрязнения. Если есть фото, приложите его в чате.'
  }
};

function selectService() {
  const selected = examples[services.value];
  document.querySelector('#task-label').textContent = selected.label;
  document.querySelector('#hint-title').textContent = selected.title;
  document.querySelector('#hint-body').textContent = selected.note;
  details.placeholder = selected.example;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hint.getAnimations().forEach((animation) => animation.cancel());
    hint.animate([{ opacity: .65, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], {
      duration: 210,
      easing: 'cubic-bezier(.2,0,0,1)'
    });
  }
}

for (const link of document.querySelectorAll('[data-pick]')) {
  link.addEventListener('click', () => {
    services.value = link.dataset.pick;
    selectService();
  });
}

form.addEventListener('change', (event) => {
  if (event.target.name === 'service') selectService();
});
details.addEventListener('input', () => details.setCustomValidity(''));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const task = details.value.trim();
  if (!task) {
    details.setCustomValidity('Коротко опишите задачу.');
    details.reportValidity();
    return;
  }

  const telegram = new URL('https://t.me/likeclin');
  telegram.searchParams.set('text', [
    'Здравствуйте! Хочу уточнить, когда можно заказать услугу в Казани и сколько она стоит.',
    'Услуга: ' + services.value,
    'Задача: ' + task
  ].join('\n'));
  window.location.assign(telegram.toString());
});
