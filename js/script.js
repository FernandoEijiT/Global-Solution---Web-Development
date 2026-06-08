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

function configurarQuiz() {
  const progresso = $('#quizProgress');
  const pergunta = $('#quizQuestion');
  const botoesOpcoes = $$('.quiz-option');
  const feedback = $('#quizFeedback');
  const botaoResposta = $('#nextQuestion');
  const resultado = $('#quizResult');
  const pontuacaoFinal = $('#quizScore');
  const mensagemFinal = $('#quizMessage');
  const botaoReiniciar = $('#restartQuiz');

  if (!progresso || !pergunta || botoesOpcoes.length === 0 || !feedback || !botaoResposta || !resultado || !pontuacaoFinal || !mensagemFinal || !botaoReiniciar) {
    return;
  }

    const perguntas = [
    { pergunta: 'Qual é o principal objetivo do AgroOrbit IA?', opcoes: ['Vender satélites', 'Monitorar lavouras com dados e sensores', 'Criar redes sociais', 'Controlar drones militares'], resposta: 1 },
    { pergunta: 'O que o NDVI ajuda a estimar?', opcoes: ['Saúde da vegetação', 'Preço de mercado', 'Quantidade de tratores', 'Velocidade do vento espacial'], resposta: 0 },
    { pergunta: 'Qual ODS está mais ligado à agricultura sustentável?', opcoes: ['ODS 2', 'ODS 5', 'ODS 16', 'ODS 17'], resposta: 0 },
    { pergunta: 'Qual componente pode medir umidade do solo em um protótipo?', opcoes: ['LED RGB', 'Sensor de umidade do solo', 'Buzzer', 'Resistor fixo isolado'], resposta: 1 },
    { pergunta: 'Qual combinação de dados indica maior risco de estresse hídrico na lavoura?', opcoes: ['Umidade baixa, temperatura alta e NDVI baixo', 'Solo úmido, temperatura ideal e NDVI alto', 'Alta luminosidade isolada', 'Nome da cultura cadastrado corretamente'], resposta: 0 },
    { pergunta: 'Qual situação representa risco agrícola?', opcoes: ['Alta umidade e temperatura ideal', 'Baixa umidade e temperatura elevada', 'NDVI alto e solo úmido', 'Luminosidade estável'], resposta: 1 },
    { pergunta: 'O que sensores IoT fazem no campo?', opcoes: ['Coletam dados ambientais', 'Geram chuva artificial', 'Lançam foguetes', 'Eliminam a necessidade de análise'], resposta: 0 },
    { pergunta: 'Qual tecnologia espacial se conecta ao projeto?', opcoes: ['Sensoriamento remoto', 'Mineração lunar obrigatória', 'Turismo espacial', 'Propulsão nuclear'], resposta: 0 },
    { pergunta: 'Qual dado o usuário pode inserir no simulador?', opcoes: ['Temperatura, umidade e NDVI', 'Senha de satélite militar', 'Órbita real de lançamento', 'Código do foguete'], resposta: 0 },
    { pergunta: 'Qual benefício social o projeto busca?', opcoes: ['Democratizar agricultura de precisão', 'Aumentar desperdício de água', 'Dificultar acesso à tecnologia', 'Eliminar produtores pequenos'], resposta: 0 }
  ];

  let perguntaAtual = 0;
  let pontuacao = 0;
  let opcaoSelecionada = null;

    function limparSelecao() {
    botoesOpcoes.forEach((botao) => botao.classList.remove('selected'));
  }

  function renderizarPergunta() {
    const item = perguntas[perguntaAtual];
    opcaoSelecionada = null;

    progresso.textContent = `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;
    pergunta.textContent = item.pergunta;
    definirFeedback(feedback, '', '');
    botaoResposta.textContent = perguntaAtual === perguntas.length - 1 ? 'Finalizar quiz' : 'Responder';
    botaoResposta.hidden = false;
    resultado.hidden = true;
    limparSelecao();

    botoesOpcoes.forEach((botao, indice) => {
      botao.textContent = item.opcoes[indice];
      botao.hidden = false;
    });
  }

  function finalizarQuiz() {
    progresso.textContent = 'Quiz concluído';
    pergunta.textContent = 'Resultado final do quiz';
    feedback.textContent = '';
    botaoResposta.hidden = true;

    botoesOpcoes.forEach((botao) => {
      botao.hidden = true;
    });

    let nivel;

    if (pontuacao <= 4) {
      nivel = 'Conhecimento inicial. Revise os conceitos de sensores, satélite e ODS.';
    } else if (pontuacao <= 7) {
      nivel = 'Bom resultado. Você entende a proposta e pode aprofundar a parte técnica.';
    } else {
      nivel = 'Excelente. Você domina bem a conexão entre agricultura, espaço e tecnologia.';
    }

    pontuacaoFinal.textContent = `${pontuacao}/${perguntas.length}`;
    mensagemFinal.textContent = nivel;
    resultado.hidden = false;
  }

    botoesOpcoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      opcaoSelecionada = Number(botao.dataset.option);
      limparSelecao();
      botao.classList.add('selected');
    });
  });

  botaoResposta.addEventListener('click', () => {
    if (opcaoSelecionada === null) {
      definirFeedback(feedback, 'Selecione uma alternativa antes de responder.', 'erro');
      return;
    }

    if (opcaoSelecionada === perguntas[perguntaAtual].resposta) {
      pontuacao += 1;
      definirFeedback(feedback, 'Resposta correta.', 'ok');
    } else {
      definirFeedback(feedback, 'Resposta incorreta.', 'erro');
    }

    setTimeout(() => {
      perguntaAtual += 1;

      if (perguntaAtual < perguntas.length) {
        renderizarPergunta();
      } else {
        finalizarQuiz();
      }
    }, 650);
  });

  botaoReiniciar.addEventListener('click', () => {
    perguntaAtual = 0;
    pontuacao = 0;
    renderizarPergunta();
  });

  renderizarPergunta();
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarAnoRodape();
  configurarNavegacao();
  configurarTemas();
  configurarSlideshow();
  configurarSimulador();
  configurarCadastroTalhao();
  configurarQuiz();

  const formulario = $('#simForm');

  if (formulario) {
    formulario.dispatchEvent(new Event('submit'));
  }
});
