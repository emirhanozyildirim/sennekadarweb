</script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #F79F1F; /* Ana turuncu arka plan */
            color: #fff;
        }
        .btn-primary, .joker-btn {
            background-color: #4A90E2; /* Mavi buton rengi */
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: background-color 0.3s ease, opacity 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .btn-primary:hover, .joker-btn:hover:not(:disabled) {
            background-color: #357ABD; /* Mavi buton hover rengi */
        }
        .joker-btn {
            padding: 10px 15px;
            font-size: 0.9em;
        }
        .joker-btn:disabled {
            background-color: #a0aec0;
            cursor: not-allowed;
            opacity: 0.6;
        }
        .btn-secondary {
            background-color: #2ECC71; /* Yeşil buton rengi */
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            transition: background-color 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .btn-secondary:hover {
            background-color: #27AE60; /* Yeşil buton hover rengi */
        }
        .card {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .input-field {
            background-color: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 10px;
            border-radius: 6px;
            width: 100%;
            margin-bottom: 1rem;
        }
        .input-field::placeholder {
            color: rgba(255,255,255,0.7);
        }
        .error-message {
            color: #FFCCCC; /* Açık kırmızı */
            font-size: 0.9em;
            margin-top: -0.5rem;
            margin-bottom: 0.5rem;
            display: none; /* Başlangıçta gizli */
        }
        .item-card {
            background-color: #ffffff;
            color: #333;
            border-radius: 10px;
            padding: 16px;
            text-align: center;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 150px;
        }
        .item-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        .item-card img {
            width: 60px; height: 60px; object-fit: contain; margin-bottom: 0.75rem;
        }
        .item-card .placeholder-icon {
            font-size: 2.5rem; margin-bottom: 0.75rem; color: #F79F1F;
        }
        .page { display: none; }
        .page.active { display: block; }
        #loadingIndicator {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;
        }
        .spinner {
            border: 8px solid #f3f3f3; border-top: 8px solid #4A90E2; border-radius: 50%;
            width: 60px; height: 60px; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .quiz-option-btn {
            background-color: #4A90E2; color: white; padding: 10px 15px; border-radius: 6px;
            font-weight: 500; transition: background-color 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
            border: 2px solid transparent; cursor: pointer;
        }
        .quiz-option-btn.hidden-by-joker {
            visibility: hidden; 
            opacity: 0;
            pointer-events: none;
        }
        .quiz-option-btn:hover:not(.disabled):not(.answered) { background-color: #357ABD; }
        .quiz-option-btn.selected-transient { background-color: #F79F1F; border-color: #fff; }
        .quiz-option-btn.correct { background-color: #2ECC71 !important; color: white !important; opacity: 1 !important; }
        .quiz-option-btn.incorrect { background-color: #E74C3C !important; color: white !important; opacity: 1 !important; }
        .quiz-option-btn.disabled, .quiz-option-btn.faded { opacity: 0.5; cursor: not-allowed; }
        .modal-content, .expert-modal-content {
            background-color: #4A5568; color: #fff; padding: 24px; border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 500px; width: 90%; text-align: center;
            position: relative; /* Close button için */
        }
        .modal-content img.result-badge-img { max-width: 100px; max-height: 100px; margin: 0 auto 1rem; }
        .modal-content img.result-comment-img { max-width: 200px; max-height: 150px; object-fit: contain; margin: 1rem auto; border-radius: 8px; }
        .expert-modal-content .expert-image { width: 120px; height: 120px; object-fit: cover; border-radius: 50%; margin: 1rem auto; }
        #authStatus {
            position: fixed; top: 10px; right: 10px; background-color: rgba(0,0,0,0.7);
            padding: 5px 10px; border-radius: 5px; font-size: 0.9em; z-index: 100;
        }
        #authButtonGoogle { 
             display: none; 
             margin-left: 10px; background-color: #dd4b39; 
             color: white; padding: 3px 8px; border-radius: 4px;
        }
        .close-modal-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 1.8rem; 
            line-height: 1; 
            color: #ccc;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem 0.5rem; 
        }
        .close-modal-btn:hover { color: #fff; }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4">

    <div id="authStatus">
        <span id="authText">Giriş yapılmadı</span>
        <button id="authButtonGoogle"><i class="fab fa-google mr-1"></i> Google ile Giriş</button>
    </div>

    <div id="loadingIndicator" class="flex">
        <div class="spinner"></div>
    </div>

    <div id="mainPage" class="page active w-full max-w-md text-center">
        <img src="https://placehold.co/300x100/F79F1F/FFFFFF?text=SEN+NE+KADAR%3F&font=Impact" alt="Uygulama Logosu" class="mx-auto mb-8 rounded-lg">
        <div class="space-y-4">
            <button id="btnKategoriler" class="btn-primary w-full">KATEGORİLER</button>
            <button id="btnProfil" class="btn-primary w-full">PROFİL / GİRİŞ</button>
            <button id="btnRozetlerim" class="btn-primary w-full">ROZETLERİM</button>
            <button id="btnLiderTablosu" class="btn-primary w-full">LİDER TABLOSU</button>
        </div>
        <button id="btnAyarlar" class="mt-8 text-white hover:text-gray-300"><i class="fas fa-cog fa-2x"></i></button>
    </div>

    <div id="categoriesPage" class="page w-full max-w-3xl">
        <div class="flex justify-between items-center mb-6 px-2">
            <button id="btnBackNavigation" class="text-white hover:text-gray-300 p-2"><i class="fas fa-arrow-left fa-2x"></i></button>
            <h1 id="categoriesPageTitle" class="text-3xl font-bold text-center text-white flex-grow">Kategoriler</h1>
            <div class="w-10 h-10"></div> </div>
        <div id="breadcrumbContainer" class="text-center text-gray-200 mb-4"></div>
        <div id="mainCategoryGridContainer"><div id="mainCategoryGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2"></div></div>
        <div id="subCategoryGridContainer" style="display: none;"><div id="subCategoryGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2"></div></div>
        <div id="quizGridContainer" style="display: none;"><div id="quizGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2"></div></div>
    </div>

    <div id="profilePage" class="page w-full max-w-md text-center">
        <button id="btnBackToMainFromProfile" class="absolute top-4 left-4 text-white hover:text-gray-300 p-2"><i class="fas fa-arrow-left fa-lg"></i> Ana Sayfa</button>
        <h1 class="text-4xl font-bold mb-8 text-white">Profil</h1>
        <div id="authFormContainer" class="card" style="display: none;">
            <h2 class="text-2xl font-semibold mb-6 text-white">Giriş Yap / Kayıt Ol</h2>
            <input type="email" id="emailInput" placeholder="E-posta Adresiniz" class="input-field">
            <p id="emailError" class="error-message">Geçerli bir e-posta adresi girin.</p>
            <input type="password" id="passwordInput" placeholder="Şifreniz" class="input-field">
            <p id="authError" class="error-message"></p>
            <div class="flex space-x-4 mt-4">
                <button id="btnCreateAccount" class="btn-secondary w-1/2">Hesap Oluştur</button>
                <button id="btnLogin" class="btn-primary w-1/2">Giriş Yap</button>
            </div>
        </div>
        <div id="profileContentContainer" class="card" style="display: none;">
            <p id="profileContentText">Profil bilgileri yükleniyor...</p>
        </div>
    </div>

    <div id="badgesPage" class="page w-full max-w-md text-center">
        <button class="btn-back-to-main-simple absolute top-4 left-4 text-white hover:text-gray-300 p-2"><i class="fas fa-arrow-left fa-lg"></i> Ana Sayfa</button>
        <h1 class="text-4xl font-bold mb-8 text-white">Rozetlerim</h1>
        <div id="badgesContent" class="card grid grid-cols-3 gap-4"><p class="col-span-3">Rozetler yükleniyor...</p></div>
    </div>

    <div id="leaderboardPage" class="page w-full max-w-md text-center">
        <button class="btn-back-to-main-simple absolute top-4 left-4 text-white hover:text-gray-300 p-2"><i class="fas fa-arrow-left fa-lg"></i> Ana Sayfa</button>
        <h1 class="text-4xl font-bold mb-8 text-white">Lider Tablosu</h1>
        <div id="leaderboardContent" class="card">
            <p>Lider tablosu yükleniyor...</p>
        </div>
    </div>

    <div id="settingsModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" style="display: none; z-index: 1000;">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-gray-800">
            <h2 class="text-2xl font-semibold mb-4">Ayarlar</h2>
            <p id="userEmailForSettings" class="my-2"></p>
            <button id="btnLogout" class="btn-primary w-full mt-4" style="background-color: #E74C3C;">Çıkış Yap</button>
            <button id="btnCloseSettings" class="btn-secondary w-full mt-6">Kapat</button>
        </div>
    </div>

    <div id="quizPage" class="page w-full max-w-2xl text-center">
         <button id="btnKategorilereDonQuiz" class="absolute top-4 left-4 text-white hover:text-gray-300 p-2"><i class="fas fa-arrow-left fa-lg"></i> Kategoriler</button>
        <h1 id="quizPageTitle" class="text-3xl font-bold mb-2 text-white">Quiz Başlıyor!</h1>
        <p id="quizBreadcrumb" class="text-sm text-gray-300 mb-4"></p>
        <div class="card">
            <img id="quizQuestionImage" src="" alt="Soru Resmi" class="mx-auto mb-4 rounded-lg max-h-60 object-contain" style="display:none;">
            <p id="quizQuestionText" class="text-xl text-white mb-6">Sorular ve cevap seçenekleri burada gösterilecek.</p>
            <div id="quizOptionsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-3"></div>
            <div class="mt-6 flex justify-center items-center"><span id="questionCounter" class="text-white text-lg">Soru 1 / 10</span></div>
            
            <div id="jokerContainer" class="mt-8 flex justify-center space-x-4" style="display: none;">
                <button id="btnFiftyFifty" class="joker-btn"><i class="fas fa-adjust mr-2"></i>Yarı Yarıya</button>
                <button id="btnAskExpert" class="joker-btn"><i class="fas fa-user-tie mr-2"></i>Uzmana Sor</button>
            </div>
        </div>
    </div>

    <div id="quizResultModal" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4" style="display: none; z-index: 1000;">
        <div class="modal-content">
            <button id="btnCloseResultModal" class="close-modal-btn">×</button>
            <h2 id="resultModalTitle" class="text-2xl font-bold mb-4">Quiz Sonucu</h2>
            <p id="resultModalScore" class="text-xl mb-2"></p>
            <img id="resultModalCommentImage" src="" alt="Yorum Resmi" class="result-comment-img" style="display:none;">
            <p id="resultModalComment" class="text-lg my-3"></p>
            <div id="resultModalBadgeContainer" class="mt-4">
                <h3 class="text-lg font-semibold">Kazanılan Rozet:</h3>
                <img id="resultModalBadgeImage" src="" alt="Rozet Resmi" class="result-badge-img" style="display:none;">
                <p id="resultModalBadgeName" class="text-md"></p>
            </div>
        </div>
    </div>
    
    <div id="expertAdviceModal" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4" style="display: none; z-index: 1050;">
        <div class="expert-modal-content">
            <button id="btnCloseExpertModal" class="close-modal-btn">×</button>
            <h2 class="text-xl font-bold mb-3">Uzman Tavsiyesi</h2>
            <img id="expertImage" src="https://placehold.co/120x120/718096/FFFFFF?text=UZMAN&font=Inter" alt="Uzman Resmi" class="expert-image">
            <p id="expertText" class="text-md my-3">Uzman düşünüyor...</p>
            <p id="expertSuggestion" class="text-lg font-semibold mt-2"></p>
        </div>
    </div>

    <button id="btnGoToMainFixed" class="fixed bottom-4 right-4 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg z-50 transition-opacity duration-300 opacity-0 pointer-events-none" title="Ana Menüye Dön">
        <i class="fas fa-home fa-lg"></i>
    </button>

    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js"></script>

    <script>
        const firebaseConfig = { 
            apiKey: "AIzaSyD_MyAPTo1aI6ksKNoX2O7HDdWH6VFcEZQ", 
            authDomain: "sennekadarfirebasedeneme.firebaseapp.com",
            projectId: "sennekadarfirebasedeneme",
            storageBucket: "sennekadarfirebasedeneme.appspot.com",
            messagingSenderId: "153036805626",
            appId: "1:153036805626:web:ddfb41ef3acd2900168043",
            measurementId: "G-XTP3C2F1Y2"
        };

        let app, auth, firestore, currentUser = null;
        try {
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            firestore = firebase.firestore();
            console.log("Firebase başarıyla başlatıldı.");
        } catch (error) { 
            console.error("Firebase başlatılırken hata oluştu:", error);
            document.body.innerHTML = `<div class="min-h-screen flex flex-col items-center justify-center p-4 bg-red-500 text-white"><h1 class="text-2xl font-bold mb-4">Uygulama Hatası!</h1><p>Firebase yapılandırmasında bir sorun var. Konsolu kontrol edin.</p><p class="mt-2 text-sm">Hata: ${error.message}</p></div>`;
        }

        const mainPage = document.getElementById('mainPage');
        const categoriesPage = document.getElementById('categoriesPage');
        const profilePage = document.getElementById('profilePage');
        const authFormContainer = document.getElementById('authFormContainer');
        const emailInput = document.getElementById('emailInput');
        const passwordInput = document.getElementById('passwordInput');
        const emailError = document.getElementById('emailError');
        const authError = document.getElementById('authError');
        const btnCreateAccount = document.getElementById('btnCreateAccount');
        const btnLogin = document.getElementById('btnLogin');
        const profileContentContainer = document.getElementById('profileContentContainer');
        const profileContentText = document.getElementById('profileContentText');
        const btnBackToMainFromProfile = document.getElementById('btnBackToMainFromProfile');
        const badgesPage = document.getElementById('badgesPage');
        const badgesContent = document.getElementById('badgesContent');
        const leaderboardPage = document.getElementById('leaderboardPage');
        const leaderboardContent = document.getElementById('leaderboardContent');
        const quizPage = document.getElementById('quizPage');
        const settingsModal = document.getElementById('settingsModal');
        const userEmailForSettings = document.getElementById('userEmailForSettings');
        const btnLogout = document.getElementById('btnLogout');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const btnKategoriler = document.getElementById('btnKategoriler');
        const btnProfil = document.getElementById('btnProfil');
        const btnRozetlerim = document.getElementById('btnRozetlerim');
        const btnLiderTablosu = document.getElementById('btnLiderTablosu');
        const btnAyarlar = document.getElementById('btnAyarlar');
        const btnCloseSettings = document.getElementById('btnCloseSettings');
        const categoriesPageTitle = document.getElementById('categoriesPageTitle');
        const breadcrumbContainer = document.getElementById('breadcrumbContainer');
        const mainCategoryGridContainer = document.getElementById('mainCategoryGridContainer');
        const mainCategoryGrid = document.getElementById('mainCategoryGrid');
        const subCategoryGridContainer = document.getElementById('subCategoryGridContainer');
        const subCategoryGrid = document.getElementById('subCategoryGrid');
        const quizGridContainer = document.getElementById('quizGridContainer');
        const quizGrid = document.getElementById('quizGrid');
        const btnBackNavigation = document.getElementById('btnBackNavigation');
        const btnKategorilereDonQuiz = document.getElementById('btnKategorilereDonQuiz');
        const quizPageTitle = document.getElementById('quizPageTitle');
        const quizBreadcrumb = document.getElementById('quizBreadcrumb');
        const quizQuestionImage = document.getElementById('quizQuestionImage');
        const quizQuestionText = document.getElementById('quizQuestionText');
        const quizOptionsContainer = document.getElementById('quizOptionsContainer');
        const questionCounter = document.getElementById('questionCounter');
        const quizResultModal = document.getElementById('quizResultModal');
        const resultModalTitle = document.getElementById('resultModalTitle');
        const resultModalScore = document.getElementById('resultModalScore');
        const resultModalCommentImage = document.getElementById('resultModalCommentImage');
        const resultModalComment = document.getElementById('resultModalComment');
        const resultModalBadgeContainer = document.getElementById('resultModalBadgeContainer');
        const resultModalBadgeImage = document.getElementById('resultModalBadgeImage');
        const resultModalBadgeName = document.getElementById('resultModalBadgeName');
        const btnCloseResultModal = document.getElementById('btnCloseResultModal'); 
        const authStatusText = document.getElementById('authText');
        const authButtonGoogle = document.getElementById('authButtonGoogle');
        const btnGoToMainFixed = document.getElementById('btnGoToMainFixed');
        const jokerContainer = document.getElementById('jokerContainer');
        const btnFiftyFifty = document.getElementById('btnFiftyFifty');
        const btnAskExpert = document.getElementById('btnAskExpert');
        const expertAdviceModal = document.getElementById('expertAdviceModal');
        const expertImage = document.getElementById('expertImage');
        const expertText = document.getElementById('expertText');
        const expertSuggestion = document.getElementById('expertSuggestion');
        const btnCloseExpertModal = document.getElementById('btnCloseExpertModal');


        let currentSelectedMainCategory = null, currentSelectedSubCategory = null, currentSelectedQuiz = null;
        let currentQuizQuestions = [], userAnswers = [], questionAnswered = false;
        const NAV_STATE = { MAIN_CATEGORIES: 'MAIN_CATEGORIES', SUB_CATEGORIES: 'SUB_CATEGORIES', QUIZZES: 'QUIZZES' };
        let currentCategoriesPageState = NAV_STATE.MAIN_CATEGORIES;
        const FEEDBACK_DELAY = 500, NEXT_QUESTION_DELAY = 2000;
        let fiftyFiftyUsed = false;
        let askExpertUsed = false;

        // --- AUTHENTICATION ---
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                if(authStatusText) authStatusText.textContent = `Giriş: ${user.displayName || user.email.split('@')[0]}`;
                if(userEmailForSettings) userEmailForSettings.textContent = `Kullanıcı: ${user.email}`;
                if(btnLogout) btnLogout.style.display = 'block';
                
                if (profilePage && profilePage.style.display === 'block') { 
                    if(authFormContainer) authFormContainer.style.display = 'none';
                    if(profileContentContainer) profileContentContainer.style.display = 'block';
                    loadUserProfile();
                }
            } else {
                currentUser = null;
                if(authStatusText) authStatusText.textContent = 'Giriş yapılmadı.';
                if(userEmailForSettings) userEmailForSettings.textContent = ``;
                if(btnLogout) btnLogout.style.display = 'none';
                if (profilePage && profilePage.style.display === 'block') { 
                    if(authFormContainer) authFormContainer.style.display = 'block';
                    if(profileContentContainer) profileContentContainer.style.display = 'none';
                }
                console.log("Kullanıcı çıkış yaptı veya giriş yapmamış.");
            }
        });

        /*
        if(authButtonGoogle) {
            authButtonGoogle.addEventListener('click', () => {
                if (!auth) { console.error("Firebase Auth başlatılmamış!"); return; }
                const provider = new firebase.auth.GoogleAuthProvider();
                auth.signInWithPopup(provider)
                    .then(async (result) => {
                        console.log("Google ile giriş başarılı:", result.user);
                        const user = result.user;
                        const userRef = firestore.collection('users').doc(user.uid);
                        const googleUserRef = firestore.collection('googleUsers').doc(user.uid); 
                        const batch = firestore.batch();
                        batch.set(userRef, {
                            displayName: user.displayName || user.email.split('@')[0],
                            email: user.email,
                            leaderboardPuan: 0,
                            authProvider: "google"
                        }, { merge: true });
                        batch.set(googleUserRef, {
                            uid: user.uid,
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                        }, { merge: true });
                        await batch.commit();
                        showPage(mainPage); 
                    })
                    .catch((error) => {
                        console.error("Google ile giriş hatası:", error);
                        if (authError) { 
                            authError.textContent = `Google ile giriş hatası: ${error.message}`;
                            authError.style.display = 'block';
                        }
                    });
            });
        }
        */

        if(btnLogout) {
            btnLogout.addEventListener('click', () => {
                 if (!auth) { console.error("Firebase Auth başlatılmamış!"); return; }
                 auth.signOut().then(() => {
                    if(settingsModal) settingsModal.style.display = 'none'; 
                    showPage(mainPage); 
                }).catch(error => console.error("Çıkış hatası:", error));
            });
        }
        
        if(btnCreateAccount) {
            btnCreateAccount.addEventListener('click', () => {
                if (!auth || !emailInput || !passwordInput) { console.error("Auth veya input elementleri eksik!"); return; }
                const email = emailInput.value;
                const password = passwordInput.value;
                if(emailError) emailError.style.display = 'none';
                if(authError) authError.style.display = 'none';

                if (!email.includes('@')) {
                    if(emailError) emailError.style.display = 'block';
                    return;
                }
                if (password.length < 6) {
                    if(authError) {
                         authError.textContent = 'Şifre en az 6 karakter olmalıdır.';
                         authError.style.display = 'block';
                    }
                    return;
                }

                auth.createUserWithEmailAndPassword(email, password)
                    .then(async (userCredential) => {
                        const user = userCredential.user;
                        console.log('Hesap oluşturuldu:', user);
                        await user.updateProfile({
                            displayName: email.split('@')[0]
                        });
                        if (!firestore) { console.error("Firestore başlatılmamış!"); return; }
                        await firestore.collection('users').doc(user.uid).set({
                            displayName: email.split('@')[0],
                            email: user.email,
                            leaderboardPuan: 0,
                            authProvider: "email"
                        }, { merge: true });
                    })
                    .catch((error) => {
                        if(authError) {
                            authError.textContent = `Hesap oluşturma hatası: ${error.message}`;
                            authError.style.display = 'block';
                        }
                        console.error('Hesap oluşturma hatası:', error);
                    });
            });
        }

        if(btnLogin) {
            btnLogin.addEventListener('click', () => {
                if (!auth || !emailInput || !passwordInput) { console.error("Auth veya input elementleri eksik!"); return; }
                const email = emailInput.value;
                const password = passwordInput.value;
                if(emailError) emailError.style.display = 'none';
                if(authError) authError.style.display = 'none';

                if (!email.includes('@')) {
                    if(emailError) emailError.style.display = 'block';
                    return;
                }
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        console.log('Giriş yapıldı:', userCredential.user);
                    })
                    .catch((error) => {
                         if(authError) {
                            authError.textContent = `Giriş hatası: ${error.message}`;
                            authError.style.display = 'block';
                        }
                        console.error('Giriş hatası:', error);
                    });
            });
        }

        function showPage(pageToShow) { 
            document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
            
            if (pageToShow) {
                pageToShow.style.display = 'block';
            } else if (mainPage) { 
                mainPage.style.display = 'block';
            }

            if (btnGoToMainFixed) {
                if (pageToShow && pageToShow.id !== 'mainPage' && mainPage && pageToShow.id !== '') { 
                    btnGoToMainFixed.classList.remove('opacity-0', 'pointer-events-none');
                    btnGoToMainFixed.classList.add('opacity-100');
                } else {
                    btnGoToMainFixed.classList.add('opacity-0', 'pointer-events-none');
                    btnGoToMainFixed.classList.remove('opacity-100');
                }
            }
            if (jokerContainer) {
                if (pageToShow && pageToShow.id === 'quizPage' && !questionAnswered) {
                    jokerContainer.style.display = 'flex';
                    if(btnFiftyFifty) btnFiftyFifty.disabled = fiftyFiftyUsed;
                    if(btnAskExpert) btnAskExpert.disabled = askExpertUsed;
                } else {
                    jokerContainer.style.display = 'none';
                }
            }
        }
        document.querySelectorAll('.btn-back-to-main-simple').forEach(button => { 
            button.addEventListener('click', () => showPage(mainPage));
        });
        if(btnBackToMainFromProfile) {
            btnBackToMainFromProfile.addEventListener('click', () => showPage(mainPage));
        }
        if (btnGoToMainFixed) {
            btnGoToMainFixed.addEventListener('click', () => {
                showPage(mainPage);
            });
        }

        function showLoading(show) { 
            if (loadingIndicator) loadingIndicator.style.display = show ? 'flex' : 'none';
        }
        function updateBreadcrumb() { 
            let bcText = `<a href="#" onclick="event.preventDefault(); loadMainCategoriesAndShowPage();" class="hover:underline">Kategoriler</a>`;
            if (currentSelectedMainCategory) {
                bcText += ` > <a href="#" onclick="event.preventDefault(); loadSubCategoriesAndShowPage(currentSelectedMainCategory);" class="hover:underline">${currentSelectedMainCategory.name}</a>`;
            }
            if (currentSelectedSubCategory) {
                bcText += ` > <a href="#" onclick="event.preventDefault(); loadQuizzesAndShowPage(currentSelectedMainCategory, currentSelectedSubCategory);" class="hover:underline">${currentSelectedSubCategory.name}</a>`;
            }
            if(breadcrumbContainer) breadcrumbContainer.innerHTML = bcText;
        }
        function loadMainCategoriesAndShowPage() { 
            showPage(categoriesPage);
            loadMainCategories();
        }
        function loadSubCategoriesAndShowPage(mainCatInfo) { 
            showPage(categoriesPage);
            currentSelectedMainCategory = mainCatInfo;
            loadSubCategories(mainCatInfo);
        }
        function loadQuizzesAndShowPage(mainCatInfo, subCatInfo) { 
            showPage(categoriesPage);
            currentSelectedMainCategory = mainCatInfo; 
            currentSelectedSubCategory = subCatInfo; 
            loadQuizzes(mainCatInfo, subCatInfo);
        }
        function createItemCard(item, type) { 
            const card = document.createElement('div');
            card.className = 'item-card';
            let imageElement;
            if (item.imageURL) {
                imageElement = document.createElement('img');
                imageElement.src = item.imageURL;
                imageElement.alt = item.name || "İsimsiz";
                imageElement.onerror = function() { this.outerHTML = `<i class="fas fa-image placeholder-icon"></i>`; };
            } else {
                let iconClass = 'fa-tags'; 
                if (type === 'subCategory') iconClass = 'fa-sitemap';
                else if (type === 'quiz') iconClass = 'fa-question-circle';
                imageElement = document.createElement('i');
                imageElement.className = `fas ${iconClass} placeholder-icon`;
            }
            const nameElement = document.createElement('span');
            nameElement.className = 'font-semibold text-md truncate w-full';
            nameElement.textContent = item.name || 'İsimsiz';
            card.appendChild(imageElement);
            card.appendChild(nameElement);

            card.addEventListener('click', () => {
                if (type === 'mainCategory') {
                    currentSelectedMainCategory = { id: item.id, name: item.name };
                    currentSelectedSubCategory = null; 
                    currentSelectedQuiz = null; 
                    loadSubCategories(currentSelectedMainCategory);
                } else if (type === 'subCategory') {
                    currentSelectedSubCategory = { id: item.id, name: item.name };
                    currentSelectedQuiz = null; 
                    loadQuizzes(currentSelectedMainCategory, currentSelectedSubCategory);
                } else if (type === 'quiz') {
                    currentSelectedQuiz = {id: item.id, name: item.name}; 
                    navigateToQuizPageAndLoadQuestions(currentSelectedMainCategory, currentSelectedSubCategory, currentSelectedQuiz);
                }
            });
            return card;
        }
        async function loadMainCategories() { 
            if (!firestore || !mainCategoryGrid) return; 
            showLoading(true);
            mainCategoryGrid.innerHTML = '';
            if(subCategoryGridContainer) subCategoryGridContainer.style.display = 'none';
            if(quizGridContainer) quizGridContainer.style.display = 'none';
            if(mainCategoryGridContainer) mainCategoryGridContainer.style.display = 'block';
            currentCategoriesPageState = NAV_STATE.MAIN_CATEGORIES;
            if(categoriesPageTitle) categoriesPageTitle.textContent = 'Kategoriler';
            currentSelectedMainCategory = null;
            currentSelectedSubCategory = null;
            currentSelectedQuiz = null;
            updateBreadcrumb();
            try {
                const snapshot = await firestore.collection('categories').orderBy('name').get();
                if (snapshot.empty) {
                    mainCategoryGrid.innerHTML = '<p class="col-span-full text-center text-white">Kategori bulunamadı.</p>';
                } else {
                    snapshot.forEach(doc => {
                        const category = { id: doc.id, ...doc.data() };
                        mainCategoryGrid.appendChild(createItemCard(category, 'mainCategory'));
                    });
                }
            } catch (error) {
                console.error("Ana kategoriler çekilirken hata: ", error);
                mainCategoryGrid.innerHTML = '<p class="col-span-full text-center text-red-300">Kategoriler yüklenemedi.</p>';
            } finally {
                showLoading(false);
            }
        }
        async function loadSubCategories(mainCategoryInfo) { 
            if (!firestore || !mainCategoryInfo || !subCategoryGrid) return; 
            showLoading(true);
            subCategoryGrid.innerHTML = '';
            if(mainCategoryGridContainer) mainCategoryGridContainer.style.display = 'none';
            if(quizGridContainer) quizGridContainer.style.display = 'none';
            if(subCategoryGridContainer) subCategoryGridContainer.style.display = 'block';
            currentCategoriesPageState = NAV_STATE.SUB_CATEGORIES;
            if(categoriesPageTitle) categoriesPageTitle.textContent = mainCategoryInfo.name;
            currentSelectedSubCategory = null; 
            currentSelectedQuiz = null;
            updateBreadcrumb();
            try {
                const path = `categories/${mainCategoryInfo.id}/subcategories`;
                const snapshot = await firestore.collection(path).orderBy('name').get();
                if (snapshot.empty) {
                    subCategoryGrid.innerHTML = `<p class="col-span-full text-center text-white">"${mainCategoryInfo.name}" için alt kategori bulunamadı.</p>`;
                } else {
                    snapshot.forEach(doc => {
                        const subCategory = { id: doc.id, ...doc.data() };
                        subCategoryGrid.appendChild(createItemCard(subCategory, 'subCategory'));
                    });
                }
            } catch (error) {
                console.error(`"${mainCategoryInfo.name}" için alt kategoriler çekilirken hata: `, error);
                subCategoryGrid.innerHTML = `<p class="col-span-full text-center text-red-300">Alt kategoriler yüklenemedi.</p>`;
            } finally {
                showLoading(false);
            }
        }
        async function loadQuizzes(mainCategoryInfo, subCategoryInfo) { 
             if (!firestore || !mainCategoryInfo || !subCategoryInfo || !quizGrid) return; 
            showLoading(true);
            quizGrid.innerHTML = '';
            if(mainCategoryGridContainer) mainCategoryGridContainer.style.display = 'none';
            if(subCategoryGridContainer) subCategoryGridContainer.style.display = 'none';
            if(quizGridContainer) quizGridContainer.style.display = 'block';
            currentCategoriesPageState = NAV_STATE.QUIZZES;
            if(categoriesPageTitle) categoriesPageTitle.textContent = `${subCategoryInfo.name} Testleri`;
            currentSelectedQuiz = null;
            updateBreadcrumb();
            try {
                const path = `categories/${mainCategoryInfo.id}/subcategories/${subCategoryInfo.id}/quizzes`;
                const snapshot = await firestore.collection(path).orderBy('name').get();
                if (snapshot.empty) {
                    quizGrid.innerHTML = `<p class="col-span-full text-center text-white">"${subCategoryInfo.name}" için test bulunamadı.</p>`;
                } else {
                    snapshot.forEach(doc => {
                        const quizData = { id: doc.id, ...doc.data() }; 
                        quizGrid.appendChild(createItemCard(quizData, 'quiz'));
                    });
                }
            } catch (error) {
                console.error(`"${subCategoryInfo.name}" için testler çekilirken hata: `, error);
                quizGrid.innerHTML = `<p class="col-span-full text-center text-red-300">Testler yüklenemedi.</p>`;
            } finally {
                showLoading(false);
            }
        }

        function navigateToQuizPageAndLoadQuestions(mainCatInfo, subCatInfo, quizInfo) { 
            currentQuizQuestions = [];
            userAnswers = [];
            currentQuestionIndex = 0;
            questionAnswered = false;
            fiftyFiftyUsed = false; 
            askExpertUsed = false;  

            if(quizPageTitle) quizPageTitle.textContent = quizInfo.name; 
            if(quizBreadcrumb) quizBreadcrumb.textContent = `${mainCatInfo.name} > ${subCatInfo.name} > ${quizInfo.name}`;
            showPage(quizPage); 
            fetchAndDisplayQuestions(mainCatInfo, subCatInfo, quizInfo);
        }

        async function fetchAndDisplayQuestions(mainCatInfo, subCatInfo, quizInfo) { 
            if (!firestore || !quizQuestionText || !quizOptionsContainer || !mainCatInfo || !subCatInfo || !quizInfo) return; 
            showLoading(true);
            quizQuestionText.textContent = "Sorular yükleniyor...";
            quizOptionsContainer.innerHTML = '';
            if(quizQuestionImage) quizQuestionImage.style.display = 'none';

            try {
                const path = `categories/${mainCatInfo.id}/subcategories/${subCatInfo.id}/quizzes/${quizInfo.id}/questions`;
                const snapshot = await firestore.collection(path).get(); 
                
                if (snapshot.empty) {
                    quizQuestionText.textContent = "Bu test için soru bulunamadı.";
                    if(questionCounter) questionCounter.style.display = 'none';
                    if(jokerContainer) jokerContainer.style.display = 'none'; 
                    showLoading(false);
                    return;
                }
                if(questionCounter) questionCounter.style.display = 'inline'; 

                const desiredOrder = ["q1", "q10", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"];

                currentQuizQuestions = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => {
                        let indexA = desiredOrder.indexOf(a.id);
                        let indexB = desiredOrder.indexOf(b.id);
                        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;
                        const numA = parseInt(a.id.replace('q', ''), 10);
                        const numB = parseInt(b.id.replace('q', ''), 10);
                        if (isNaN(numA) && isNaN(numB)) return a.id.localeCompare(b.id);
                        if (isNaN(numA)) return 1; 
                        if (isNaN(numB)) return -1;
                        return numA - numB;
                    });
                
                userAnswers = new Array(currentQuizQuestions.length).fill(null);
                displayQuestion(currentQuestionIndex);

            } catch (error) {
                console.error("Sorular çekilirken hata:", error);
                quizQuestionText.textContent = "Sorular yüklenirken bir hata oluştu.";
            } finally {
                showLoading(false);
            }
        }

        function displayQuestion(index) { 
            if (index < 0 || index >= currentQuizQuestions.length || !quizQuestionText || !quizOptionsContainer) return;
            questionAnswered = false; 
            if(jokerContainer) { 
                 jokerContainer.style.display = 'flex';
                 if(btnFiftyFifty) btnFiftyFifty.disabled = fiftyFiftyUsed;
                 if(btnAskExpert) btnAskExpert.disabled = askExpertUsed;
            }

            const questionData = currentQuizQuestions[index];
            quizQuestionText.textContent = questionData.soruMetni;
            if (questionData.imageURL && quizQuestionImage) {
                quizQuestionImage.src = questionData.imageURL;
                quizQuestionImage.style.display = 'block';
            } else if (quizQuestionImage) {
                quizQuestionImage.style.display = 'none';
            }
            quizOptionsContainer.innerHTML = '';
            Object.entries(questionData.siklar).sort().forEach(([key, value]) => { 
                const optionButton = document.createElement('button');
                optionButton.className = 'quiz-option-btn';
                optionButton.textContent = `${key.toUpperCase()}. ${value}`;
                optionButton.dataset.optionKey = key;
                optionButton.addEventListener('click', () => handleAnswerSelection(optionButton, key, questionData.dogruCevap));
                quizOptionsContainer.appendChild(optionButton);
            });
            if(questionCounter) questionCounter.textContent = `Soru ${index + 1} / ${currentQuizQuestions.length}`;
        }

        function handleAnswerSelection(selectedButton, selectedKey, correctAnswerKey) { 
            if (questionAnswered || !quizOptionsContainer) return; 
            questionAnswered = true;
            if(jokerContainer) jokerContainer.style.display = 'none'; 
            userAnswers[currentQuestionIndex] = selectedKey;
            const allOptionButtons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
            allOptionButtons.forEach(btn => {
                btn.classList.add('disabled'); 
                btn.classList.remove('selected-transient'); 
            });
            selectedButton.classList.add('selected-transient');

            setTimeout(() => {
                selectedButton.classList.remove('selected-transient');
                allOptionButtons.forEach(btn => {
                    const optionKey = btn.dataset.optionKey;
                    if (optionKey === correctAnswerKey) btn.classList.add('correct');
                    else if (optionKey === selectedKey) btn.classList.add('incorrect');
                    else btn.classList.add('faded'); 
                });
                setTimeout(() => {
                    if (currentQuestionIndex < currentQuizQuestions.length - 1) {
                        currentQuestionIndex++;
                        displayQuestion(currentQuestionIndex);
                    } else {
                        finishQuiz();
                    }
                }, NEXT_QUESTION_DELAY);
            }, FEEDBACK_DELAY);
        }
        
        function handleFiftyFiftyJoker() {
            if (fiftyFiftyUsed || questionAnswered || currentQuizQuestions.length === 0 || !quizOptionsContainer) return;

            const currentQuestion = currentQuizQuestions[currentQuestionIndex];
            const correctAnswerKey = currentQuestion.dogruCevap;
            const optionButtons = Array.from(quizOptionsContainer.querySelectorAll('.quiz-option-btn:not(.hidden-by-joker)')); 
            let wrongOptionButtons = optionButtons.filter(opt => opt.dataset.optionKey !== correctAnswerKey);

            let numToRemove = Math.min(2, wrongOptionButtons.length -1); 
            
            for (let i = 0; i < numToRemove && wrongOptionButtons.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * wrongOptionButtons.length);
                wrongOptionButtons[randomIndex].classList.add('hidden-by-joker');
                wrongOptionButtons.splice(randomIndex, 1); 
            }

            fiftyFiftyUsed = true;
            if(btnFiftyFifty) btnFiftyFifty.disabled = true;
        }

        async function handleAskExpertJoker() {
            if (askExpertUsed || questionAnswered || !firestore) return;
            showLoading(true);
            try {
                const jokerDocRef = firestore.collection('others').doc('joker'); 
                const docSnap = await jokerDocRef.get();

                if (docSnap.exists) { // Düzeltildi: .exists bir özellik, fonksiyon değil (compat sürüm için)
                    const jokerData = docSnap.data();
                    if(expertImage) expertImage.src = jokerData.ImageUrl || 'https://placehold.co/120x120/718096/FFFFFF?text=UZMAN&font=Inter';
                    if(expertText) expertText.textContent = jokerData.Text || "Biraz düşündükten sonra...";

                    const currentQuestion = currentQuizQuestions[currentQuestionIndex];
                    const correctAnswerKey = currentQuestion.dogruCevap;
                    let suggestedKey;
                    const randomNumber = Math.random(); 

                    if (randomNumber < 0.7) { 
                        suggestedKey = correctAnswerKey;
                    } else { 
                        const allKeys = Object.keys(currentQuestion.siklar);
                        let availableWrongKeys = allKeys.filter(key => {
                            const btn = quizOptionsContainer.querySelector(`.quiz-option-btn[data-option-key="${key}"]`);
                            return key !== correctAnswerKey && btn && !btn.classList.contains('hidden-by-joker');
                        });

                        if (availableWrongKeys.length > 0) {
                            suggestedKey = availableWrongKeys[Math.floor(Math.random() * availableWrongKeys.length)];
                        } else { 
                            suggestedKey = correctAnswerKey;
                        }
                    }
                    const suggestedAnswerText = currentQuestion.siklar[suggestedKey];
                    if(expertSuggestion) expertSuggestion.textContent = `Hatırladığım kadarıyla doğru cevap: ${suggestedKey.toUpperCase()}. ${suggestedAnswerText}`;
                    
                    if(expertAdviceModal) expertAdviceModal.style.display = 'flex';
                } else {
                    console.error("Uzman jokeri için 'others/joker' dökümanı bulunamadı!");
                    alert("Uzman şu an meşgul, daha sonra tekrar deneyin!");
                }
            } catch (error) {
                console.error("Uzman jokeri alınırken hata:", error);
                alert("Uzman jokeri yüklenirken bir sorun oluştu.");
            } finally {
                showLoading(false);
            }
            askExpertUsed = true;
            if(btnAskExpert) btnAskExpert.disabled = true;
        }

        async function finishQuiz() { 
            showLoading(true);
            let score = 0;
            currentQuizQuestions.forEach((q, i) => {
                if (userAnswers[i] === q.dogruCevap) {
                    score++;
                }
            });

            const totalQuestions = currentQuizQuestions.length;
            const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
            let resultCategory = 'low'; 
            if (percentage >= 67) resultCategory = 'high'; 
            else if (percentage >= 34) resultCategory = 'medium';

            if(resultModalTitle && currentSelectedQuiz) resultModalTitle.textContent = `${currentSelectedQuiz.name} Sonucu`;
            if(resultModalScore) resultModalScore.textContent = `Skorunuz: ${score} / ${totalQuestions} (${percentage.toFixed(0)}%)`;
            if(resultModalComment) resultModalComment.textContent = "Yorum yükleniyor...";
            if(resultModalCommentImage) resultModalCommentImage.style.display = 'none';
            if(resultModalBadgeName) resultModalBadgeName.textContent = "Rozet bilgisi yükleniyor...";
            if(resultModalBadgeImage) resultModalBadgeImage.style.display = 'none';
            if(resultModalBadgeContainer) resultModalBadgeContainer.style.display = 'block';

            let awardedBadgeData = null; 
            let quizSpecificBadgeName = "Rozet"; 
            let quizSpecificBadgeImageUrl = null;

            try {
                if (currentSelectedMainCategory && currentSelectedSubCategory && currentSelectedQuiz && currentSelectedQuiz.id) { 
                    const notlarPath = `categories/${currentSelectedMainCategory.id}/subcategories/${currentSelectedSubCategory.id}/quizzes/${currentSelectedQuiz.id}/notlar/${resultCategory}`;
                    const notlarDoc = await firestore.doc(notlarPath).get();
                    if (notlarDoc.exists) { // Düzeltildi
                        const notlarData = notlarDoc.data();
                        if(resultModalComment) resultModalComment.textContent = notlarData.yorum || "Harika bir iş çıkardın!";
                        if (notlarData.imageURL && resultModalCommentImage) {
                            resultModalCommentImage.src = notlarData.imageURL;
                            resultModalCommentImage.style.display = 'block';
                        }
                    } else {
                        if(resultModalComment) resultModalComment.textContent = "Bu skor için özel bir yorum bulunamadı.";
                    }

                    const rozetPath = `categories/${currentSelectedMainCategory.id}/subcategories/${currentSelectedSubCategory.id}/quizzes/${currentSelectedQuiz.id}/rozet/rozet`;
                    const rozetDoc = await firestore.doc(rozetPath).get();
                    if (rozetDoc.exists) { // Düzeltildi
                        const rozetData = rozetDoc.data();
                        quizSpecificBadgeName = rozetData.rozetAdi || rozetData.name || "Quiz Rozeti";
                        quizSpecificBadgeImageUrl = rozetData.rozetPNG || rozetData.imageURL;
                        
                        if(resultModalBadgeName) resultModalBadgeName.textContent = quizSpecificBadgeName;
                        if (quizSpecificBadgeImageUrl && resultModalBadgeImage) {
                            resultModalBadgeImage.src = quizSpecificBadgeImageUrl;
                            resultModalBadgeImage.style.display = 'block';
                        }
                        
                        awardedBadgeData = {
                            rozetAdi: quizSpecificBadgeName, 
                            rozetImageURL: quizSpecificBadgeImageUrl,
                            kazanmaTarihi: firebase.firestore.FieldValue.serverTimestamp(),
                            quizAdi: currentSelectedQuiz.name, 
                            kazanilanSeviye: resultCategory 
                        };
                    } else {
                        if(resultModalBadgeName) resultModalBadgeName.textContent = "Bu quiz için özel bir rozet bulunamadı.";
                        if(resultModalBadgeContainer) resultModalBadgeContainer.style.display = 'none';
                    }

                    if (currentUser && currentSelectedQuiz.name) { 
                        const userId = currentUser.uid;
                        const userRef = firestore.collection('users').doc(userId);
                        const solvedQuizDocId = currentSelectedQuiz.name.replace(/\//g, '_'); 
                        const solvedQuizRef = userRef.collection('solvedQuizzes').doc(solvedQuizDocId); 
                        
                        const batch = firestore.batch();
                        batch.set(solvedQuizRef, {
                            puan: score,
                            tarih: firebase.firestore.FieldValue.serverTimestamp()
                        }, { merge: true });
                        batch.update(userRef, {
                            leaderboardPuan: firebase.firestore.FieldValue.increment(score * 10) 
                        });
                        if (awardedBadgeData) {
                            let rozetDocIdSuffix = resultCategory; 
                            if (resultCategory === 'high') { rozetDocIdSuffix = "takintili"; }
                            const baseRozetId = awardedBadgeData.rozetAdi.replace(/\//g, '_'); 
                            const userBadgeDocId = `${baseRozetId}_${rozetDocIdSuffix}`;
                            const userBadgeRef = userRef.collection('rozetler').doc(userBadgeDocId);
                            batch.set(userBadgeRef, awardedBadgeData, { merge: true }); 
                        }
                        await batch.commit();
                        console.log("Kullanıcı verileri başarıyla kaydedildi.");
                    } else {
                        console.log("Kullanıcı giriş yapmamış veya quiz adı eksik, sonuç kaydedilmedi.");
                    }
                } else {
                     console.error("Quiz veya kategori bilgisi eksik, sonuç işlenemedi.");
                     if(resultModalComment) resultModalComment.textContent = "Sonuç işlenirken bir hata oluştu (eksik bilgi).";
                }
            } catch (error) {
                console.error("Sonuç/rozet bilgisi çekilirken veya kullanıcı verisi kaydedilirken hata:", error);
                if(resultModalComment) resultModalComment.textContent = "Sonuç bilgileri yüklenirken bir hata oluştu.";
                if(resultModalBadgeName) resultModalBadgeName.textContent = "Rozet bilgisi yüklenirken bir hata oluştu.";
            } finally {
                showLoading(false);
                if(quizResultModal) quizResultModal.style.display = 'flex';
            }
        }

        if(btnCloseResultModal) {
            btnCloseResultModal.addEventListener('click', () => { 
                if(quizResultModal) quizResultModal.style.display = 'none';
                showPage(categoriesPage);
                if (currentSelectedSubCategory && currentSelectedMainCategory) {
                    loadQuizzesAndShowPage(currentSelectedMainCategory, currentSelectedSubCategory);
                } else if (currentSelectedMainCategory) {
                    loadSubCategoriesAndShowPage(currentSelectedMainCategory);
                } else {
                    loadMainCategoriesAndShowPage();
                }
            });
        }
        if(btnCloseExpertModal) {
            btnCloseExpertModal.addEventListener('click', () => {
                if(expertAdviceModal) expertAdviceModal.style.display = 'none';
            });
        }

        if (btnKategoriler) { 
            btnKategoriler.addEventListener('click', () => {
                showPage(categoriesPage);
                loadMainCategories(); 
            });
        }
        if (btnBackNavigation) { 
            btnBackNavigation.addEventListener('click', () => {
                if (currentCategoriesPageState === NAV_STATE.QUIZZES && currentSelectedMainCategory && currentSelectedSubCategory) {
                    loadSubCategoriesAndShowPage(currentSelectedMainCategory); 
                } else if (currentCategoriesPageState === NAV_STATE.SUB_CATEGORIES && currentSelectedMainCategory) {
                   loadMainCategoriesAndShowPage(); 
                } else {
                    showPage(mainPage);
                }
            });
        }
        if (btnKategorilereDonQuiz) { 
             btnKategorilereDonQuiz.addEventListener('click', () => {
                showPage(categoriesPage);
                if (currentSelectedSubCategory && currentSelectedMainCategory) {
                    loadQuizzesAndShowPage(currentSelectedMainCategory, currentSelectedSubCategory);
                } else if (currentSelectedMainCategory) { 
                    loadSubCategoriesAndShowPage(currentSelectedMainCategory);
                } else { 
                    loadMainCategoriesAndShowPage();
                }
            });
        }
        
        async function loadUserProfile() {
            if (!currentUser || !profileContentText || !authFormContainer || !profileContentContainer) {
                if(profileContentText) profileContentText.innerHTML = '<p>Profil bilgilerini görmek için giriş yapın.</p>';
                if(authFormContainer) authFormContainer.style.display = 'block';
                if(profileContentContainer) profileContentContainer.style.display = 'none';
                return;
            }
            if(authFormContainer) authFormContainer.style.display = 'none';
            if(profileContentContainer) profileContentContainer.style.display = 'block';
            profileContentText.innerHTML = '<p>Profil bilgileri yükleniyor...</p>';
            try {
                const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
                if (userDoc.exists) { // Düzeltildi
                    const userData = userDoc.data();
                    let html = `
                        <h2 class="text-xl font-semibold mb-2">${userData.displayName || currentUser.email.split('@')[0]}</h2>
                        <p class="mb-1">Email: ${currentUser.email}</p>
                        <p class="mb-4">Liderlik Puanı: ${userData.leaderboardPuan || 0}</p>
                        <h3 class="text-lg font-medium mt-3 mb-2">Çözülen Quizler:</h3>
                        <ul class="list-disc list-inside text-left text-sm">`;
                    
                    const solvedQuizzesSnapshot = await firestore.collection('users').doc(currentUser.uid).collection('solvedQuizzes').orderBy('tarih', 'desc').limit(10).get(); 
                    if (solvedQuizzesSnapshot.empty) {
                        html += '<li>Henüz quiz çözülmemiş.</li>';
                    } else {
                        solvedQuizzesSnapshot.forEach(doc => {
                            const quizData = doc.data();
                            html += `<li>${doc.id}: ${quizData.puan} puan (${new Date(quizData.tarih.toDate()).toLocaleDateString()})</li>`;
                        });
                    }
                    html += '</ul>';
                    profileContentText.innerHTML = html;
                } else {
                    profileContentText.innerHTML = `<p>Merhaba ${currentUser.displayName || currentUser.email.split('@')[0]}! Profil bilgileriniz henüz oluşturulmamış olabilir.</p>`;
                }
            } catch (error) {
                console.error("Profil yüklenirken hata:", error);
                profileContentText.innerHTML = '<p>Profil yüklenirken bir hata oluştu.</p>';
            }
        }
        
        if(btnProfil) {
            btnProfil.addEventListener('click', () => {
                showPage(profilePage);
                if (currentUser) {
                    if(authFormContainer) authFormContainer.style.display = 'none';
                    if(profileContentContainer) profileContentContainer.style.display = 'block';
                    loadUserProfile();
                } else {
                    if(authFormContainer) authFormContainer.style.display = 'block';
                    if(profileContentContainer) profileContentContainer.style.display = 'none';
                    if(emailInput) emailInput.value = ''; 
                    if(passwordInput) passwordInput.value = '';
                    if(emailError) emailError.style.display = 'none';
                    if(authError) authError.style.display = 'none';
                }
            });
        }

        if(btnRozetlerim) {
            btnRozetlerim.addEventListener('click', async () => { 
                if (!currentUser) {
                    alert("Rozetlerinizi görüntülemek için giriş yapmalısınız.");
                    return;
                }
                showPage(badgesPage);
                if(badgesContent) badgesContent.innerHTML = '<p class="col-span-3">Rozetler yükleniyor...</p>';
                try {
                    const badgesSnapshot = await firestore.collection('users').doc(currentUser.uid).collection('rozetler').orderBy('kazanmaTarihi', 'desc').get();
                    if (badgesSnapshot.empty) {
                        if(badgesContent) badgesContent.innerHTML = '<p class="col-span-3">Henüz kazanılmış rozet yok.</p>';
                    } else {
                        let html = '';
                        badgesSnapshot.forEach(doc => {
                            const badge = doc.data();
                            html += `
                                <div class="item-card bg-gray-700 p-3 h-auto">
                                    <img src="${badge.rozetImageURL || 'https://placehold.co/60x60/718096/FFFFFF?text=R&font=Inter'}" alt="${badge.rozetAdi}" class="w-16 h-16 mx-auto mb-2 rounded-full">
                                    <p class="font-semibold text-sm text-white">${badge.rozetAdi}</p>
                                    <p class="text-xs text-gray-300">${new Date(badge.kazanmaTarihi.toDate()).toLocaleDateString()}</p>
                                </div>`;
                        });
                        if(badgesContent) badgesContent.innerHTML = html;
                    }
                } catch (error) {
                    console.error("Rozetler yüklenirken hata:", error);
                    if(badgesContent) badgesContent.innerHTML = '<p class="col-span-3">Rozetler yüklenirken bir hata oluştu.</p>';
                }
            });
        }

        if(btnLiderTablosu) {
            btnLiderTablosu.addEventListener('click', async () => { 
                showPage(leaderboardPage);
                if(leaderboardContent) leaderboardContent.innerHTML = '<p>Lider tablosu yükleniyor...</p>';
                try {
                    const leaderboardSnapshot = await firestore.collection('users').orderBy('leaderboardPuan', 'desc').limit(20).get(); 
                    if (leaderboardSnapshot.empty) {
                        if(leaderboardContent) leaderboardContent.innerHTML = '<p>Lider tablosunda henüz kimse yok.</p>';
                    } else {
                        let html = '<ol class="list-decimal list-inside text-left space-y-1">'; 
                        leaderboardSnapshot.forEach(doc => {
                            const user = doc.data();
                            html += `<li>${user.displayName || 'İsimsiz Kullanıcı'}: ${user.leaderboardPuan || 0} puan</li>`; 
                        });
                        html += '</ol>';
                        if(leaderboardContent) leaderboardContent.innerHTML = html;
                    }
                } catch (error) {
                    console.error("Lider tablosu yüklenirken hata:", error);
                    if(leaderboardContent) leaderboardContent.innerHTML = '<p>Lider tablosu yüklenirken bir hata oluştu.</p>';
                }
            });
        }
        
        if (btnAyarlar) {
            btnAyarlar.addEventListener('click', () => { 
                if (currentUser && userEmailForSettings && btnLogout) {
                    userEmailForSettings.textContent = `Kullanıcı: ${currentUser.email}`;
                    btnLogout.style.display = 'block';
                } else if(userEmailForSettings && btnLogout) {
                    userEmailForSettings.textContent = `Giriş yapılmamış.`;
                    btnLogout.style.display = 'none';
                }
                if(settingsModal) settingsModal.style.display = 'flex';
            });
        }
        if (btnCloseSettings) {
            btnCloseSettings.addEventListener('click', () => {
                if(settingsModal) settingsModal.style.display = 'none';
            });
        }

        if(btnFiftyFifty) {
            btnFiftyFifty.addEventListener('click', handleFiftyFiftyJoker);
        }
        if(btnAskExpert) {
            btnAskExpert.addEventListener('click', handleAskExpertJoker);
        }
        if(btnCloseExpertModal) {
            btnCloseExpertModal.addEventListener('click', () => {
                if(expertAdviceModal) expertAdviceModal.style.display = 'none';
            });
        }

        if (mainPage) { 
            showPage(mainPage);
        } else {
            console.error("mainPage elementi bulunamadı!");
        }