'use strict';

const $ = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => document.querySelectorAll(seletor);

function limitarValor(numero, minimo, maximo) {
  return Math.min(Math.max(numero, minimo), maximo);
}

function formatarPontuacao(valor) {
  return Number(valor).toFixed(1).replace('.', ',');
}

function definirFeedback(elemento, mensagem, tipo) {
  if (!elemento) {
    return;
  }

  elemento.textContent = mensagem;
  elemento.classList.remove('feedback-ok', 'feedback-error');

  if (tipo === 'ok') {
    elemento.classList.add('feedback-ok');
  } else if (tipo === 'erro') {
    elemento.classList.add('feedback-error');
  }
}

function configurarNavegacao() {
  const botaoMenu = $('#navToggle');
  const menu = $('#mainNav');

  if (!botaoMenu || !menu) {
    return;
  }

  botaoMenu.addEventListener('click', () => {
    const estaAberto = menu.classList.toggle('open');
    botaoMenu.setAttribute('aria-expanded', String(estaAberto));
  });

  $$('#mainNav a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      botaoMenu.setAttribute('aria-expanded', 'false');
    });
  });
}
function atualizarAnoRodape() {
  const ano = $('#year');

  if (ano) {
    ano.textContent = new Date().getFullYear();
  }
}

function configurarTemas() {
  const botoesTema = $$('.theme-btn');

  if (botoesTema.length === 0) {
    return;
  }

  document.body.classList.add('theme-orbital');

  botoesTema.forEach((botao) => {
    botao.addEventListener('click', () => {
      const temaSelecionado = botao.dataset.theme;

      document.body.classList.remove('theme-orbital', 'theme-eco', 'theme-solar');
      document.body.classList.add(temaSelecionado);

      botoesTema.forEach((item) => item.classList.remove('active'));
      botao.classList.add('active');
    });
  });
}