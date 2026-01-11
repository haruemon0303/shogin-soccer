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

// 敵陣の定義（成り判定用）
const ENEMY_TERRITORY = {
    [PLAYER.FIRST]: [6, 7, 8],   // 先手の敵陣は row 6, 7, 8
    [PLAYER.SECOND]: [0, 1, 2]   // 後手の敵陣は row 0, 1, 2
};

// ドロップ禁止ゾーン（簡易オフサイド）
const DROP_RESTRICTED_ROWS = {
    [PLAYER.FIRST]: [7, 8],   // 先手は row 7, 8 にドロップ不可
    [PLAYER.SECOND]: [0, 1]   // 後手は row 0, 1 にドロップ不可
};

// 成り後の駒名
const PROMOTED_NAMES = {
    [PIECE_TYPE.PAWN]: 'と',
    [PIECE_TYPE.LANCE]: '成香',
    [PIECE_TYPE.KNIGHT]: '成桂',
    [PIECE_TYPE.SILVER]: '成銀',
    [PIECE_TYPE.BISHOP]: '馬',
    [PIECE_TYPE.ROOK]: '龍'
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
    formationType: null, // 選択された配置タイプ
    isAIMode: false,     // AI対戦モード
    aiThinking: false,   // AI思考中
    capturedPieces: {    // ベンチ（捕獲した駒）
        [PLAYER.FIRST]: {},
        [PLAYER.SECOND]: {}
    },
    isDropMode: false,   // ドロップモード
    selectedDropPiece: null // ドロップ選択中の駒種
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
let promotionModal;
let toastElement;
let localModeBtn;
let aiModeBtn;

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
    promotionModal = document.getElementById('promotionModal');
    toastElement = document.getElementById('toast');

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

    // モード選択
    localModeBtn = document.getElementById('localModeBtn');
    aiModeBtn = document.getElementById('aiModeBtn');
    localModeBtn.addEventListener('click', () => selectMode('local'));
    aiModeBtn.addEventListener('click', () => selectMode('ai'));

    // 配置選択から開始
    showFormationSelection();
}

// ===== モード選択 =====
function selectMode(mode) {
    gameState.isAIMode = (mode === 'ai');

    // ボタンのアクティブ状態を切り替え
    localModeBtn.classList.toggle('active', mode === 'local');
    aiModeBtn.classList.toggle('active', mode === 'ai');
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
    gameState.aiThinking = false;
    gameState.capturedPieces = {
        [PLAYER.FIRST]: {},
        [PLAYER.SECOND]: {}
    };
    gameState.isDropMode = false;
    gameState.selectedDropPiece = null;

    // ログクリア
    const formationName = gameState.formationType === 'shogi' ? '将棋配置' : 'サッカー配置';
    const modeText = gameState.isAIMode ? 'AI対戦' : 'ローカル2人対戦';
    logContentElement.innerHTML = `<p>ゲーム開始！${formationName}（${modeText}）で対戦します。</p><p>先手（青）の番です。</p>`;

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
                if (piece.promoted) {
                    pieceElement.classList.add('promoted');
                }
                pieceElement.textContent = getPieceDisplayName(piece);

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

// ===== ベンチ描画 =====
function renderBench() {
    const benchPiecesElement = document.getElementById('benchPieces');
    benchPiecesElement.innerHTML = '';

    const currentPlayerBench = gameState.capturedPieces[gameState.currentPlayer];
    const hasPieces = Object.keys(currentPlayerBench).some(type => currentPlayerBench[type] > 0);

    if (!hasPieces) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'bench-empty';
        emptyMessage.textContent = '捕獲した駒がベンチに表示されます';
        benchPiecesElement.appendChild(emptyMessage);
        return;
    }

    // 駒種ごとにボタンを生成
    Object.entries(currentPlayerBench).forEach(([pieceType, count]) => {
        if (count > 0) {
            const pieceElement = document.createElement('div');
            pieceElement.className = `bench-piece ${gameState.currentPlayer}`;
            if (gameState.isDropMode && gameState.selectedDropPiece === pieceType) {
                pieceElement.classList.add('selected');
            }
            pieceElement.textContent = pieceType;

            // 所持数表示
            const countElement = document.createElement('div');
            countElement.className = 'bench-piece-count';
            countElement.textContent = count;
            pieceElement.appendChild(countElement);

            // クリックイベント
            pieceElement.addEventListener('click', () => selectDropPiece(pieceType));

            benchPiecesElement.appendChild(pieceElement);
        }
    });
}

