import { random, getRandomElement } from './utils.mjs';

export class Figure {
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

  static COLORS = [
    'red',
    'blue',
    'magenta',
    'cyan',
    'green',
    'yellow',
    'brown'
  ];

  constructor() {
    this.matrix = getRandomElement(this.#FIGURES);
    this.applyDirection(random(0, 3));
    this.#applyColor(random(1, Figure.COLORS.length));
  }

  rotate() {
    const rotatedFigure = [];

    for (let i = 0; i < this.matrix[0].length; i++) {
      const newRow = [];

      for (let j = 0; j < this.matrix.length; j++) {
        newRow.push(this.matrix[this.matrix.length - 1 - j][i]);
      }
      rotatedFigure.push(newRow);
    }
    this.matrix = rotatedFigure;
  }

  applyDirection(direction) {
    for (let i = 0; i < direction; i++) {
      this.rotate();
    }
  }

  #applyColor(colorIndex) {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j]) {
          this.matrix[i][j] = colorIndex;
        }
      }
    }
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
              1 + (startRow + i) * size, size - 1, size - 1
            );
          }
        }
      }

    }
  }
}
