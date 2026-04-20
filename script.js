const form = document.getElementById('form');

const state = {
  nome: '',
  categoria: '',
  genero: '',
  tamanho: '',
  cor: '',
  preco: '',
  qtd: ''
};

// máscara preço
function formatCurrency(value) {
  let digits = value.replace(/\D/g, '');
  if (!digits) return '';

  let number = (parseInt(digits, 10) / 100).toFixed(2);

  return 'R$ ' + number
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// validação
function validate(field, value) {
  switch (field) {
    case 'nome':
      if (!value) return 'Campo obrigatório';
      return '';

    case 'categoria':
    case 'genero':
    case 'tamanho':
      if (!value) return 'Selecione uma opção';
      return '';

    case 'cor':
      if (!value) return 'Informe a cor';
      return '';

    case 'preco':
      if (!value) return 'Campo obrigatório';
      let n = parseFloat(value.replace('R$', '').replace(/\./g,'').replace(',', '.'));
      if (!n || n <= 0) return 'Valor inválido';
      return '';

    case 'qtd':
      if (value === '') return 'Campo obrigatório';
      if (value < 0) return 'Valor inválido';
      return '';
  }
}

// UI
function setFieldState(field, error) {
  const el = document.querySelector(`[data-field="${field}"]`);
  const feedback = el.querySelector('.feedback');

  el.classList.remove('error', 'success');

  if (error) {
    el.classList.add('error');
    feedback.textContent = error;
  } else {
    el.classList.add('success');
    feedback.textContent = 'OK';
  }
}

// eventos
form.addEventListener('input', (e) => {
  const id = e.target.id;
  if (!state.hasOwnProperty(id)) return;

  if (id === 'preco') {
    e.target.value = formatCurrency(e.target.value);
  }

  state[id] = e.target.value;

  const error = validate(id, state[id]);
  setFieldState(id, error);
});

// submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  let hasError = false;

  Object.keys(state).forEach(field => {
    const error = validate(field, state[field]);
    setFieldState(field, error);
    if (error) hasError = true;
  });

  if (hasError) {
    showToast('Corrija os campos');
    return;
  }

  showToast('Roupa cadastrada com sucesso!');
  form.reset();
});

// toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';

  setTimeout(() => t.style.display = 'none', 3000);
}