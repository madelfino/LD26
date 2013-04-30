// Generated by CoffeeScript 1.6.1
(function() {
  var BOARD_TIMEOUT;

  BOARD_TIMEOUT = 1000;

  window.onload = function() {
    var aimove, board, boardTimeouts, boardTurns, boardWinners, canvas, checkBigBoard, checkBoard, coordsToRowCol, ctx, drawBoard, drawO, drawX, fps, gameIntervalId, gameOver, getBoardInfo, getMoves, getTurn, mouse, numBoards, resetBoard, run, select, setBoardInfo, updateTimers, whichBoard;
    gameOver = false;
    canvas = document.getElementById("stage");
    ctx = canvas.getContext('2d');
    boardTurns = [];
    boardWinners = [];
    boardTimeouts = [];
    board = [];
    resetBoard = function() {
      var b, i, j, r, row, smallBoard, _i, _j, _k, _l, _results;
      board = new Array();
      boardWinners = [['', '', ''], ['', '', ''], ['', '', '']];
      boardTurns = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      for (b = _i = 0; _i <= 8; b = ++_i) {
        smallBoard = new Array();
        for (r = _j = 0; _j <= 2; r = ++_j) {
          row = new Array();
          row[0] = '';
          row[1] = '';
          row[2] = '';
          smallBoard.push(row);
        }
        board.push(smallBoard);
      }
      _results = [];
      for (i = _k = 0; _k <= 2; i = ++_k) {
        row = new Array();
        for (j = _l = 0; _l <= 2; j = ++_l) {
          row[j] = BOARD_TIMEOUT;
        }
        _results.push(boardTimeouts.push(row));
      }
      return _results;
    };
    resetBoard();
    mouse = {
      x: 0,
      y: 0
    };
    select = false;
    fps = 50;
    run = function() {
      var i, _i;
      for (i = _i = 0; _i <= 8; i = ++_i) {
        boardWinners[Math.floor(i / 3)][i % 3] = checkBoard(board[i]);
      }
      ctx.fillStyle = "#BBBBBB";
      ctx.fillRect(0, 0, 800, 600);
      updateTimers();
      drawBoard();
      ctx.fillStyle = "#EEEEEE";
      ctx.fillRect(mouse.x, mouse.y, 5, 5);
    };
    canvas.onmousemove = function(e) {
      var canvasX, canvasY, cond, curElem, totalOffsetX, totalOffsetY;
      totalOffsetX = 0;
      totalOffsetY = 0;
      canvasX = 0;
      canvasY = 0;
      curElem = canvas;
      cond = true;
      while (cond) {
        totalOffsetX += curElem.offsetLeft - curElem.scrollLeft;
        totalOffsetY += curElem.offsetTop - curElem.scrollTop;
        cond = (curElem = curElem.offsetParent);
      }
      canvasX = e.pageX - totalOffsetX;
      canvasY = e.pageY - totalOffsetY;
      mouse.x = canvasX;
      mouse.y = canvasY;
    };
    canvas.onclick = function(e) {
      var c, r, _ref;
      if (gameOver) {
        gameOver = false;
        resetBoard();
      }
      if (select) {
        _ref = coordsToRowCol(mouse.x, mouse.y), r = _ref[0], c = _ref[1];
        if (getTurn(r, c) === 'X') {
          setBoardInfo(r, c);
        }
      }
    };
    updateTimers = function() {
      var b, i, j, t, x, y, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 2; i = ++_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (j = _j = 0; _j <= 2; j = ++_j) {
            if (boardWinners[j][i] === '' && !gameOver) {
              x = 200 + 130 * i;
              y = 100 + 130 * j;
              boardTimeouts[j][i] -= 10 / (numBoards() + 1);
              if (boardTimeouts[j][i] <= 0) {
                boardTimeouts[j][i] = BOARD_TIMEOUT;
                b = whichBoard(j * 3, i * 3);
                boardTurns[b] = -1;
                aimove(b, j * 3, i * 3);
              }
              t = boardTimeouts[j][i];
              ctx.fillStyle = "#333333";
              _results1.push(ctx.fillRect(x, y, 118 * (t / BOARD_TIMEOUT), 118));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    };
    drawBoard = function() {
      var i, j, x, y, _i, _j, _k, _l;
      ctx.fillStyle = "#AAAAAA";
      select = false;
      for (i = _i = 0; _i <= 8; i = ++_i) {
        for (j = _j = 0; _j <= 8; j = ++_j) {
          x = 200 + i * 40;
          if (i > 2) {
            x += 10;
          }
          if (i > 5) {
            x += 10;
          }
          y = 100 + j * 40;
          if (j > 2) {
            y += 10;
          }
          if (j > 5) {
            y += 10;
          }
          ctx.fillRect(x, y, 38, 38);
          if (mouse.x > x && mouse.x < x + 38 && mouse.y > y && mouse.y < y + 38) {
            ctx.fillStyle = "#CCCCCC";
            ctx.fillRect(x, y, 38, 38);
            ctx.fillStyle = "#AAAAAA";
            select = true;
          }
          if (getBoardInfo(j, i) === 'X') {
            drawX(x, y, 38, 1);
          }
          if (getBoardInfo(j, i) === 'O') {
            drawO(x, y, 19, 1);
          }
        }
      }
      for (i = _k = 0; _k <= 2; i = ++_k) {
        for (j = _l = 0; _l <= 2; j = ++_l) {
          x = 200 + i * 130;
          y = 100 + j * 130;
          if (boardWinners[j][i] === 'X') {
            drawX(x, y, 120, 5);
          }
          if (boardWinners[j][i] === 'O') {
            drawO(x, y, 60, 5);
          }
        }
      }
      if (checkBigBoard() === 'X') {
        drawX(200, 100, 380, 10);
        gameOver = true;
      }
      if (checkBigBoard() === 'O') {
        drawO(200, 100, 190, 10);
        gameOver = true;
      }
    };
    drawX = function(x, y, w, lw) {
      ctx.lineWidth = lw;
      ctx.strokeStyle = "#555555";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + w);
      ctx.stroke();
      ctx.moveTo(x + w, y);
      ctx.lineTo(x, y + w);
      ctx.stroke();
      return ctx.lineWidth = 1;
    };
    drawO = function(x, y, r, lw) {
      ctx.lineWidth = lw;
      ctx.strokeStyle = "#DDDDDD";
      ctx.beginPath();
      ctx.arc(x + r, y + r, r, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.stroke();
      return ctx.lineWidth = 1;
    };
    coordsToRowCol = function(x, y) {
      var col, row;
      row = y - 100;
      if (row > 120) {
        row -= 10;
      }
      if (row > 240) {
        row -= 10;
      }
      row = Math.floor(row / 40);
      col = x - 200;
      if (col > 120) {
        col -= 10;
      }
      if (col > 240) {
        col -= 10;
      }
      col = Math.floor(col / 40);
      return [row, col];
    };
    whichBoard = function(r, c) {
      return 3 * Math.floor(r / 3) + Math.floor(c / 3);
    };
    getBoardInfo = function(r, c) {
      var b, col, row;
      b = whichBoard(r, c);
      row = r % 3;
      col = c % 3;
      return board[b][row][col];
    };
    getTurn = function(r, c) {
      if (boardTurns[whichBoard(r, c)] === 1) {
        return 'X';
      } else {
        return 'O';
      }
    };
    setBoardInfo = function(r, c) {
      var b, col, mark, row;
      b = whichBoard(r, c);
      if (gameOver || (boardWinners[Math.floor(r / 3)][Math.floor(c / 3)] === 'X' || boardWinners[Math.floor(r / 3)][Math.floor(c / 3)] === 'O')) {
        return false;
      }
      mark = getTurn(r, c);
      row = r % 3;
      col = c % 3;
      if (board[b][row][col] === '') {
        board[b][row][col] = mark;
        boardTurns[b] = -boardTurns[b];
        boardTimeouts[Math.floor(b / 3)][b % 3] = BOARD_TIMEOUT;
        if (mark === 'X') {
          aimove(b, r - r % 3, c - c % 3);
        }
        return true;
      }
      return false;
    };
    checkBoard = function(b) {
      var i, j, movesAvailable, _i, _j, _k;
      for (i = _i = 0; _i <= 2; i = ++_i) {
        if (b[i][0] === 'X' && b[i][1] === 'X' && b[i][2] === 'X') {
          return 'X';
        }
        if (b[0][i] === 'X' && b[1][i] === 'X' && b[2][i] === 'X') {
          return 'X';
        }
        if (b[i][0] === 'O' && b[i][1] === 'O' && b[i][2] === 'O') {
          return 'O';
        }
        if (b[0][i] === 'O' && b[1][i] === 'O' && b[2][i] === 'O') {
          return 'O';
        }
      }
      if (b[0][0] === 'X' && b[1][1] === 'X' && b[2][2] === 'X') {
        return 'X';
      }
      if (b[0][2] === 'X' && b[1][1] === 'X' && b[2][0] === 'X') {
        return 'X';
      }
      if (b[0][0] === 'O' && b[1][1] === 'O' && b[2][2] === 'O') {
        return 'O';
      }
      if (b[0][2] === 'O' && b[1][1] === 'O' && b[2][0] === 'O') {
        return 'O';
      }
      movesAvailable = false;
      for (i = _j = 0; _j <= 2; i = ++_j) {
        for (j = _k = 0; _k <= 2; j = ++_k) {
          if (b[i][j] === '') {
            movesAvailable = true;
          }
        }
      }
      if (movesAvailable) {
        return '';
      } else {
        return 'C';
      }
    };
    checkBigBoard = function() {
      return checkBoard(boardWinners);
    };
    numBoards = function() {
      var count, i, j, _i, _j;
      count = 0;
      for (i = _i = 0; _i <= 2; i = ++_i) {
        for (j = _j = 0; _j <= 2; j = ++_j) {
          if (boardWinners[i][j] === '') {
            count++;
          }
        }
      }
      return count;
    };
    aimove = function(b, roffset, coffset) {
      var col, i, j, move, newBoard, row, _i, _j, _k, _l, _len, _ref;
      if (checkBoard(board[b]) !== '') {
        return;
      }
      _ref = getMoves(b);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        move = _ref[_i];
        newBoard = [];
        for (i = _j = 0; _j <= 2; i = ++_j) {
          newBoard.push(new Array());
        }
        for (i = _k = 0; _k <= 2; i = ++_k) {
          for (j = _l = 0; _l <= 2; j = ++_l) {
            newBoard[i][j] = board[b][i][j];
          }
        }
        newBoard[move[0]][move[1]] = 'O';
        if ((checkBoard(newBoard)) === 'O') {
          setBoardInfo(move[0] + roffset, move[1] + coffset);
          return;
        }
        newBoard[move[0]][move[1]] = 'X';
        if ((checkBoard(newBoard)) === 'X') {
          setBoardInfo(move[0] + roffset, move[1] + coffset);
          return;
        }
      }
      row = Math.floor(Math.random() * 3);
      col = Math.floor(Math.random() * 3);
      while (board[b][row][col] !== '') {
        row = Math.floor(Math.random() * 3);
        col = Math.floor(Math.random() * 3);
      }
      row += roffset;
      col += coffset;
      return setBoardInfo(row, col);
    };
    getMoves = function(b) {
      var i, j, moves, _i, _j;
      moves = [];
      for (i = _i = 0; _i <= 2; i = ++_i) {
        for (j = _j = 0; _j <= 2; j = ++_j) {
          if (board[b][i][j] === '') {
            moves.push([i, j]);
          }
        }
      }
      return moves;
    };
    gameIntervalId = setInterval(run, 1000 / fps);
  };

}).call(this);
