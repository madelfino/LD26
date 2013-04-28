// Generated by CoffeeScript 1.6.1
(function() {
  var BOARD_TIMEOUT;

  BOARD_TIMEOUT = 1000;

  window.onload = function() {
    var aimove, b, board, boardTimeouts, boardTurns, boardWinners, canvas, checkBigBoard, checkBoard, coordsToRowCol, ctx, drawBoard, fps, gameIntervalId, gameOver, getBoardInfo, getTurn, i, j, mouse, r, row, run, select, setBoardInfo, smallBoard, updateTimers, whichBoard, _i, _j, _k, _l;
    gameOver = false;
    canvas = document.getElementById("stage");
    ctx = canvas.getContext('2d');
    boardTurns = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    boardWinners = [['', '', ''], ['', '', ''], ['', '', '']];
    boardTimeouts = [];
    board = new Array();
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
    mouse = {
      x: 0,
      y: 0
    };
    select = false;
    for (i = _k = 0; _k <= 2; i = ++_k) {
      row = new Array();
      for (j = _l = 0; _l <= 2; j = ++_l) {
        row[j] = BOARD_TIMEOUT;
      }
      boardTimeouts.push(row);
    }
    fps = 50;
    run = function() {
      var _m;
      for (i = _m = 0; _m <= 8; i = ++_m) {
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
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    canvas.onclick = function(e) {
      var c, _ref;
      console.log(boardTimeouts);
      if (select) {
        _ref = coordsToRowCol(mouse.x, mouse.y), r = _ref[0], c = _ref[1];
        if (getTurn(r, c) === 'X') {
          setBoardInfo(r, c);
        }
      }
    };
    updateTimers = function() {
      var t, x, y, _m, _results;
      _results = [];
      for (i = _m = 0; _m <= 2; i = ++_m) {
        _results.push((function() {
          var _n, _results1;
          _results1 = [];
          for (j = _n = 0; _n <= 2; j = ++_n) {
            if (boardWinners[j][i] === '' && !gameOver) {
              x = 200 + 130 * i;
              y = 100 + 130 * j;
              boardTimeouts[j][i]--;
              if (boardTimeouts[j][i] <= 0) {
                boardTimeouts[j][i] = BOARD_TIMEOUT;
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
      var x, y, _m, _n, _o, _p;
      ctx.fillStyle = "#AAAAAA";
      select = false;
      for (i = _m = 0; _m <= 8; i = ++_m) {
        for (j = _n = 0; _n <= 8; j = ++_n) {
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
          if (getBoardInfo(j, i) === 'O') {
            ctx.strokeStyle = "#DDDDDD";
            ctx.beginPath();
            ctx.arc(x + 19, y + 19, 19, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.stroke();
          }
          if (getBoardInfo(j, i) === 'X') {
            ctx.strokeStyle = "#555555";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 38, y + 38);
            ctx.stroke();
            ctx.moveTo(x + 38, y);
            ctx.lineTo(x, y + 38);
            ctx.stroke();
          }
        }
      }
      for (i = _o = 0; _o <= 2; i = ++_o) {
        for (j = _p = 0; _p <= 2; j = ++_p) {
          x = 200 + i * 130;
          y = 100 + j * 130;
          if (boardWinners[j][i] === 'X') {
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#555555";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 120, y + 120);
            ctx.stroke();
            ctx.moveTo(x + 120, y);
            ctx.lineTo(x, y + 120);
            ctx.stroke();
            ctx.lineWidth = 1;
          }
          if (boardWinners[j][i] === 'O') {
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#DDDDDD";
            ctx.beginPath();
            ctx.arc(x + 60, y + 60, 60, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.stroke();
            ctx.lineWidth = 1;
          }
        }
      }
      x = 200;
      y = 100;
      if (checkBigBoard() === 'X') {
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#555555";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 380, y + 380);
        ctx.stroke();
        ctx.moveTo(x + 380, y);
        ctx.lineTo(x, y + 380);
        ctx.stroke();
        ctx.lineWidth = 1;
        gameOver = true;
      }
      if (checkBigBoard() === 'O') {
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#DDDDDD";
        ctx.beginPath();
        ctx.arc(x + 190, y + 190, 190, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.lineWidth = 1;
        gameOver = true;
      }
    };
    coordsToRowCol = function(x, y) {
      var col;
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
      console.log("row: " + row + "; col: " + col);
      return [row, col];
    };
    whichBoard = function(r, c) {
      return 3 * Math.floor(r / 3) + Math.floor(c / 3);
    };
    getBoardInfo = function(r, c) {
      var col;
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
      var col, mark;
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
      var movesAvailable, _m, _n, _o;
      for (i = _m = 0; _m <= 2; i = ++_m) {
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
      for (i = _n = 0; _n <= 2; i = ++_n) {
        for (j = _o = 0; _o <= 2; j = ++_o) {
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
    aimove = function(b, roffset, coffset) {
      var col;
      console.log(board[b]);
      if (checkBoard(board[b]) !== '') {
        return;
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
    gameIntervalId = setInterval(run, 1000 / fps);
  };

}).call(this);