// ===== ドロップする駒を選択 =====
function selectDropPiece(pieceType) {
    if (gameState.gameOver) return;
    if (gameState.aiThinking) return;
    if (gameState.isAIMode && gameState.currentPlayer === PLAYER.SECOND) return;

    // 通常モードからドロップモードへ切り替え
    gameState.selectedPiece = null;
    gameState.isPassMode = false;
    gameState.isDropMode = true;
    gameState.selectedDropPiece = pieceType;

    renderBoard();
    renderBench();
    updateUI();
}

// ===== 選択解除（ドロップモード対応） =====
function cancelSelection() {
    gameState.selectedPiece = null;
    gameState.isPassMode = false;
    gameState.isDropMode = false;
    gameState.selectedDropPiece = null;
    renderBoard();
    renderBench();
    updateUI();
}

// ===== ドロップ実行 =====
function attemptDrop(targetRow, targetCol) {
    // 空きマスでなければ無効
    if (gameState.board[targetRow][targetCol]) {
        cancelSelection();
        return;
    }

    const pieceType = gameState.selectedDropPiece;
    const currentPlayer = gameState.currentPlayer;

    // ドロップ制限チェック（簡易オフサイド）
    if (isDropRestricted(currentPlayer, targetRow)) {
        showToast('オフサイド：その位置には投入できません');
        return;
    }

    // 二歩チェック
    if (pieceType === PIECE_TYPE.PAWN && !canDropPawnInColumn(currentPlayer, targetCol)) {
        showToast('二歩：同じ筋に歩は打てません');
        return;
    }

    const currentPlayerBench = gameState.capturedPieces[currentPlayer];

    // ベンチから駒を減らす
    currentPlayerBench[pieceType]--;
    if (currentPlayerBench[pieceType] === 0) {
        delete currentPlayerBench[pieceType];
    }

    // 盤面に配置
    gameState.board[targetRow][targetCol] = {
        type: pieceType,
        player: gameState.currentPlayer
    };

    // ログ
    addLog(`${gameState.currentPlayer === PLAYER.FIRST ? '先手' : '後手'}：${pieceType}を(${targetRow},${targetCol})に投入`);

    // ドロップモード解除
    gameState.isDropMode = false;
    gameState.selectedDropPiece = null;

    renderBoard();
    renderBench();
    updateUI();

    // ターン交代
    nextTurn();
}

// ===== セルクリック処理 =====
function handleCellClick(row, col) {
    if (gameState.gameOver) return;
    if (gameState.aiThinking) return; // AI思考中は操作不可

    // AIモードでAIの番は操作不可
    if (gameState.isAIMode && gameState.currentPlayer === PLAYER.SECOND) return;

    const piece = gameState.board[row][col];

    // ドロップモード
    if (gameState.isDropMode) {
        attemptDrop(row, col);
        return;
    }

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

    // ドロップモード：空きマスをハイライト（制限を考慮）
    if (gameState.isDropMode) {
        const pieceType = gameState.selectedDropPiece;
        const currentPlayer = gameState.currentPlayer;

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (!gameState.board[row][col]) {
                    // ドロップ禁止ゾーンチェック（簡易オフサイド）
                    if (isDropRestricted(currentPlayer, row)) {
                        continue; // この行にはドロップ不可
                    }

                    // 二歩チェック（歩の場合のみ）
                    if (pieceType === PIECE_TYPE.PAWN && !canDropPawnInColumn(currentPlayer, col)) {
                        continue; // この列には既に歩がある
                    }

                    const cell = boardElement.children[row * BOARD_SIZE + col];
                    cell.classList.add('valid-drop');
                }
            }
        }
        return;
    }

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
            const targetPiece = gameState.board[r][c];

            if (targetPiece && targetPiece.player === piece.player) {
                // 味方駒へのパス（強調表示）
                cell.classList.add('valid-pass-to-ally');
            } else {
                // 空きマスへのスルーパス
                cell.classList.add('valid-pass');
            }
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
    const directions = getPieceDirections(piece.type, piece.player, piece.promoted || false);

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

