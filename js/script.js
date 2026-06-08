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