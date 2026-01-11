// ===== 定数定義 =====
const BOARD_SIZE = 9;
const PLAYER = {
    FIRST: 'first',   // 先手（青）
    SECOND: 'second'  // 後手（赤）
};

const PIECE_TYPE = {
    KING: '玉',    // 玉（GK）
    ROOK: '飛',    // 飛車（FW）
    BISHOP: '角',  // 角（MF）
    GOLD: '金',    // 金（DF）
    SILVER: '銀',  // 銀（MF）
    KNIGHT: '桂',  // 桂馬（FW）
    LANCE: '香',   // 香車（DF）
    PAWN: '歩'     // 歩（FW）
};

// ゴールマスの定義
const GOALS = {
    [PLAYER.FIRST]: [
        { row: 0, col: 3 },
        { row: 0, col: 4 },
        { row: 0, col: 5 }
    ],
    [PLAYER.SECOND]: [
        { row: 8, col: 3 },
        { row: 8, col: 4 },
        { row: 8, col: 5 }
    ]
};

// ===== ゲーム状態 =====
let gameState = {
    board: [],           // 盤面の駒配置
    currentPlayer: PLAYER.FIRST,
    ball: { row: 4, col: 4, holder: null }, // ボール位置と保持者
    selectedPiece: null, // 選択中の駒
    isPassMode: false,   // パスモード
    gameOver: false,
    winner: null,
    formationType: null  // 選択された配置タイプ
};

// ===== 初期配置（将棋配置） =====
const SHOGI_FORMATION = {
    [PLAYER.FIRST]: [
        { type: PIECE_TYPE.KING, row: 0, col: 4 },
        { type: PIECE_TYPE.ROOK, row: 1, col: 7 },
        { type: PIECE_TYPE.BISHOP, row: 1, col: 1 },
        { type: PIECE_TYPE.GOLD, row: 0, col: 3 },
        { type: PIECE_TYPE.GOLD, row: 0, col: 5 },
        { type: PIECE_TYPE.SILVER, row: 0, col: 2 },
        { type: PIECE_TYPE.SILVER, row: 0, col: 6 },
        { type: PIECE_TYPE.KNIGHT, row: 0, col: 1 },
        { type: PIECE_TYPE.KNIGHT, row: 0, col: 7 },
        { type: PIECE_TYPE.LANCE, row: 0, col: 0 },
        { type: PIECE_TYPE.LANCE, row: 0, col: 8 },
        { type: PIECE_TYPE.PAWN, row: 2, col: 0 },
        { type: PIECE_TYPE.PAWN, row: 2, col: 1 },
        { type: PIECE_TYPE.PAWN, row: 2, col: 2 },
        { type: PIECE_TYPE.PAWN, row: 2, col: 3 },
        { type: PIECE_TYPE.PAWN, row: 2, col: 4 },
        { type: PIECE_TYPE.PAWN, row: 2, col: 5 },
        { type: PIECE_TYPE.PAWN, row: 2, col: 6 },
        { type: PIECE_TYPE.PAWN, row: 2, col: 7 },
        { type: PIECE_TYPE.PAWN, row: 2, col: 8 }
    ],
    [PLAYER.SECOND]: [
        { type: PIECE_TYPE.KING, row: 8, col: 4 },
        { type: PIECE_TYPE.ROOK, row: 7, col: 1 },
        { type: PIECE_TYPE.BISHOP, row: 7, col: 7 },
        { type: PIECE_TYPE.GOLD, row: 8, col: 3 },
        { type: PIECE_TYPE.GOLD, row: 8, col: 5 },
        { type: PIECE_TYPE.SILVER, row: 8, col: 2 },
        { type: PIECE_TYPE.SILVER, row: 8, col: 6 },
        { type: PIECE_TYPE.KNIGHT, row: 8, col: 1 },
        { type: PIECE_TYPE.KNIGHT, row: 8, col: 7 },
        { type: PIECE_TYPE.LANCE, row: 8, col: 0 },
        { type: PIECE_TYPE.LANCE, row: 8, col: 8 },
        { type: PIECE_TYPE.PAWN, row: 6, col: 0 },
        { type: PIECE_TYPE.PAWN, row: 6, col: 1 },
        { type: PIECE_TYPE.PAWN, row: 6, col: 2 },
        { type: PIECE_TYPE.PAWN, row: 6, col: 3 },
        { type: PIECE_TYPE.PAWN, row: 6, col: 4 },
        { type: PIECE_TYPE.PAWN, row: 6, col: 5 },
        { type: PIECE_TYPE.PAWN, row: 6, col: 6 },
        { type: PIECE_TYPE.PAWN, row: 6, col: 7 },
        { type: PIECE_TYPE.PAWN, row: 6, col: 8 }
    ]
};