// ===== パス可能マス取得（視線ベース） =====
function getValidPassTargets(row, col, piece) {
    const targets = [];
    // 8方向の視線パス（縦/横/斜め）
    const directions = [
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
        { dr: 0, dc: -1 },                      { dr: 0, dc: 1 },
        { dr: 1, dc: -1 },  { dr: 1, dc: 0 },  { dr: 1, dc: 1 }
    ];

    directions.forEach(({ dr, dc }) => {
        for (let i = 1; i < BOARD_SIZE; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;

            if (!isInBounds(newRow, newCol)) break;

            const targetPiece = gameState.board[newRow][newCol];

            if (!targetPiece) {
                // 空きマスへのスルーパス可能
                targets.push({ row: newRow, col: newCol });
            } else if (targetPiece.player === piece.player) {
                // 味方駒へパス可能（視線の終端）
                targets.push({ row: newRow, col: newCol });
                break;
            } else {
                // 相手駒で視線がブロックされる
                break;
            }
        }
    });

    return targets;
}

// ===== 駒の方向取得 =====
function getPieceDirections(type, player, promoted = false) {
    // 先手は下向き（+row）、後手は上向き（-row）
    const forward = player === PLAYER.FIRST ? 1 : -1;

    // 成り駒の動き
    if (promoted) {
        switch (type) {
            case PIECE_TYPE.PAWN:
            case PIECE_TYPE.LANCE:
            case PIECE_TYPE.KNIGHT:
            case PIECE_TYPE.SILVER:
                // と金・成香・成桂・成銀：全て金と同じ動き
                return [
                    { dr: forward, dc: -1, range: 1 },  // 前左
                    { dr: forward, dc: 0, range: 1 },   // 前
                    { dr: forward, dc: 1, range: 1 },   // 前右
                    { dr: 0, dc: -1, range: 1 },        // 左
                    { dr: 0, dc: 1, range: 1 },         // 右
                    { dr: -forward, dc: 0, range: 1 }   // 後ろ
                ];
            case PIECE_TYPE.BISHOP:
                // 馬：角の動き + 前後左右1マス
                return [
                    { dr: -1, dc: -1, range: BOARD_SIZE },
                    { dr: -1, dc: 1, range: BOARD_SIZE },
                    { dr: 1, dc: -1, range: BOARD_SIZE },
                    { dr: 1, dc: 1, range: BOARD_SIZE },
                    { dr: -1, dc: 0, range: 1 },
                    { dr: 1, dc: 0, range: 1 },
                    { dr: 0, dc: -1, range: 1 },
                    { dr: 0, dc: 1, range: 1 }
                ];
            case PIECE_TYPE.ROOK:
                // 龍：飛の動き + 斜め1マス
                return [
                    { dr: -1, dc: 0, range: BOARD_SIZE },
                    { dr: 1, dc: 0, range: BOARD_SIZE },
                    { dr: 0, dc: -1, range: BOARD_SIZE },
                    { dr: 0, dc: 1, range: BOARD_SIZE },
                    { dr: -1, dc: -1, range: 1 },
                    { dr: -1, dc: 1, range: 1 },
                    { dr: 1, dc: -1, range: 1 },
                    { dr: 1, dc: 1, range: 1 }
                ];
            default:
                // その他（金・玉は成らない）
                return getPieceDirections(type, player, false);
        }
    }

    // 通常の駒の動き
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

        // ベンチに追加
        const currentPlayerBench = gameState.capturedPieces[gameState.currentPlayer];
        if (!currentPlayerBench[capturedPiece.type]) {
            currentPlayerBench[capturedPiece.type] = 0;
        }
        currentPlayerBench[capturedPiece.type]++;
        logMessage += '（ベンチに追加）';

        // 玉を捕獲しても勝利にはならない（ゴールのみが勝利条件）
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

    // 成り判定（敵陣に入った場合）
    if (!piece.promoted && canPromote(piece.type) && isInEnemyTerritory(piece.player, targetRow)) {
        // 成りダイアログを表示
        showPromotionDialog(targetRow, targetCol);
        return;
    }

    // ターン交代
    nextTurn();
}

