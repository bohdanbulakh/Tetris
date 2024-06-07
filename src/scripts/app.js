'use strict';

const random = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const getRandomElement = (array) => array[random(0, array.length - 1)];

class Figure {
  static COLORS = [
    '#9d4edd',
    '#014f86',
    '#0a9396',
    '#25a244',
    '#ee9b00',
    '#ca6702',
    '#ae2012',
  ];

  #FIGURES = [
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1, 1, 1],
    ],
  ];

  constructor() {
    this.matrix = getRandomElement(this.#FIGURES);
    this.applyDirection(random(0, 3));
    this.#applyColor(random(1, Figure.COLORS.length));
  }

  rotate() {
    this.matrix = this.matrix[0].map((_, colIndex) =>
      this.matrix.map((row) => row[colIndex]).reverse()
    );
  }

  applyDirection(direction) {
    for (let i = 0; i < direction; i++) {
      this.rotate();
    }
  }

  #applyColor(colorIndex) {
    this.matrix = this.matrix.map(
      (row) => row.map((cell) => (cell ? colorIndex : cell))
    );
  }

  draw(context, size, position) {
    const startRow = position.row - (this.matrix.length - 1);

    for (let i = 0; i < this.matrix.length; i++) {
      if (startRow + i >= 0) {
        for (let j = 0; j < this.matrix[i].length; j++) {
          if (this.matrix[i][j]) {
            context.fillStyle = Figure.COLORS[this.matrix[i][j] - 1];
            context.fillRect(
              1 + (j + position.col) * size,
              1 + (startRow + i) * size,
              size - 1, size - 1
            );
          }
        }
      }
    }
  }
}

class Field {
  constructor(rows, columns) {
    this.matrix = Array(rows).fill(Array(columns).fill(0));
  }

  clear() {
    this.matrix = this.matrix.map((row) => row.map(() => 0));
  }

  checkCollision(figure, position) {
    if (
      position.row >= this.matrix.length ||
        position.col + figure[0].length > this.matrix[0].length ||
        position.col < 0
    ) {
      return true;
    }

    const startRow = position.row - (figure.length - 1);
    for (let i = 0; i < figure.length; i++) {
      if (startRow + i >= 0) {
        for (let j = 0; j < figure[i].length; j++) {
          if (figure[i][j] && this.matrix[startRow + i][position.col + j]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  placeFigure(figure, position) {
    const startRow = position.row - (figure.length - 1);
    for (let i = 0; i < figure.length; i++) {
      if (startRow + i >= 0) {
        for (let j = 0; j < figure[i].length; j++) {
          if (figure[i][j]) {
            this.matrix[startRow + i][position.col + j] = figure[i][j];
          }
        }
      }
    }
  }

  deleteFilledRows() {
    let deleted = 0;

    for (let i = 0; i < this.matrix.length; i++) {
      if (this.matrix[i].every((elem) => !!elem)) {
        deleted++;
        for (let j = i; j > 0; j--) {
          this.matrix[j] = this.matrix[j - 1];
        }
        this.matrix[0] = (new Array(this.matrix[0].length)).fill(0);
      }
    }

    return deleted;
  }

  draw(context, cellSize) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j]) {
          context.fillStyle = Figure.COLORS[this.matrix[i][j] - 1];
          context.fillRect(
            1 + j * cellSize,
            1 + i * cellSize,
            cellSize - 1,
            cellSize - 1
          );
        }
      }
    }
  }
}

const fieldCanvas = document.getElementById('game-field');
const fieldCtx = fieldCanvas.getContext('2d');

const nextFigureCanvas = document.getElementById('next-figure');
const nextFigCtx = nextFigureCanvas.getContext('2d');
const scoreBar = document.getElementById('score');

const CELLS_COUNT = 20;
const CELL_SIZE = (fieldCanvas.width - 1) / CELLS_COUNT;
const START_POS = {
  row: -1,
  col: Math.ceil(CELLS_COUNT / 2),
};