// ===== 初期配置（サッカー配置 4-4-2風） =====
const SOCCER_FORMATION = {
    [PLAYER.FIRST]: [
        { type: PIECE_TYPE.KING, row: 0, col: 4 },
        { type: PIECE_TYPE.ROOK, row: 3, col: 3 },
        { type: PIECE_TYPE.ROOK, row: 3, col: 5 },
        { type: PIECE_TYPE.BISHOP, row: 2, col: 4 },
        { type: PIECE_TYPE.GOLD, row: 1, col: 2 },
        { type: PIECE_TYPE.GOLD, row: 1, col: 6 },
        { type: PIECE_TYPE.SILVER, row: 2, col: 1 },
        { type: PIECE_TYPE.SILVER, row: 2, col: 7 },
        { type: PIECE_TYPE.PAWN, row: 3, col: 0 },
        { type: PIECE_TYPE.PAWN, row: 3, col: 2 },
        { type: PIECE_TYPE.PAWN, row: 3, col: 4 },
        { type: PIECE_TYPE.PAWN, row: 3, col: 6 },
        { type: PIECE_TYPE.PAWN, row: 3, col: 8 },
        { type: PIECE_TYPE.PAWN, row: 1, col: 3 },
        { type: PIECE_TYPE.PAWN, row: 1, col: 4 },
        { type: PIECE_TYPE.PAWN, row: 1, col: 5 },
        { type: PIECE_TYPE.PAWN, row: 0, col: 1 }
    ],
    [PLAYER.SECOND]: [
        { type: PIECE_TYPE.KING, row: 8, col: 4 },
        { type: PIECE_TYPE.ROOK, row: 5, col: 3 },
        { type: PIECE_TYPE.ROOK, row: 5, col: 5 },
        { type: PIECE_TYPE.BISHOP, row: 6, col: 4 },
        { type: PIECE_TYPE.GOLD, row: 7, col: 2 },
        { type: PIECE_TYPE.GOLD, row: 7, col: 6 },
        { type: PIECE_TYPE.SILVER, row: 6, col: 1 },
        { type: PIECE_TYPE.SILVER, row: 6, col: 7 },
        { type: PIECE_TYPE.PAWN, row: 5, col: 0 },
        { type: PIECE_TYPE.PAWN, row: 5, col: 2 },
        { type: PIECE_TYPE.PAWN, row: 5, col: 4 },
        { type: PIECE_TYPE.PAWN, row: 5, col: 6 },
        { type: PIECE_TYPE.PAWN, row: 5, col: 8 },
        { type: PIECE_TYPE.PAWN, row: 7, col: 3 },
        { type: PIECE_TYPE.PAWN, row: 7, col: 4 },
        { type: PIECE_TYPE.PAWN, row: 7, col: 5 },
        { type: PIECE_TYPE.PAWN, row: 8, col: 7 }
    ]
};

// ===== DOM要素 =====
let boardElement;
let boardWrapperElement;
let turnBarElement;
let turnTextElement;
let ballHolderCompactElement;
let logContentElement;
let guideTextElement;
let moveBtn;
let passBtn;
let cancelBtn;
let resetBtn;
let gameOverModal;
let tutorialModal;
let formationModal;

