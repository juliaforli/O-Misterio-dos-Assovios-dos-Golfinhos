let telaAtual = "inicio";
let usuario = "";
let inputUsuario, botaoCriarUsuario;
let erroLogin = "";

let cartas = [];
let cartasPorPagina = 6;
let totalPaginas = 5;
let paginaAtual = 0;

let combinacaoAtual = [];
let historico = [];
let historicoGlobal = {};
let cartasSalvas = [];

let tempoInicio = 0;
let tempoJogo = 0;
let jogoFinalizado = false;
let cliqueBloqueado = false;

let instrucaoPaginaAtual = 0;
let instrucoesConteudo = [];
let imagensInstrucoes = [];

let grupos = [];
let grupoSelecionado;
let imagensCartas = [];
let idUsuario;

var myFont;

let imgMenu, imgFundo, imgHistoria, imgLogoLab;

// ---------- PRELOAD ----------
function preload() {
  myFont = loadFont("fontes/PressStart2P.ttf");
  
  imgMenu = loadImage("ImagensFundo/TelaMenu.png");
  imgFundo = loadImage("ImagensFundo/TelaFundo.png"); 
  //imgHistoria = loadImage('/ImagensFundo/TelaHistoria.png');
  
  // instruções (mantém)
  imagensInstrucoes[0] = loadImage('instrucao_1.png');
  imagensInstrucoes[1] = loadImage('instrucao_2.png');
  imagensInstrucoes[2] = loadImage('instrucao_3.png');
  imagensInstrucoes[3] = loadImage('instrucao_4.png');
  imagensInstrucoes[4] = loadImage('instrucao_5.png');
  imagensInstrucoes[5] = loadImage('instrucao_6.png');
  imgLogoLab = loadImage("logo_lab.jpg"); // Modificações de Chico #1
  
  grupos = [carregarGrupo1, carregarGrupo2, carregarGrupo3];
  
  preloadHistoria();
}

// ---------- SETUP ----------
function setup() {
  createCanvas(1325, 600);  // MUDADO PARA 1325x600
  textAlign(CENTER, CENTER);
  
  
  criarCartas();
  carregarHistoricoLocal(); // Lógica de migração removida
  //setupHistoria();
  
  // Gera ID único para o usuário se não existir
  idUsuario = localStorage.getItem("userID");
  if (!idUsuario) {
    idUsuario = "user_" + int(random(1000, 9999));
    localStorage.setItem("userID", idUsuario);
  }
  
  // Seleciona aleatoriamente um grupo
  grupoSelecionado = int(random(grupos.length));
  imagensCartas = grupos[grupoSelecionado]();
  
  // Define o conteúdo de cada página de instrução

  instrucoesConteudo = [
    {
      titulo: "1. Selecionando Cartas",
      texto: "Clique em uma carta para selecioná-la (ela ganhará uma borda vermelha).\n\nSe clicar errado, clique nela novamente para desmarcar.",
      img: imagensInstrucoes[0]
    },
    {
      titulo: "2. Navegando entre Páginas",
      texto: "O jogo tem 5 páginas de cartas.\n\nUse as setas do teclado (← →) ou clique nas setas azuis na tela para mudar de página.",
      img: imagensInstrucoes[1]
    },
    {
      titulo: "3. Salvando uma Combinação",
      texto: "Após selecionar as cartas que formam um grupo, clique no botão 'Salvar Combinação'.\n\nIsso salvará seu progresso.",
      img: imagensInstrucoes[2]
    },
    {
      titulo: "4. Cartas Salvas",
      texto: "Uma vez salvas, as cartas ficarão transparentes e não poderão mais ser selecionadas.\n\nSeu progresso é mostrado no canto inferior esquerdo.",
      img: imagensInstrucoes[3]
    },
    {
      titulo: "5. Limpando a Seleção",
      texto: "Se você selecionou várias cartas mas mudou de ideia antes de salvar, clique em 'Limpar Seleção' para desmarcar todas de uma vez.",
      img: imagensInstrucoes[4]
    },
    {
      titulo: "6. Finalizando o Jogo",
      texto: "Continue salvando combinações até que todas as 30 cartas estejam transparentes. O botão 'Finalizar Jogo' ficará disponível para você parar o tempo e registrar sua pontuação.",
      img: imagensInstrucoes[5]
    }
  ];
}