const params = {
  animationId: null,
  field: new Field(CELLS_COUNT, CELLS_COUNT),
  figures: [],
  pos: { ...START_POS },
  time: 0,
  score: 0,
  status: 'gameOver',
};

const showGameOver = (context, text) => {
  const WIDTH = 500;
  const HEIGHT = 150;

  const center = {
    x: context.canvas.width / 2,
    y: context.canvas.height / 2,
  };

  context.globalAlpha = '0.9';
  context.fillStyle = '#59652b';
  context.fillRect(center.x - WIDTH / 2, center.y - HEIGHT / 2, WIDTH, HEIGHT);

  context.globalAlpha = 1;
  context.fillStyle = '#D0D6B3';
  context.font = '72px medium';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, center.x, center.y);
};

const stepDown = () => {
  if (params.score >= 999999) {
    cancelAnimationFrame(params.animationId);
    params.status = 'gameOver';
    showGameOver(fieldCtx, 'YOU WON!');
  }
  params.pos.row++;

  if (params.field.checkCollision(params.figures[0].matrix, params.pos)) {
    if (params.pos.row <= 0) {
      cancelAnimationFrame(params.animationId);
      params.status = 'gameOver';
      showGameOver(fieldCtx, 'GAME OVER!');
      return;
    }

    params.pos.row--;
    params.field.placeFigure(params.figures[0].matrix, params.pos);
    params.score += params.field.deleteFilledRows();

    params.pos = { ...START_POS };
    params.figures.push(new Figure());
    params.figures.shift();
  }
};

const loop = () => {
  params.animationId = requestAnimationFrame(loop);
  scoreBar.textContent = params.score;

  params.field.draw(fieldCtx, CELL_SIZE);
  params.figures[0].draw(fieldCtx, CELL_SIZE, params.pos);

  const nextFigure = params.figures[1];
  nextFigureCanvas.width = nextFigure.matrix[0].length * CELL_SIZE;
  nextFigureCanvas.height = nextFigure.matrix.length * CELL_SIZE;

  nextFigure.draw(nextFigCtx, CELL_SIZE, {
    row: nextFigure.matrix.length - 1,
    col: 0,
  });

  if (++params.time > 35) {
    params.time = 0;
    stepDown();
  }
};

const pauseButton = document.getElementById('pause');

const actions = {
  ArrowDown: (params) => {
    if (params.status === 'gameOver') return;
    stepDown();
  },

  ArrowUp: (params) => {
    if (params.status === 'gameOver') return;

    params.figures[0].rotate();
    if (params.field.checkCollision(params.figures[0].matrix, params.pos)) {
      params.figures[0].applyDirection(3);
    }
  },

  ArrowLeft: (params) => {
    if (params.status === 'gameOver') return;

    if (!params.field.checkCollision(params.figures[0].matrix, {
      ...params.pos,
      col: params.pos.col - 1,
    })) {
      params.pos.col--;
    }
  },

  ArrowRight: (params) => {
    if (params.status === 'gameOver') return;

    if (!params.field.checkCollision(params.figures[0].matrix, {
      ...params.pos,
      col: params.pos.col + 1,
    })) {
      params.pos.col++;
    }
  },

  KeyP: (params) => {
    switch (params.status) {
    case 'gameOver':
      return;
    case 'running':
      params.status = 'paused';
      pauseButton.textContent = 'Resume';
      cancelAnimationFrame(params.animationId);
      break;
    case 'paused':
      pauseButton.textContent = 'Pause';
      params.status = 'running';
      params.animationId = requestAnimationFrame(loop);
      break;
    }
  },

  KeyS: (params) => {
    cancelAnimationFrame(params.animationId);

    params.field.clear();
    params.score = 0;
    params.pos = { ...START_POS };
    params.figures = [new Figure(), new Figure()];
    params.status = 'running';

    params.animationId = requestAnimationFrame(loop);
  }
};

document.getElementById('start').onclick = () => actions.KeyS(params);
pauseButton.onclick = () => actions.KeyP(params);

document.addEventListener('keydown', (event) => {
  if (actions[event.code]) {
    actions[event.code](params);
  }
});
