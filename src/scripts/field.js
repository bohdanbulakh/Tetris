import { Figure } from './figure.js';

export class Field {
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
        for (let j = 0; j < figure[0].length; j++) {
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
            1 + j * cellSize, 1 + i * cellSize, cellSize - 1, cellSize - 1
          );
        }
      }
    }
  }
}
