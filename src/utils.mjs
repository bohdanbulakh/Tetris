'use strict';

function random(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function getRandomElement(array) {
    return array[random(0, array.length - 1)];
}

export {random, getRandomElement}
