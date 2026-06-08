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

function calcularRiscoAgricola(temperatura, umidadeSolo, ndvi) {
  const estresseTermico = limitarValor((temperatura - 20) * 3, 0, 100);
  const estresseHidrico = limitarValor(100 - umidadeSolo, 0, 100);
  const estresseVegetacao = limitarValor((1 - ndvi) * 100, 0, 100);
  const score = estresseTermico * 0.30 + estresseHidrico * 0.40 + estresseVegetacao * 0.30;

  return {
    score: limitarValor(score, 0, 100),
    estresseTermico,
    estresseHidrico,
    estresseVegetacao
  };
}

function classificarRisco(score) {
  if (score < 35) {
    return {
      classe: 'Saudável',
      css: 'saudavel',
      mensagem: 'A lavoura está em condição estável. Continue monitorando.'
    };
  } else if (score < 70) {
    return {
      classe: 'Atenção',
      css: 'atencao',
      mensagem: 'A lavoura apresenta sinais de estresse. Verifique irrigação e temperatura.'
    };
  }

  return {
    classe: 'Crítico',
    css: 'critico',
    mensagem: 'Risco alto. Recomenda-se ação imediata no manejo da plantação.'
  };
}

function atualizarIndicadoresHero(ndvi, umidade, risco) {
  const statNdvi = $('#statNdvi');
  const statUmi = $('#statUmi');
  const statRisco = $('#statRisco');

  if (statNdvi) {
    statNdvi.textContent = Number(ndvi).toFixed(2);
  }

  if (statUmi) {
    statUmi.textContent = `${Math.round(umidade)}%`;
  }

  if (statRisco) {
    statRisco.textContent = risco;
  }
}

function configurarSimulador() {
  const formulario = $('#simForm');

  if (!formulario) {
    return;
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const campoTemperatura = $('#inpTemp');
    const campoUmidade = $('#inpUmi');
    const campoNdvi = $('#inpNdvi');
    const erro = $('#formError');

    if (campoTemperatura.value === '' || campoUmidade.value === '' || campoNdvi.value === '') {
      erro.textContent = 'Preencha todos os campos do simulador.';
      return;
    }

    const temperatura = Number(campoTemperatura.value);
    const umidade = Number(campoUmidade.value);
    const ndvi = Number(campoNdvi.value);

    if (temperatura < 0 || temperatura > 50) {
      erro.textContent = 'Temperatura inválida. Use valores entre 0 e 50 °C.';
      return;
    } else if (umidade < 0 || umidade > 100) {
      erro.textContent = 'Umidade inválida. Use valores entre 0 e 100%.';
      return;
    } else if (ndvi < 0 || ndvi > 1) {
      erro.textContent = 'NDVI inválido. Use valores entre 0 e 1.';
      return;
    }

    erro.textContent = '';

    const resultado = calcularRiscoAgricola(temperatura, umidade, ndvi);
    const classificacao = classificarRisco(resultado.score);

    $('#resScore').textContent = formatarPontuacao(resultado.score);
    $('#resTemp').textContent = `${formatarPontuacao(resultado.estresseTermico)}%`;
    $('#resUmi').textContent = `${formatarPontuacao(resultado.estresseHidrico)}%`;
    $('#resVeg').textContent = `${formatarPontuacao(resultado.estresseVegetacao)}%`;

    const saidaClasse = $('#resClass');
    saidaClasse.classList.remove('saudavel', 'atencao', 'critico');
    saidaClasse.classList.add(classificacao.css);
    saidaClasse.textContent = `${classificacao.classe} — ${classificacao.mensagem}`;

    atualizarIndicadoresHero(ndvi, umidade, classificacao.classe);
  });
}

function configurarCadastroTalhao() {
  const formulario = $('#formTalhao');
  const lista = $('#listaTalhoes');
  const status = $('#cadastroStatus');

  if (!formulario || !lista || !status) {
    return;
  }

  const talhoes = [];

  function criarParagrafo(texto) {
    const paragrafo = document.createElement('p');
    paragrafo.textContent = texto;
    return paragrafo;
  }

  function renderizarTalhoes() {
    lista.replaceChildren();

    for (let i = 0; i < talhoes.length; i += 1) {
      const talhao = talhoes[i];
      const card = document.createElement('article');
      const titulo = document.createElement('strong');

      card.classList.add('talhao-card');
      titulo.textContent = `${i + 1}. ${talhao.nome}`;

      card.appendChild(titulo);
      card.appendChild(criarParagrafo(`Cultura: ${talhao.cultura}`));
      card.appendChild(criarParagrafo(`Prioridade: ${talhao.prioridade}`));
      lista.appendChild(card);
    }
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nome = $('#nomeTalhao').value.trim();
    const cultura = $('#culturaTalhao').value.trim();
    const prioridade = $('#prioridadeTalhao').value;

    if (nome === '' || cultura === '' || prioridade === '') {
      definirFeedback(status, 'Preencha todos os campos antes de cadastrar o talhão.', 'erro');
      return;
    }

    talhoes.push({ nome, cultura, prioridade });
    definirFeedback(status, `Talhão "${nome}" cadastrado com sucesso.`, 'ok');
    formulario.reset();
    renderizarTalhoes();
  });
}