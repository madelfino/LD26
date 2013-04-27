window.onload = () ->

    canvas = document.getElementById "stage"
    ctx = canvas.getContext '2d'

    ctx.fillStyle = "#BBBBBB"
    ctx.fillRect 0, 0, 800, 600

    return