// ---------- DRAW (Função principal) ----------
function draw() {
  if (telaAtual === "inicio") {
    image(imgMenu, 0, 0, width, height);
  } else if (telaAtual === "historia") {
    drawHistoria();
    return;
  } else if (telaAtual === "jogo") {
    image(imgFundo, 0, 0, width, height);
  } else if (telaAtual === "instrucoes") {
    image(imgFundo, 0, 0, width, height);
  } else if (telaAtual === "config") {
    image(imgFundo, 0, 0, width, height);
  } else if (telaAtual === "rank") {
    image(imgFundo, 0, 0, width, height);
  } else if (telaAtual === "fim") {
    image(imgFundo, 0, 0, width, height);
  }
  //background("#dff3ff");
  cursor(ARROW); 

  if(telaAtual === "inicio") drawInicio();
  else if(telaAtual === "jogo") drawJogo();
  else if(telaAtual === "config") drawConfig();
  else if(telaAtual === "rank") drawRank();
  else if(telaAtual === "instrucoes") drawInstrucoes();
  else if(telaAtual === "fim") drawTelaFim();
}

// ---------- Tela Inicial (AJUSTADO) ----------
function drawInicio() {
  fill(0);
  textSize(20);
  textFont(myFont);
  //text("O Mistério dos Assovios dos Golfinhos", width/2, 80);
  let x = width/2 - 100, w = 200, h = 60, r = 12;
  let y1 = 160;
  if (mouseX > x && mouseX < x + w && mouseY > y1 && mouseY < y1 + h) {
    fill(120, 220, 255); cursor(HAND);
  } else {
    fill(100, 200, 250);
  }
  rect(x, y1, w, h, r);
  fill(0); textSize(15); text("Iniciar Jogo", width/2, y1 + h/2);
  let y2 = 240;
  if (mouseX > x && mouseX < x + w && mouseY > y2 && mouseY < y2 + h) {
    fill(255, 220, 170); cursor(HAND);
  } else {
    fill(255, 200, 150);
  }
  rect(x, y2, w, h, r);
  fill(0); text("Instruções", width/2, y2 + h/2);
  let y3 = 320;
  if (mouseX > x && mouseX < x + w && mouseY > y3 && mouseY < y3 + h) {
    fill(200, 200, 255); cursor(HAND);
  } else {
    fill(180, 180, 250);
  }
  rect(x, y3, w, h, r);
  fill(0); text("Configuração", width/2, y3 + h/2);
  let y4 = 400;
  if (mouseX > x && mouseX < x + w && mouseY > y4 && mouseY < y4 + h) {
    fill(220, 255, 200); cursor(HAND);
  } else {
    fill(200, 250, 180);
  }
  rect(x, y4, w, h, r);
  fill(0); text("Ranking", width/2, y4 + h/2);
}

// Modificações de Chico #2 (Inicio)
// Desenhar a Logo no canto inferior esquerdo
  if (imgLogoLab) { // Verifica se a imagem foi carregada
    let logoW = 100; // Largura desejada para a logo
    let logoH = imgLogoLab.height * (logoW / imgLogoLab.width); // Calcula altura proporcional
    let logoX = 20; // Margem esquerda
    let logoY = height - logoH - 20; // Margem inferior
    image(imgLogoLab, logoX, logoY, logoW, logoH);
  }

  // Desenhar os Créditos no canto inferior direito
  push(); // Salva o estado atual (alinhamento, tamanho da fonte)
  fill(0); // Cor preta para o texto
  textSize(8); // Tamanho bem pequeno para ser discreto
  textAlign(RIGHT, BOTTOM); // Alinha à direita e na base
  let creditos = "Desenvolvido por: Julia Forlit, Juliane Santos e Francisco Figueiredo";
  let creditosX = width - 20; // Margem direita
  let creditosY = height - 20; // Margem inferior
  text(creditos, creditosX, creditosY);
  pop();
  // Modificações de Chico #2 (Fim)