// ===== 初期化 =====
function init() {
    // DOM要素取得
    boardElement = document.getElementById('board');
    boardWrapperElement = document.getElementById('boardWrapper');
    turnBarElement = document.getElementById('turnBar');
    turnTextElement = document.getElementById('turnText');
    ballHolderCompactElement = document.getElementById('ballHolderCompact');
    logContentElement = document.getElementById('logContent');
    guideTextElement = document.getElementById('guideText');
    moveBtn = document.getElementById('moveBtn');
    passBtn = document.getElementById('passBtn');
    cancelBtn = document.getElementById('cancelBtn');
    resetBtn = document.getElementById('resetBtn');
    gameOverModal = document.getElementById('gameOverModal');
    tutorialModal = document.getElementById('tutorialModal');
    formationModal = document.getElementById('formationModal');

    // イベントリスナー
    moveBtn.addEventListener('click', () => setActionMode('move'));
    passBtn.addEventListener('click', () => setActionMode('pass'));
    cancelBtn.addEventListener('click', cancelSelection);
    resetBtn.addEventListener('click', showFormationSelection);
    document.getElementById('gameOverResetBtn').addEventListener('click', () => {
        gameOverModal.classList.remove('show');
        showFormationSelection();
    });
    document.getElementById('tutorialCloseBtn').addEventListener('click', closeTutorial);
    document.getElementById('shogiFormationBtn').addEventListener('click', () => startGameWithFormation('shogi'));
    document.getElementById('soccerFormationBtn').addEventListener('click', () => startGameWithFormation('soccer'));

    // 配置選択から開始
    showFormationSelection();
}

// ===== 配置選択 =====
function showFormationSelection() {
    formationModal.classList.add('show');
}

function startGameWithFormation(formationType) {
    gameState.formationType = formationType;
    formationModal.classList.remove('show');

    // チュートリアル表示
    showTutorialIfFirstTime();

    // ゲーム開始
    resetGame();
}

// ===== チュートリアル =====
function showTutorialIfFirstTime() {
    const hasSeenTutorial = localStorage.getItem('shogin-soccer-tutorial-seen');
    if (!hasSeenTutorial) {
        tutorialModal.classList.add('show');
    }
}

function closeTutorial() {
    const noShow = document.getElementById('noShowTutorial').checked;
    if (noShow) {
        localStorage.setItem('shogin-soccer-tutorial-seen', 'true');
    }
    tutorialModal.classList.remove('show');
}

// ===== ゲームリセット =====
function resetGame() {
    // 盤面初期化
    gameState.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

    // 選択された配置で駒配置
    const formation = gameState.formationType === 'shogi' ? SHOGI_FORMATION : SOCCER_FORMATION;
    for (const player in formation) {
        formation[player].forEach(({ type, row, col }) => {
            gameState.board[row][col] = { type, player };
        });
    }

    // ボール初期化
    gameState.ball = { row: 4, col: 4, holder: null };
    gameState.currentPlayer = PLAYER.FIRST;
    gameState.selectedPiece = null;
    gameState.isPassMode = false;
    gameState.gameOver = false;
    gameState.winner = null;

    // ログクリア
    const formationName = gameState.formationType === 'shogi' ? '将棋配置' : 'サッカー配置';
    logContentElement.innerHTML = `<p>ゲーム開始！${formationName}で対戦します。</p><p>先手（青）の番です。</p>`;

    // 盤面描画
    renderBoard();
    updateUI();
}

