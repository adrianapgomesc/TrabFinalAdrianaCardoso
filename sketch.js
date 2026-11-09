
let pagina = 0;
let fonteCarregada = false;

// ASCII DAS CINCO BANDAS
let imagensASCII = [[], [], [], [], []];
let asciiCarregado = [false, false, false, false, false];
let errosASCII = [false, false, false, false, false];

// FICHEIROS ASCII
let ficheirosASCII = [
  "deftones.txt",
  "system.txt",
  "rhcp.txt",
  "fleetwoodmac.txt",
  "gorillaz.txt"
];

// INFORMAÇÃO DAS BANDAS
let bandas = [
  {
    nome: "DEFTONES //",
    ano: "1988",
    estilo: "Alternative metal / Nu metal",
    curiosidade: "Curiosidades sobre a banda a acrescentar."
  },
  {
    nome: "SYSTEM OF A DOWN //",
    ano: "1994",
    estilo: "Alternative metal / Nu metal",
    curiosidade: "Curiosidades sobre a banda a acrescentar."
  },
  {
    nome: "RED HOT CHILI PEPPERS //",
    ano: "1983",
    estilo: "Funk rock / Alternative rock",
    curiosidade: "Curiosidades sobre a banda a acrescentar."
  },
  {
    nome: "FLEETWOOD MAC //",
    ano: "1967",
    estilo: "Rock / Pop rock / Blues rock",
    curiosidade: "Curiosidades sobre a banda a acrescentar."
  },
  {
    nome: "GORILLAZ //",
    ano: "1998",
    estilo: "Alternative rock / Trip hop / Electronic",
    curiosidade: "Curiosidades sobre a banda a acrescentar."
  }
];

// FICHEIROS DE MÚSICA
let ficheirosMusica = [
  "deftones.mp3",
  "system.mp3",
  "rhcp.mp3",
  "fleetwoodmac.mp3",
  "gorillaz.mp3"
];

// NOMES DAS MÚSICAS
let titulosMusica = [
  "My Own Summer (Shove It)",
  "Know",
  "Did I Let You Know",
  "I Don't Want to Know",
  "Feel Good Inc."
];

// NOMES DOS ÁLBUNS
let albunsMusica = [
  "Around the Fur",
  "System of a Down",
  "I'm with You",
  "Rumours",
  "Demon Days"
];

// VARIÁVEIS DO LEITOR
let sons = [null, null, null, null, null];
let musicaCarregada = [false, false, false, false, false];
let errosMusica = [false, false, false, false, false];

let reproducaoAtivada = false;
let musicaAtual = -1;
let musicaMuda = false;

// VISUALIZADOR DE FREQUÊNCIAS
let contextoAudio = null;
let analisador = null;
let fontesAudio = [];
let espectro = null;

// POSIÇÃO DO LEITOR
let leitorX = 0;
let leitorY = 0;
let leitorW = 0;


// SETUP
function setup() {

  createCanvas(windowWidth, windowHeight);

  // CARREGAR OS FICHEIROS ASCII
  for (let i = 0; i < ficheirosASCII.length; i++) {

    let indice = i;

    loadStrings(
      ficheirosASCII[indice],

      function(linhas) {
        imagensASCII[indice] = linhas;
        asciiCarregado[indice] = true;
        console.log("ASCII carregado: " + ficheirosASCII[indice]);
      },

      function(erro) {
        errosASCII[indice] = true;
        console.error("Erro ao carregar ASCII:", erro);
      }
    );
  }

  // CARREGAR A FONTE
  if (document.fonts) {

    document.fonts.load('32px "Redaction 50"')
      .then(() => {
        fonteCarregada = true;
      })
      .catch(() => {
        fonteCarregada = false;
      });
  }

  // PREPARAR O VISUALIZADOR DE FREQUÊNCIAS
  prepararAnalisador();

  // CARREGAR AS MÚSICAS
  for (let i = 0; i < ficheirosMusica.length; i++) {

    let indice = i;

    let audio = new Audio(ficheirosMusica[indice]);

    audio.preload = "auto";
    audio.volume = musicaMuda ? 0 : 1;

    sons[indice] = audio;

    // LIGAR O ÁUDIO AO VISUALIZADOR
    ligarAudioAoAnalisador(audio, indice);

    audio.addEventListener("canplay", function() {

      musicaCarregada[indice] = true;

      console.log("Música carregada: " + ficheirosMusica[indice]);

      if (
        reproducaoAtivada &&
        musicaAtual === indice &&
        pagina === indice + 1
      ) {
        tocarMusica(indice);
      }
    });

    audio.addEventListener("error", function() {

      errosMusica[indice] = true;

      console.error(
        "Erro ao carregar música: " + ficheirosMusica[indice],
        audio.error
      );
    });

    audio.addEventListener("ended", function() {

      if (musicaAtual === indice) {
        console.log("Música terminada: " + ficheirosMusica[indice]);
      }
    });

    audio.load();
  }
}