// ---------- Tela Instruções (AJUSTADO) ----------
function drawInstrucoes() {
  //background("#fffacd");
  fill(0);
  let totalPaginas = instrucoesConteudo.length;
  let pagina = instrucoesConteudo[instrucaoPaginaAtual];
  textSize(15);
  textAlign(CENTER, TOP); 
  text(`📖 ${pagina.titulo}`, width/2, 30);
  push();
  textSize(15);
  textAlign(LEFT, TOP);
  textLeading(20);
  let margem = 80;
  let larguraTexto = width - (margem * 2);
  text(pagina.texto, margem, 100, larguraTexto);
  pop();
  push();
  
  let imgY = 180; 
  let imgW = 600; 
  let imgH = 300; 
  let imgX = (width - imgW) / 2; 
  image(pagina.img, imgX, imgY, imgW, imgH);
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(imgX, imgY, imgW, imgH, 10);
  pop();
  textAlign(CENTER, CENTER);
  let btnY = height - 70, btnH = 50, btnR = 12;
  if (instrucaoPaginaAtual > 0) {
    let btnX = 50, btnW = 150;
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      fill(220, 220, 240); cursor(HAND);
    } else {
      fill(200, 200, 220);
    }
    rect(btnX, btnY, btnW, btnH, btnR);
    fill(0);
    textSize(15);
    text("Anterior", btnX + btnW/2, btnY + btnH/2);
  }
  if (instrucaoPaginaAtual < totalPaginas - 1) {
    let btnX = width - 200, btnW = 150;
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      fill(220, 220, 240); cursor(HAND);
    } else {
      fill(200, 200, 220);
    }
    rect(btnX, btnY, btnW, btnH, btnR);
    fill(0);
    textSize(15);
    text("Próximo", btnX + btnW/2, btnY + btnH/2);
  }
  let btnX = width/2 - 100, btnW = 200;
  if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
    fill(200, 220, 255); cursor(HAND);
  } else {
    fill(180, 200, 250);
  }
  rect(btnX, btnY, btnW, btnH, btnR);
  fill(0);
  textSize(10);
  text("Voltar ao Início", width/2, btnY + btnH/2);
  fill(0);
  textSize(15);
  text(`Página ${instrucaoPaginaAtual + 1} de ${totalPaginas}`, width/2, imgY + imgH + 20); 
}

// ---------- Tela Jogo (Modificada para mostrar erro) ----------
function drawJogo() {
  // Verifica por 'usuario' (nome)
  if(!usuario) { 
    fill(0);
    textSize(28);
    textAlign(CENTER, CENTER);
    text("Insira seu nome para começar", width/2, height/2 - 60); 
    textSize(18);
    text("Seu nome será usado no ranking!", width/2, height/2 - 20); 

    if(!inputUsuario) {
      inputUsuario = createInput('');
      inputUsuario.position(width/2 - 80, height/2 + 20); 
      
      botaoCriarUsuario = createButton('Começar');
      let botaoLargura = botaoCriarUsuario.width;
      botaoCriarUsuario.position(width/2 - (botaoLargura / 2), height/2 + 60); 
      botaoCriarUsuario.mousePressed(criarUsuario);
    }
    
    // --- NOVO CÓDIGO PARA MOSTRAR ERRO ---
    if (erroLogin !== "") {
      fill(255, 0, 0); // Cor vermelha para o erro
      textSize(16);
      textAlign(CENTER, CENTER);
      text(erroLogin, width/2, height/2 + 100); // Posição abaixo do botão
    }
    // --- FIM DO NOVO CÓDIGO ---
    
    return;
  }

  if(!jogoFinalizado) tempoJogo = floor((millis() - tempoInicio)/1000);

  drawCartasPagina();
  drawCombinacaoAtual();
  drawProgresso(); 
  drawNavegacao(); 
  drawBotaoSalvar();
  drawBotaoLimpar(); 
  drawTimer();
  drawBotaoFinalizar();
  drawBotaoDesistir();
}

// ---------- Tela Final do Jogo (AJUSTADO) ----------
function drawTelaFim() {
  //background("#e6ffe6");
  fill(0);
  textSize(36);
  text("Parabéns!", width/2, 80);
  
  textSize(24);
  text(`Usuário: ${usuario}`, width/2, 150);
  
  let m = floor(tempoJogo/60), s = tempoJogo%60;
  text(`Tempo Total: ${nf(m,2)}:${nf(s,2)}`, width/2, 200);
  
  text(`Combinações Salvas: ${historico.length}`, width/2, 250);

  let x = width/2-100, y = 350, w = 200, h = 50, r = 12;
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    fill(200, 220, 255); cursor(HAND);
  } else {
    fill(180, 200, 250);
  }
  rect(x, y, w, h, r);
  fill(0);
  textSize(15);
  text("Voltar ao\nInício", width/2, y + h/2);
}

