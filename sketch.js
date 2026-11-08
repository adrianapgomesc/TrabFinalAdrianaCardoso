
let pagina = 0;
let fonteCarregada = false;

// ASCII DAS CINCO BANDAS
let imagensASCII = [
  [], // Deftones
  [], // System of a Down
  [], // Red Hot Chili Peppers
  [], // Fleetwood Mac
  []  // Gorillaz
];

let asciiCarregado = [false, false, false, false, false];
let errosASCII = [false, false, false, false, false];

// NOMES DOS FICHEIROS
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


// SETUP
function setup() {

  createCanvas(windowWidth, windowHeight);

  // CARREGAR OS CINCO FICHEIROS ASCII
  for (let i = 0; i < ficheirosASCII.length; i++) {

    let indice = i;

    loadStrings(
      ficheirosASCII[indice],

      function(linhas) {
        imagensASCII[indice] = linhas;
        asciiCarregado[indice] = true;

        console.log(
          "ASCII carregado: " + ficheirosASCII[indice]
        );
      },

      function(erro) {
        errosASCII[indice] = true;

        console.error(
          "Erro ao carregar " + ficheirosASCII[indice],
          erro
        );
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

  }

  // PÁGINAS DAS BANDAS
  else {

    desenharBanda();

  }

  desenharSetas();

}


// DESENHAR A PÁGINA DE CADA BANDA
function desenharBanda() {

  let banda = bandas[pagina - 1];

  let margem = 80;
  let centro = width / 2;

  // ALTERNAR A COMPOSIÇÃO
  if (pagina % 2 !== 0) {

    // ASCII À ESQUERDA
    desenharASCII(margem, 170);

    // INFORMAÇÃO À DIREITA
    desenharInformacao(centro + 40, banda);

  } else {

    // INFORMAÇÃO À ESQUERDA
    desenharInformacao(margem, banda);

    // ASCII À DIREITA
    desenharASCII(centro + 40, 170);

  }

}


// DESENHAR O NOME E INFORMAÇÃO DA BANDA
function desenharInformacao(x, banda) {

  fill(255);
  noStroke();

  // NOME DA BANDA
  if (fonteCarregada) {
    textFont("Redaction 50");
  } else {
    textFont("Arial");
  }

  textStyle(ITALIC);
  textSize(34);
  textAlign(LEFT, TOP);

  text(banda.nome, x, 160, width / 2 - 100);

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

  text(
    banda.estilo,
    x,
    372,
    width / 2 - 100
  );

  // CURIOSIDADES
  fill(150);
  textSize(12);
  text("SABIAS QUE?", x, 450);

  fill(255);
  textSize(15);

  text(
    banda.curiosidade,
    x,
    475,
    width / 2 - 100,
    100
  );

}


// DESENHAR O ASCII DE CADA BANDA
function desenharASCII(x, y) {

  let indice = pagina - 1;

  fill(190);
  noStroke();

  textFont("Courier New");
  textStyle(NORMAL);
  textAlign(LEFT, TOP);

  // SE O FICHEIRO JÁ FOI CARREGADO
  if (asciiCarregado[indice]) {

    let linhas = imagensASCII[indice];

    // DESCOBRIR A LARGURA E ALTURA DO ASCII
    let maiorLinha = 0;

    for (let i = 0; i < linhas.length; i++) {
      if (linhas[i].length > maiorLinha) {
        maiorLinha = linhas[i].length;
      }
    }

    let numeroLinhas = linhas.length;

    // ESPAÇO DISPONÍVEL PARA A IMAGEM
    let espacoLargura = width / 2 - 120;
    let espacoAltura = height - 220;

    // AJUSTAR O TAMANHO AUTOMATICAMENTE
    let tamanhoLargura =
      espacoLargura / (maiorLinha * 0.62);

    let tamanhoAltura =
      espacoAltura / (numeroLinhas * 1.15);

    let tamanho = min(
      8,
      tamanhoLargura,
      tamanhoAltura
    );

    tamanho = max(2, tamanho);

    textSize(tamanho);
    textLeading(tamanho * 1.15);

    text(
      linhas.join("\n"),
      x,
      y
    );

  }

  // SE HOUVE UM ERRO A CARREGAR
  else if (errosASCII[indice]) {

    fill(180);
    textSize(12);

    text(
      "ERROR LOADING ASCII IMAGE",
      x,
      y
    );

  }

  // ENQUANTO ESTÁ A CARREGAR
  else {

    fill(100);
    textSize(12);

    text(
      "LOADING ASCII IMAGE...",
      x,
      y
    );

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

  // SETA ESQUERDA
  if (
    mouseX < 80 &&
    abs(mouseY - height / 2) < 50
  ) {

    if (pagina === 0) {
      pagina = 5;
    }

    else if (pagina === 1) {
      pagina = 0;
    }

    else {
      pagina--;
    }

  }

  // SETA DIREITA
  else if (
    mouseX > width - 80 &&
    abs(mouseY - height / 2) < 50
  ) {

    if (pagina === 0) {
      pagina = 1;
    }

    else if (pagina === 5) {
      pagina = 0;
    }

    else {
      pagina++;
    }

  }

}


// AJUSTAR O CANVAS À JANELA
function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}
