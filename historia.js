// ---------- historia.js - Tela de história inicial do jogo ----------

let historiaAtual = 0;
let imagensHistoria = [];

function preloadHistoria() {
  // Carrega as 4 imagens da história
  imagensHistoria[0] = loadImage('ImagensFundo/TelaHistoria1.png');
  imagensHistoria[1] = loadImage('ImagensFundo/TelaHistoria2.png');
  imagensHistoria[2] = loadImage('ImagensFundo/TelaHistoria3.png');
  imagensHistoria[3] = loadImage('ImagensFundo/TelaHistoria4.png');
}

function drawHistoria() {
  textFont(myFont);

  // Fundo - usa a imagem correspondente à página atual
  if (imagensHistoria[historiaAtual]) {
    image(imagensHistoria[historiaAtual], 0, 0, width, height);
  }

  // Navegação
  drawNavegacaoHistoria();

  // Botão Começar (só na última página)
  if (historiaAtual === imagensHistoria.length - 1) {
    drawBotaoComecar();
  }

  // Indicador de página
  fill(0);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(`${historiaAtual + 1} / ${imagensHistoria.length}`, width / 2, height - 15);
}

function drawBotaoComecar() {
  let btnX = width / 2 - 60;
  let btnY = height - 150;
  let btnW = 120;
  let btnH = 40;

  // Estilo do botão
  if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
    fill(100, 220, 100); // Verde mais claro no hover
    cursor(HAND);
  } else {
    fill(100, 200, 100); // Verde normal
  }

  // Desenha o botão
  stroke(0);
  strokeWeight(2);
  rect(btnX, btnY, btnW, btnH, 8);

  // Texto do botão
  fill(255);
  textFont(myFont);
  textSize(12);
  textAlign(CENTER, CENTER);
  noStroke();
  text("COMEÇAR", btnX + btnW / 2, btnY + btnH / 2);
}

function drawNavegacaoHistoria() {
  let yBotoes = height - 80;

  // Botão Cancelar (volta para tela inicial)
  let xCancelar = 40;
  if (mouseX > xCancelar && mouseX < xCancelar + 100 && mouseY > yBotoes && mouseY < yBotoes + 40) {
    fill(255, 120, 120, 200);
    cursor(HAND);
  } else {
    fill(255, 100, 100, 200);
  }
  rect(xCancelar, yBotoes, 100, 40, 8);
  fill(0);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("Cancelar", xCancelar + 50, yBotoes + 20);

  // Botão Anterior
  if (historiaAtual > 0) {
    let xAnterior = width / 2 - 120;
    if (mouseX > xAnterior && mouseX < xAnterior + 100 && mouseY > yBotoes && mouseY < yBotoes + 40) {
      fill(120, 220, 255, 200);
      cursor(HAND);
    } else {
      fill(100, 200, 250, 200);
    }
    rect(xAnterior, yBotoes, 100, 40, 8);
    fill(0);
    text("Anterior", xAnterior + 50, yBotoes + 20);
  }

  // Botão Próximo (só aparece se não for a última página)
  if (historiaAtual < imagensHistoria.length - 1) {
    let xProximo = width / 2 + 40;
    if (mouseX > xProximo && mouseX < xProximo + 100 && mouseY > yBotoes && mouseY < yBotoes + 40) {
      fill(120, 220, 255, 200);
      cursor(HAND);
    } else {
      fill(100, 200, 250, 200);
    }
    rect(xProximo, yBotoes, 100, 40, 8);
    fill(0);
    text("Próximo", xProximo + 50, yBotoes + 20);
  }

  // Botão Pular (vai direto para o jogo)
  let xPular = width - 140;
  if (mouseX > xPular && mouseX < xPular + 100 && mouseY > yBotoes && mouseY < yBotoes + 40) {
    fill(255, 220, 100, 200);
    cursor(HAND);
  } else {
    fill(255, 200, 80, 200);
  }
  rect(xPular, yBotoes, 100, 40, 8);
  fill(0);
  text("Pular", xPular + 50, yBotoes + 20);
}

function mousePressedHistoria() {
  let yBotoes = height - 80;

  // Botão Cancelar
  let xCancelar = 40;
  if (mouseX > xCancelar && mouseX < xCancelar + 100 && mouseY > yBotoes && mouseY < yBotoes + 40) {
    telaAtual = "inicio"; // volta para tela inicial
    resetarHistoria();
    return true;
  }

  // Botão Anterior
  if (historiaAtual > 0) {
    let xAnterior = width / 2 - 120;
    if (mouseX > xAnterior && mouseX < xAnterior + 100 && mouseY > yBotoes && mouseY < yBotoes + 40) {
      historiaAtual--;
      return true;
    }
  }

  // Botão Próximo
  if (historiaAtual < imagensHistoria.length - 1) {
    let xProximo = width / 2 + 40;
    if (mouseX > xProximo && mouseX < xProximo + 100 && mouseY > yBotoes && mouseY < yBotoes + 40) {
      historiaAtual++;
      return true;
    }
  }

  // Botão Pular
  let xPular = width - 140;
  if (mouseX > xPular && mouseX < xPular + 100 && mouseY > yBotoes && mouseY < yBotoes + 40) {
    iniciarJogo();
    return true;
  }

  // Botão Começar (apenas na última página)
  if (historiaAtual === imagensHistoria.length - 1) {
    let btnX = width / 2 - 60;
    let btnY = height - 150;
    let btnW = 120;
    let btnH = 40;

    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      iniciarJogo();
      return true;
    }
  }

  return false;
}

function iniciarJogo() {
  // Vai para a tela de jogo (cadastro de usuário)
  telaAtual = "jogo";
}

function resetarHistoria() {
  historiaAtual = 0;
}

// Função para navegação por teclado
function keyPressedHistoria() {
  if (telaAtual === "historia") {
    if (keyCode === LEFT_ARROW && historiaAtual > 0) {
      historiaAtual--;
      return true;
    } else if (keyCode === RIGHT_ARROW && historiaAtual < imagensHistoria.length - 1) {
      historiaAtual++;
      return true;
    } else if (keyCode === ENTER && historiaAtual === imagensHistoria.length - 1) {
      iniciarJogo();
      return true;
    }
  }
  return false;
}