// ---------- Criar usuário (Modificada com verificação) ----------
function criarUsuario() {
  let nome = inputUsuario.value().trim();
  
  // 1. Verifica se o nome está vazio
  if(nome === "") {
    erroLogin = "Por favor, insira um nome.";
    return;
  }
  
  // 2. VERIFICA SE O NOME JÁ EXISTE
  if (nome in historicoGlobal) {
    erroLogin = "Este nome já existe. Tente outro.";
    return;
  }
  
  // 3. Sucesso!
  erroLogin = ""; // Limpa qualquer erro anterior
  usuario = nome; // Define o nome global
  
  inputUsuario.hide();
  botaoCriarUsuario.hide();
  tempoInicio = millis();
  historico = [];
  cartasSalvas = []; 
  jogoFinalizado = false;
}

// ---------- Criar cartas (sem alteração) ----------
function criarCartas() {
  cartas = [];
  for(let i=0;i<30;i++){
    cartas.push({
      id:i,
      cor:color(random(80,255), random(80,255), random(80,255)),
      page:floor(i/cartasPorPagina),
      x:0,
      y:0
    });
  }
}

// ---------- Cartas por página (AJUSTADO) ----------
function drawCartasPagina() {
  let colunas = 3;
  let cardLargura = 225;
  let cardAltura = 154;
  let cardGap = 25;
  let gridLargura = (colunas * cardLargura) + ((colunas - 1) * cardGap);
  let xInicial = (width - gridLargura) / 2;
  let inicio = paginaAtual * cartasPorPagina;
  let fim = inicio + cartasPorPagina;
  let x = xInicial; 
  let y = 100;

  for (let i = inicio; i < fim && i < cartas.length; i++) {
    let c = cartas[i];
    c.x = x;
    c.y = y;

    let estaSalva = cartasSalvas.includes(c.id);
    let img = imagensCartas[c.id]; // imagem da carta correspondente

    // Desenha a imagem da carta
    push();
    drawingContext.save();

    // cria o formato arredondado da carta
    drawingContext.beginPath();
    drawingContext.roundRect(c.x, c.y, cardLargura, cardAltura, 10);
    drawingContext.clip();

    // aplica transparência se a carta estiver salva
    if (estaSalva) {
      tint(255, 100);
    } else {
      noTint();
    }

    // desenha a imagem
    image(img, c.x, c.y, cardLargura, cardAltura);
    noTint();

    drawingContext.restore();
    pop();

    // moldura preta
    noFill();
    stroke(0);
    strokeWeight(2);
    rect(c.x, c.y, cardLargura, cardAltura, 10);

    // muda cursor se o mouse estiver sobre a carta (e não salva)
    if (!estaSalva && mouseX > c.x && mouseX < c.x + cardLargura && mouseY > c.y && mouseY < c.y + cardAltura) {
      cursor(HAND);
    }

    // texto (opcional, pode remover se quiser apenas a imagem)
    //if (estaSalva) fill(0, 100);
    //else fill(0);
    noStroke();
    //textAlign(CENTER, CENTER);
    //text("Carta " + (c.id + 1), c.x + cardLargura / 2, c.y + cardAltura / 2);

    // borda vermelha se estiver selecionada
    if (combinacaoAtual.includes(c.id)) {
      noFill();
      stroke(255, 0, 0);
      strokeWeight(4);
      rect(c.x - 5, c.y - 5, cardLargura + 10, cardAltura + 10, 12);
    }

    // posicionamento em grid
    x += cardLargura + cardGap;
    if ((i - inicio + 1) % colunas === 0) {
      x = xInicial;
      y += cardAltura + 40;
    }
  }
}

