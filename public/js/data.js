const COLOR_RANGES = {
    "black": [0, 0, 0, 180, 255, 50],
    "brown": [10, 100, 20, 20, 255, 200],
    "red": [0, 100, 100, 10, 255, 255],
    "orange": [10, 100, 100, 25, 255, 255],
    "yellow": [25, 100, 100, 35, 255, 255],
    "green": [35, 100, 100, 85, 255, 255],
    "blue": [85, 100, 100, 125, 255, 255],
    "violet": [125, 100, 100, 160, 255, 255],
    "gray": [0, 0, 50, 180, 50, 200],
    "white": [0, 0, 200, 180, 30, 255],
    "gold": [20, 100, 100, 30, 255, 255],
    "silver": [0, 0, 100, 180, 255, 150],
};

const COLOR_CODES = {
    "black": 0,
    "brown": 1,
    "red": 2,
    "orange": 3,
    "yellow": 4,
    "green": 5,
    "blue": 6,
    "violet": 7,
    "gray": 8,
    "white": 9,
    "gold": -1,
    "silver": -2,
};
const TOLERANCE_VALUES = {
    "brown": 1,
    "red": 2,
    "green": 0.5,
    "blue": 0.25,
    "violet": 0.1,
    "gray": 0.05,
    "gold": 5,
    "silver": 10,
};