// PREPARAR O ANALISADOR DE FREQUÊNCIAS
function prepararAnalisador() {

  let AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    console.warn("O navegador não suporta o visualizador de áudio.");
    return;
  }

  try {

    contextoAudio = new AudioContextClass();

    analisador = contextoAudio.createAnalyser();
    analisador.fftSize = 64;
    analisador.connect(contextoAudio.destination);

    espectro = new Uint8Array(analisador.frequencyBinCount);

  } catch (erro) {

    console.error("Erro ao preparar o visualizador:", erro);
  }
}


// LIGAR CADA MÚSICA AO ANALISADOR
function ligarAudioAoAnalisador(audio, indice) {

  if (!contextoAudio || !analisador) {
    return;
  }

  try {

    let fonte = contextoAudio.createMediaElementSource(audio);

    fonte.connect(analisador);

    fontesAudio[indice] = fonte;

  } catch (erro) {

    console.warn(
      "Não foi possível ligar o visualizador à música:",
      ficheirosMusica[indice],
      erro
    );
  }
}


// DRAW
function draw() {

  background(0);

  // MUSIC ARCHIVE
  fill(255);
  noStroke();

  textFont("Arial");
  textStyle(NORMAL);
  textSize(13);
  textAlign(RIGHT, TOP);

  text("MUSIC ARCHIVE", width - 30, 30);

  // ECRÃ INICIAL
  if (pagina === 0) {

    if (fonteCarregada) {
      textFont("Redaction 50");
    } else {
      textFont("Arial");
    }

    textStyle(NORMAL);
    textSize(32);
    textLeading(45);
    textAlign(CENTER, CENTER);

    text(
      "to discover more,\npress the arrows",
      width / 2,
      height / 2
    );

  } else {

    desenharBanda();
  }

  // SETAS DESENHADAS NO FINAL
  desenharSetas();
}


// DESENHAR A PÁGINA DE CADA BANDA
function desenharBanda() {

  let banda = bandas[pagina - 1];

  let margem = 80;
  let centro = width / 2;

  if (pagina % 2 !== 0) {

    desenharASCII(margem, 170);
    desenharInformacao(centro + 40, banda);

  } else {

    desenharInformacao(margem, banda);
    desenharASCII(centro + 40, 170);
  }
}


// DESENHAR O NOME E INFORMAÇÃO DA BANDA
function desenharInformacao(x, banda) {

  fill(255);
  noStroke();

  let larguraInfo = width / 2 - 100;

  // NOME DA BANDA
  if (fonteCarregada) {
    textFont("Redaction 50");
  } else {
    textFont("Arial");
  }

  textStyle(ITALIC);
  textSize(34);
  textAlign(LEFT, TOP);

  text(banda.nome, x, 160, larguraInfo);

  textStyle(NORMAL);

  // ANO DE FORMAÇÃO
  textFont("Arial");
  textSize(12);
  textAlign(LEFT, TOP);

  fill(150);
  text("ANO DE FORMAÇÃO", x, 270);

  fill(255);
  textSize(18);
  text(banda.ano, x, 292);

  // ESTILO MUSICAL
  fill(150);
  textSize(12);
  text("ESTILO MUSICAL", x, 350);

  fill(255);
  textSize(18);
  text(banda.estilo, x, 372, larguraInfo);

  // CURIOSIDADES
  fill(150);
  textSize(12);
  text("SABIAS QUE?", x, 450);

  fill(255);
  textSize(15);
  text(banda.curiosidade, x, 475, larguraInfo, 100);

  // POSIÇÃO DO LEITOR
  let posicaoLeitor = min(570, height - 220);

  desenharLeitor(x, posicaoLeitor, larguraInfo);
}


