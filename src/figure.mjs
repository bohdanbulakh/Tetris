'use strict';
import {random, getRandomElement} from "./utils.mjs";

export class Figure {
    #FIGURES = [
        [
            [0, 0, 1],
            [1, 1, 1],
        ], [
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
        this.figure = getRandomElement(this.#FIGURES);
        this.#applyDirection(random(0, 3));
        this.#applyColor(random(1, Figure.COLORS.length));
    }

    rotate() {
        const rotatedFigure = [];
        const rows = this.figure.length;
        const columns = this.figure[0].length;

        for (let column = 0; column < columns; column++) {
            const newColumn = [];

            for (let row = 0; row < rows; row++) {
                newColumn.push(this.figure[rows - 1 - row][column]);
            }
            rotatedFigure.push(newColumn);
        }

        return rotatedFigure;
    }

    #applyDirection(direction) {
        for (let i = 0; i < direction; i++) {
            this.figure = this.rotate();
        }
    }

    #applyColor(color) {
        for (let i = 0; i < this.figure.length; i++) {
            for (let j = 0; j < this.figure[i].length; j++) {
                if (this.figure[i][j]) {
                    this.figure[i][j] = color;
                }
            }
        }
    }
}
