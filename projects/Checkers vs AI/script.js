const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const size = 8;
const tileSize = canvas.width / size;
let board = [];
let currentPlayer = "player";
let selectedPiece = null;
let validMoves = [];

// Dastlabki taxtani tayyorlash
function initBoard() {
  board = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      if ((r + c) % 2 === 1) {
        if (r < 3) row.push({ color: "black", king: false });
        else if (r > 4) row.push({ color: "#fff", king: false });
        else row.push(null);
      } else {
        row.push(null);
      }
    }
    board.push(row);
  }
}

function drawBoard() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Kvadratlarni chizish
      ctx.fillStyle = (r + c) % 2 === 0 ? "#f3f3" : "#a0522d";
      ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);

      const piece = board[r][c];
      if (piece) {
        // Tosh
        ctx.beginPath();
        ctx.arc(
          c * tileSize + tileSize / 2,
          r * tileSize + tileSize / 2,
          tileSize / 2.5,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = piece.color === "black" ? "#000" : "#fff";
        ctx.fill();
        if (piece.king) {
          ctx.fillStyle = "#ffd700";
          ctx.font = "20px Arial";
          ctx.fillText(
            "👑",
            c * tileSize + tileSize / 3,
            r * tileSize + tileSize / 1.5
          );
        }
      }
    }
  }

  // Yura oladigan joylarni ko‘rsatish
  validMoves.forEach((move) => {
    ctx.beginPath();
    ctx.arc(
      move.col * tileSize + tileSize / 2,
      move.row * tileSize + tileSize / 2,
      8,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(0, 123, 255, 0.7)";
    ctx.fill();
  });
}

canvas.addEventListener("click", handleClick);

function handleClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const row = Math.floor(y / tileSize);
  const col = Math.floor(x / tileSize);

  if (selectedPiece) {
    const move = validMoves.find((m) => m.row === row && m.col === col);
    if (move) {
      makeMove(selectedPiece.row, selectedPiece.col, move.row, move.col);
      selectedPiece = null;
      validMoves = [];
      drawBoard();
      if (currentPlayer === "ai") setTimeout(aiMove, 400);
      return;
    }
  }

  const piece = board[row][col];
  if (piece && piece.color === "#fff" && currentPlayer === "player") {
    selectedPiece = { row, col };
    validMoves = getValidMoves(row, col);
    drawBoard();
  }
}

function getValidMoves(row, col) {
  const piece = board[row][col];
  if (!piece) return [];
  const directions = piece.king
    ? [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]
    : piece.color === "#fff"
    ? [
        [-1, -1],
        [-1, 1],
      ]
    : [
        [1, -1],
        [1, 1],
      ];
  const moves = [];

  directions.forEach(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;
    if (inBounds(r, c) && !board[r][c]) {
      moves.push({ row: r, col: c });
    }

    const jumpR = row + dr * 2;
    const jumpC = col + dc * 2;
    if (inBounds(jumpR, jumpC) && !board[jumpR][jumpC]) {
      const mid = board[row + dr][col + dc];
      if (mid && mid.color !== piece.color) {
        moves.push({
          row: jumpR,
          col: jumpC,
          capture: { row: row + dr, col: col + dc },
        });
      }
    }
  });
  return moves;
}

function makeMove(fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  board[toRow][toCol] = piece;
  board[fromRow][fromCol] = null;

  if (Math.abs(fromRow - toRow) === 2) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;
    board[midRow][midCol] = null;
  }

  if (
    (piece.color === "#fff" && toRow === 0) ||
    (piece.color === "black" && toRow === size - 1)
  ) {
    piece.king = true;
  }

  currentPlayer = piece.color === "#fff" ? "ai" : "player";
}

function inBounds(r, c) {
  return r >= 0 && r < size && c >= 0 && c < size;
}

function aiMove() {
  let bestMove = null;
  outer: for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const piece = board[r][c];
      if (piece && piece.color === "black") {
        const moves = getValidMoves(r, c);
        if (moves.length > 0) {
          bestMove = { from: { row: r, col: c }, to: moves[0] };
          break outer;
        }
      }
    }
  }

  if (bestMove) {
    makeMove(
      bestMove.from.row,
      bestMove.from.col,
      bestMove.to.row,
      bestMove.to.col
    );
    drawBoard();
  }
}

initBoard();
drawBoard();