// ===== 盤面描画 =====
function renderBoard() {
    boardElement.innerHTML = '';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // ゴールマス
            if (isGoalCell(row, col, PLAYER.FIRST)) {
                cell.classList.add('goal-first');
            } else if (isGoalCell(row, col, PLAYER.SECOND)) {
                cell.classList.add('goal-second');
            }

            // 駒の表示
            const piece = gameState.board[row][col];
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece ${piece.player}`;
                pieceElement.textContent = piece.type;

                // ボール保持表示
                if (gameState.ball.holder &&
                    gameState.ball.holder.row === row &&
                    gameState.ball.holder.col === col) {
                    pieceElement.classList.add('has-ball');
                    const ballIndicator = document.createElement('div');
                    ballIndicator.className = 'ball-indicator';
                    pieceElement.appendChild(ballIndicator);
                }

                cell.appendChild(pieceElement);
            }

            // ボールが盤面にある場合（保持されていない）
            if (!gameState.ball.holder &&
                gameState.ball.row === row &&
                gameState.ball.col === col) {
                cell.textContent = '⚽';
                cell.style.fontSize = 'clamp(1rem, 4vw, 1.5rem)';
            }

            // クリックイベント
            cell.addEventListener('click', () => handleCellClick(row, col));

            boardElement.appendChild(cell);
        }
    }
}

// ===== セルクリック処理 =====
function handleCellClick(row, col) {
    if (gameState.gameOver) return;

    const piece = gameState.board[row][col];

    // 駒選択
    if (!gameState.selectedPiece) {
        if (piece && piece.player === gameState.currentPlayer) {
            selectPiece(row, col);
        }
        return;
    }

    // パスモード
    if (gameState.isPassMode) {
        attemptPass(row, col);
        return;
    }

    // 移動実行
    attemptMove(row, col);
}

// ===== 駒選択 =====
function selectPiece(row, col) {
    gameState.selectedPiece = { row, col };
    highlightValidMoves();
    updateUI();
}

// ===== 選択解除 =====
function cancelSelection() {
    gameState.selectedPiece = null;
    gameState.isPassMode = false;
    renderBoard();
    updateUI();
}

// ===== アクションモード設定 =====
function setActionMode(mode) {
    if (!gameState.selectedPiece) return;

    if (mode === 'pass') {
        // パスモードに切り替え
        gameState.isPassMode = true;
    } else {
        // 移動モードに切り替え
        gameState.isPassMode = false;
    }

    highlightValidMoves();
    updateUI();
}

// ===== 合法手ハイライト =====
function highlightValidMoves() {
    renderBoard();

    if (!gameState.selectedPiece) return;

    const { row, col } = gameState.selectedPiece;
    const piece = gameState.board[row][col];

    // 選択中の駒をハイライト
    const selectedCell = boardElement.children[row * BOARD_SIZE + col];
    selectedCell.classList.add('selected');

    if (gameState.isPassMode) {
        // パスモード：パス可能マスをハイライト
        const validPasses = getValidPassTargets(row, col, piece);
        validPasses.forEach(({ row: r, col: c }) => {
            const cell = boardElement.children[r * BOARD_SIZE + c];
            cell.classList.add('valid-pass');
        });
    } else {
        // 移動モード：移動可能マスと捕獲可能マスを区別
        const validMoves = getValidMoves(row, col, piece);
        validMoves.forEach(({ row: r, col: c }) => {
            const cell = boardElement.children[r * BOARD_SIZE + c];
            const targetPiece = gameState.board[r][c];

            if (targetPiece && targetPiece.player !== piece.player) {
                // 捕獲可能（相手駒）
                cell.classList.add('valid-capture');
            } else {
                // 移動可能（空きマス）
                cell.classList.add('valid-move');
            }
        });
    }
}

// ===== 合法手取得 =====
function getValidMoves(row, col, piece) {
    const moves = [];
    const directions = getPieceDirections(piece.type, piece.player);

    directions.forEach(({ dr, dc, range }) => {
        for (let i = 1; i <= range; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;

            if (!isInBounds(newRow, newCol)) break;

            const targetPiece = gameState.board[newRow][newCol];

            // 空きマスまたは相手の駒
            if (!targetPiece || targetPiece.player !== piece.player) {
                moves.push({ row: newRow, col: newCol });
            }

            // 駒があったら進めない
            if (targetPiece) break;
        }
    });

    return moves;
}

// ===== パス可能マス取得 =====
function getValidPassTargets(row, col, piece) {
    const targets = [];
    const directions = getPieceDirections(piece.type, piece.player);

    directions.forEach(({ dr, dc, range }) => {
        for (let i = 1; i <= range; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;

            if (!isInBounds(newRow, newCol)) break;

            const targetPiece = gameState.board[newRow][newCol];

            // 空きマスまたは味方の駒（パス可能）
            if (!targetPiece || targetPiece.player === piece.player) {
                targets.push({ row: newRow, col: newCol });
            }

            // 相手の駒があったら進めない
            if (targetPiece && targetPiece.player !== piece.player) break;

            // 味方の駒があったら進めない（受け取りは可）
            if (targetPiece && targetPiece.player === piece.player) break;
        }
    });

    return targets;
}

// ===== 駒の方向取得 =====
function getPieceDirections(type, player) {
    // 先手は下向き（+row）、後手は上向き（-row）
    const forward = player === PLAYER.FIRST ? 1 : -1;

    switch (type) {
        case PIECE_TYPE.KING:
            return [
                { dr: -1, dc: -1, range: 1 }, { dr: -1, dc: 0, range: 1 }, { dr: -1, dc: 1, range: 1 },
                { dr: 0, dc: -1, range: 1 }, { dr: 0, dc: 1, range: 1 },
                { dr: 1, dc: -1, range: 1 }, { dr: 1, dc: 0, range: 1 }, { dr: 1, dc: 1, range: 1 }
            ];
        case PIECE_TYPE.ROOK:
            return [
                { dr: -1, dc: 0, range: BOARD_SIZE },
                { dr: 1, dc: 0, range: BOARD_SIZE },
                { dr: 0, dc: -1, range: BOARD_SIZE },
                { dr: 0, dc: 1, range: BOARD_SIZE }
            ];
        case PIECE_TYPE.BISHOP:
            return [
                { dr: -1, dc: -1, range: BOARD_SIZE },
                { dr: -1, dc: 1, range: BOARD_SIZE },
                { dr: 1, dc: -1, range: BOARD_SIZE },
                { dr: 1, dc: 1, range: BOARD_SIZE }
            ];
        case PIECE_TYPE.GOLD:
            // 金：斜め後ろ以外の6方向
            return [
                { dr: forward, dc: -1, range: 1 },  // 前左
                { dr: forward, dc: 0, range: 1 },   // 前
                { dr: forward, dc: 1, range: 1 },   // 前右
                { dr: 0, dc: -1, range: 1 },        // 左
                { dr: 0, dc: 1, range: 1 },         // 右
                { dr: -forward, dc: 0, range: 1 }   // 後ろ
            ];
        case PIECE_TYPE.SILVER:
            // 銀：前3方向と斜め後ろ2方向
            return [
                { dr: forward, dc: -1, range: 1 },   // 前左
                { dr: forward, dc: 0, range: 1 },    // 前
                { dr: forward, dc: 1, range: 1 },    // 前右
                { dr: -forward, dc: -1, range: 1 },  // 後ろ左
                { dr: -forward, dc: 1, range: 1 }    // 後ろ右
            ];
        case PIECE_TYPE.KNIGHT:
            // 桂馬：前2マス左右1マス
            return [
                { dr: forward * 2, dc: -1, range: 1 },
                { dr: forward * 2, dc: 1, range: 1 }
            ];
        case PIECE_TYPE.LANCE:
            // 香車：前方に直進
            return [{ dr: forward, dc: 0, range: BOARD_SIZE }];
        case PIECE_TYPE.PAWN:
            return [{ dr: forward, dc: 0, range: 1 }];
        default:
            return [];
    }
}

// ===== 移動試行 =====
function attemptMove(targetRow, targetCol) {
    const { row, col } = gameState.selectedPiece;
    const piece = gameState.board[row][col];
    const validMoves = getValidMoves(row, col, piece);

    const isValid = validMoves.some(m => m.row === targetRow && m.col === targetCol);
    if (!isValid) {
        // 無効な移動
        cancelSelection();
        return;
    }

    // 移動実行
    const capturedPiece = gameState.board[targetRow][targetCol];
    gameState.board[targetRow][targetCol] = piece;
    gameState.board[row][col] = null;

    // ログ
    let logMessage = `${piece.player === PLAYER.FIRST ? '先手' : '後手'}：${piece.type}が(${row},${col})→(${targetRow},${targetCol})へ移動`;

    // 駒捕獲
    if (capturedPiece) {
        logMessage += `（${capturedPiece.type}を捕獲）`;

        // ボール保持者を捕獲した場合
        if (gameState.ball.holder &&
            gameState.ball.holder.row === targetRow &&
            gameState.ball.holder.col === targetCol) {
            gameState.ball.holder = { row: targetRow, col: targetCol };
            logMessage += '（ボール奪取！）';
        }

        // 玉を捕獲したら勝利
        if (capturedPiece.type === PIECE_TYPE.KING) {
            endGame(gameState.currentPlayer, `${piece.player === PLAYER.FIRST ? '先手' : '後手'}が相手の玉を捕獲！`);
            return;
        }
    }

    // ボール取得
    if (!gameState.ball.holder &&
        gameState.ball.row === targetRow &&
        gameState.ball.col === targetCol) {
        gameState.ball.holder = { row: targetRow, col: targetCol };
        logMessage += '（ボール取得！）';
    } else if (gameState.ball.holder &&
               gameState.ball.holder.row === row &&
               gameState.ball.holder.col === col) {
        // ボール保持者が移動
        gameState.ball.holder = { row: targetRow, col: targetCol };
    }

    addLog(logMessage);

    // ゴール判定
    if (checkGoal(targetRow, targetCol)) {
        return;
    }

    // ターン交代
    nextTurn();
}

// ===== パス試行 =====
function attemptPass(targetRow, targetCol) {
    const { row, col } = gameState.selectedPiece;
    const piece = gameState.board[row][col];
    const validTargets = getValidPassTargets(row, col, piece);

    const isValid = validTargets.some(t => t.row === targetRow && t.col === targetCol);
    if (!isValid) {
        cancelSelection();
        return;
    }

    // パス実行
    const targetPiece = gameState.board[targetRow][targetCol];

    if (targetPiece && targetPiece.player === piece.player) {
        // 味方にパス
        gameState.ball.holder = { row: targetRow, col: targetCol };
        addLog(`${piece.player === PLAYER.FIRST ? '先手' : '後手'}：${piece.type}が(${targetRow},${targetCol})の${targetPiece.type}にパス！`);
    } else {
        // 空きマスにパス（ボールだけ移動）
        gameState.ball.row = targetRow;
        gameState.ball.col = targetCol;
        gameState.ball.holder = null;
        addLog(`${piece.player === PLAYER.FIRST ? '先手' : '後手'}：${piece.type}が(${targetRow},${targetCol})にパス`);
    }

    // ゴール判定
    if (checkGoal(targetRow, targetCol)) {
        return;
    }

    // ターン交代
    nextTurn();
}

// ===== ゴール判定 =====
function checkGoal(row, col) {
    // ボール保持者または送ったボールがゴールマスにあるか
    const ballAtGoal = (gameState.ball.holder &&
                        gameState.ball.holder.row === row &&
                        gameState.ball.holder.col === col) ||
                       (!gameState.ball.holder &&
                        gameState.ball.row === row &&
                        gameState.ball.col === col);

    if (!ballAtGoal) return false;

    // 相手ゴールか確認
    const opponentGoals = gameState.currentPlayer === PLAYER.FIRST
        ? GOALS[PLAYER.SECOND]
        : GOALS[PLAYER.FIRST];

    const isGoal = opponentGoals.some(g => g.row === row && g.col === col);

    if (isGoal) {
        endGame(gameState.currentPlayer, `${gameState.currentPlayer === PLAYER.FIRST ? '先手' : '後手'}がゴール！`);
        return true;
    }

    return false;
}

// ===== ターン交代 =====
function nextTurn() {
    gameState.currentPlayer = gameState.currentPlayer === PLAYER.FIRST
        ? PLAYER.SECOND
        : PLAYER.FIRST;
    gameState.selectedPiece = null;
    gameState.isPassMode = false;

    // 手番バーのアニメーション
    turnBarElement.classList.add('turn-change');
    setTimeout(() => {
        turnBarElement.classList.remove('turn-change');
    }, 600);

    renderBoard();
    updateUI();
}

// ===== ゲーム終了 =====
function endGame(winner, message) {
    gameState.gameOver = true;
    gameState.winner = winner;

    addLog(message);

    document.getElementById('gameOverTitle').textContent = `${winner === PLAYER.FIRST ? '先手（青）' : '後手（赤）'}の勝利！`;
    document.getElementById('gameOverMessage').textContent = message;
    gameOverModal.classList.add('show');

    renderBoard();
    updateUI();
}

// ===== UI更新 =====
function updateUI() {
    // 手番バーの更新
    turnTextElement.textContent = gameState.currentPlayer === PLAYER.FIRST
        ? '先手（青）の番'
        : '後手（赤）の番';

    // 手番バーの背景色変更
    turnBarElement.className = 'turn-bar ' +
        (gameState.currentPlayer === PLAYER.FIRST ? 'first-turn' : 'second-turn');

    // 盤面外枠のグロー更新
    boardWrapperElement.className = 'board-wrapper ' +
        (gameState.currentPlayer === PLAYER.FIRST ? 'first-turn' : 'second-turn');

    // ボール保持者表示（コンパクト版）
    if (gameState.ball.holder) {
        const { row, col } = gameState.ball.holder;
        const piece = gameState.board[row][col];
        ballHolderCompactElement.textContent = `${piece.player === PLAYER.FIRST ? '先手' : '後手'}の${piece.type}`;
    } else {
        ballHolderCompactElement.textContent = `中央`;
    }

    // ガイドテキスト更新
    updateGuideText();

    // 確認バーの制御
    const hasSelection = !!gameState.selectedPiece;
    const hasBall = gameState.ball.holder &&
                    gameState.selectedPiece &&
                    gameState.ball.holder.row === gameState.selectedPiece.row &&
                    gameState.ball.holder.col === gameState.selectedPiece.col;

    moveBtn.disabled = !hasSelection || gameState.gameOver;
    passBtn.disabled = !hasBall || gameState.gameOver;
    cancelBtn.disabled = !hasSelection || gameState.gameOver;
}

// ===== ガイドテキスト更新 =====
function updateGuideText() {
    if (gameState.gameOver) {
        guideTextElement.textContent = `🎉 ${gameState.winner === PLAYER.FIRST ? '先手（青）' : '後手（赤）'}の勝利！`;
        return;
    }

    const hasSelection = !!gameState.selectedPiece;
    const hasBall = gameState.ball.holder &&
                    gameState.selectedPiece &&
                    gameState.ball.holder.row === gameState.selectedPiece.row &&
                    gameState.ball.holder.col === gameState.selectedPiece.col;

    if (!hasSelection) {
        // 駒未選択
        guideTextElement.textContent = '駒をタップして選択してください';
    } else if (gameState.isPassMode) {
        // パスモード
        guideTextElement.textContent = '緑マス = パス先。タップしてパスしてください';
    } else if (hasBall) {
        // ボール保持中
        guideTextElement.textContent = '青 = 移動 / 緑 = パス / 赤枠 = 捕獲。移動先をタップまたは「パス」ボタンでパス';
    } else {
        // 通常の駒選択中
        guideTextElement.textContent = '青 = 移動 / 赤枠 = 捕獲。移動先をタップしてください';
    }
}

// ===== ログ追加 =====
function addLog(message) {
    const p = document.createElement('p');
    p.textContent = message;
    logContentElement.insertBefore(p, logContentElement.firstChild);
}

// ===== ユーティリティ =====
function isInBounds(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function isGoalCell(row, col, player) {
    return GOALS[player].some(g => g.row === row && g.col === col);
}

// ===== ゲーム開始 =====
document.addEventListener('DOMContentLoaded', init);