// ===== 成り可能判定 =====
function canPromote(pieceType) {
    // 金と玉は成れない
    return pieceType !== PIECE_TYPE.GOLD && pieceType !== PIECE_TYPE.KING;
}

// ===== 成りダイアログ表示 =====
function showPromotionDialog(row, col) {
    const piece = gameState.board[row][col];
    const promotedName = PROMOTED_NAMES[piece.type];

    document.getElementById('promotionMessage').textContent =
        `${piece.type} を ${promotedName} に成りますか？`;

    promotionModal.classList.add('show');

    // ボタンイベント（一度だけ）
    const promoteYesBtn = document.getElementById('promoteYesBtn');
    const promoteNoBtn = document.getElementById('promoteNoBtn');

    const handleYes = () => {
        promotePiece(row, col);
        promotionModal.classList.remove('show');
        promoteYesBtn.removeEventListener('click', handleYes);
        promoteNoBtn.removeEventListener('click', handleNo);
        nextTurn();
    };

    const handleNo = () => {
        promotionModal.classList.remove('show');
        promoteYesBtn.removeEventListener('click', handleYes);
        promoteNoBtn.removeEventListener('click', handleNo);
        nextTurn();
    };

    promoteYesBtn.addEventListener('click', handleYes);
    promoteNoBtn.addEventListener('click', handleNo);
}

