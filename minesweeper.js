let minefield = document.querySelector('.minefield')
let newGame = document.querySelector('.button')
let score = document.querySelector('.score')
let flags = document.querySelector('.flags')
let flagIcon = document.querySelector('.flag-icon')
let settings = document.querySelectorAll('.input')
let boardWidth = 30

let setWidth = () => {
    settings.forEach (x => {
        if (x.checked) boardWidth = (+x.id)
    })
    console.log(boardWidth)
}
let board = []
let boardSize = 0
let bombCount = 0
let flagCount = 0
let getRandomInt = (input) => {
    return Math.floor(Math.random() * input)
}

//      Create minefield
let buildBoard = () => {
    setWidth()
    boardSize = boardWidth * 16
    bombCount = boardSize / 4
    flagCount = 0
    score.textContent = ''
    flags.textContent = ''
    score.style.opacity = '0'
    flags.style.opacity = '0'
    flagIcon.style.opacity = '0'
    minefield.textContent = ''
    minefield.style.width = `${10 + (boardWidth * 30)}px`
    //  Create squares
    for (let i = 0; i < boardSize; i++) {
        let square = document.createElement('div')
        square.setAttribute('isFlagged', 'false')
        square.setAttribute('isBomb', 'false')
        square.setAttribute('id', i)
        square.setAttribute('data', 0)
        square.classList.add('square')
        minefield.append(square)
        board = minefield.querySelectorAll('.square')
    }
    //      Set bombs in random squares
    for (let i = 0; i < bombCount; i++) {
        board[getRandomInt(boardSize - 1)].setAttribute('isBomb', 'true')
    }
    //      Set amount of bombs near each square
    for (let i = 0; i < boardSize; i++) {
        let bombsNear = 0
        let isLeftSide = (i % boardWidth === 0)
        let isRightSide = (i % boardWidth === (boardWidth - 1))
        if (board[i].getAttribute('isBomb') === 'false') {
            let nw = i - boardWidth - 1
            let north = i - boardWidth
            let ne = i - boardWidth + 1
            let east = i + 1
            let se = i + boardWidth + 1
            let south = i + boardWidth
            let sw = i + boardWidth - 1
            let west = i - 1

            // Check square to the north west for a bomb
            if (i > boardWidth 
                && !isLeftSide 
                && board[nw].getAttribute('isBomb') === 'true') {
                bombsNear++
            }
            // Check square to the north for a bomb
            if (i >= boardWidth 
                && board[north].getAttribute('isBomb') === 'true') {
                bombsNear++
            }
            // Check square to the north east for a bomb
            if (i >= boardWidth 
                && !isRightSide 
                && board[ne].getAttribute('isBomb') === 'true') {
                bombsNear++
            }
            //  Check square to the east for a bomb
            if (i < boardSize 
                && !isRightSide 
                && board[east].getAttribute('isBomb') === 'true') {
                bombsNear++
            }
            // Check square to the south east for a bomb
            if (i < (boardSize - boardWidth) 
                && !isRightSide 
                && board[se].getAttribute('isBomb') === 'true') {
                bombsNear++
            }
            // Check square to the south for a bomb
            if (i < (boardSize - boardWidth) 
                && board[south].getAttribute('isBomb') === 'true') {
                bombsNear++
            }
            // Check square to the south west for a bomb
            if (i <= (boardSize - boardWidth) 
                && !isLeftSide 
                && board[sw].getAttribute('isBomb') === 'true') {
                bombsNear++
            }
            // Check square to the west for a bomb
            if (i > 0 && !isLeftSide 
                && board[west].getAttribute('isBomb') === 'true') {
                bombsNear++
            }
            board[i].setAttribute('data', bombsNear)
        }
    }
    minefield.style.outline = '2px solid black'
    
    //      Set listeners
    board.forEach(x => {

        //      Right click     //
        x.addEventListener('contextmenu', event => {
            event.preventDefault()

            if (x.classList.contains('show')) {
                return
            } else {
                //  Remove flag
                if (x.getAttribute('isFlagged') === 'true') {
                    x.classList.remove('flag', 'checked')
                    x.setAttribute('isFlagged', 'false')
                    flagCount--
                } else {
                    //  Add flag
                    x.classList.add('flag', 'checked')
                    x.setAttribute('isFlagged', 'true')
                    flagCount++
                }
            }
            checkFlags()
            progress()
        })

        //      Left click       //
        x.addEventListener('click', () => {

            // If it's not flagged
            if (x.getAttribute('isFlagged') === 'false') {

                //      If it's a bomb
                if (x.getAttribute('isBomb') === 'true') {
                    x.classList.add('bomb', 'checked', 'kaboom')
                    gameOver()
                } else {

                    //      If it's not a bomb and not empty
                    if (x.getAttribute('data') > 0) {
                        x.classList.add('checked', 'show')
                        x.textContent = x.getAttribute('data')
                        if (x.getAttribute('data') === '1') x.style.color = 'rgb(50, 50, 200)'
                        if (x.getAttribute('data') === '2') x.style.color = 'rgb(0, 65, 0)'
                        if (x.getAttribute('data') === '3') x.style.color = 'rgb(180, 50, 50)'
                        if (x.getAttribute('data') === '4') x.style.color = 'rgb(10, 5, 130)'
                        if (x.getAttribute('data') === '5') x.style.color = 'rgb(65, 0, 0)'
                        if (x.getAttribute('data') === '6') x.style.color = 'orange'
                        if (x.getAttribute('data') === '7') x.style.color = 'yellow'
                    } else {
                        // If it's not a bomb and it is empty
                        x.classList.remove('hint')
                        x.classList.add('checked', 'show')
                        // check for empty neighbours and clear them
                        checkEmpty(x.getAttribute('id'))
                    }
                }
            } else {
                return
            }
            progress()
        })
    })
    setTimeout(() => {
        checkFlags()
    }, 100);
    // Hint
    for (let i = (boardWidth * 3); i < boardSize; i++) {
        if (board[i].getAttribute('isbomb') === 'false' && board[i].getAttribute('data') === '0') {
            board[i].classList.add('hint')
            return
        }
    }
}

