BOARD_TIMEOUT = 1000

window.onload = () ->

    gameOver = false
    canvas = document.getElementById "stage"
    ctx = canvas.getContext '2d'

    boardTurns = []
    boardWinners = []
    boardTimeouts = []
    board = []
    resetBoard = () ->
        board = new Array()
        boardWinners = [['','',''],['','',''],['','','']]
        boardTurns = [1,1,1,1,1,1,1,1,1]
        for b in [0..8]
            smallBoard = new Array()
            for r in [0..2]
                row = new Array()
                row[0] = ''
                row[1] = ''
                row[2] = '' 
                smallBoard.push row
            board.push smallBoard
        for i in [0..2]
            row = new Array()
            for j in [0..2]
                row[j] = BOARD_TIMEOUT
            boardTimeouts.push row
    resetBoard()
    mouse = { x:0, y:0 }
    select = false
    fps = 50

    run = () ->

        for i in [0..8]
            boardWinners[Math.floor(i/3)][i%3] = checkBoard board[i]

        #draw background
        ctx.fillStyle = "#BBBBBB"
        ctx.fillRect 0, 0, 800, 600

        updateTimers()
        drawBoard()

        #draw cursor
        ctx.fillStyle = "#EEEEEE"
        ctx.fillRect mouse.x, mouse.y, 5, 5

        return

    canvas.onmousemove = (e) ->

        totalOffsetX = 0
        totalOffsetY = 0
        canvasX = 0
        canvasY = 0
        curElem = canvas
        cond = true
        while cond
            totalOffsetX += curElem.offsetLeft - curElem.scrollLeft
            totalOffsetY += curElem.offsetTop - curElem.scrollTop
            cond = (curElem = curElem.offsetParent)
        canvasX = e.pageX - totalOffsetX
        canvasY = e.pageY - totalOffsetY
        mouse.x = canvasX
        mouse.y = canvasY
        return

    canvas.onclick = (e) ->
        if gameOver
            gameOver = false
            resetBoard()
        if select
            [r, c] = coordsToRowCol mouse.x, mouse.y
            if getTurn(r, c) == 'X'
                setBoardInfo r, c
        return

    updateTimers = () ->
        for i in [0..2]
            for j in [0..2]
                if boardWinners[j][i] == '' and not gameOver
                    x = 200 + 130 * i
                    y = 100 + 130 * j
                    boardTimeouts[j][i] -= (10 - numBoards())
                    if boardTimeouts[j][i] <= 0
                        boardTimeouts[j][i] = BOARD_TIMEOUT
                        b = whichBoard j*3, i*3
                        boardTurns[b] = -1
                        aimove b, j*3, i*3
                    t = boardTimeouts[j][i]
                    ctx.fillStyle = "#333333"
                    ctx.fillRect x, y, 118 * (t / BOARD_TIMEOUT), 118

    drawBoard = () ->

        #draw cells
        ctx.fillStyle = "#AAAAAA"
        select = false
        for i in [0..8]
            for j in [0..8]
                x = 200 + i * 40
                if i > 2
                    x += 10
                if i > 5
                    x += 10
                y = 100 + j * 40
                if j > 2
                    y += 10
                if j > 5
                    y += 10
                ctx.fillRect x, y, 38, 38
                if mouse.x > x and mouse.x < x + 38 and mouse.y > y and mouse.y < y + 38
                    ctx.fillStyle = "#CCCCCC"
                    ctx.fillRect x, y, 38, 38
                    ctx.fillStyle = "#AAAAAA"
                    select = true
                if getBoardInfo(j,i) == 'X'
                    drawX x, y, 38, 1
                if getBoardInfo(j,i) == 'O'
                    drawO x, y, 19, 1
        for i in [0..2]
            for j in [0..2]
                x = 200 + i * 130
                y = 100 + j * 130
                if boardWinners[j][i] == 'X'
                    drawX x, y, 120, 5
                if boardWinners[j][i] == 'O'
                    drawO x, y, 60, 5
        if checkBigBoard() == 'X'
                drawX 200, 100, 380, 10
                gameOver = true
        if checkBigBoard() == 'O'
                drawO 200, 100, 190, 10
                gameOver = true
            
        return

    drawX = (x, y, w, lw) ->
        ctx.lineWidth = lw
        ctx.strokeStyle = "#555555"
        ctx.beginPath()
        ctx.moveTo x, y
        ctx.lineTo x + w, y + w
        ctx.stroke()
        ctx.moveTo x + w, y
        ctx.lineTo x, y + w
        ctx.stroke()
        ctx.lineWidth = 1

    drawO = (x, y, r, lw) ->
        ctx.lineWidth = lw
        ctx.strokeStyle = "#DDDDDD"
        ctx.beginPath()
        ctx.arc x + r, y + r, r, 0, 2 * Math.PI, true
        ctx.closePath()
        ctx.stroke()
        ctx.lineWidth = 1

    coordsToRowCol = (x,y) ->

        row = y - 100
        if row > 120
            row -= 10
        if row > 240
            row -= 10
        row = Math.floor ( row / 40 )

        col = x - 200
        if col > 120
            col -= 10
        if col > 240
            col -= 10
        col = Math.floor ( col / 40 )

        return [row, col]

    whichBoard = (r, c) ->
        return (3*Math.floor(r/3) + Math.floor(c/3))

    getBoardInfo = (r,c) ->
        b = whichBoard r,c
        row = r % 3
        col = c % 3
        return board[b][row][col]

    getTurn = (r, c) ->
        return if boardTurns[whichBoard(r,c)] == 1 then 'X' else 'O'

    setBoardInfo = (r,c) ->
        b = whichBoard r,c
        if gameOver or (boardWinners[Math.floor(r/3)][Math.floor(c/3)] == 'X' or boardWinners[Math.floor(r/3)][Math.floor(c/3)] == 'O')
            return false
        mark = getTurn r,c
        row = r % 3
        col = c % 3
        if board[b][row][col] == ''
            board[b][row][col] = mark
            boardTurns[b] = -boardTurns[b]
            boardTimeouts[Math.floor(b/3)][b%3] = BOARD_TIMEOUT
            if mark == 'X'
                aimove b, r - r%3, c - c%3
            return true
        return false 

    checkBoard = (b) ->
        for i in [0..2]
            if b[i][0] == 'X' and b[i][1] == 'X' and b[i][2] == 'X'
                return 'X'
            if b[0][i] == 'X' and b[1][i] == 'X' and b[2][i] == 'X'
                return 'X'
            if b[i][0] == 'O' and b[i][1] == 'O' and b[i][2] == 'O'
                return 'O'
            if b[0][i] == 'O' and b[1][i] == 'O' and b[2][i] == 'O'
                return 'O'

        if b[0][0] == 'X' and b[1][1] == 'X' and b[2][2] == 'X'
            return 'X'
        if b[0][2] == 'X' and b[1][1] == 'X' and b[2][0] == 'X'
            return 'X'

        if b[0][0] == 'O' and b[1][1] == 'O' and b[2][2] == 'O'
            return 'O'
        if b[0][2] == 'O' and b[1][1] == 'O' and b[2][0] == 'O'
            return 'O'

        movesAvailable = false
        for i in [0..2]
            for j in [0..2]
                if b[i][j] == ''
                    movesAvailable = true

        return if movesAvailable then '' else 'C'

    checkBigBoard = () ->
        return checkBoard boardWinners

    numBoards = () ->
        count = 0
        for i in [0..2]
            for j in [0..2]
                if boardWinners[i][j] == ''
                    count++
        return count

    aimove = (b, roffset, coffset) ->
        if checkBoard(board[b]) != ''
            return
        for move in getMoves b
            newBoard = []
            newBoard.push new Array() for i in [0..2]
            for i in [0..2]
                for j in [0..2]
                    newBoard[i][j] = board[b][i][j]

            newBoard[move[0]][move[1]] = 'O'
            if (checkBoard newBoard) == 'O'
                setBoardInfo move[0] + roffset, move[1] + coffset
                return
            newBoard[move[0]][move[1]] = 'X'
            if (checkBoard newBoard) == 'X'
                setBoardInfo move[0] + roffset, move[1] + coffset
                return
        row = Math.floor (Math.random()*3)
        col = Math.floor (Math.random()*3)
        while board[b][row][col] != ''
            row = Math.floor (Math.random()*3)
            col = Math.floor (Math.random()*3)
        row += roffset
        col += coffset
        setBoardInfo row, col

    getMoves = (b) ->
        moves = []
        for i in [0..2]
            for j in [0..2]
                if board[b][i][j] == ''
                    moves.push [i,j]
        return moves

    gameIntervalId = setInterval run, 1000 / fps
    return
