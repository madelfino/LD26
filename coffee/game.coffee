window.onload = () ->

    turn = 1
    canvas = document.getElementById "stage"
    ctx = canvas.getContext '2d'

    boardTurns = [1,1,1,1,1,1,1,1,1]
    board = new Array()
    for b in [0..8]
        smallBoard = new Array()
        for r in [0..2]
            row = new Array()
            row[0] = ''
            row[1] = ''
            row[2] = '' 
            smallBoard.push row
        board.push smallBoard
    mouse = { x:0, y:0 }
    select = false

    fps = 50

    draw = () ->
        drawBoard()
        #draw cursor
        ctx.fillStyle = "#EEEEEE"
        ctx.fillRect mouse.x, mouse.y, 5, 5
        return

    canvas.onmousemove = (e) ->
        mouse.x = e.clientX
        mouse.y = e.clientY
        return

    canvas.onclick = (e) ->
        if select
            [r, c] = coordsToRowCol mouse.x, mouse.y
            setBoardInfo r, c
        return

    drawBoard = () ->

        #draw background
        ctx.fillStyle = "#BBBBBB"
        ctx.fillRect 0, 0, 800, 600

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
                if getBoardInfo(j,i) == 'O'
                    ctx.strokeStyle = "#DDDDDD"
                    ctx.beginPath()
                    ctx.arc x+19, y+19, 19, 0, 2 * Math.PI, true
                    ctx.closePath()
                    ctx.stroke()
                if getBoardInfo(j,i) == 'X'
                    ctx.strokeStyle = "#555555"
                    ctx.beginPath()
                    ctx.moveTo x, y
                    ctx.lineTo x + 38, y + 38
                    ctx.stroke()
                    ctx.moveTo x + 38, y
                    ctx.lineTo x, y + 38
                    ctx.stroke()
        return

    coordsToRowCol = (x,y) ->

        #todo account for spacing
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
        console.log "row: " + row + "; col: " + col

        return [row, col]

    getBoardInfo = (r,c) ->
        whichBoard = 3*Math.floor(r/3) + Math.floor(c/3)
        row = r % 3
        col = c % 3
        return board[whichBoard][row][col]

    setBoardInfo = (r,c) ->
        whichBoard = 3*Math.floor(r/3) + Math.floor(c/3)
        mark = if boardTurns[whichBoard] == 1 then 'X' else 'O'
        row = r % 3
        col = c % 3
        if board[whichBoard][row][col] == ''
            board[whichBoard][row][col] = mark
            boardTurns[whichBoard] = -boardTurns[whichBoard]
            return true
        return false 

    intervalId = setInterval draw, 1000 / fps

    return
