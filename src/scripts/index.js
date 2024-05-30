import { Figure } from './figure.js';
import { Field } from './field.js';

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
  animationId: undefined,
  field: new Field(CELLS_COUNT, CELLS_COUNT),
  figures: [],
  pos: { ...START_POS },
  time: 0,
  score: 0,
  status: 'running',
};

const stepDown = () => {
  params.pos.row++;

  if (params.field.checkCollision(params.figures[0].matrix, params.pos)) {
    if (params.pos.row <= 0) {
      cancelAnimationFrame(params.animationId);
      params.status = 'gameOver';
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


const pauseGame = (button) => {
  if (params.status === 'running') {
    params.status = 'paused';
    button.textContent = 'Resume';
    cancelAnimationFrame(params.animationId);
  } else {
    button.textContent = 'Pause';
    params.status = 'running';
    params.animationId = requestAnimationFrame(loop);
  }
};

document.getElementById('start').onclick = () => {
  cancelAnimationFrame(params.animationId);

  params.field.clear();
  params.score = 0;
  params.pos = { ...START_POS };
  params.figures = [new Figure(), new Figure()];
  params.status = 'running';

  params.animationId = requestAnimationFrame(loop);
};


const pauseButton = document.getElementById('pause');
pauseButton.onclick = () => pauseGame(pauseButton);

document.addEventListener('keydown', (event) => {
  if (params.status === 'gameOver') return;

  if (['ArrowDown', 's', 'S'].includes(event.key)) {
    stepDown();
  }

  if (['ArrowUp', 'w', 'W'].includes(event.key)) {
    params.figures[0].rotate();
    if (params.field.checkCollision(params.figures[0].matrix, params.pos)) {
      params.figures[0].applyDirection(3);
    }
  }

  if (
    ['ArrowLeft', 'a', 'A'].includes(event.key) &&
    !params.field.checkCollision(params.figures[0].matrix, {
      ...params.pos,
      col: params.pos.col - 1,
    })
  ) {
    params.pos.col--;
  }

  if (
    ['ArrowRight', 'd', 'D'].includes(event.key) &&
    !params.field.checkCollision(params.figures[0].matrix, {
      ...params.pos,
      col: params.pos.col + 1,
    })
  ) {
    params.pos.col++;
  }

  if (['p', 'P'].includes(event.key)) {
    pauseGame(pauseButton);
  }
});