// DESENHAR O LEITOR
function desenharLeitor(x, y, w) {

  // LIMITAR A LARGURA DO LEITOR
  w = min(w, 360);

  leitorX = x;
  leitorY = y;
  leitorW = w;

  fill(150);
  noStroke();

  textFont("Arial");
  textStyle(NORMAL);
  textSize(12);
  textAlign(LEFT, TOP);

  text("NOW PLAYING", x, y);

  // NOME DA MÚSICA
  fill(255);
  textStyle(NORMAL);
  textSize(13);

  text(titulosMusica[pagina - 1], x, y + 19, w);

  // NOME DO ÁLBUM EM ITÁLICO
  textStyle(ITALIC);
  textSize(12);

  text(albunsMusica[pagina - 1], x, y + 37, w);

  textStyle(NORMAL);

  // VISUALIZADOR DE FREQUÊNCIAS
  desenharFrequencias(x, y + 60, w, 35);

  // BARRA DE PROGRESSO E TEMPOS
  desenharProgresso(x, y + 105, w);

  // BOTÕES
  fill(255);
  textFont("Arial");
  textStyle(NORMAL);
  textSize(12);
  textAlign(LEFT, CENTER);

  let som = sons[pagina - 1];
  let estaATocar = som && !som.paused && !som.ended;

  text(estaATocar ? "PLAYING" : "PLAY", x, y + 142);
  text("PAUSE", x + 90, y + 142);
  text(musicaMuda ? "UNMUTE" : "MUTE", x + 180, y + 142);

  // ESTADO DO ÁUDIO
  if (errosMusica[pagina - 1]) {

    fill(180);
    textSize(10);
    text("ERROR LOADING AUDIO", x, y + 165);

  } else if (!musicaCarregada[pagina - 1]) {

    fill(120);
    textSize(10);
    text("LOADING AUDIO...", x, y + 165);
  }
}


// VISUALIZADOR DE FREQUÊNCIAS
function desenharFrequencias(x, y, w, h) {

  let som = sons[pagina - 1];

  if (
    analisador &&
    espectro &&
    som &&
    !som.paused &&
    !som.ended
  ) {

    analisador.getByteFrequencyData(espectro);

  } else if (espectro) {

    espectro.fill(0);
  }

  let numeroBarras = 32;
  let espaco = 3;
  let larguraBarra =
    (w - (numeroBarras - 1) * espaco) / numeroBarras;

  noStroke();
  fill(190);

  for (let i = 0; i < numeroBarras; i++) {

    let valor = 0;

    if (espectro && espectro.length > 0) {
      valor = espectro[i] / 255;
    }

    let altura = max(2, valor * h);

    rect(
      x + i * (larguraBarra + espaco),
      y + h - altura,
      larguraBarra,
      altura
    );
  }
}


// FORMATAR TEMPO EM MINUTOS E SEGUNDOS
function formatarTempo(segundos) {

  if (!Number.isFinite(segundos) || segundos < 0) {
    return "--:--";
  }

  let minutos = Math.floor(segundos / 60);
  let segundosRestantes = Math.floor(segundos % 60);

  return (
    minutos +
    ":" +
    String(segundosRestantes).padStart(2, "0")
  );
}


// OBTER O TEMPO ATUAL DA MÚSICA
function obterTempoAtual(indice) {

  let som = sons[indice];

  if (!som) {
    return 0;
  }

  if (Number.isFinite(som.currentTime)) {
    return som.currentTime;
  }

  return 0;
}


