let plants = [];
let waterSlider, lightSlider;
let waterLevel = 50;
let lightLevel = 50;
let healthStatus = "Saudável";
let isRaining = false;
let drops = [];

function setup() {
  createCanvas(800, 600);

  // Criar várias plantas pequenas com um espaçamento maior
  for (let i = 0; i < 5; i++) {
    let xPos = random(100, width - 100);
    let yPos = height - 100;

    // Garantir que as plantas não se sobreponham
    while (isOverlapping(xPos, yPos)) {
      xPos = random(100, width - 100);
    }

    plants.push(new Plant(xPos, yPos));
  }

  waterSlider = createSlider(0, 100, 50);
  waterSlider.position(20, height - 50);
  waterSlider.input(() => waterLevel = waterSlider.value());

  lightSlider = createSlider(0, 100, 50);
  lightSlider.position(200, height - 50);
  lightSlider.input(() => lightLevel = lightSlider.value());

  let rainButton = createButton('Ativar Chuva');
  rainButton.position(400, height - 50);
  rainButton.mousePressed(toggleRain);

  textSize(16);
  fill(0);
  text('Ajuste os sliders para cuidar das plantas!', 20, 30);
  text('Água', 20, height - 80);
  text('Luz', 200, height - 80);
}

function draw() {
  background(135, 206, 235); // Céu azul
  drawSoil(); // Terra
  drawSun(); // Desenhando o sol

  if (isRaining) {
    createRain();
    updateRain();
    drawRain();
  }

  // Desenhar as plantas
  for (let plant of plants) {
    plant.display();
    plant.growth(waterLevel, lightLevel);
  }

  displayHealthStatus();
  displaySliders();
}

function drawSoil() {
  fill(139, 69, 19); // Cor da terra
  noStroke();
  rect(0, height - 100, width, 100); // O fundo de terra
}

function drawSun() {
  // Posição do sol no canto superior direito
  let sunX = width - 80;
  let sunY = 80;
  let sunSize = 80;
  
  fill(255, 223, 0); // Cor do sol (amarelo)
  noStroke();
  ellipse(sunX, sunY, sunSize, sunSize); // Desenha o sol
}

function createRain() {
  if (frameCount % 5 === 0) {
    drops.push(new RainDrop(random(width), 0, random(5, 10)));
  }
}

function updateRain() {
  for (let i = drops.length - 1; i >= 0; i--) {
    let drop = drops[i];
    drop.update();
    if (drop.y > height) {
      drops.splice(i, 1);
    }
  }
}

function drawRain() {
  for (let drop of drops) {
    drop.display();
  }
}

function toggleRain() {
  isRaining = !isRaining;
}

class RainDrop {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(4, 10);
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(0, 0, 255);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size * 2);
  }
}

class Plant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10; // Tamanho inicial menor
    this.maxSize = 50; // Tamanho máximo reduzido
    this.minSize = 10; // Tamanho mínimo reduzido
    this.health = "Saudável";
    this.stemLength = 20; // Comprimento do tronco reduzido
    this.stemWidth = 4; // Largura do tronco reduzida
    this.leafCount = 0; // Começa sem folhas
  }

  display() {
    fill(139, 69, 19);
    rect(this.x - this.stemWidth / 2, this.y - this.stemLength, this.stemWidth, this.stemLength);

    for (let i = 0; i < this.leafCount; i++) {
      let angle = map(i, 0, this.leafCount, -PI / 4, PI / 4);
      let leafX = this.x + cos(angle) * (this.size / 2);
      let leafY = this.y - this.stemLength + sin(angle) * (this.size / 2);
      fill(34, 139, 34);
      ellipse(leafX, leafY, this.size / 3, this.size / 6);
    }

    fill(34, 139, 34);
    if (this.health === "Murcha") {
      fill(255, 0, 0);
    } else if (this.health === "Florescendo!") {
      fill(255, 223, 0);
    }
    ellipse(this.x, this.y - this.stemLength, this.size, this.size);
  }

  growth(water, light) {
    if (water > 70 && light > 70) {
      this.size += 1.0; // Crescimento mais lento
      this.health = "Florescendo!";
      this.leafCount = 12; // Mais folhas quando a planta está florescendo
    } else if (water > 40 && light > 40) {
      this.size += 0.3; // Crescimento moderado
      this.health = "Saudável";
      this.leafCount = 8; // Folhas moderadas quando a planta está saudável
    } else if (water < 20 || light < 20) {
      this.size -= 0.2;
      this.health = "Murcha";
      this.leafCount = 0; // Sem folhas quando a planta está murcha
    }

    this.size = constrain(this.size, this.minSize, this.maxSize);
    this.stemLength = constrain(this.size * 0.5, 20, 50); // Tronco mais curto
  }
}

// Função para verificar se as plantas estão sobrepondo
function isOverlapping(x, y) {
  for (let plant of plants) {
    let distance = dist(x, y, plant.x, plant.y);
    if (distance < 80) { // 80 é a distância mínima entre as plantas
      return true;
    }
  }
  return false;
}

function displayHealthStatus() {
  fill(0);
  textSize(18);
  textAlign(CENTER);
  text(`Status das Plantas: ${plants[0].health}`, width / 2, 30); // Exibindo o status de uma das plantas
}

function displaySliders() {
  fill(0);
  textSize(14);
  text('Água: ' + waterLevel, 100, height - 20);
  text('Luz: ' + lightLevel, 300, height - 20);

  fill(0, 0, 255);
  rect(20, height - 70, waterLevel * 3, 20);

  fill(255, 204, 0);
  rect(200, height - 70, lightLevel * 3, 20);
}
