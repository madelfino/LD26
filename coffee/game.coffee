window.onload = () ->

    canvas = document.getElementById "stage"
    ctx = canvas.getContext '2d'

    ctx.fillStyle = "#BBBBBB"
    ctx.fillRect 0, 0, 800, 600
    ctx.fillStyle = "#AAAAAA"

    fps = 50

    run = () ->
        update()
        draw()
        return

    draw = () ->
        drawBoard()
        return

    update = () ->
        return

    drawBoard = () ->
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
        return

    run()
    intervalId = setInterval run, 1000 / fps

    return