// BARRA DE PROGRESSO E CONTAGEM DO TEMPO
function desenharProgresso(x, y, w) {

  let indice = pagina - 1;
  let som = sons[indice];

  let progresso = 0;
  let tempoAtual = 0;
  let tempoRestante = 0;

  if (som && musicaCarregada[indice]) {

    let duracao = som.duration;
    tempoAtual = obterTempoAtual(indice);

    if (Number.isFinite(duracao) && duracao > 0) {

      progresso = constrain(tempoAtual / duracao, 0, 1);

      tempoRestante = Math.max(0, duracao - tempoAtual);
    }
  }

  // BARRA DE FUNDO
  noStroke();
  fill(70);
  rect(x, y, w, 3);

  // PROGRESSO
  fill(255);
  rect(x, y, w * progresso, 3);

  // PONTO DE PROGRESSO
  circle(x + w * progresso, y + 1.5, 7);

  // TEMPO DECORRIDO - ESQUERDA
  fill(150);
  textFont("Arial");
  textStyle(NORMAL);
  textSize(10);
  textAlign(LEFT, TOP);

  text(formatarTempo(tempoAtual), x, y + 9);

  // TEMPO RESTANTE - DIREITA
  textAlign(RIGHT, TOP);

  let textoRestante = "-" + formatarTempo(tempoRestante);

  text(textoRestante, x + w, y + 9);
}


// TOCAR A MÚSICA
function tocarMusica(indice) {

  if (!sons[indice] || !musicaCarregada[indice]) {
    console.log("A música ainda não está carregada.");
    return;
  }

  let som = sons[indice];

  // SE FOR UMA MÚSICA DIFERENTE, PARAR AS OUTRAS
  if (musicaAtual !== indice) {

    for (let i = 0; i < sons.length; i++) {

      if (i !== indice && sons[i]) {

        sons[i].pause();

        try {
          sons[i].currentTime = 0;
        } catch (erro) {
          console.warn("Não foi possível reiniciar uma faixa.", erro);
        }
      }
    }

    // COMEÇAR A NOVA MÚSICA DO INÍCIO
    som.currentTime = 0;
  }

  musicaAtual = indice;

  // CONTROLAR O VOLUME
  som.volume = musicaMuda ? 0 : 1;

  // ATIVAR O CONTEXTO DE ÁUDIO
  if (contextoAudio && contextoAudio.state === "suspended") {
    contextoAudio.resume();
  }

  // INICIAR OU RETOMAR A MÚSICA
  let tentativaReproducao = som.play();

  if (tentativaReproducao !== undefined) {

    tentativaReproducao
      .then(function() {
        console.log("A tocar: " + ficheirosMusica[indice]);
      })
      .catch(function(erro) {
        console.error("Não foi possível iniciar a música:", erro);
      });
  }
}


// PARAR TODAS AS MÚSICAS
function pararTodasMusicas() {

  for (let i = 0; i < sons.length; i++) {

    if (sons[i]) {

      sons[i].pause();

      try {
        sons[i].currentTime = 0;
      } catch (erro) {
        // A faixa pode ainda não ter carregado os metadados.
      }
    }
  }

  musicaAtual = -1;
}


// MUDAR DE PÁGINA
function mudarPagina(novaPagina) {

  pagina = novaPagina;

  if (pagina === 0) {

    pararTodasMusicas();
    return;
  }

  pararTodasMusicas();

  if (reproducaoAtivada) {

    musicaAtual = pagina - 1;

    if (musicaCarregada[musicaAtual]) {
      tocarMusica(musicaAtual);
    }
  }
}