// ---------- mousePressed (AJUSTADO) ----------
function mousePressed() {
  if(telaAtual==="inicio") {
    if(mouseX>width/2-100 && mouseX<width/2+100){
      if(mouseY>160 && mouseY<220)
        { telaAtual="historia"; 
         return; 
        }
      if(mouseY>240 && mouseY<300){ 
        telaAtual="instrucoes"; 
        instrucaoPaginaAtual = 0; 
        return; 
      }
      if(mouseY>320 && mouseY<380){ telaAtual="config"; return; }
      if(mouseY>400 && mouseY<460){ telaAtual="rank"; return; }
    }
  }
  
  if(telaAtual === "historia") {
    if(mousePressedHistoria()) {
      return;
    }
  }
  
  if(telaAtual==="instrucoes") {
    let totalPaginas = instrucoesConteudo.length;
    if(mouseX>width/2-100 && mouseX<width/2+100 && mouseY>height-70 && mouseY<height-20) {
      telaAtual = "inicio";
      instrucaoPaginaAtual = 0;
      return;
    }
    if (instrucaoPaginaAtual > 0 && mouseX > 50 && mouseX < 200 && mouseY > height - 70 && mouseY < height - 20) {
      instrucaoPaginaAtual--;
      return;
    }
    if (instrucaoPaginaAtual < totalPaginas - 1 && mouseX > width - 200 && mouseX < width - 50 && mouseY > height - 70 && mouseY < height - 20) {
      instrucaoPaginaAtual++;
      return;
    }
  }

  // LÓGICA DA TELA DE JOGO (Verifica por 'usuario')
  if(telaAtual==="jogo" && usuario){
    
    if (mouseX > 30 && mouseX < 150 && mouseY > 20 && mouseY < 60) {
      resetarParaInicio(); 
      return; 
    }
    
    if (paginaAtual < totalPaginas - 1 && mouseX > width/2 + 80 && mouseX < width/2 + 120 && mouseY > 20 && mouseY < 60) { 
      paginaAtual++;
      return;
    }
    
    if (paginaAtual > 0 && mouseX > width/2 - 150 && mouseX < width/2 - 80 && mouseY > 20 && mouseY < 60) { 
      paginaAtual--;
      return;
    }

    let inicio = paginaAtual * cartasPorPagina;
    let fim = inicio + cartasPorPagina;
    for(let i=inicio;i<fim && i<cartas.length;i++){
      let c = cartas[i];
      // Ajuste a área de clique para as novas dimensões 225x154
      if(mouseX>c.x && mouseX<c.x+225 && mouseY>c.y && mouseY<c.y+154){
        if (!cartasSalvas.includes(c.id)) { 
          if(!combinacaoAtual.includes(c.id)) combinacaoAtual.push(c.id);
          else combinacaoAtual = combinacaoAtual.filter(id=>id!==c.id);
        }
        return;
      }
    }

    if(mouseX>width-180 && mouseX<width-20 && mouseY>height-70 && mouseY<height-20){
      if(combinacaoAtual.length>0){
        for(let id of combinacaoAtual) {
          if(!cartasSalvas.includes(id)) {
            cartasSalvas.push(id);
          }
        }
        historico.push({
          numero: historico.length + 1,
          cartas: [...combinacaoAtual].map(id => `carta${grupoSelecionado + 1}_${id + 1}`)
        });
        combinacaoAtual=[];
      }
    }
    
    if (combinacaoAtual.length > 0 && mouseX > width - 360 && mouseX < width - 200 && mouseY > height - 70 && mouseY < height - 20) {
      combinacaoAtual = []; 
      return;
    }

    // FINALIZAR (Modificado para salvar com chave 'usuario')
    if(mouseX > width-180 && mouseX < width-20 && mouseY > height-140 && mouseY < height-90){
      if(cartasSalvas.length >= cartas.length){
        let agora = new Date();
        
        // Inicializa o array para o usuário se for a primeira vez
        if(!historicoGlobal[usuario]) {
          historicoGlobal[usuario] = [];
        }
        // Adiciona a partida ao array do usuário
        historicoGlobal[usuario].push({
          id_usuario: idUsuario, // Novo campo
          data: agora.toLocaleDateString(),
          tempo: tempoJogo,
          grupo: grupoSelecionado + 1, // Novo campo
          combinacoes: historico
        });

        salvarHistoricoLocal();
        jogoFinalizado = true;
        telaAtual = "fim";
      }
    }
  }

  if(telaAtual==="fim") {
    if(mouseX>width/2-100 && mouseX<width/2+100 && mouseY>350 && mouseY<400) {
      resetarParaInicio(); 
    }
  }
}

// ---------- keyPressed (Modificado) ----------
function keyPressed(){
  if(telaAtual !== "jogo" || !usuario) return; // Verifica por 'usuario'
  
  if(keyCode === RIGHT_ARROW && paginaAtual < totalPaginas - 1) {
    paginaAtual++;
  } else if(keyCode === LEFT_ARROW && paginaAtual > 0) {
    paginaAtual--;
  }
}

