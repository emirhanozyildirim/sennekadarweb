// --- Firebase Configuration ---
        const firebaseConfig = {
            apiKey: "AIzaSyCSEDuVvxkgUCsv_EQU6eFhzbcxHBqtMEc",
            authDomain: "xoxgame2.firebaseapp.com",
            databaseURL: "https://xoxgame2-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "xoxgame2",
            storageBucket: "xoxgame2.firebasestorage.app",
            messagingSenderId: "565416654726",
            appId: "1:565416654726:web:98f6cc61f2f99a21275e07",
            measurementId: "G-C6W68NSK8X"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();
        // firebase.analytics(); // Enable if needed

        // --- DOM Element References ---
        const screens = document.querySelectorAll('.screen');
        const mainMenuScreen = document.getElementById('main-menu');
        const createGameScreen = document.getElementById('create-game-screen');
        const joinGameScreen = document.getElementById('join-game-screen');
        const shareUrlScreen = document.getElementById('share-url-screen'); // New
        const joinViaUrlScreen = document.getElementById('join-via-url-screen'); // New
        const lobbyScreen = document.getElementById('lobby-screen');
        const randomMatchWaitScreen = document.getElementById('random-match-wait-screen'); // Added
        const gameScreen = document.getElementById('game-screen');

        // Buttons
        const randomMatchBtn = document.getElementById('random-match-btn'); // Added
        const cancelRandomMatchBtn = document.getElementById('cancel-random-match-btn'); // Added
        const createGameBtn = document.getElementById('create-game-btn');
        const joinGameBtn = document.getElementById('join-game-btn');
        const createGameUrlBtn = document.getElementById('create-game-url-btn'); // New
        const submitCreateGameBtn = document.getElementById('submit-create-game-btn');
        const submitJoinGameBtn = document.getElementById('submit-join-game-btn');
        const submitJoinGameUrlBtn = document.getElementById('submit-join-game-url-btn'); // New
        const readyBtn = document.getElementById('ready-btn');
        const rematchBtn = document.getElementById('rematch-btn');
        const newGameBtn = document.getElementById('new-game-btn');
        const backBtns = document.querySelectorAll('.back-btn');
        const copyUrlBtn = document.getElementById('copy-url-btn'); // New
        const goToLobbyFromShareBtn = document.getElementById('go-to-lobby-from-share-btn'); // New

        // Inputs
        const mainMenuUsernameInput = document.getElementById('main-menu-username-input'); // Added
        const creatorNameInput = document.getElementById('creator-name-input');
        const joinerNameInput = document.getElementById('joiner-name-input');
        const joinerNameUrlInput = document.getElementById('joiner-name-url-input'); // New
        const inviteCodeInput = document.getElementById('invite-code-input');

        // Share URL Screen Elements
        const shareGameUrlEl = document.getElementById('share-game-url'); // New
        const copyStatusEl = document.getElementById('copy-status'); // New

        // Join URL Screen Elements
        const joinUrlStatusEl = document.getElementById('join-url-status'); // New

        // Random Match Wait Screen Elements
        const randomMatchStatusEl = document.getElementById('random-match-status'); // Added

        // Lobby Elements
        const lobbyInviteCodeEl = document.getElementById('lobby-invite-code');
        const lobbyCreatorNameEl = document.getElementById('lobby-creator-name');
        const lobbyJoinerNameEl = document.getElementById('lobby-joiner-name');
        const creatorReadyStatusEl = document.getElementById('creator-ready-status');
        const joinerReadyStatusEl = document.getElementById('joiner-ready-status');
        const lobbyStatusEl = document.getElementById('lobby-status');

        // Game Screen Elements
        const playerBlueNameEl = document.getElementById('player-blue-name');
        const playerOrangeNameEl = document.getElementById('player-orange-name');
        const piecesBlueEl = document.getElementById('pieces-blue');
        const piecesOrangeEl = document.getElementById('pieces-orange');
        const scoreBlueEl = document.getElementById('score-blue');
        const scoreOrangeEl = document.getElementById('score-orange');
        const currentPlayerIndicatorEl = document.getElementById('current-player-indicator');
        const playerPiecesBlueContainer = document.getElementById('player-pieces-blue');
        const playerPiecesOrangeContainer = document.getElementById('player-pieces-orange');
        const gameBoardEl = document.getElementById('game-board');
        const movesListEl = document.getElementById('moves-list');
        const gameOverPopup = document.getElementById('game-over-popup');
        const gameResultMessageEl = document.getElementById('game-result-message');

        // --- NEW: Rematch Invitation Elements ---
        const gameOverActionsDiv = document.getElementById('game-over-actions');
        const rematchInvitationDiv = document.getElementById('rematch-invitation');
        const rematchInviteMessageEl = document.getElementById('rematch-invite-message');
        const joinRematchBtn = document.getElementById('join-rematch-btn');
        const declineRematchBtn = document.getElementById('decline-rematch-btn');
        // --- End NEW ---

        // --- Game State Variables ---
        let currentGameId = null;
        let currentPlayerColor = null; // 'blue' or 'orange'
        // Initialize with a default structure to prevent errors before first load
        let localGameState = {
            board: Array(9).fill(null), // Start with an empty board representation
            pieces: { blue: {}, orange: {} },
            score: { blue: 0, orange: 0 },
            moves: [],
            // Add other keys if needed to prevent undefined errors early on
        };
        let gameRef = null; // Firebase reference for the current game
        let gameListener = null; // Firebase listener for the current game
        let isGameReady = false; // Flag to indicate if initial game state is loaded
        let waitingPlayersListener = null; // Listener for the /waitingPlayers node
        let myMatchListener = null; // Listener for the player's own entry in /waitingPlayers
        let waitingPlayerRef = null; // Reference to the player's own entry in /waitingPlayers
        let currentUserId = null; // Unique ID for this player session
        let selectedPieceInfo = null; // { pieceElement: HTMLElement, color: string, size: string } for click-to-move

        // --- Utility Functions ---

        /**
         * Shows the specified screen and hides others.
         * @param {string} screenId The ID of the screen to show.
         */
        function showScreen(screenId) {
            screens.forEach(screen => {
                screen.classList.remove('active');
                if (screen.id === screenId) {
                    screen.classList.add('active');
                }
            });
            console.log(`Navigated to: ${screenId}`);
        }

        /**
         * Generates a random 3-digit invite code.
         * @returns {string} A 3-digit string.
         */
        function generateInviteCode() {
            return Math.floor(100 + Math.random() * 900).toString();
        }

        /**
         * Displays an alert message (can be replaced with a custom modal later).
         * @param {string} message The message to display.
         */
        function showAlert(message) {
            // TODO: Implement a nicer modal/toast notification
            alert(message);
        }

        /**
         * Converts Firebase object-like array representation to a dense JS array.
         * Handles cases where Firebase returns an object for sparse arrays.
         * @param {object|Array|null} firebaseBoard The board data received from Firebase.
         * @returns {Array} A dense 9-element array representing the board.
         */
        function firebaseBoardToArray(firebaseBoard) {
            const board = Array(9).fill(null); // Initialize a dense array
            if (Array.isArray(firebaseBoard)) {
                // If it's already an array, copy elements, ensuring length is 9
                firebaseBoard.forEach((val, index) => {
                    if (index < 9 && val !== undefined) { // Avoid copying undefined/empty slots beyond index 8
                        board[index] = val;
                    }
                });
            } else if (firebaseBoard && typeof firebaseBoard === 'object') {
                // If it's an object (sparse array representation from Firebase)
                for (const key in firebaseBoard) {
                    const index = parseInt(key, 10);
                    if (!isNaN(index) && index >= 0 && index < 9) {
                        board[index] = firebaseBoard[key];
                    }
                }
            }
            // If firebaseBoard is null or not an object/array, board remains Array(9).fill(null)
            return board;
        }

        /**
         * Generates a random URL-safe ID (e.g., for game URLs).
         * @param {number} length The desired length of the ID.
         * @returns {string} A random alphanumeric string.
         */
        function generateUrlSafeId(length = 6) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }


        // --- Firebase Interaction Functions ---

        /**
         * Creates a new game in Firebase using an invite code.
         */
        async function createGameWithCode() { // Renamed function
            let creatorName = mainMenuUsernameInput.value.trim();
            if (!creatorName) {
                 creatorName = creatorNameInput.value.trim(); // Fallback to screen-specific input
            }

            if (!creatorName) {
                showAlert("Lütfen ana menüde veya burada bir kullanıcı adı girin.");
                // Optionally focus the input: mainMenuUsernameInput.focus(); or creatorNameInput.focus();
                return;
            }
            // Hide the input on this screen if main menu one was used
            creatorNameInput.style.display = mainMenuUsernameInput.value.trim() ? 'none' : 'block';

            const inviteCode = generateInviteCode();
            currentGameId = inviteCode;
            currentPlayerColor = 'blue'; // Creator is always blue

            const initialGameData = {
                creatorName: creatorName,
                joinerName: null,
                creatorReady: false,
                joinerReady: false,
                pieces: {
                    blue: { small: 3, medium: 3, large: 3 },
                    orange: { small: 3, medium: 3, large: 3 }
                },
                board: Array(9).fill(null), // Represents the 3x3 board
                currentPlayer: 'blue', // Blue starts
                score: { blue: 0, orange: 0 },
                moves: [],
                lastMove: null,
                gameResult: null, // { winner: 'blue'/'orange'/'draw', winningPattern: [indices], isDraw: bool, timestamp: ... }
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };

            try {
                gameRef = database.ref('games/' + inviteCode);
                await gameRef.set(initialGameData);
                console.log(`Game created with code: ${inviteCode}`);
                lobbyInviteCodeEl.textContent = inviteCode;
                lobbyCreatorNameEl.textContent = creatorName;
                lobbyJoinerNameEl.textContent = "Rakip bekleniyor...";
                creatorReadyStatusEl.classList.remove('ready');
                joinerReadyStatusEl.classList.remove('ready');
                lobbyStatusEl.textContent = "Rakip bekleniyor...";
                showScreen('lobby-screen');
                listenToGameChanges(inviteCode);
            } catch (error) {
                console.error("Error creating game:", error);
                showAlert("Oyun oluşturulurken bir hata oluştu.");
                currentGameId = null;
                currentPlayerColor = null;
                gameRef = null;
            }
        }

        /**
         * Joins a game using the ID found in the URL.
         */
        async function joinGameViaUrl() {
            const gameId = joinViaUrlScreen.dataset.gameId; // Retrieve game ID stored earlier
            const joinerName = joinerNameUrlInput.value.trim();

            if (!joinerName) {
                showAlert("Lütfen kullanıcı adınızı girin.");
                joinerNameUrlInput.focus();
                return;
            }
            if (!gameId) {
                showAlert("Katılınacak oyun ID'si bulunamadı. Lütfen geçerli bir bağlantı kullanın.");
                // Optionally redirect to main menu: window.location.href = window.location.origin;
                return;
            }

            if (!currentUserId) {
                currentUserId = generateUserId(); // Generate ID if joining directly via URL
                console.log("Generated session userId for URL join:", currentUserId);
            }

            joinUrlStatusEl.textContent = "Oyun kontrol ediliyor...";
            submitJoinGameUrlBtn.disabled = true; // Disable button during check

            try {
                const gameSnapshot = await database.ref('games/' + gameId).once('value');
                if (!gameSnapshot.exists()) {
                    showAlert("Bu ID'ye sahip bir oyun bulunamadı.");
                    joinUrlStatusEl.textContent = "Oyun bulunamadı.";
                    submitJoinGameUrlBtn.disabled = false;
                    return;
                }

                const gameData = gameSnapshot.val();
                if (gameData.joinerName) {
                    // Allow rejoining if it's the same user? For now, reject.
                    if (gameData.joinerUserId === currentUserId) {
                         console.log("Rejoining game via URL.");
                         // Already joined, proceed to lobby/game
                    } else {
                        showAlert("Bu oyun zaten dolu.");
                        joinUrlStatusEl.textContent = "Oyun dolu.";
                        submitJoinGameUrlBtn.disabled = false;
                        return;
                    }
                }

                // Join the game
                currentGameId = gameId;
                currentPlayerColor = 'orange'; // Joiner is always orange
                gameRef = database.ref('games/' + gameId);

                await gameRef.update({
                    joinerName: joinerName,
                    joinerUserId: currentUserId, // Store joiner's user ID
                    joinerReady: false // Start not ready
                });

                console.log(`Joined game via URL: ${gameId}`);
                joinUrlStatusEl.textContent = "Oyuna katılım başarılı! Lobiye yönlendiriliyorsunuz...";

                // Start listening and show lobby
                listenToGameChanges(gameId);
                showScreen('lobby-screen'); // Go directly to lobby

            } catch (error) {
                console.error("Error joining game via URL:", error);
                showAlert("URL ile oyuna katılırken bir hata oluştu.");
                joinUrlStatusEl.textContent = "Katılırken hata oluştu.";
                submitJoinGameUrlBtn.disabled = false;
                currentGameId = null;
                currentPlayerColor = null;
                gameRef = null;
            }
        }


        /**
         * Creates a new game intended to be joined via a URL.
         */
        async function createGameWithUrl() {
            console.log("Create Game with URL clicked");
            let creatorName = mainMenuUsernameInput.value.trim();
            if (!creatorName) {
                showAlert("Lütfen ana menüde bir kullanıcı adı girin.");
                mainMenuUsernameInput.focus();
                return;
            }

            if (!currentUserId) {
                currentUserId = generateUserId();
                console.log("Generated session userId:", currentUserId);
            }

            const newGameId = generateUrlSafeId(6); // Generate a 6-char ID
            currentGameId = newGameId; // Set current game ID locally
            currentPlayerColor = 'blue'; // Creator is always blue

            const initialGameData = {
                creatorName: creatorName,
                creatorUserId: currentUserId, // Store creator's user ID
                joinerName: null,
                joinerUserId: null,
                creatorReady: false, // Start not ready, wait in lobby
                joinerReady: false,
                isUrlGame: true, // Flag to identify URL-based games if needed
                pieces: {
                    blue: { small: 3, medium: 3, large: 3 },
                    orange: { small: 3, medium: 3, large: 3 }
                },
                board: Array(9).fill(null),
                currentPlayer: 'blue',
                score: { blue: 0, orange: 0 },
                moves: [],
                lastMove: null,
                gameResult: null,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };

            try {
                gameRef = database.ref('games/' + newGameId);
                await gameRef.set(initialGameData);
                console.log(`Game created with URL-ID: ${newGameId}`);

                // Construct and display the shareable URL
                const shareUrl = `${window.location.origin}/${newGameId}`;
                shareGameUrlEl.textContent = shareUrl;
                copyStatusEl.textContent = ''; // Clear previous copy status

                showScreen('share-url-screen');

                // Note: We don't call listenToGameChanges yet.
                // That happens when the creator clicks "Lobiye Git".

            } catch (error) {
                console.error("Error creating game with URL:", error);
                showAlert("URL ile oyun oluşturulurken bir hata oluştu.");
                currentGameId = null;
                currentPlayerColor = null;
                gameRef = null;
            }
        }


        /**
         * Joins an existing game using an invite code.
         */
        async function joinGameWithCode() { // Renamed function
            let joinerName = mainMenuUsernameInput.value.trim();
             if (!joinerName) {
                 joinerName = joinerNameInput.value.trim(); // Fallback to screen-specific input
             }
            const inviteCode = inviteCodeInput.value.trim();

            if (!joinerName) {
                showAlert("Lütfen ana menüde veya burada bir kullanıcı adı girin.");
                 // Optionally focus the input: mainMenuUsernameInput.focus(); or joinerNameInput.focus();
                return;
            }
             // Hide the input on this screen if main menu one was used
            joinerNameInput.style.display = mainMenuUsernameInput.value.trim() ? 'none' : 'block';
            if (!inviteCode || inviteCode.length !== 3 || !/^\d+$/.test(inviteCode)) {
                showAlert("Lütfen geçerli bir 3 haneli davet kodu girin.");
                return;
            }

            try {
                const gameSnapshot = await database.ref('games/' + inviteCode).once('value');
                if (!gameSnapshot.exists()) {
                    showAlert("Bu koda sahip bir oyun bulunamadı.");
                    return;
                }

                const gameData = gameSnapshot.val();
                if (gameData.joinerName) {
                    showAlert("Bu oyun zaten dolu.");
                    return;
                }

                // Join the game
                currentGameId = inviteCode;
                currentPlayerColor = 'orange'; // Joiner is always orange
                gameRef = database.ref('games/' + inviteCode);

                await gameRef.update({
                    joinerName: joinerName,
                    joinerReady: false // Reset ready status on join
                });

                console.log(`Joined game with code: ${inviteCode}`);
                lobbyInviteCodeEl.textContent = inviteCode;
                // Update lobby screen immediately (listener will also update)
                lobbyCreatorNameEl.textContent = gameData.creatorName;
                lobbyJoinerNameEl.textContent = joinerName;
                creatorReadyStatusEl.classList.toggle('ready', gameData.creatorReady);
                joinerReadyStatusEl.classList.remove('ready'); // Joiner starts not ready
                updateLobbyStatus(gameData.creatorReady, false); // Initial status

                showScreen('lobby-screen');
                listenToGameChanges(inviteCode);

            } catch (error) {
                console.error("Error joining game:", error);
                showAlert("Oyuna katılırken bir hata oluştu.");
                currentGameId = null;
                currentPlayerColor = null;
                gameRef = null;
            }
        }

        /**
         * Listens for real-time updates to the current game.
         * @param {string} gameId The ID of the game to listen to.
         */
        function listenToGameChanges(gameId) { // Renamed parameter
            if (gameListener && gameRef) {
                gameRef.off('value', gameListener); // Detach previous listener if any
                console.log(`Detached listener from previous game ref: ${gameRef.key}`);
            }
            
            currentGameId = gameId; // Update currentGameId when starting to listen
            gameRef = database.ref('games/' + gameId); // Use the passed gameId
            console.log(`Attaching listener to game: ${gameId}`);

            gameListener = gameRef.on('value', (snapshot) => {
                if (!snapshot.exists()) {
                    console.log(`Game data not found or deleted for gameId: ${gameId}. Possibly left by opponent.`);
                    // Avoid alert if we intentionally left (e.g., clicked Ana Menu)
                    if(gameScreen.classList.contains('active') || lobbyScreen.classList.contains('active')) {
                        showAlert("Oyun verisi bulunamadı veya silindi. Ana menüye dönülüyor.");
                    }
                    resetLocalState(); // Clean up local state
                    showScreen('main-menu');
                    return;
                }
                const rawGameState = snapshot.val(); // Get raw data
                const previousGameResult = localGameState ? localGameState.gameResult : null; // Store previous result state

                localGameState = rawGameState; // Assign raw data

                localGameState.board = firebaseBoardToArray(rawGameState.board);

                if (!localGameState.pieces) localGameState.pieces = { blue: { small: 0, medium: 0, large: 0 }, orange: { small: 0, medium: 0, large: 0 } };
                if (!localGameState.score) localGameState.score = { blue: 0, orange: 0 };
                if (!localGameState.moves) localGameState.moves = [];

                console.log(`Game data updated for ${gameId}:`, localGameState);

                // --- Determine current player color based on game data ---
                // Ensure currentUserId is set (it should be, but double-check)
                if (!currentUserId) {
                    currentUserId = generateUserId();
                    console.warn("currentUserId was missing, generated:", currentUserId);
                }

                if (localGameState.creatorUserId === currentUserId) {
                    currentPlayerColor = 'blue';
                } else if (localGameState.joinerUserId === currentUserId) {
                    currentPlayerColor = 'orange';
                } else {
                    console.warn(`Could not determine player color for game ${gameId}. My ID: ${currentUserId}, Creator: ${localGameState.creatorUserId}, Joiner: ${localGameState.joinerUserId}`);
                    // This might happen briefly if joining a game created by someone else.
                    // Let's assume joiner if not creator for now, needs careful check in join logic.
                    currentPlayerColor = 'orange'; // TEMPORARY assumption
                }
                console.log(`Player color determined as: ${currentPlayerColor} for game ${gameId}`);
                // --- End color determination ---

                isGameReady = true; // Mark game as ready after first successful load
                console.log("Game is now ready.");
                updateUIBasedOnGameState(localGameState, previousGameResult); // Pass the processed state and previous result status

            }, (error) => {
                console.error(`Firebase listener error for game ${gameId}:`, error);
                isGameReady = false; // Mark as not ready on error
                showAlert("Oyun verisi dinlenirken bir hata oluştu.");
                resetLocalState();
                showScreen('main-menu');
            });
        }

        /**
         * Updates the UI based on the received game state.
         * @param {object} gameState The current game state from Firebase.
         * @param {object | null} previousGameResult The gameResult from the previous state update.
         */
        function updateUIBasedOnGameState(gameState, previousGameResult) {
            // --- Game Start/Restart Logic (Handles start from Lobby OR Random Match Wait) ---
            // If game screen is not active, BUT players are ready and game hasn't ended, start the game.
            if (!gameScreen.classList.contains('active') && gameState.creatorReady && gameState.joinerReady && !gameState.gameResult) {
                 console.log("Game should start/resume: Players ready, game not over, game screen inactive. Initializing board and showing game screen...");
                  initializeGameBoard();
                  showScreen('game-screen');
                 // UI updates for the game screen will happen below.
             }

            // --- Lobby Screen Update ---
            if (lobbyScreen.classList.contains('active')) {
                lobbyInviteCodeEl.textContent = currentGameId.startsWith("REM_") ? "Tekrar Maçı" : (currentGameId || '---'); // Show Rematch status
                lobbyCreatorNameEl.textContent = gameState.creatorName || "Bekleniyor...";
                lobbyJoinerNameEl.textContent = gameState.joinerName || "Bekleniyor...";
                creatorReadyStatusEl.classList.toggle('ready', !!gameState.creatorReady);
                joinerReadyStatusEl.classList.toggle('ready', !!gameState.joinerReady);
                updateLobbyStatus(gameState.creatorReady, gameState.joinerReady);
                 // Update score display in lobby if game is a rematch
                 // TODO: Add score display element to lobby HTML if desired
            }


            // --- Game Screen Update ---
            if (gameScreen.classList.contains('active')) {
                playerBlueNameEl.textContent = gameState.creatorName || "Oyuncu 1";
                playerOrangeNameEl.textContent = gameState.joinerName || "Oyuncu 2";
                scoreBlueEl.textContent = gameState.score.blue;
                scoreOrangeEl.textContent = gameState.score.orange;
                currentPlayerIndicatorEl.textContent = gameState.currentPlayer === 'blue' ? 'Mavi' : (gameState.currentPlayer === 'orange' ? 'Turuncu' : '-');
                currentPlayerIndicatorEl.className = gameState.currentPlayer || '';
                document.querySelector('.player-info.player-blue').classList.toggle('active-turn', gameState.currentPlayer === 'blue');
                document.querySelector('.player-info.player-orange').classList.toggle('active-turn', gameState.currentPlayer === 'orange');
                updatePieceCounterUI(piecesBlueEl, gameState.pieces.blue);
                updatePieceCounterUI(piecesOrangeEl, gameState.pieces.orange);
                renderPlayerPieces('blue', gameState.pieces.blue);
                renderPlayerPieces('orange', gameState.pieces.orange);
                const isBlueTurn = gameState.currentPlayer === 'blue';
                playerPiecesBlueContainer.classList.toggle('inactive-mobile', !isBlueTurn);
                playerPiecesOrangeContainer.classList.toggle('inactive-mobile', isBlueTurn);
                renderBoard(gameState.board);
                renderMoveHistory(gameState.moves);

                // --- Game Over & Rematch Invitation Logic ---
                if (gameState.gameResult) {
                     // Game is over. Ensure the popup is managed correctly.
                    handleGameOver(gameState.gameResult, gameState.board); // Show initial popup

                    // Check if a rematch has been initiated by the *other* player
                    if (gameState.rematchGameId && !localGameState.rematchInitiatorId) { // Check if initiator ID is NOT set yet locally
                        // A rematch offer exists, update the popup for the player who DIDN'T initiate
                        console.log(`Rematch offer detected: ${gameState.rematchGameId}`);
                        const initiatorName = (localGameState.creatorUserId === gameState.rematchInitiatorUserId) ? localGameState.creatorName : localGameState.joinerName;
                         rematchInviteMessageEl.textContent = `${initiatorName} tekrar maç teklif ediyor!`;
                         gameOverActionsDiv.style.display = 'none'; // Hide original buttons
                         rematchInvitationDiv.style.display = 'block'; // Show invitation
                         // Store the rematch ID for the join button
                         rematchInvitationDiv.dataset.rematchId = gameState.rematchGameId;
                         rematchInvitationDiv.dataset.initiatorUserId = gameState.rematchInitiatorUserId; // Store initiator ID

                    } else {
                        // No rematch offer OR this player initiated it, show standard game over actions
                         gameOverActionsDiv.style.display = 'block';
                         rematchInvitationDiv.style.display = 'none';
                    }

                } else {
                    // Game is not over (ongoing or just reset after rematch agreement)
                    gameOverPopup.classList.remove('active');
                    gameOverActionsDiv.style.display = 'block'; // Ensure original buttons are default
                    rematchInvitationDiv.style.display = 'none'; // Ensure invitation is hidden
                    gameBoardEl.querySelectorAll('.board-cell.winning-cell').forEach(cell => {
                       cell.classList.remove('winning-cell');
                    });
                }
            }
        }

        /**
         * Updates the piece counter display.
         * @param {HTMLElement} containerEl The container element for the counts.
         * @param {object} piecesData Piece counts {small, medium, large}.
         */
        function updatePieceCounterUI(containerEl, piecesData) {
            containerEl.querySelector('.count-s').textContent = piecesData.small;
            containerEl.querySelector('.count-m').textContent = piecesData.medium;
            containerEl.querySelector('.count-l').textContent = piecesData.large;
        }


        /**
         * Updates the status message in the lobby.
         * @param {boolean} creatorReady
         * @param {boolean} joinerReady
         */
        function updateLobbyStatus(creatorReady, joinerReady) {
             if (!localGameState.joinerName) {
                 lobbyStatusEl.textContent = "Rakibin katılması bekleniyor...";
             } else if (!creatorReady && !joinerReady) {
                lobbyStatusEl.textContent = "İki oyuncunun da hazır olması bekleniyor...";
            } else if (!creatorReady) {
                lobbyStatusEl.textContent = `Oyuncu '${localGameState.creatorName}' bekleniyor...`;
            } else if (!joinerReady) {
                lobbyStatusEl.textContent = `Oyuncu '${localGameState.joinerName}' bekleniyor...`;
            } else {
                lobbyStatusEl.textContent = "Oyun başlıyor!";
            }
             // Disable/Enable ready button based on player's own ready state
             const playerIsCreator = currentPlayerColor === 'blue';
             const playerIsReady = playerIsCreator ? creatorReady : joinerReady;
             readyBtn.textContent = playerIsReady ? "Hazır Değil" : "Hazır";
             readyBtn.disabled = false; // Ensure button is enabled once in lobby
        }


        /**
         * Sets the player's ready status in Firebase. Handles rematch logic.
         */
        async function setReady() {
            if (!gameRef || !currentPlayerColor) return;

            const isCreator = currentPlayerColor === 'blue';
            const currentReadyState = isCreator ? localGameState.creatorReady : localGameState.joinerReady;
            const newReadyState = !currentReadyState;

            const updates = {};
            if (isCreator) {
                updates.creatorReady = newReadyState;
            } else {
                updates.joinerReady = newReadyState;
            }

            // Determine the potential ready state after this update
            const potentiallyReadyCreator = isCreator ? newReadyState : localGameState.creatorReady;
            const potentiallyReadyJoiner = !isCreator ? newReadyState : localGameState.joinerReady;
            const bothWillBeReady = potentiallyReadyCreator && potentiallyReadyJoiner;

            // Check if we are in a post-game state (gameResult exists) and this action makes both players ready for a rematch
            if (localGameState.gameResult && bothWillBeReady) {
                console.log("Both players ready for rematch. Resetting game state in Firebase.");
                // Add game reset logic to the updates
                const initialPieces = { small: 3, medium: 3, large: 3 };
                updates.pieces = { blue: { ...initialPieces }, orange: { ...initialPieces } };
                updates.board = Array(9).fill(null);
                updates.currentPlayer = 'blue'; // Blue starts again
                updates.moves = [];
                updates.lastMove = null;
                updates.gameResult = null; // <-- Reset game result HERE, signaling game restart
            }

            try {
                readyBtn.disabled = true; // Prevent double clicks
                await gameRef.update(updates);
                console.log(`Player ${currentPlayerColor} ready status update processed. Both ready now: ${bothWillBeReady}, Game was over: ${!!localGameState.gameResult}`);
                // UI updates via listener. The listener will see gameResult: null if reset happened.
                readyBtn.disabled = false; // Re-enable after update
            } catch (error) {
                console.error("Error setting ready status:", error);
                showAlert("Hazır durumu ayarlanırken hata oluştu.");
                readyBtn.disabled = false; // Re-enable on error
            }
        }

        /**
         * Resets local game state variables and detaches listener.
         */
        function resetLocalState() {
            if (gameListener && gameRef) {
                gameRef.off('value', gameListener);
                 console.log(`Detached listener from game ref: ${gameRef.key} during reset.`);
            }
            currentGameId = null;
            currentPlayerColor = null;
            // currentUserId should persist for the session unless explicitly reset
            localGameState = {
                board: Array(9).fill(null),
                pieces: { blue: {}, orange: {} },
                score: { blue: 0, orange: 0 },
                moves: [],
                // Ensure potential rematch state is cleared
                rematchGameId: null,
                rematchInitiatorId: null,
                rematchInitiatorUserId: null,
            };
            gameRef = null;
            gameListener = null;
            isGameReady = false;

            // Reset matchmaking state if necessary (from previous implementation)
            if (waitingPlayersListener) database.ref('/waitingPlayers').off('value', waitingPlayersListener);
            if (myMatchListener && waitingPlayerRef) waitingPlayerRef.off('value', myMatchListener);
            if (waitingPlayerRef) waitingPlayerRef.onDisconnect().cancel();
            waitingPlayersListener = null;
            myMatchListener = null;
            waitingPlayerRef = null;

            // Clear inputs
            mainMenuUsernameInput.value = '';
            creatorNameInput.value = '';
            joinerNameInput.value = '';
            joinerNameUrlInput.value = '';
            inviteCodeInput.value = '';
            creatorNameInput.style.display = 'block';
            joinerNameInput.style.display = 'block';

            // Reset URL/Lobby/Game specific UI
            shareGameUrlEl.textContent = 'URL Yükleniyor...';
            copyStatusEl.textContent = '';
            joinUrlStatusEl.textContent = '';
            lobbyInviteCodeEl.textContent = '---';
            lobbyCreatorNameEl.textContent = 'Bekleniyor...';
            lobbyJoinerNameEl.textContent = 'Bekleniyor...';
            creatorReadyStatusEl.classList.remove('ready');
            joinerReadyStatusEl.classList.remove('ready');
            lobbyStatusEl.textContent = 'Rakip bekleniyor...';
            readyBtn.textContent = 'Hazır';
            readyBtn.disabled = true;
            gameOverPopup.classList.remove('active');
             // Ensure rematch UI is hidden on full reset
             gameOverActionsDiv.style.display = 'block';
             rematchInvitationDiv.style.display = 'none';

            console.log("Local state reset completed.");
        }


        // --- Game Logic Functions (Placeholders - To be implemented) ---

        /**
         * Creates the HTML elements for the game board cells.
         */
        function initializeGameBoard() {
            gameBoardEl.innerHTML = ''; // Clear previous board
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('div');
                cell.classList.add('board-cell');
                cell.dataset.index = i;
                // Add drag/drop event listeners for cells
                cell.addEventListener('dragover', handleDragOver);
                cell.addEventListener('dragenter', handleDragEnter);
                cell.addEventListener('dragleave', handleDragLeave);
                cell.addEventListener('drop', handleDrop);
                cell.addEventListener('click', handleCellClick); // ADDED: Click listener for cells
                gameBoardEl.appendChild(cell);
            }
            console.log("Game board initialized.");
        }

        /**
         * Renders the pieces available to the current player.
         * @param {string} playerColor 'blue' or 'orange'.
         * @param {object} piecesData Piece counts {small, medium, large}.
         */
        function renderPlayerPieces(playerColor, piecesData) {
            const container = playerColor === 'blue' ? playerPiecesBlueContainer : playerPiecesOrangeContainer;
            // Clear previous piece displays (including counts)
            const existingDisplays = container.querySelectorAll('.piece-display');
            existingDisplays.forEach(disp => disp.remove());

            // Ensure piecesData is valid
            if (!piecesData) {
                console.warn(`renderPlayerPieces: Invalid piecesData for ${playerColor}`);
                piecesData = { small: 0, medium: 0, large: 0 }; // Default to zero if missing
            }


            const sizes = ['large', 'medium', 'small']; // Display large first
            sizes.forEach(size => {
                const count = piecesData[size] || 0; // Handle potential undefined count

                // Create a container for the piece and its count
                const pieceDisplay = document.createElement('div');
                pieceDisplay.classList.add('piece-display');

                // Create the representative piece element
                const piece = document.createElement('div');
                piece.classList.add('piece', playerColor, size);
                piece.dataset.color = playerColor;
                piece.dataset.size = size;

                // Determine if this piece should be draggable
                // Use localGameState to check current player and game status
                const isMyTurn = localGameState && localGameState.currentPlayer === playerColor;
                const hasPieces = count > 0;
                const isGameOver = localGameState && localGameState.gameResult;
                const isDraggable = isMyTurn && hasPieces && !isGameOver; // Can only drag if it's my turn, I have pieces, and game isn't over

                piece.draggable = isDraggable;

                if (isDraggable) {
                    piece.addEventListener('dragstart', handleDragStart);
                    piece.addEventListener('dragend', handleDragEnd);
                    piece.classList.remove('non-draggable'); // Ensure class is removed if it becomes draggable
                } else {
                    // Remove listeners if they exist from previous renders (optional, but good practice)
                    piece.removeEventListener('dragstart', handleDragStart);
                    piece.removeEventListener('dragend', handleDragEnd);
                    piece.classList.add('non-draggable'); // Add class for styling non-draggable pieces
                }

                // ADDED: Click listener for pieces (only if it's potentially selectable)
                if (isMyTurn && hasPieces && !isGameOver) {
                    piece.addEventListener('click', handlePieceClick);
                    piece.style.cursor = 'pointer'; // Indicate clickable
                } else {
                    piece.style.cursor = isDraggable ? 'grab' : 'default'; // Keep grab cursor for draggable, default otherwise
                }
                // END ADDED

                // Create the count element
                const countSpan = document.createElement('span');
                countSpan.classList.add('piece-count');
                countSpan.textContent = `(${count})`;

                // Append piece and count to the display container
                pieceDisplay.appendChild(piece);
                pieceDisplay.appendChild(countSpan);

                // Append the display container to the main player pieces container
                container.appendChild(pieceDisplay);
            });
        }


        /**
         * Renders the game board based on the current state.
         * @param {Array} boardState Array representing the board.
         */
        function renderBoard(boardState) {
            // Safety check: Ensure boardState is a valid array
            if (!boardState || !Array.isArray(boardState)) {
                console.warn("renderBoard called with invalid boardState:", boardState);
                // Optionally clear the board or show a loading state
                gameBoardEl.querySelectorAll('.board-cell').forEach(cell => {
                    cell.innerHTML = '';
                    cell.classList.remove('winning-cell');
                });
                return;
            }

            const cells = gameBoardEl.querySelectorAll('.board-cell');
            cells.forEach((cell, index) => {
                // Clear previous pieces in the cell
                cell.innerHTML = '';
                cell.classList.remove('winning-cell'); // Remove winning highlight initially

                const pieceData = boardState[index];
                if (pieceData) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', pieceData.color, pieceData.size);
                    // Make pieces on board non-draggable for simplicity,
                    // or implement logic to allow moving own pieces later.
                    piece.draggable = false;
                    cell.appendChild(piece);
                }
            });
        }

        /**
         * Renders the move history list.
         * @param {Array} moves Array of move objects.
         */
        function renderMoveHistory(moves) {
            movesListEl.innerHTML = ''; // Clear previous list
            if (!moves || moves.length === 0) {
                const li = document.createElement('li');
                li.textContent = "Henüz hamle yapılmadı.";
                movesListEl.appendChild(li);
                return;
            }
            // Show latest move first
            moves.slice().reverse().forEach((move, index) => {
                const li = document.createElement('li');
                const player = move.color === 'blue' ? localGameState.creatorName : localGameState.joinerName;
                // Example notation: "Ali (Mavi) L taşını a1 hücresine koydu."
                // Convert index to algebraic notation (a1, b1, c1, a2...)
                const col = ['a', 'b', 'c'][move.index % 3];
                const row = Math.floor(move.index / 3) + 1;
                const cellNotation = `${col}${row}`;
                const sizeNotation = { small: 'S', medium: 'M', large: 'L' }[move.size];
                li.textContent = `#${moves.length - index}: ${player} (${move.color === 'blue' ? 'Mavi' : 'Turuncu'}) ${sizeNotation} taşını ${cellNotation} hücresine koydu.`;
                movesListEl.appendChild(li);
            });
        }

        /**
         * Handles the game over state, shows popup.
         * @param {object} gameResult The result object from Firebase.
         * @param {Array} boardState The final board state.
         */
        function handleGameOver(gameResult, boardState) {
            let message = "";
            if (gameResult.isDraw) {
                message = "Oyun Berabere!";
            } else {
                // Ensure names are available, provide defaults if not
                 const blueName = localGameState.creatorName || 'Mavi';
                 const orangeName = localGameState.joinerName || 'Turuncu';
                 const winnerName = gameResult.winner === 'blue' ? blueName : orangeName;
                 message = `${winnerName} (${gameResult.winner === 'blue' ? 'Mavi' : 'Turuncu'}) Kazandı!`;

                // Highlight winning cells - clear old ones first
                gameBoardEl.querySelectorAll('.board-cell.winning-cell').forEach(cell => cell.classList.remove('winning-cell'));
                if (gameResult.winningPattern) {
                    gameResult.winningPattern.forEach(index => {
                        gameBoardEl.querySelector(`.board-cell[data-index='${index}']`)?.classList.add('winning-cell');
                    });
                }
            }
            gameResultMessageEl.textContent = message;

             // Show popup - the logic in updateUIBasedOnGameState will handle invitation display
             if (!gameOverPopup.classList.contains('active')) {
               console.log("Showing game over popup.");
               gameOverPopup.classList.add('active');
                // Ensure correct initial state of buttons
                gameOverActionsDiv.style.display = 'block';
                rematchInvitationDiv.style.display = 'none';
             } else {
                console.log("Game over popup already active.");
             }

            // Ensure pieces are non-interactive
            if(localGameState && localGameState.pieces){
               renderPlayerPieces('blue', localGameState.pieces.blue);
               renderPlayerPieces('orange', localGameState.pieces.orange);
            }
            clearSelection(); // Ensure no piece is selected
        }

        /**
         * Initiates a NEW rematch game lobby in Firebase.
         */
        async function requestRematch() {
            if (!gameRef || !localGameState || !localGameState.gameResult) {
                 console.error("Cannot request rematch: Missing game ref, state, or game not over.");
                 return;
             }
            if (!currentUserId) {
                 console.error("Cannot request rematch: Missing currentUserId.");
                 showAlert("Kullanıcı kimliği bulunamadı, tekrar maç başlatılamıyor.");
                 return;
            }

            console.log(`Player ${currentPlayerColor} (${currentUserId}) requesting rematch...`);
            // Disable buttons immediately to prevent double requests
            rematchBtn.disabled = true;
            newGameBtn.disabled = true;


            // 1. Generate New Game ID
            const newRematchGameId = 'REM_' + generateInviteCode() + Date.now().toString().slice(-4);

            // 2. Determine new roles and colors (Initiator becomes Blue/Creator)
            const initiatorColor = currentPlayerColor; // Color in the *finished* game
            const opponentColor = initiatorColor === 'blue' ? 'orange' : 'blue';

            const initiatorUserId = currentUserId;
            const opponentUserId = (initiatorColor === 'blue') ? localGameState.joinerUserId : localGameState.creatorUserId;
            const initiatorName = (initiatorColor === 'blue') ? localGameState.creatorName : localGameState.joinerName;
            const opponentName = (initiatorColor === 'blue') ? localGameState.joinerName : localGameState.creatorName;

             // Check if opponentUserId is valid
            if (!opponentUserId) {
                 console.error("Cannot create rematch: Opponent User ID is missing.");
                 showAlert("Rakip bilgisi eksik, tekrar maç oluşturulamıyor.");
                 rematchBtn.disabled = false;
                 newGameBtn.disabled = false;
                 return;
             }


            // 3. Prepare New Game Data
            const initialPieces = { small: 3, medium: 3, large: 3 };
            const newGameData = {
                creatorName: initiatorName,      // Initiator is the new creator (Blue)
                joinerName: opponentName,        // Opponent is the new joiner (Orange)
                creatorUserId: initiatorUserId,
                joinerUserId: opponentUserId,
                creatorReady: true,              // Initiator starts ready
                joinerReady: false,             // Opponent starts not ready
                pieces: {
                    blue: { ...initialPieces }, // Creator pieces
                    orange: { ...initialPieces } // Joiner pieces
                },
                board: Array(9).fill(null),
                currentPlayer: 'blue',          // New creator (initiator) starts
                score: {                        // Carry over the score
                    blue: localGameState.score[initiatorColor], // Initiator's score becomes Blue's score
                    orange: localGameState.score[opponentColor] // Opponent's score becomes Orange's score
                },
                moves: [],
                lastMove: null,
                gameResult: null,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                isRematch: true,
                previousGameId: currentGameId // Link to the previous game
            };

            // 4. Prepare updates for Firebase (Atomic update for safety)
            const updates = {};
            // Create the new game
            updates[`/games/${newRematchGameId}`] = newGameData;
            // Update the OLD game to notify the opponent
            updates[`/games/${currentGameId}/rematchGameId`] = newRematchGameId;
            updates[`/games/${currentGameId}/rematchInitiatorUserId`] = initiatorUserId; // Store who initiated

            try {
                console.log(`Creating new rematch game: ${newRematchGameId}`);
                await database.ref().update(updates);
                console.log(`Rematch game ${newRematchGameId} created and old game ${currentGameId} updated.`);

                // 5. Transition THIS player to the new game lobby
                if (gameListener && gameRef) {
                    gameRef.off('value', gameListener); // Stop listening to the old game
                    console.log(`Detached listener from old game: ${currentGameId}`);
                }

                // Update local state for the new game
                currentGameId = newRematchGameId;
                currentPlayerColor = 'blue'; // Initiator is always blue in the new game
                gameRef = database.ref('games/' + currentGameId); // Update gameRef

                 // Reset button states here as we are navigating away
                 rematchBtn.disabled = false;
                 newGameBtn.disabled = false;
                 gameOverPopup.classList.remove('active'); // Hide popup


                // Start listening to the NEW game
                listenToGameChanges(currentGameId);

                // Show the lobby screen for the new game
                showScreen('lobby-screen');


            } catch (error) {
                console.error("Error creating rematch game:", error);
                showAlert("Tekrar maç oluşturulurken bir hata oluştu.");
                 // Re-enable buttons on error
                 rematchBtn.disabled = false;
                 newGameBtn.disabled = false;
            }
        }


        /**
         * Joins the rematch game offered by the opponent.
         */
        async function joinRematch() {
            const rematchId = rematchInvitationDiv.dataset.rematchId;
            if (!rematchId) {
                console.error("Cannot join rematch: Rematch ID not found in dataset.");
                return;
            }
             if (!currentUserId) {
                 console.error("Cannot join rematch: Missing currentUserId.");
                 showAlert("Kullanıcı kimliği bulunamadı, tekrar maça katılamazsınız.");
                 return;
            }


            console.log(`Player ${currentUserId} joining rematch game: ${rematchId}`);
            joinRematchBtn.disabled = true; // Disable buttons
            declineRematchBtn.disabled = true;

            try {
                // 1. Stop listening to the old game
                 if (gameListener && gameRef) {
                    gameRef.off('value', gameListener);
                    console.log(`Detached listener from old game: ${currentGameId} before joining rematch.`);
                }

                // 2. Update local state for the new game
                const oldGameId = currentGameId; // Keep track for potential cleanup
                currentGameId = rematchId;
                currentPlayerColor = 'orange'; // Player joining is always orange in the new setup
                gameRef = database.ref('games/' + currentGameId);

                // 3. Set ready status in the NEW game
                await gameRef.update({ joinerReady: true });
                console.log(`Set joinerReady to true for game ${currentGameId}`);


                // 4. Start listening to the new game
                listenToGameChanges(currentGameId);

                 // 5. Clean up rematch info from the OLD game (optional but good practice)
                 // This prevents the invitation showing up again if the player revisits the old game state somehow
                 const oldGameUpdates = {};
                 oldGameUpdates[`/games/${oldGameId}/rematchGameId`] = null;
                 oldGameUpdates[`/games/${oldGameId}/rematchInitiatorUserId`] = null;
                 await database.ref().update(oldGameUpdates).catch(err => console.warn(`Could not clean up old game ${oldGameId} rematch data:`, err));


                // 6. Hide popup and show lobby
                 gameOverPopup.classList.remove('active');
                 // Re-enable buttons (they are hidden, but reset state)
                 joinRematchBtn.disabled = false;
                 declineRematchBtn.disabled = false;
-                 showScreen('lobby-screen');
+                // Go directly to game screen. Listener will ensure it renders correctly.
+                console.log("Rematch joined. Showing game screen.");
+                showScreen('game-screen');
 
 
             } catch (error) {
                console.error("Error joining rematch game:", error);
                showAlert("Tekrar maça katılırken bir hata oluştu.");
                 // Re-enable buttons on error
                 joinRematchBtn.disabled = false;
                 declineRematchBtn.disabled = false;
                 // Potentially try to re-attach listener to old game? Or just go to main menu?
                 // Let's just go to main menu for simplicity on error here.
                 resetLocalState();
                 showScreen('main-menu');
            }
        }

        /**
         * Declines the rematch offer and goes to the main menu.
         */
        async function declineRematch() {
             console.log("Declining rematch offer.");
             const oldGameId = currentGameId; // Game ID where the offer resides

              // Optionally inform the initiator? Could add a 'rematchDeclined: true' flag to the old game.
              // For simplicity, we'll just navigate away.

              // Clean up rematch info from the old game to prevent it showing again
              if (oldGameId) {
                  const oldGameUpdates = {};
                  oldGameUpdates[`/games/${oldGameId}/rematchGameId`] = null;
                  oldGameUpdates[`/games/${oldGameId}/rematchInitiatorUserId`] = null;
                  await database.ref().update(oldGameUpdates).catch(err => console.warn(`Could not clean up old game ${oldGameId} rematch data on decline:`, err));
              }

             startNewGame(); // Reset state and go to main menu
        }


        /**
         * Goes back to the main menu, resetting everything.
         */
        function startNewGame() {
            console.log("Starting New Game (Resetting State)...");
            gameOverPopup.classList.remove('active');
            // Reset local state handles detaching listeners etc.
            resetLocalState();
            showScreen('main-menu');
        }


        // --- Drag and Drop Event Handlers ---
        let draggedPieceInfo = null; // { element: HTMLElement, color: string, size: string }

        function handleDragStart(event) {
            // Check if game state is ready
            if (!isGameReady) {
                event.preventDefault();
                console.log("[DragStart] Prevented: Game state not ready.");
                showAlert("Oyun durumu henüz yüklenmedi, lütfen bekleyin.");
                return;
            }
            // Only allow dragging if it's the player's turn and the piece belongs to them
            if (localGameState.currentPlayer !== currentPlayerColor) {
                event.preventDefault();
                console.log("[DragStart] Prevented: Not your turn!");
                // No alert needed here, just prevent drag
                return;
            }
             // Check if player has that piece available
            const pieceSize = event.target.dataset.size;
            // Ensure pieces data is loaded before checking
            if (!localGameState.pieces || !localGameState.pieces[currentPlayerColor] || localGameState.pieces[currentPlayerColor][pieceSize] <= 0) {
                 event.preventDefault();
                 console.log(`[DragStart] Prevented: No ${pieceSize} pieces left or pieces data missing.`);
                 return;
            }

            draggedPieceInfo = {
                element: event.target,
                color: event.target.dataset.color,
                size: event.target.dataset.size
            };
            event.dataTransfer.effectAllowed = 'move';
            // Optional: Add data to transfer (though we use global `draggedPieceInfo`)
            // event.dataTransfer.setData('text/plain', JSON.stringify({color: draggedPieceInfo.color, size: draggedPieceInfo.size}));
            event.target.style.opacity = '0.5'; // Visual feedback
            console.log(`Dragging piece: ${draggedPieceInfo.color} ${draggedPieceInfo.size}`);
        }

        function handleDragEnd(event) {
            // Reset opacity whether drop was successful or not
            if (draggedPieceInfo) {
                draggedPieceInfo.element.style.opacity = '1';
            }
            draggedPieceInfo = null; // Clear dragged piece info
            // Remove hover effect from all cells
            document.querySelectorAll('.board-cell.droppable-hover').forEach(cell => {
                cell.classList.remove('droppable-hover');
            });
        }

        function handleDragOver(event) {
            event.preventDefault(); // Necessary to allow dropping
            event.dataTransfer.dropEffect = 'move';
        }

        function handleDragEnter(event) {
            // Highlight potential drop target
            if (event.target.classList.contains('board-cell')) {
                // Check if move is potentially valid before highlighting
                const targetIndex = parseInt(event.target.dataset.index, 10);
                // Ensure localGameState and board are available before checking validity
                if (localGameState && localGameState.board && draggedPieceInfo) {
                    if (isValidMove(targetIndex, draggedPieceInfo, localGameState.board)) {
                        event.target.classList.add('droppable-hover');
                    }
                } else {
                     console.warn("[DragEnter] Cannot check validity: Missing gameState, board, or dragged piece info.");
                }
            }
        }

        function handleDragLeave(event) {
            // Remove highlight
            if (event.target.classList.contains('board-cell')) {
                event.target.classList.remove('droppable-hover');
            }
        }

        function handleDrop(event) {
            event.preventDefault();
            event.target.classList.remove('droppable-hover'); // Remove hover effect

            if (!event.target.classList.contains('board-cell') || !draggedPieceInfo) {
                console.log("Drop outside a valid cell or no piece dragged.");
                return;
            }

             // Check if game state is ready before proceeding
            if (!isGameReady) {
                console.log("[Drop] Prevented: Game state not ready.");
                showAlert("Oyun durumu henüz yüklenmedi, lütfen bekleyin.");
                return;
            }

            // Check if it's the player's turn (double check)
            if (localGameState.currentPlayer !== currentPlayerColor) {
                console.log("[Drop] Prevented: Not your turn!");
                showAlert("Sıra sizde değil!");
                return;
            }


            const targetIndex = parseInt(event.target.dataset.index, 10);
            console.log(`Attempting to drop ${draggedPieceInfo.size} ${draggedPieceInfo.color} onto cell ${targetIndex}`);

            // Validate the move (ensure gameState and board exist)
            if (localGameState && localGameState.board && isValidMove(targetIndex, draggedPieceInfo, localGameState.board)) {
                // Make the move in Firebase
                console.log("[Drop] Move is valid. Calling makeMove...");
                makeMove(targetIndex, draggedPieceInfo);
            } else {
                console.log("[Drop] Invalid move or missing game state/board.");
                // Check if the board state was the issue
                if (!localGameState || !localGameState.board) {
                     showAlert("Oyun durumu yüklenemedi, hamle yapılamıyor.");
                } else {
                     showAlert("Geçersiz hamle!");
                }
            }
        }

        // --- Move Validation and Execution ---

        /**
         * Checks if placing the dragged piece onto the target cell is valid.
         * @param {number} targetIndex The index of the target cell (0-8).
         * @param {object} pieceInfo Information about the dragged piece {color, size}.
         * @param {Array} boardState The current state of the board.
         * @returns {boolean} True if the move is valid, false otherwise.
         */
        function isValidMove(targetIndex, pieceInfo, boardState) {
            // Safety checks
            if (!pieceInfo) {
                console.warn("[isValidMove] Failed: No pieceInfo provided.");
                return false;
            }
            if (!boardState || !Array.isArray(boardState) || targetIndex < 0 || targetIndex >= boardState.length) {
                 console.warn("[isValidMove] Failed: Invalid boardState or targetIndex.", { boardState, targetIndex });
                 return false;
            }

            const targetCellData = boardState[targetIndex];
            const pieceSizeValue = { small: 1, medium: 2, large: 3 }[pieceInfo.size];

            // Rule 1: Can place on empty cell
            if (targetCellData === null) {
                return true;
            }

            // Rule 2: Cannot place on own piece
            if (targetCellData.color === pieceInfo.color) {
                return false;
            }

            // Rule 3: Can place on opponent's SMALLER piece
            const targetPieceSizeValue = { small: 1, medium: 2, large: 3 }[targetCellData.size];
            if (targetCellData.color !== pieceInfo.color && pieceSizeValue > targetPieceSizeValue) {
                return true;
            }

            // Otherwise, move is invalid (trying to place on opponent's equal or larger piece)
            return false;
        }

        /**
         * Updates Firebase with the new move details.
         * @param {number} targetIndex The index where the piece was placed.
         * @param {object} pieceInfo Information about the placed piece {color, size}.
         */
        async function makeMove(targetIndex, pieceInfo) {
            if (!gameRef || !localGameState) return;

            console.log(`Making move: ${pieceInfo.color} ${pieceInfo.size} to ${targetIndex}`);

            // Prepare updates for Firebase
            const updates = {};
            const newBoard = [...localGameState.board]; // Create a copy
            newBoard[targetIndex] = { color: pieceInfo.color, size: pieceInfo.size };
            updates[`board`] = newBoard;

            // Decrement piece count
            const newPieces = JSON.parse(JSON.stringify(localGameState.pieces)); // Deep copy
            newPieces[pieceInfo.color][pieceInfo.size]--;
            updates[`pieces`] = newPieces;

            // Switch player
            updates[`currentPlayer`] = pieceInfo.color === 'blue' ? 'orange' : 'blue';

            // Add to move history
            const col = ['a', 'b', 'c'][targetIndex % 3];
            const row = Math.floor(targetIndex / 3) + 1;
            const newMove = {
                index: targetIndex,
                size: pieceInfo.size,
                color: pieceInfo.color,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                notation: `${pieceInfo.color.charAt(0).toUpperCase()}_${pieceInfo.size.charAt(0).toUpperCase()}_${col}${row}`
            };
            const currentMoves = localGameState.moves || [];
            updates[`moves`] = [...currentMoves, newMove];
            updates[`lastMove`] = newMove;

            // Check for winner *after* this move
            const winnerInfo = checkWinner(newBoard);
            if (winnerInfo) {
                updates[`gameResult`] = {
                    winner: winnerInfo.winner,
                    winningPattern: winnerInfo.pattern,
                    isDraw: false,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                };
                // Update score
                const newScore = { ...localGameState.score };
                newScore[winnerInfo.winner]++;
                updates[`score`] = newScore;
                updates[`currentPlayer`] = null; // No current player if game over
            } else if (checkDraw(newBoard, newPieces)) {
                 updates[`gameResult`] = {
                    winner: 'draw',
                    winningPattern: null,
                    isDraw: true,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                };
                updates[`currentPlayer`] = null; // No current player if game over
            }


            try {
                // Disable interactions temporarily
                // TODO: Add visual indication like a loading spinner or disabling board/pieces

                await gameRef.update(updates);
                console.log("Move successfully updated in Firebase.");

                // Re-enable interactions
                // TODO: Remove loading indicator

            } catch (error) {
                console.error("Error making move:", error);
                showAlert("Hamle yapılırken bir hata oluştu.");
                // TODO: Potentially revert UI changes or re-enable interactions
            }

            // Clear selection after move
            clearSelection();
        }


        /**
         * Checks if the current board state results in a win.
         * @param {Array} boardState The current board state.
         * @returns {object|null} { winner: 'blue'/'orange', pattern: [indices] } or null if no winner.
         */
        function checkWinner(boardState) {
            const winningPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6]             // Diagonals
            ];

            for (const pattern of winningPatterns) {
                const [a, b, c] = pattern;
                // Check if all cells in the pattern have a piece
                if (boardState[a] && boardState[b] && boardState[c]) {
                    // Check if they are all the same color (considering the topmost piece)
                    const colorA = boardState[a].color;
                    const colorB = boardState[b].color;
                    const colorC = boardState[c].color;
                    if (colorA === colorB && colorB === colorC) {
                        console.log(`Winner found: ${colorA} with pattern ${pattern}`);
                        return { winner: colorA, pattern: pattern };
                    }
                }
            }

            return null; // No winner
        }

        /**
         * Checks if the game is a draw.
         * (Simplified: Checks if board is full AND no winner. More complex logic might be needed
         * if players run out of specific pieces preventing any valid moves).
         * @param {Array} boardState The current board state.
         * @param {object} pieces The current piece counts for both players.
         * @returns {boolean} True if the game is a draw.
         */
        function checkDraw(boardState, pieces) {
            // Basic draw condition: Board is full and no winner (winner check happens first)
            const isBoardFull = boardState.every(cell => cell !== null);

            // TODO: Add more complex draw condition: No player has any valid moves left.
            // This requires checking all available pieces against all board cells for both players.
            // For now, we rely on the board being full.

            if (isBoardFull) {
                console.log("Draw condition met: Board is full.");
                return true;
            }

            return false;
        }


        // --- Click-to-Move Functions ---

        /**
         * Clears the current piece selection and removes visual highlights.
         */
        function clearSelection() {
            if (selectedPieceInfo && selectedPieceInfo.pieceElement) {
                selectedPieceInfo.pieceElement.classList.remove('selected-piece');
            }
            selectedPieceInfo = null;
            clearTargetCellHighlights();
            console.log("Selection cleared.");
        }

        /**
         * Removes the highlight from all potential target cells.
         */
        function clearTargetCellHighlights() {
            gameBoardEl.querySelectorAll('.board-cell.clickable-target').forEach(cell => {
                cell.classList.remove('clickable-target');
            });
        }

        /**
         * Highlights board cells where the currently selected piece can be legally placed.
         */
        function highlightValidTargetCells() {
            clearTargetCellHighlights(); // Clear previous highlights first
            if (!selectedPieceInfo || !localGameState || !localGameState.board) return;

            gameBoardEl.querySelectorAll('.board-cell').forEach((cell, index) => {
                if (isValidMove(index, selectedPieceInfo, localGameState.board)) {
                    cell.classList.add('clickable-target');
                }
            });
            console.log("Highlighted valid target cells.");
        }

        /**
         * Handles clicking on an available piece.
         * @param {Event} event The click event.
         */
        function handlePieceClick(event) {
            const pieceElement = event.currentTarget; // Use currentTarget to get the element the listener was attached to
            const color = pieceElement.dataset.color;
            const size = pieceElement.dataset.size;

            // Basic validation checks
            if (!isGameReady) {
                showAlert("Oyun durumu henüz yüklenmedi, lütfen bekleyin.");
                return;
            }
            if (localGameState.currentPlayer !== currentPlayerColor) {
                showAlert("Sıra sizde değil!");
                clearSelection(); // Clear selection if it's not their turn
                return;
            }
            if (localGameState.gameResult) {
                showAlert("Oyun bitti!");
                clearSelection();
                return;
            }
             // Check if player has that piece available
            if (!localGameState.pieces || !localGameState.pieces[color] || localGameState.pieces[color][size] <= 0) {
                 showAlert(`Bu boyutta (${size}) taşınız kalmadı.`);
                 clearSelection();
                 return;
            }

            // If clicking the already selected piece, deselect it
            if (selectedPieceInfo && selectedPieceInfo.pieceElement === pieceElement) {
                clearSelection();
                return;
            }

            // Clear previous selection before selecting the new one
            clearSelection();

            // Select the new piece
            selectedPieceInfo = { pieceElement, color, size };
            pieceElement.classList.add('selected-piece');
            console.log(`Selected piece: ${color} ${size}`);

            // Highlight valid moves on the board
            highlightValidTargetCells();
        }

        /**
         * Handles clicking on a board cell.
         * @param {Event} event The click event.
         */
        function handleCellClick(event) {
            const cellElement = event.currentTarget;
            const targetIndex = parseInt(cellElement.dataset.index, 10);

            if (!isGameReady || !localGameState || !localGameState.board) {
                showAlert("Oyun durumu henüz yüklenmedi, lütfen bekleyin.");
                clearSelection();
                return;
            }
             if (localGameState.gameResult) {
                showAlert("Oyun bitti!");
                clearSelection();
                return;
            }

            // If a piece is selected and the clicked cell is a valid target
            if (selectedPieceInfo && cellElement.classList.contains('clickable-target')) {
                 console.log(`Cell ${targetIndex} clicked with selected piece. Making move...`);
                 // Make the move (using the selected piece info)
                 makeMove(targetIndex, selectedPieceInfo);
                 // makeMove now calls clearSelection() internally
            } else {
                 // If a piece was selected but the target is invalid, or if no piece was selected,
                 // just clear the current selection (if any).
                 console.log(`Cell ${targetIndex} clicked, but not a valid target or no piece selected. Clearing selection.`);
                 clearSelection();
            }
        }

        // --- End Click-to-Move Functions ---


        // --- NEW Random Match Functions ---

        function generateUserId() {
            // Simple unique ID generator for the session
            return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        }

        async function handleRandomMatchClick() {
            console.log("Random Match button clicked (New System)");
            const username = mainMenuUsernameInput.value.trim();
            if (!username) {
                showAlert("Rastgele eşleşme için lütfen ana menüde bir kullanıcı adı girin.");
                mainMenuUsernameInput.focus();
                return;
            }
            if (!currentUserId) {
                currentUserId = generateUserId();
                console.log("Generated session userId:", currentUserId);
            }

            // Ensure previous listeners are detached before starting anew
            await cancelRandomMatch(false); // Call cancel without navigating back

            showScreen('random-match-wait-screen');
            randomMatchBtn.disabled = true;
            cancelRandomMatchBtn.disabled = false;
            randomMatchStatusEl.textContent = "Sıraya ekleniyor...";

            try {
                waitingPlayerRef = database.ref(`/waitingPlayers/${currentUserId}`);
                const playerData = {
                    username: username,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    status: "waiting"
                };
                await waitingPlayerRef.set(playerData);
                await waitingPlayerRef.onDisconnect().remove(); // Set disconnect handler
                console.log(`Player ${username} (${currentUserId}) added to waiting queue.`);
                randomMatchStatusEl.textContent = "Rakip bekleniyor...";

                // Start listening for potential matches and for own status change
                listenForWaitingPlayers();
                listenForMyMatch();

            } catch (error) {
                console.error("Error adding player to waiting queue:", error);
                showAlert("Sıraya eklenirken bir hata oluştu: " + error.message);
                await cancelRandomMatch(); // Clean up and go back to main menu
            }
        }

        function listenForWaitingPlayers() {
            // Detach previous listener if any
            if (waitingPlayersListener) {
                database.ref('/waitingPlayers').off('value', waitingPlayersListener);
            }

            const waitingRef = database.ref('/waitingPlayers');
            waitingPlayersListener = waitingRef.on('value', (snapshot) => {
                if (!snapshot.exists() || !currentUserId || !waitingPlayerRef) {
                    // If queue is empty or we are no longer waiting, stop listening
                    console.log("Waiting players listener: Queue empty or no longer waiting.");
                    if (waitingPlayersListener) {
                         waitingRef.off('value', waitingPlayersListener);
                         waitingPlayersListener = null;
                    }
                    return;
                }

                const allWaitingPlayers = snapshot.val();
                const waitingList = [];
                for (const userId in allWaitingPlayers) {
                    if (allWaitingPlayers[userId].status === 'waiting') {
                        waitingList.push({ userId: userId, ...allWaitingPlayers[userId] });
                    }
                }

                console.log(`Waiting players check: ${waitingList.length} player(s) waiting.`);

                if (waitingList.length >= 2) {
                    // Sort by timestamp to get the oldest two
                    waitingList.sort((a, b) => a.timestamp - b.timestamp);
                    const player1 = waitingList[0];
                    const player2 = waitingList[1];

                    // --- Crucial Check: Only the client with the smaller userId initiates the match ---
                    if (currentUserId === player1.userId || currentUserId === player2.userId) {
                        const initiatorId = player1.userId < player2.userId ? player1.userId : player2.userId;
                        console.log(`Potential match found: ${player1.username} vs ${player2.username}. Initiator should be: ${initiatorId}`);

                        if (currentUserId === initiatorId) {
                            console.log("This client is the initiator. Attempting to create game...");
                            // Stop listening immediately to prevent trying again
                            if (waitingPlayersListener) {
                                waitingRef.off('value', waitingPlayersListener);
                                waitingPlayersListener = null;
                                console.log("Stopped waiting players listener (initiator).");
                            }
                            // Create the game and update player statuses
                            createRandomGame(player1, player2);
                        } else {
                             console.log("This client is not the initiator. Waiting for match confirmation...");
                             // The other client will perform the update. We just wait for our status to change via listenForMyMatch.
                        }
                    } else {
                        // This client is waiting but not one of the first two, do nothing.
                        console.log("This client is waiting, but not among the first two.");
                    }
                }
            }, (error) => {
                console.error("Error listening to waiting players:", error);
                showAlert("Eşleşme beklenirken veritabanı dinleme hatası oluştu.");
                cancelRandomMatch();
            });
        }

        async function createRandomGame(player1, player2) {
            console.log(`Creating game for ${player1.username} (${player1.userId}) and ${player2.username} (${player2.userId})`);
            const newGameId = 'RND_' + generateInviteCode() + Date.now().toString().slice(-4);

            // Randomly assign colors
            const colors = ['blue', 'orange'];
            const player1IsBlue = Math.random() < 0.5;

            const initialGameData = {
                creatorName: player1IsBlue ? player1.username : player2.username,
                joinerName: player1IsBlue ? player2.username : player1.username,
                creatorUserId: player1IsBlue ? player1.userId : player2.userId,
                joinerUserId: player1IsBlue ? player2.userId : player1.userId,
                creatorReady: true, // Start ready
                joinerReady: true,  // Start ready
                pieces: {
                    blue: { small: 3, medium: 3, large: 3 },
                    orange: { small: 3, medium: 3, large: 3 }
                },
                board: Array(9).fill(null),
                currentPlayer: 'blue', // Blue always starts
                score: { blue: 0, orange: 0 },
                moves: [],
                lastMove: null,
                gameResult: null,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                isRandomMatch: true
            };

            // Prepare multi-path update for atomicity
            const updates = {};
            updates[`/games/${newGameId}`] = initialGameData;
            updates[`/waitingPlayers/${player1.userId}/status`] = "matched";
            updates[`/waitingPlayers/${player1.userId}/gameId`] = newGameId;
            updates[`/waitingPlayers/${player2.userId}/status`] = "matched";
            updates[`/waitingPlayers/${player2.userId}/gameId`] = newGameId;

            try {
                await database.ref().update(updates);
                console.log(`Game ${newGameId} created and players updated successfully.`);
                // The listenForMyMatch listener on both clients will now detect the change and start the game.
            } catch (error) {
                console.error("Error creating game and updating players:", error);
                showAlert("Oyun oluşturulurken veya oyuncu durumları güncellenirken hata oluştu.");
                // Attempt to clean up - potentially remove the game node if created?
                // For simplicity, just navigate back to main menu after trying to remove players from queue
                await database.ref(`/waitingPlayers/${player1.userId}`).remove().catch(e => console.error("Cleanup error p1:", e));
                await database.ref(`/waitingPlayers/${player2.userId}`).remove().catch(e => console.error("Cleanup error p2:", e));
                cancelRandomMatch();
            }
        }


        function listenForMyMatch() {
             if (!currentUserId) return;
             // Detach previous listener if any
             if (myMatchListener && waitingPlayerRef) {
                 waitingPlayerRef.off('value', myMatchListener);
             }

             waitingPlayerRef = database.ref(`/waitingPlayers/${currentUserId}`);
             console.log(`Listening for own status at: /waitingPlayers/${currentUserId}`);

             myMatchListener = waitingPlayerRef.on('value', (snapshot) => {
                 if (snapshot.exists()) {
                     const myData = snapshot.val();
                     console.log("My waiting status update:", myData);
                     if (myData.status === 'matched' && myData.gameId) {
                         console.log(`Matched! Found gameId: ${myData.gameId}`);

                         // Stop listening here and cancel disconnect handler
                         waitingPlayerRef.off('value', myMatchListener);
                         myMatchListener = null;
                         waitingPlayerRef.onDisconnect().cancel(); // Crucial!
                         console.log("Stopped own status listener and cancelled onDisconnect.");

                         // Stop the general waiting players listener as well
                         if (waitingPlayersListener) {
                             database.ref('/waitingPlayers').off('value', waitingPlayersListener);
                             waitingPlayersListener = null;
                             console.log("Stopped general waiting players listener.");
                         }

                         // Set game ID and start listening to the game
                         currentGameId = myData.gameId;
                         // Determine color and start game listening
                         // Need to fetch game data to know the color, listenToGameChanges will handle it
                         console.log(`Starting to listen to game: ${currentGameId}`);
                         listenToGameChanges(currentGameId); // This function will update UI and show game screen

                         // Reset queue ref
                         waitingPlayerRef = null;
                     }
                 } else {
                     // My node was deleted - likely cancelled or matched and cleaned up by initiator
                     console.log(`My waiting node /waitingPlayers/${currentUserId} deleted.`);
                     // If we are still on the waiting screen, it means cancellation happened
                     if (randomMatchWaitScreen.classList.contains('active')) {
                         console.log("Still on waiting screen, assuming cancellation.");
                         // Ensure listeners are off and navigate back
                          if (myMatchListener && waitingPlayerRef) waitingPlayerRef.off('value', myMatchListener);
                          if (waitingPlayersListener) database.ref('/waitingPlayers').off('value', waitingPlayersListener);
                          myMatchListener = null;
                          waitingPlayersListener = null;
                          waitingPlayerRef = null; // Clear ref
                          randomMatchBtn.disabled = false;
                          cancelRandomMatchBtn.disabled = true;
                          showScreen('main-menu');
                     }
                 }
             }, (error) => {
                 console.error("Error listening for own match status:", error);
                 showAlert("Kendi eşleşme durumunuz beklenirken bir hata oluştu.");
                 cancelRandomMatch();
             });
        }


        async function cancelRandomMatch(navigateToMenu = true) {
            console.log("Cancelling random match search (New System)...");
            const userIdToCancel = currentUserId;
            const playerRefToCancel = waitingPlayerRef; // Capture ref before resetting

            // Detach listeners immediately
            if (waitingPlayersListener) {
                database.ref('/waitingPlayers').off('value', waitingPlayersListener);
                waitingPlayersListener = null;
                console.log("Detached waiting players listener.");
            }
            if (myMatchListener && playerRefToCancel) {
                playerRefToCancel.off('value', myMatchListener);
                myMatchListener = null;
                console.log("Detached own status listener.");
            }

            // Cancel onDisconnect and remove from waiting list
            if (playerRefToCancel) {
                 try {
                    await playerRefToCancel.onDisconnect().cancel();
                    console.log("Cancelled onDisconnect handler.");
                    await playerRefToCancel.remove();
                    console.log("Removed self from waiting players:", userIdToCancel);
                 } catch(error) {
                     console.error("Error removing self from queue or cancelling disconnect:", error);
                 }
            }

            // Reset local state
            // currentGameId = null; // Should already be null if cancelling
            // currentPlayerColor = null;
            waitingPlayerRef = null; // Clear the reference

            // Re-enable the main match button and disable cancel
            randomMatchBtn.disabled = false;
            cancelRandomMatchBtn.disabled = true;

            if (navigateToMenu) {
                showScreen('main-menu');
            }
        }


        // --- Event Listeners Setup ---
        function setupEventListeners() {
            randomMatchBtn.addEventListener('click', handleRandomMatchClick); // Added
            createGameBtn.addEventListener('click', () => {
                // Show/hide username input based on main menu input
                creatorNameInput.style.display = mainMenuUsernameInput.value.trim() ? 'none' : 'block';
                showScreen('create-game-screen');
            });
            createGameUrlBtn.addEventListener('click', createGameWithUrl); // New listener

            joinGameBtn.addEventListener('click', () => {
                 // Show/hide username input based on main menu input
                joinerNameInput.style.display = mainMenuUsernameInput.value.trim() ? 'none' : 'block';
                showScreen('join-game-screen');
            });

            submitCreateGameBtn.addEventListener('click', createGameWithCode);
            submitJoinGameBtn.addEventListener('click', joinGameWithCode);
            submitJoinGameUrlBtn.addEventListener('click', joinGameViaUrl); // New listener

            cancelRandomMatchBtn.addEventListener('click', cancelRandomMatch);

            readyBtn.addEventListener('click', setReady);

            rematchBtn.addEventListener('click', requestRematch); // Now creates NEW game
            newGameBtn.addEventListener('click', startNewGame);

            joinRematchBtn.addEventListener('click', joinRematch); // New listener for joining offered rematch
            declineRematchBtn.addEventListener('click', declineRematch); // New listener for declining

            copyUrlBtn.addEventListener('click', () => {
                const urlToCopy = shareGameUrlEl.textContent;
                if (navigator.clipboard && urlToCopy && urlToCopy !== 'URL Yükleniyor...') {
                    navigator.clipboard.writeText(urlToCopy).then(() => {
                        copyStatusEl.textContent = 'URL Kopyalandı!';
                        setTimeout(() => { copyStatusEl.textContent = ''; }, 2000); // Clear message after 2s
                    }).catch(err => {
                        console.error('URL kopyalanamadı: ', err);
                        copyStatusEl.textContent = 'Kopyalama Başarısız!';
                         setTimeout(() => { copyStatusEl.textContent = ''; }, 2000);
                    });
                }
            });

            goToLobbyFromShareBtn.addEventListener('click', () => {
                if (currentGameId) {
                    console.log(`Going to lobby for game: ${currentGameId}`);
                    listenToGameChanges(currentGameId); // Start listening
                    showScreen('lobby-screen');
                } else {
                    console.error("Cannot go to lobby, currentGameId is not set.");
                    showAlert("Lobiye gidilemiyor, oyun ID bulunamadı.");
                }
            });


            backBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetScreen = btn.dataset.target;
                     // If going back from lobby or game, reset state
                    if (lobbyScreen.classList.contains('active') || gameScreen.classList.contains('active')) {
                         // Maybe ask for confirmation before leaving a game?
                         if (confirm("Oyundan çıkmak istediğinize emin misiniz? İlerlemeniz kaybolabilir.")) {
                             // Optionally delete game from Firebase if creator leaves lobby?
                             // For now, just reset local state.
                             resetLocalState();
                             showScreen(targetScreen);
                         }
                    } else {
                        showScreen(targetScreen);
                    }
                });
            });

            // Drag/Drop listeners for board cells are added in initializeGameBoard()
            // Drag listeners for pieces are added in renderPlayerPieces()
            // Click listeners are added in initializeGameBoard() and renderPlayerPieces()

            // ADDED: Listener to deselect piece if clicking outside relevant areas
            document.getElementById('app-container').addEventListener('click', (event) => {
                // Check if the click target is NOT a piece in the player's hand OR a clickable board cell
                if (!event.target.closest('.player-pieces .piece') && !event.target.closest('.board-cell')) {
                    if (selectedPieceInfo) {
                        console.log("Clicked outside relevant area. Clearing selection.");
                        clearSelection();
                    }
                }
            });
            // END ADDED
        }

        // --- Initial Setup ---
        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM fully loaded and parsed");

            // --- Check for Game ID in URL Path ---
            const pathSegments = window.location.pathname.split('/').filter(segment => segment); // Get path segments, remove empty ones
            const gameIdFromUrl = pathSegments.length > 0 ? pathSegments[0] : null; // Assume first segment is game ID

            if (gameIdFromUrl && gameIdFromUrl.length === 6) { // Basic check for 6-char ID
                console.log(`Game ID found in URL: ${gameIdFromUrl}`);
                // Store the game ID on the join screen element for later retrieval
                joinViaUrlScreen.dataset.gameId = gameIdFromUrl;
                joinUrlStatusEl.textContent = `Oyun ${gameIdFromUrl} için katılım bekleniyor...`;
                showScreen('join-via-url-screen'); // Show the specific join screen
            } else {
                console.log("No valid game ID found in URL path, showing main menu.");
                showScreen('main-menu'); // Start at the main menu if no valid game ID
            }
            // --- End URL Check ---

            setupEventListeners();
            readyBtn.disabled = true; // Disable ready button initially
        });