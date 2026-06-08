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
function configurarSlideshow() {
  const imagem = $('#slideImage');
  const titulo = $('#slideTitle');
  const texto = $('#slideText');
  const botaoProximo = $('#nextSlide');
  const botaoAnterior = $('#prevSlide');
  const dots = $$('.slide-dot');

  if (!imagem || !titulo || !texto || !botaoProximo || !botaoAnterior || dots.length === 0) {
    return;
  }

  const slides = [
    {
      imagem: 'imagens/agricultor.jpg',
      titulo: 'Produtor rural conectado',
      texto: 'O sistema transforma dados técnicos em decisões simples para o campo.',
      alt: 'Agricultor usando tecnologia no campo'
    },
    {
      imagem: 'imagens/satelite.jpg',
      titulo: 'Observação da Terra por satélite',
      texto: 'O conceito orbital apoia o monitoramento de vegetação, solo e clima.',
      alt: 'Satélite monitorando a Terra'
    },
    {
      imagem: 'imagens/sensores.jpg',
      titulo: 'Sensores IoT no solo',
      texto: 'Arduino e sensores simulam a coleta local de umidade, temperatura e luminosidade.',
      alt: 'Sensores conectados a uma placa Arduino'
    }
  ];

  let indiceAtual = 0;
  let temporizador = null;

  function atualizarDots() {
    dots.forEach((dot, indice) => {
      dot.classList.toggle('active', indice === indiceAtual);
    });
  }
  function renderizarSlide() {
    const slide = slides[indiceAtual];
    imagem.src = slide.imagem;
    imagem.alt = slide.alt;
    titulo.textContent = slide.titulo;
    texto.textContent = slide.texto;
    atualizarDots();
  }

  function proximoSlide() {
    indiceAtual = (indiceAtual + 1) % slides.length;
    renderizarSlide();
  }

  function slideAnterior() {
    indiceAtual = (indiceAtual - 1 + slides.length) % slides.length;
    renderizarSlide();
  }

  function reiniciarTemporizador() {
    clearInterval(temporizador);
    temporizador = setInterval(proximoSlide, 4500);
  }

  botaoProximo.addEventListener('click', () => {
    proximoSlide();
    reiniciarTemporizador();
  });

  botaoAnterior.addEventListener('click', () => {
    slideAnterior();
    reiniciarTemporizador();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      indiceAtual = Number(dot.dataset.slide);
      renderizarSlide();
      reiniciarTemporizador();
    });
  });

  renderizarSlide();
  reiniciarTemporizador();
}