// ---------- Combinação atual (AJUSTADO) ----------
function drawCombinacaoAtual(){
  fill(0); 
  textSize(15); 
  textAlign(CENTER, CENTER);
  
  // Título mais acima
  let yTitulo = 475
  text("Combinação Atual:", width/2, yTitulo);
  
  // Posição das mini-cartas (abaixo do título)
  let x = 250
  let y = yTitulo + 40; // 40 pixels abaixo do título
  
  // Mantém a mesma proporção das cartas originais (225x154)
  let cardH = 60; // Altura fixa para miniaturas
  let cardW = cardH * (225/154); // Largura proporcional = 60 * 1.46 ≈ 87.6
  let cardGap = 10;
  
  for(let id of combinacaoAtual){
    // Pega a imagem da carta correspondente do grupo selecionado
    let img = imagensCartas[id];
    
    // Desenha a imagem da carta
    push();
    drawingContext.save();
    
    // Cria o formato arredondado da mini-carta
    drawingContext.beginPath();
    drawingContext.roundRect(x, y, cardW, cardH, 8);
    drawingContext.clip();
    
    // Desenha a imagem redimensionada
    image(img, x, y, cardW, cardH);
    
    drawingContext.restore();
    pop();
    
    // Moldura preta
    noFill();
    stroke(0);
    strokeWeight(2);
    rect(x, y, cardW, cardH, 8);
    
    // Número da carta (opcional - pode remover se quiser apenas a imagem)
    fill(255); // Texto branco para contrastar
    noStroke();
    textSize(10); // Texto menor
    textAlign(CENTER, CENTER);
    text(id + 1, x + cardW/2, y + cardH - 10); // Número na parte inferior
    
    x += cardW + cardGap;
  }
  
  // Reset do tamanho do texto
  fill(0); // Volta ao preto para outros textos
  textSize(16);
  
}
// ---------- Botão Limpar Seleção (AJUSTADO) ----------
function drawBotaoLimpar(){
  if (combinacaoAtual.length > 0) {
    let x = width - 360, y = height - 70, w = 160, h = 50, r = 10;
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      fill(255, 200, 120); cursor(HAND);
    } else {
      fill(255, 180, 100);
    }
    stroke(0); strokeWeight(2);
    rect(x, y, w, h, r); 
    fill(0); noStroke(); textSize(14);
    textAlign(CENTER, CENTER);
    text("Limpar\nSeleção", width - 280, height - 45);
  }
}

// ---------- Botão salvar (AJUSTADO) ----------
function drawBotaoSalvar(){
  let x = width-180, y = height-70, w = 160, h = 50, r = 10;
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    fill(120, 220, 120); cursor(HAND);
  } else {
    fill(100, 200, 100);
  }
  stroke(0); strokeWeight(2);
  rect(x, y, w, h, r); 
  fill(0); noStroke(); textSize(14);
  textAlign(CENTER, CENTER);
  text("Salvar\nCombinação", width-100, height-45);
}

// ---------- Botão finalizar (AJUSTADO) ----------
function drawBotaoFinalizar(){
  if(cartasSalvas.length >= cartas.length && !jogoFinalizado){
    let x = width-180, y = height-140, w = 160, h = 50, r = 10;
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      fill(255, 170, 170); cursor(HAND);
    } else {
      fill(255, 150, 150);
    }
    stroke(0); strokeWeight(2);
    rect(x, y, w, h, r); 
    fill(0); noStroke(); textSize(14);
    textAlign(CENTER, CENTER);
    text("Finalizar\nJogo", width-100, height-115);
  }
}

// ---------- Timer (AJUSTADO) ----------
function drawTimer(){
  fill(0); textSize(18); textAlign(CENTER, CENTER);
  let tempo = jogoFinalizado?tempoJogo:floor((millis()-tempoInicio)/1000);
  let m = floor(tempo/60), s=tempo%60;
  text(`Tempo: ${nf(m,2)}:${nf(s,2)}`, width-100,30);
}

// ---------- Botão Desistir (AJUSTADO) ----------
function drawBotaoDesistir(){
  let x = 30, y = 20, w = 120, h = 40, r = 10;
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    fill(255, 120, 120); cursor(HAND);
  } else {
    fill(255, 100, 100);
  }
  stroke(0);
  strokeWeight(2);
  rect(x, y, w, h, r);
  fill(0);
  noStroke();
  textSize(13);
  textAlign(CENTER, CENTER);
  text("Desistir", x + w/2, y + h/2);
}

// ---------- Função de Reset (Modificada) ----------
function resetarParaInicio() {
  usuario = ""; // Reseta o nome do usuário
  erroLogin = ""; // Limpa a mensagem de erro
  historico = [];
  cartasSalvas = [];
  combinacaoAtual = [];
  paginaAtual = 0;
  jogoFinalizado = false;
  
  grupoSelecionado = int(random(grupos.length));
  imagensCartas = grupos[grupoSelecionado]();
  console.log("Novo grupo selecionado:", grupoSelecionado + 1);
  
  if (inputUsuario) {
    inputUsuario.remove();
    inputUsuario = null;
  }
  if (botaoCriarUsuario) {
    botaoCriarUsuario.remove();
    botaoCriarUsuario = null;
  }
  
  telaAtual = "inicio";
}

