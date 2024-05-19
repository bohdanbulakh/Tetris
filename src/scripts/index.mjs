import { Figure } from './figure.mjs';
import { Field } from './field.mjs';

const canvas = document.getElementById('game-field');
const context = canvas.getContext('2d');

const CELLS_COUNT = 20;
const CELL_SIZE = (canvas.width - 1) / CELLS_COUNT;
const START_POS = {
  row: -1,
  col: Math.ceil(CELLS_COUNT / 2),
};

const params = {
  animationId: undefined,
  field: new Field(CELLS_COUNT, CELLS_COUNT),
  figure: new Figure(),
  position: { ...START_POS },
  time: 0,
};

function loop() {
  params.animationId = requestAnimationFrame(loop);

  context.clearRect(0, 0, canvas.width, canvas.height);
  params.field.draw(context, CELL_SIZE);
  params.figure.draw(context, CELL_SIZE, params.position);

  if (++params.time > 35) {
    params.time = 0;
    stepDown();
  }
}

function stepDown() {
  params.position.row++;

  if (params.field.checkCollision(params.figure.matrix, params.position)) {
    if (params.position.row <= 0) {
      cancelAnimationFrame(params.animationId);
      params.gameOver = true;
      return;
    }

    params.position.row--;
    params.field.placeFigure(params.figure.matrix, params.position);
    params.field.deleteFilledRows();

    params.position = { ...START_POS };
    params.figure = new Figure();
  }
}

document.getElementById('start').onclick = () => {
  cancelAnimationFrame(params.animationId);
  params.gameOver = false;

  params.field.clear();
  params.position = { ...START_POS };
  params.figure = new Figure();
  params.animationId = requestAnimationFrame(loop);
};

document.addEventListener('keydown', (event) => {
  if (params.gameOver) return;

  switch (event.key) {
  case 'ArrowDown': {
    stepDown();
    break;
  }

  case 'ArrowUp': {
    params.figure.rotate();

    if (params.field.checkCollision(params.figure.matrix, params.position)) {
      params.figure.applyDirection(3);
    }

    break;
  }

  case 'ArrowLeft': {
    if (!params.field.checkCollision(params.figure.matrix, {
      ...params.position,
      col: params.position.col - 1,
    })) {
      params.position.col--;
    }

    break;
  }

  case 'ArrowRight': {
    if (!params.field.checkCollision(params.figure.matrix, {
      ...params.position,
      col: params.position.col + 1,
    })) {
      params.position.col++;
    }

    break;
  }
  }
});