// ===== 駒を成る =====
function promotePiece(row, col) {
    const piece = gameState.board[row][col];
    piece.promoted = true;
    addLog(`${piece.player === PLAYER.FIRST ? '先手' : '後手'}：${piece.type}が成って${PROMOTED_NAMES[piece.type]}になりました！`);
    renderBoard();
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

    // 自分のゴールか確認（オウンゴール）
    const ownGoals = GOALS[gameState.currentPlayer];
    const isOwnGoal = ownGoals.some(g => g.row === row && g.col === col);

    if (isOwnGoal) {
        const winner = gameState.currentPlayer === PLAYER.FIRST ? PLAYER.SECOND : PLAYER.FIRST;
        endGame(winner, `${gameState.currentPlayer === PLAYER.FIRST ? '先手' : '後手'}がオウンゴール！${winner === PLAYER.FIRST ? '先手' : '後手'}の勝利！`);
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

    // AIの番ならAI思考を実行
    if (gameState.isAIMode && gameState.currentPlayer === PLAYER.SECOND && !gameState.gameOver) {
        executeAITurn();
    }
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

    // ベンチ描画
    renderBench();

    // ガイドテキスト更新
    updateGuideText();

    // 確認バーの制御
    const hasSelection = !!gameState.selectedPiece;
    const hasBall = gameState.ball.holder &&
                    gameState.selectedPiece &&
                    gameState.ball.holder.row === gameState.selectedPiece.row &&
                    gameState.ball.holder.col === gameState.selectedPiece.col;

    const isAITurn = gameState.isAIMode && gameState.currentPlayer === PLAYER.SECOND;
    const hasDropSelection = gameState.isDropMode && gameState.selectedDropPiece;

    moveBtn.disabled = !hasSelection || gameState.gameOver || gameState.aiThinking || isAITurn || hasDropSelection;
    passBtn.disabled = !hasBall || gameState.gameOver || gameState.aiThinking || isAITurn || hasDropSelection;
    cancelBtn.disabled = (!hasSelection && !hasDropSelection) || gameState.gameOver || gameState.aiThinking || isAITurn;
}

// ===== ガイドテキスト更新 =====
function updateGuideText() {
    if (gameState.gameOver) {
        guideTextElement.textContent = `🎉 ${gameState.winner === PLAYER.FIRST ? '先手（青）' : '後手（赤）'}の勝利！`;
        return;
    }

    if (gameState.aiThinking) {
        guideTextElement.textContent = '🤖 AI thinking...';
        return;
    }

    if (gameState.isDropMode) {
        guideTextElement.textContent = '紫マス = 配置可能。空きマスをタップしてベンチから投入';
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

// ===== トースト通知 =====
function showToast(message) {
    toastElement.textContent = message;
    toastElement.classList.add('show');

    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

// ===== ドロップ制限チェック（簡易オフサイド） =====
function isDropRestricted(player, row) {
    return DROP_RESTRICTED_ROWS[player].includes(row);
}

// ===== 二歩チェック =====
function canDropPawnInColumn(player, col) {
    // 指定列に既に歩（または成った歩）が存在するかチェック
    for (let row = 0; row < BOARD_SIZE; row++) {
        const piece = gameState.board[row][col];
        if (piece && piece.player === player && piece.type === PIECE_TYPE.PAWN) {
            return false; // 既に歩がある
        }
    }
    return true; // 歩がない＝ドロップ可能
}

// ===== 敵陣判定 =====
function isInEnemyTerritory(player, row) {
    return ENEMY_TERRITORY[player].includes(row);
}

// ===== 駒の表示名取得（成り対応） =====
function getPieceDisplayName(piece) {
    if (piece.promoted && PROMOTED_NAMES[piece.type]) {
        return PROMOTED_NAMES[piece.type];
    }
    return piece.type;
}

// ===== AI思考ロジック =====
function executeAITurn() {
    gameState.aiThinking = true;
    updateUI();

    // 0.3秒後にAI思考を実行（UIの更新を反映させるため）
    setTimeout(() => {
        const bestMove = findBestAIMove();

        if (bestMove) {
            executeAIMove(bestMove);
        } else {
            // 合法手がない場合はターン交代
            nextTurn();
        }

        gameState.aiThinking = false;
        updateUI();
    }, 300);
}

function findBestAIMove() {
    const allMoves = [];

    // 全ての自分の駒について合法手を列挙
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.player === PLAYER.SECOND) {
                // 移動可能な手を列挙
                const validMoves = getValidMoves(row, col, piece);
                validMoves.forEach(({ row: targetRow, col: targetCol }) => {
                    allMoves.push({
                        type: 'move',
                        fromRow: row,
                        fromCol: col,
                        toRow: targetRow,
                        toCol: targetCol,
                        piece
                    });
                });

                // パス可能な手を列挙（ボール保持中のみ）
                if (gameState.ball.holder &&
                    gameState.ball.holder.row === row &&
                    gameState.ball.holder.col === col) {
                    const validPasses = getValidPassTargets(row, col, piece);
                    validPasses.forEach(({ row: targetRow, col: targetCol }) => {
                        allMoves.push({
                            type: 'pass',
                            fromRow: row,
                            fromCol: col,
                            toRow: targetRow,
                            toCol: targetCol,
                            piece
                        });
                    });
                }
            }
        }
    }

    // ドロップ可能な手を列挙
    const aiBench = gameState.capturedPieces[PLAYER.SECOND];
    Object.entries(aiBench).forEach(([pieceType, count]) => {
        if (count > 0) {
            // 空きマス全てにドロップ可能（制限を考慮）
            for (let row = 0; row < BOARD_SIZE; row++) {
                // ドロップ禁止ゾーンをスキップ
                if (isDropRestricted(PLAYER.SECOND, row)) {
                    continue;
                }

                for (let col = 0; col < BOARD_SIZE; col++) {
                    if (!gameState.board[row][col]) {
                        // 二歩チェック
                        if (pieceType === PIECE_TYPE.PAWN && !canDropPawnInColumn(PLAYER.SECOND, col)) {
                            continue;
                        }

                        allMoves.push({
                            type: 'drop',
                            pieceType,
                            toRow: row,
                            toCol: col
                        });
                    }
                }
            }
        }
    });

    if (allMoves.length === 0) return null;

    // 各手を評価
    const evaluatedMoves = allMoves.map(move => ({
        move,
        score: evaluateAIMove(move)
    }));

    // スコアでソート（降順）
    evaluatedMoves.sort((a, b) => b.score - a.score);

    // 最高スコアの手を返す
    return evaluatedMoves[0].move;
}

function evaluateAIMove(move) {
    let score = 0;

    // AI（後手）のゴールは最下段（row 8）、相手（先手）のゴールは最上段（row 0）
    const aiGoals = GOALS[PLAYER.SECOND]; // 最下段 row 8
    const opponentGoals = GOALS[PLAYER.FIRST]; // 最上段 row 0

    // ドロップの場合の評価
    if (move.type === 'drop') {
        // 基本スコア
        score = 30;

        // 自ゴール周辺への配置を評価（防御）
        const distFromOwnGoal = Math.abs(move.toRow - 8);
        if (distFromOwnGoal <= 2) {
            score += 20; // ゴール前の防御強化
        }

        // ボール周辺への配置を評価
        let ballRow, ballCol;
        if (gameState.ball.holder) {
            ballRow = gameState.ball.holder.row;
            ballCol = gameState.ball.holder.col;
        } else {
            ballRow = gameState.ball.row;
            ballCol = gameState.ball.col;
        }
        const distToBall = Math.abs(move.toRow - ballRow) + Math.abs(move.toCol - ballCol);
        if (distToBall <= 2) {
            score += 15; // ボール付近に配置
        }

        // ランダム性
        score += Math.random() * 5;

        return score;
    }

    // ボール位置の取得
    let ballRow, ballCol;
    if (gameState.ball.holder) {
        ballRow = gameState.ball.holder.row;
        ballCol = gameState.ball.holder.col;
    } else {
        ballRow = gameState.ball.row;
        ballCol = gameState.ball.col;
    }

    // 移動後のボール位置を推定
    let newBallRow, newBallCol;
    if (move.type === 'pass') {
        newBallRow = move.toRow;
        newBallCol = move.toCol;
    } else if (gameState.ball.holder &&
               gameState.ball.holder.row === move.fromRow &&
               gameState.ball.holder.col === move.fromCol) {
        // ボール保持者が移動
        newBallRow = move.toRow;
        newBallCol = move.toCol;
    } else if (!gameState.ball.holder &&
               gameState.ball.row === move.toRow &&
               gameState.ball.col === move.toCol) {
        // ボールを取得
        newBallRow = move.toRow;
        newBallCol = move.toCol;
    } else {
        // ボール位置変わらず
        newBallRow = ballRow;
        newBallCol = ballCol;
    }

    // オウンゴール判定（絶対に避ける）
    const isOwnGoal = aiGoals.some(g => g.row === newBallRow && g.col === newBallCol);
    if (isOwnGoal) {
        return -100000; // 最悪のスコア
    }

    // 相手ゴール判定（最優先）
    const isGoal = opponentGoals.some(g => g.row === newBallRow && g.col === newBallCol);
    if (isGoal) {
        return 100000; // 最高のスコア
    }

    // 相手ゴールに近づく（後手は row 0 を目指す）
    const distToOpponentGoal = Math.abs(newBallRow - 0) + Math.abs(newBallCol - 4);
    score += (18 - distToOpponentGoal) * 10; // 近いほど高得点

    // 自分ゴールから遠ざかる（後手は row 8 から遠ざかる = row が小さいほど良い）
    const distFromOwnGoal = Math.abs(newBallRow - 8);
    score += distFromOwnGoal * 5;

    // ボール奪取
    const targetPiece = gameState.board[move.toRow][move.toCol];
    if (targetPiece && targetPiece.player !== PLAYER.SECOND &&
        gameState.ball.holder &&
        gameState.ball.holder.row === move.toRow &&
        gameState.ball.holder.col === move.toCol) {
        score += 50; // ボール奪取は高得点
    }

    // 駒の捕獲
    if (targetPiece && targetPiece.player !== PLAYER.SECOND) {
        score += 20; // 駒の捕獲も加点
        if (targetPiece.type === PIECE_TYPE.KING) {
            score += 10; // 玉は特に価値が高い（勝利にはならないが）
        }
    }

    // ランダム性を少し追加（同じスコアの手がある場合のバリエーション）
    score += Math.random() * 5;

    return score;
}

function executeAIMove(move) {
    if (move.type === 'move') {
        // 移動を実行
        const capturedPiece = gameState.board[move.toRow][move.toCol];
        gameState.board[move.toRow][move.toCol] = move.piece;
        gameState.board[move.fromRow][move.fromCol] = null;

        // ログ
        let logMessage = `後手（AI）：${move.piece.type}が(${move.fromRow},${move.fromCol})→(${move.toRow},${move.toCol})へ移動`;

        // 駒捕獲
        if (capturedPiece) {
            logMessage += `（${capturedPiece.type}を捕獲）`;

            // ボール保持者を捕獲した場合
            if (gameState.ball.holder &&
                gameState.ball.holder.row === move.toRow &&
                gameState.ball.holder.col === move.toCol) {
                gameState.ball.holder = { row: move.toRow, col: move.toCol };
                logMessage += '（ボール奪取！）';
            }

            // ベンチに追加
            const aiBench = gameState.capturedPieces[PLAYER.SECOND];
            if (!aiBench[capturedPiece.type]) {
                aiBench[capturedPiece.type] = 0;
            }
            aiBench[capturedPiece.type]++;
            logMessage += '（ベンチに追加）';
        }

        // ボール取得
        if (!gameState.ball.holder &&
            gameState.ball.row === move.toRow &&
            gameState.ball.col === move.toCol) {
            gameState.ball.holder = { row: move.toRow, col: move.toCol };
            logMessage += '（ボール取得！）';
        } else if (gameState.ball.holder &&
                   gameState.ball.holder.row === move.fromRow &&
                   gameState.ball.holder.col === move.fromCol) {
            // ボール保持者が移動
            gameState.ball.holder = { row: move.toRow, col: move.toCol };
        }

        addLog(logMessage);

        // ゴール判定
        if (checkGoal(move.toRow, move.toCol)) {
            return;
        }

        // AI成り判定（敵陣に入った場合）
        if (!move.piece.promoted && canPromote(move.piece.type) && isInEnemyTerritory(PLAYER.SECOND, move.toRow)) {
            // AIは基本的に成る（成ったほうが強いため）
            promotePiece(move.toRow, move.toCol);
        }

        // ターン交代
        nextTurn();
    } else if (move.type === 'pass') {
        // パスを実行
        const targetPiece = gameState.board[move.toRow][move.toCol];

        if (targetPiece && targetPiece.player === PLAYER.SECOND) {
            // 味方にパス
            gameState.ball.holder = { row: move.toRow, col: move.toCol };
            addLog(`後手（AI）：${move.piece.type}が(${move.toRow},${move.toCol})の${targetPiece.type}にパス！`);
        } else {
            // 空きマスにパス（ボールだけ移動）
            gameState.ball.row = move.toRow;
            gameState.ball.col = move.toCol;
            gameState.ball.holder = null;
            addLog(`後手（AI）：${move.piece.type}が(${move.toRow},${move.toCol})にパス`);
        }

        // ゴール判定
        if (checkGoal(move.toRow, move.toCol)) {
            return;
        }

        // ターン交代
        nextTurn();
    } else if (move.type === 'drop') {
        // ドロップを実行
        const aiBench = gameState.capturedPieces[PLAYER.SECOND];

        // ベンチから駒を減らす
        aiBench[move.pieceType]--;
        if (aiBench[move.pieceType] === 0) {
            delete aiBench[move.pieceType];
        }

        // 盤面に配置
        gameState.board[move.toRow][move.toCol] = {
            type: move.pieceType,
            player: PLAYER.SECOND
        };

        addLog(`後手（AI）：${move.pieceType}を(${move.toRow},${move.toCol})に投入`);

        // ターン交代
        nextTurn();
    }
}

// ===== ゲーム開始 =====
document.addEventListener('DOMContentLoaded', init);