// ---------- Progresso (AJUSTADO) ----------
function drawProgresso(){
  fill(0); 
  textAlign(LEFT, TOP); 
  let yPos = height - 100, xPosText = 50; 
  textSize(15);
  textStyle(NORMAL); 
  text("Combinações\nsalvas: "+historico.length, xPosText, yPos);
  textSize(15);
  textStyle(BOLD);
  text(`Cartas\nSalvas: ${cartasSalvas.length}/${cartas.length}`, xPosText, yPos + 50); 
  textStyle(NORMAL);
  textAlign(CENTER, CENTER); 
}

// ---------- Navegação páginas (AJUSTADO) ----------
function drawNavegacao(){
  fill(0); 
  textAlign(CENTER, CENTER); 
  let yNavegacao = 40, yInstrucao = yNavegacao + 35;
  textSize(15); 
  text(`Página\n${paginaAtual+1} de ${totalPaginas}`, width/2, yNavegacao);
  
  if (paginaAtual > 0) {
    let x = width/2 - 150, y = yNavegacao - 20, w = 40, h = 40, r = 8;
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      fill(120, 220, 255); 
      cursor(HAND);
    } else {
      fill(100, 200, 250);
    }
    stroke(0); strokeWeight(1);
    rect(x, y, w, h, r); 
    fill(0); noStroke();
    textSize(15);
    text("←", width/2 - 130, yNavegacao); 
  }
  
  if (paginaAtual < totalPaginas - 1) {
    let x = width/2 + 80, y = yNavegacao - 20, w = 40, h = 40, r = 8;
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      fill(120, 220, 255); 
      cursor(HAND);
    } else {
      fill(100, 200, 250);
    }
    stroke(0); strokeWeight(1);
    rect(x, y, w, h, r); 
    fill(0); noStroke();
    textSize(15);
    text("→", width/2 + 100, yNavegacao); 
  }
  
  textSize(14); 
  fill(0); noStroke();
  text("Use as setas ← → ou clique", width/2, yInstrucao); 
  textSize(15); 
  textAlign(CENTER, CENTER); 
}

// ---------- Tela Configuração (AJUSTADO) ----------
function drawConfig(){
  //background("#dde7ff");
  fill(0); 
  textSize(25); 
  textAlign(CENTER, CENTER);
  text("Configurações", width/2,60);
  textSize(10); 
  text("Gerencie os dados salvos", width/2,100);
  let x1 = width/2-150, y1 = 150, w1 = 300, h1 = 60, r1 = 12;
  
  if (mouseX > x1 && mouseX < x1 + w1 && mouseY > y1 && mouseY < y1 + h1) {
    fill(170, 240, 170); cursor(HAND);
  } else {
    fill(150, 220, 150);
  }
  stroke(0);
  rect(x1, y1, w1, h1, r1); 
  fill(0); noStroke(); textSize(15);
  text("Exportar (CSV)", width/2, y1 + h1/2);
  
  let xR = width/2-150, yR = 230, wR = 300, hR = 60, rR = 12;
  if (mouseX > xR && mouseX < xR + wR && mouseY > yR && mouseY < yR + hR) {
    fill(255, 170, 170); cursor(HAND);
  } else {
    fill(255, 150, 150);
  }
  stroke(0);
  rect(xR, yR, wR, hR, rR); 
  fill(0); 
  noStroke(); 
  textSize(15);
  text("Resetar jogo", width/2, yR + hR/2);
  
  let x2 = width/2-100, y2 = 475, w2 = 200, h2 = 50, r2 = 12;
  if (mouseX > x2 && mouseX < x2 + w2 && mouseY > y2 && mouseY < y2 + h2) {
    fill(200, 220, 255); 
    cursor(HAND);
  } else {
    fill(180, 200, 250);
  }
  stroke(0);
  rect(x2, y2, w2, h2, r2); 
  fill(0); 
  noStroke(); 
  textSize(15); 
  text("Voltar", width/2, 500);
}