//      Track flags while in game
let checkFlags = () => {

    //      Set amount of flags needed
    let bombs = 0
    board.forEach(x => {
        if (x.getAttribute('isBomb') === 'true') bombs++
    })

    //      Display flags
    if (board.length) {
        flags.textContent = `${bombs - flagCount}`
        flags.style.opacity = '1'
        flagIcon.style.opacity = '1'
    }
}

//      Track progress while in game
let progress = () => {
    let count = 0
    board.forEach(x => {
        if (x.classList.contains('checked')) count++
        if (count === boardSize) gameOver()
    })
}

//      Clear empty space when clicking
let checkEmpty = (index) => {
    let isLeftSide = (index % boardWidth === 0)
    let isRightSide = (index % boardWidth === (boardWidth - 1))
    let nw = +index - boardWidth - 1
    let north = +index - boardWidth
    let ne = +index - boardWidth + 1
    let east = +index + 1
    let se = +index + boardWidth + 1
    let south = +index + boardWidth
    let sw = +index + boardWidth - 1
    let west = +index - 1

    //          Check north west if empty
    if (index > boardWidth 
        && !isLeftSide 
        && board[nw].getAttribute('data') >= 0 
        && !board[nw].classList.contains('checked') 
        && board[nw].getAttribute('isBomb') === 'false') {
        board[nw].click()
    }
    //          Check north if empty
    if (index >= boardWidth 
        && board[north].getAttribute('data') >= 0 
        && !board[north].classList.contains('checked') 
        && board[north].getAttribute('isBomb') === 'false') {
        board[north].click()
    }
    //          Check north east if empty
    if (index >= boardWidth 
        && !isRightSide 
        && board[ne].getAttribute('data') >= 0 
        && !board[ne].classList.contains('checked') 
        && board[ne].getAttribute('isBomb') === 'false') {
        board[ne].click()
    }
    //          Check east if empty
    if (index < (boardSize - 1) 
        && !isRightSide 
        && board[east].getAttribute('data') >= 0 
        && !board[east].classList.contains('checked') 
        && board[east].getAttribute('isBomb') === 'false') {
        board[east].click()
    }
    //          Check south east if empty
    if (index < (boardSize - boardWidth) 
        && !isRightSide 
        && board[se].getAttribute('data') >= 0  
        && !board[se].classList.contains('checked')
        && board[se].getAttribute('isBomb') === 'false') {
        board[se].click()
    }
    //          Check south if empty
    if (index < (boardSize - boardWidth) 
        && board[south].getAttribute('data') >= 0  
        && !board[south].classList.contains('checked')
        && board[south].getAttribute('isBomb') === 'false') {
        board[south].click()
    }
    //          Check south west if empty
    if (index <= (boardSize - boardWidth) 
        && !isLeftSide 
        && board[sw].getAttribute('data') >= 0  
        && !board[sw].classList.contains('checked')
        && board[sw].getAttribute('isBomb') === 'false') {
        board[sw].click()
    }
    //          Check west if empty
    if (index > 0 
        && !isLeftSide 
        && board[west].getAttribute('data') >= 0  
        && !board[west].classList.contains('checked')
        && board[west].getAttribute('isBomb') === 'false') {
        board[west].click()
    }
}

//      Game over function (end game, display score)
let gameOver = () => {
    for (let i = 0; i < boardSize; i++) {
        if (board[i].getAttribute('isBomb') === 'true' 
            && !board[i].classList.contains('flag')) {
            board[i].classList.add('bomb')
        }
    }
    //     Stop game board interaction
    board.forEach(x => x.classList.add('disabled'))

    //      Calculate score
    let total = 0
    let bombs = 0
    board.forEach (x => {
        if (x.getAttribute('isBomb') === 'true') bombs++
        if (x.getAttribute('isflagged') === 'true' 
            && x.getAttribute('isBomb') === 'true') {
            total++
        }
    })
    //      Display score
    if (total === bombs) {
        score.textContent = `Congratulations you flagged all ${total} of ${bombs} mines`
        score.style.opacity = '1'
        newGame.classList.add('highlight')
    } else {
        score.textContent = `You flagged ${total} of ${bombs} mines`
        score.style.opacity = '1'
        newGame.classList.add('highlight')
    }
}

//      New game button
newGame.addEventListener('click', () => {
    newGame.classList.remove('highlight')
    minefield.style.opacity = 1
    buildBoard()
})