// INTERAÇÃO COM O LEITOR
function clicarNoLeitor() {

  let x = leitorX;
  let y = leitorY;
  let w = leitorW;

  // PLAY
  if (
    mouseX >= x &&
    mouseX <= x + 75 &&
    mouseY >= y + 127 &&
    mouseY <= y + 160
  ) {

    reproducaoAtivada = true;

    tocarMusica(pagina - 1);

    return true;
  }

  // PAUSE
  if (
    mouseX >= x + 85 &&
    mouseX <= x + 165 &&
    mouseY >= y + 127 &&
    mouseY <= y + 160
  ) {

    let indice = pagina - 1;
    let som = sons[indice];

    if (som && !som.paused) {
      som.pause();
    }

    return true;
  }

  // MUTE / UNMUTE
  if (
    mouseX >= x + 175 &&
    mouseX <= x + 270 &&
    mouseY >= y + 127 &&
    mouseY <= y + 160
  ) {

    musicaMuda = !musicaMuda;

    for (let i = 0; i < sons.length; i++) {

      if (sons[i]) {
        sons[i].volume = musicaMuda ? 0 : 1;
      }
    }

    return true;
  }

  // BARRA DE PROGRESSO
  if (
    mouseX >= x &&
    mouseX <= x + w &&
    mouseY >= y + 99 &&
    mouseY <= y + 126
  ) {

    let indice = pagina - 1;
    let som = sons[indice];

    if (som && musicaCarregada[indice]) {

      let duracao = som.duration;

      let posicao = constrain((mouseX - x) / w, 0, 1);

      let novoTempo = posicao * duracao;

      if (Number.isFinite(duracao) && duracao > 0) {

        try {
          som.currentTime = novoTempo;
        } catch (erro) {
          console.error("Não foi possível alterar a posição da música:", erro);
        }
      }
    }

    return true;
  }

  return false;
}


// DESENHAR ASCII
function desenharASCII(x, y) {

  let indice = pagina - 1;

  fill(190);
  noStroke();

  textFont("Courier New");
  textStyle(NORMAL);
  textAlign(LEFT, TOP);

  if (asciiCarregado[indice]) {

    let linhas = imagensASCII[indice];
    let maiorLinha = 0;

    for (let i = 0; i < linhas.length; i++) {

      if (linhas[i].length > maiorLinha) {
        maiorLinha = linhas[i].length;
      }
    }

    let numeroLinhas = linhas.length;

    let espacoLargura = width / 2 - 120;
    let espacoAltura = height - 220;

    let tamanhoLargura = espacoLargura / (maiorLinha * 0.62);
    let tamanhoAltura = espacoAltura / (numeroLinhas * 1.15);

    let tamanho = min(8, tamanhoLargura, tamanhoAltura);
    tamanho = max(2, tamanho);

    textSize(tamanho);
    textLeading(tamanho * 1.15);

    text(linhas.join("\n"), x, y);

  } else if (errosASCII[indice]) {

    fill(180);
    textSize(12);
    text("ERROR LOADING ASCII IMAGE", x, y);

  } else {

    fill(100);
    textSize(12);
    text("LOADING ASCII IMAGE...", x, y);
  }
}


// SETAS
function desenharSetas() {

  fill(255);
  noStroke();

  textFont("Arial");
  textStyle(NORMAL);
  textSize(28);
  textAlign(CENTER, CENTER);

  text("←", 35, height / 2);
  text("→", width - 35, height / 2);
}


// NAVEGAÇÃO
function mousePressed() {

  // PRIMEIRO VERIFICAR O LEITOR
  if (pagina > 0) {

    if (clicarNoLeitor()) {
      return;
    }
  }

  // SETA ESQUERDA
  if (
    mouseX < 80 &&
    abs(mouseY - height / 2) < 50
  ) {

    if (pagina === 0) {
      mudarPagina(5);
    } else if (pagina === 1) {
      mudarPagina(0);
    } else {
      mudarPagina(pagina - 1);
    }
  }

  // SETA DIREITA
  else if (
    mouseX > width - 80 &&
    abs(mouseY - height / 2) < 50
  ) {

    if (pagina === 0) {
      mudarPagina(1);
    } else if (pagina === 5) {
      mudarPagina(0);
    } else {
      mudarPagina(pagina + 1);
    }
  }
}


// AJUSTAR CANVAS
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
