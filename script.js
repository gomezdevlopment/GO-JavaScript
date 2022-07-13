const BLACK = 'black'
const WHITE = 'white'
const PREVIOUS = 'previous'
const L = 'l'

const audio = new Audio();
audio.src = "audio/click.mp3";

let previousStone

let boardState = [
    L, L, L, L, L, L, L, L, L, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    L, L, L, L, L, L, L, L, L, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    L, L, L, L, L, L, L, L, L, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    L, L, L, L, L, L, L, L, L, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    L, L, L, L, L, L, L, L, L, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    L, L, L, L, L, L, L, L, L, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    L, L, L, L, L, L, L, L, L, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    L, L, L, L, L, L, L, L, L, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    L, L, L, L, L, L, L, L, L, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
]

let blackStones = []
let whiteStones = []

const squares = document.getElementById('squares')
let intersections = squares.children
const mapOfIntersections = new Map();
let blackTurn

startGame()

function startGame() {
    blackTurn = true

    for (let i = 0; i < 81; i++) {
        const intersection = intersections[i]
        mapOfIntersections.set(Number(intersection.id), intersection)
        intersection.addEventListener('click', handleClick)
    }

    setSquaresHoverClass()
}

function handleClick(e) {
    const intersection = e.target
    const currentClass = blackTurn ? BLACK : WHITE
    placeStone(intersection, currentClass)
    audio.play()
    passTurn()
    setSquaresHoverClass()
}

function placeStone(intersection, currentClass) {
    if(previousStone != null){
        previousStone.classList.remove(PREVIOUS)
    }

    previousStone = intersection
    intersection.classList.add(currentClass)
    intersection.classList.add(PREVIOUS)
    const stonePosition = Number(intersection.id)
    boardState[stonePosition] = currentClass
    if (blackTurn) {
        blackStones.push(intersection)
        checkForCaptures(whiteStones, WHITE)
        capturedStones.forEach(stone => {
            stone.classList.remove(WHITE)
            boardState[Number(stone.id)] = L
            const stoneIndex = whiteStones.indexOf(stone)
            whiteStones.splice(stoneIndex, 1)
        })
    } else {
        whiteStones.push(intersection)
        checkForCaptures(blackStones, BLACK)
        capturedStones.forEach(stone => {
            stone.classList.remove(BLACK)
            boardState[Number(stone.id)] = L
            const stoneIndex = blackStones.indexOf(stone)
            blackStones.splice(stoneIndex, 1)
        })
    }
}

function passTurn() {
    blackTurn = !blackTurn
}

let groupedStones = []
let groupedStonesHaveLiberty = false
let checkedStones = []
let capturedStones = []

function checkForCaptures(stonesOnBoard, friendlyColor) {
    capturedStones = []
    checkedStones = []
    groupCount = 0
    stonesOnBoard.forEach(stone => {
        if (!checkedStones.includes(stone)) {
            const stonePosition = Number(stone.id)
            groupedStonesHaveLiberty = false
            groupedStones = [stone]
            checkLiberties(stonePosition, friendlyColor)
            checkedStones.push.apply(checkedStones, groupedStones)
            if (!groupedStonesHaveLiberty) {
                capturedStones.push.apply(capturedStones, groupedStones)
            }
        }
    })
}

function checkLiberties(stonePosition, friendlyColor) {
    const up = stonePosition - 18
    const left = stonePosition - 1
    const right = stonePosition + 1
    const down = stonePosition + 18

    const intersectionUp = boardState[up]
    const intersectionLeft = boardState[left]
    const intersectionRight = boardState[right]
    const intersectionDown = boardState[down]

    if (intersectionUp === L) {
        groupedStonesHaveLiberty = true
    } else if (intersectionUp === friendlyColor) {
        const stone = mapOfIntersections.get(up)
        const stonePosition = up
        if (!groupedStones.includes(stone)) {
            groupedStones.push(stone)
            checkLiberties(stonePosition, friendlyColor)
        }
    }

    if (intersectionLeft === L) {
        groupedStonesHaveLiberty = true
    } else if (intersectionLeft === friendlyColor) {
        const stone = mapOfIntersections.get(left)
        const stonePosition = left
        if (!groupedStones.includes(stone)) {
            groupedStones.push(stone)
            checkLiberties(stonePosition, friendlyColor)
        }
    }

    if (intersectionRight === L) {
        groupedStonesHaveLiberty = true
    } else if (intersectionRight === friendlyColor) {
        const stone = mapOfIntersections.get(right)
        const stonePosition = right
        if (!groupedStones.includes(stone)) {
            groupedStones.push(stone)
            checkLiberties(stonePosition, friendlyColor)
        }
    }

    if (intersectionDown === L) {
        groupedStonesHaveLiberty = true
    } else if (intersectionDown === friendlyColor) {
        const stone = mapOfIntersections.get(down)
        const stonePosition = down
        if (!groupedStones.includes(stone)) {
            groupedStones.push(stone)
            checkLiberties(stonePosition, friendlyColor)
        }
    }
}

function setSquaresHoverClass() {
    squares.classList.remove(BLACK)
    squares.classList.remove(WHITE)
    if (blackTurn) {
        squares.classList.add(BLACK)
    } else {
        squares.classList.add(WHITE)
    }
}