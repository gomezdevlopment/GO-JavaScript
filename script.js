const BLACK = 'black'
const WHITE = 'white'
const PREVIOUS = 'previous'
const L = 'l'
const O = 'o'

const audio = new Audio();
audio.src = "audio/click.mp3";

const errorAudio = new Audio();
errorAudio.src = "audio/error.mp3"

let previousStone

const boardState = [
    L, L, L, L, L, L, L, L, L, O, O, O, O, O, O, O, O, O,
    L, L, L, L, L, L, L, L, L, O, O, O, O, O, O, O, O, O,
    L, L, L, L, L, L, L, L, L, O, O, O, O, O, O, O, O, O,
    L, L, L, L, L, L, L, L, L, O, O, O, O, O, O, O, O, O,
    L, L, L, L, L, L, L, L, L, O, O, O, O, O, O, O, O, O,
    L, L, L, L, L, L, L, L, L, O, O, O, O, O, O, O, O, O,
    L, L, L, L, L, L, L, L, L, O, O, O, O, O, O, O, O, O,
    L, L, L, L, L, L, L, L, L, O, O, O, O, O, O, O, O, O,
    L, L, L, L, L, L, L, L, L, O, O, O, O, O, O, O, O, O,
]

let previousBoardStates = []

const blackStones = []
const whiteStones = []

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
}

function placeStone(intersection, currentClass) {
    intersection.classList.add(currentClass)
    intersection.removeEventListener('click', handleClick)
    const stonePosition = Number(intersection.id)
    boardState[stonePosition] = currentClass
    if (blackTurn) {
        checkIfLegalMove(blackStones, whiteStones, intersection, WHITE, BLACK, stonePosition)
    } else {
        checkIfLegalMove(whiteStones, blackStones, intersection, BLACK, WHITE, stonePosition)
    }
}

function checkIfLegalMove(myStones, enemyStones, stone, enemyColor, myColor, stonePosition) {
    myStones.push(stone)
    checkForCaptures(enemyStones, enemyColor)
    removeCapturedStones(enemyColor, enemyStones)
    const currentBoardState = boardState.toString()
    const ko = previousBoardStates.includes(currentBoardState)

    if (ko) {
        console.log("ko")
        replaceCapturedStones(enemyColor)
        errorAudio.play()
        removePlacedStone(stone, stonePosition, myStones, myColor)
    } else {
        console.log("not ko")
        checkForCaptures(myStones, myColor)
        if (capturedStones.length > 0) {
            removePlacedStone(stone, stonePosition, myStones, myColor)
            errorAudio.play()
        } else {
            passTurn(stone)
        }
    }
}

function removeCapturedStones(color, stones) {
    capturedStones.forEach(stone => {
        stone.classList.remove(color)
        boardState[Number(stone.id)] = L
        const stoneIndex = stones.indexOf(stone)
        stones.splice(stoneIndex, 1)
        stone.addEventListener('click', handleClick)
    })
}

function removePlacedStone(placedStone, stonePosition, stones, color) {
    boardState[stonePosition] = L
    placedStone.addEventListener('click', handleClick)
    placedStone.classList.remove(color)
    stones.splice(stones.indexOf(placedStone), 1)
}

function replaceCapturedStones(color) {
    capturedStones.forEach(stone => {
        stone.classList.add(color)
        boardState[Number(stone.id)] = color
        if (color === WHITE) {
            whiteStones.push(stone)
        } else {
            blackStones.push(stone)
        }
        stone.removeEventListener('click', handleClick)
    })
}

function passTurn(placedStone) {
    blackTurn = !blackTurn
    setSquaresHoverClass()
    audio.play()
    if (previousStone != null) {
        previousStone.classList.remove(PREVIOUS)
    }
    previousStone = placedStone
    placedStone.classList.add(PREVIOUS)
    const currentBoardState = boardState.toString()
    previousBoardStates.push(currentBoardState)
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