// ---------- mouseClicked (AJUSTADO) ----------
function mouseClicked(){
  if(cliqueBloqueado) return;
  
  if(telaAtual==="config"){
    if(mouseX>width/2-150 && mouseX<width/2+150 && mouseY>150 && mouseY<210) {
      cliqueBloqueado = true;
      setTimeout(() => { cliqueBloqueado = false; }, 500);
      exportarCSVGlobal();
      return; 
    }
    if(mouseX>width/2-150 && mouseX<width/2+150 && mouseY>230 && mouseY<290) {
      cliqueBloqueado = true;
      setTimeout(() => { cliqueBloqueado = false; }, 500);
      let confirmou = confirm("Você tem CERTEZA?\n\nIsso vai apagar o histórico de TODOS os jogadores e não pode ser desfeito. \n\n É aconselhado salvar o arquivo CSV antes de apagar o ranking.");
      if (confirmou) {
        localStorage.removeItem("historicoJogo");
        historicoGlobal = {};
      }
      return;
    }
    let x2 = width/2-100, y2 = 475, w2 = 200, h2 = 50, r2 = 12;
    if (mouseX > x2 && mouseX < x2 + w2 && mouseY > y2 && mouseY < y2 + h2)   { 
      telaAtual="inicio";
      cliqueBloqueado = true;
      setTimeout(() => { cliqueBloqueado = false; }, 300);
      return;
    }
  }

   
  if(telaAtual==="rank"){
    if(mouseX>width/2-100 && mouseX<width/2+100 && mouseY>500 && mouseY<550) {
      telaAtual="inicio";
      cliqueBloqueado = true;
      setTimeout(() => { cliqueBloqueado = false; }, 300);
    }
  }
}

// ---------- Tela Ranking (AJUSTADO) ----------
function drawRank(){
  //background("#fff3c7"); 
  fill(0); textSize(28); textAlign(CENTER, CENTER);
  text("🏆 Ranking", width/2,60);
  textSize(16);
  
  let ranking = [];
  // Loop revertido para a estrutura de nome como chave
  for(let user in historicoGlobal) {
    if(Array.isArray(historicoGlobal[user]) && historicoGlobal[user].length > 0) {
      let melhorTempo = Math.min(...historicoGlobal[user].map(p => p.tempo));
      ranking.push({usuario: user, tempo: melhorTempo}); // 'user' é o nome
    }
  }
  ranking.sort((a,b) => a.tempo - b.tempo);
  
  textAlign(CENTER);
  for(let i=0; i<ranking.length; i++){
    let h = ranking[i];
    text(`${i+1}. ${h.usuario} - ${h.tempo}s`, width/2, 110+i*30);
  }
  
  let x = width/2-100, y = 500, w = 200, h = 50, r = 12;
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    fill(200, 220, 255); cursor(HAND);
  } else {
    fill(180, 200, 250);
  }
  rect(x, y, w, h, r); 
  fill(0); noStroke(); textSize(15); text("Voltar", width/2, y + h/2);
}

// ---------- Salvar histórico localmente (sem alteração) ----------
function salvarHistoricoLocal(){
  localStorage.setItem("historicoJogo", JSON.stringify(historicoGlobal));
}

// ---------- Carregar histórico local (Revertido) ----------
function carregarHistoricoLocal(){
  let dados = localStorage.getItem("historicoJogo");
  if(dados) {
    try {
      // Simplesmente carrega o que está salvo.
      // Se estiver no formato de ID, o botão "Resetar" resolve.
      historicoGlobal = JSON.parse(dados);
    } catch(e) {
      historicoGlobal = {};
    }
  } else {
    historicoGlobal = {};
  }
}

// ---------- Exportar CSV (Revertido) ----------
function exportarCSVGlobal(){
  // MODIFICAÇÃO: Novos campos no CSV
  let csv = "id_usuario,usuario,data,tempo_total,grupo,numero_combinacao,cartas_combinacao\n";
  
  for(let usuario in historicoGlobal) {
    if(Array.isArray(historicoGlobal[usuario])) {
      historicoGlobal[usuario].forEach(partida => {
        if(partida.combinacoes && Array.isArray(partida.combinacoes)) {
          partida.combinacoes.forEach(comb => {
            let cartasStr = comb.cartas.join(", ");
            csv += `${partida.id_usuario},${usuario},${partida.data},${partida.tempo},${partida.grupo},${comb.numero},"[${cartasStr}]"\n`;
          });
        }
      });
    }
  }
  
  let blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
  let url = URL.createObjectURL(blob);
  let a = createA(url,"historico_completo.csv");
  a.attribute("download","historico_completo.csv"); a.hide(); a.elt.click();
}
