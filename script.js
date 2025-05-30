/* style.css */

body {
    font-family: 'Baloo 2', 'Inter', sans-serif; 
    background-image: url('images/quiz_background.jpg'); /* images klasöründe olduğundan emin olun */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    color: #fff;
    overflow-x: hidden; 
}

#mainLogoTitle {
    font-family: 'Baloo 2', cursive; 
    font-weight: 800; 
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3); 
    letter-spacing: 1px;
    /* Font size Tailwind ile yönetiliyor (text-5xl sm:text-6xl) */
}

.btn-primary, .joker-btn, .btn-secondary {
    font-family: 'Baloo 2', sans-serif;
    color: white;
    padding: 12px 20px; 
    border-radius: 10px; 
    font-weight: 600; 
    text-align: center;
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2); 
    text-transform: uppercase; 
    letter-spacing: 0.8px; 
    display: flex; 
    align-items: center;
    justify-content: center;
    border: none; 
    cursor: pointer;
}

.btn-primary, .joker-btn { /* .joker-btn için ortak stiller */
    background-color: #5046E5; 
}
.btn-primary:hover:not(:disabled), .joker-btn:hover:not(:disabled) { 
    background-color: #4338CA; 
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.25);
}
.btn-primary:disabled { 
    background-color: #7c73e0;
    opacity: 0.7;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.joker-btn {
    background-color: #ff9800; 
    padding: 10px 15px; 
    font-size: 0.9em;
}
.joker-btn:hover:not(:disabled) {
    background-color: #e68900;
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.25);
}
.joker-btn:disabled {
    background-color: #ffc966; 
    cursor: not-allowed;
    opacity: 0.6;
    transform: translateY(0);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}
.joker-btn i {
    margin-right: 0.5rem;
}

.btn-secondary {
    background-color: #10B981; 
}
.btn-secondary:hover:not(:disabled) { 
    background-color: #059669; 
    transform: translateY(-1px);
}
.btn-secondary:disabled {
    background-color: #52d8b4;
    opacity: 0.7;
    cursor: not-allowed;
}

/* Ana Sayfa Butonları - Genişlik Ayarı HTML'de Tailwind ile yapıldı (max-w-xs mx-auto) */
#mainPage .space-y-3 { /* Tailwind space-y-3 veya space-y-4 kullanılabilir */
    display: flex;
    flex-direction: column;
    gap: 0.75rem; /* sm:gap-1rem Tailwind'e göre ayarlanabilir */
    align-items: center; 
}

.card {
    background-color: rgba(0, 0, 0, 0.35); /* Biraz daha belirgin */
    border-radius: 16px; 
    padding: 20px; 
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(10px); 
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1); 
}
@media (min-width: 640px) { 
    .card {
        padding: 25px;
    }
}

.input-field {
    background-color: rgba(255,255,255,0.08); 
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 12px 15px; 
    border-radius: 8px;
    width: 100%;
    margin-bottom: 1rem;
    font-family: 'Baloo 2', sans-serif; 
}
.input-field::placeholder {
    color: rgba(255,255,255,0.5);
}
.error-message {
    color: #fecaca; 
    background-color: rgba(153, 27, 27, 0.3); 
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.9em;
    margin-top: -0.5rem;
    margin-bottom: 0.5rem;
    display: none;
}
.item-card {
    background-color: #ffffff;
    color: #333;
    border-radius: 12px; 
    padding: 20px;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 160px; 
}
.item-card:hover {
    transform: translateY(-6px) scale(1.03); 
    box-shadow: 0 8px 20px rgba(0,0,0,0.18);
}
.item-card img {
    width: 64px; height: 64px; object-fit: contain; margin-bottom: 1rem; 
}
.item-card .placeholder-icon {
    font-size: 3rem; margin-bottom: 1rem; color: #5046E5; /* Ana buton rengiyle uyumlu */
}
.page { display: none; }
.page.active { display: block; }
#loadingIndicator {
    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center;
}
.spinner {
    border: 8px solid #555; 
    border-top: 8px solid #5046E5; 
    border-radius: 50%;
    width: 60px; height: 60px; animation: spin 1s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.quiz-option-btn {
    background-color: #4A90E2; color: white; padding: 12px 18px; border-radius: 8px; 
    font-weight: 500; transition: background-color 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
    border: 2px solid transparent; cursor: pointer;
    font-family: 'Baloo 2', sans-serif; 
    width: 100%; 
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
.quiz-option-btn.disabled, .quiz-option-btn.faded { opacity: 0.4; cursor: not-allowed; } 

.modal-content, .expert-modal-content {
    background-color: #334155; 
    color: #e2e8f0; 
    padding: 28px; 
    border-radius: 16px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.4); 
    max-width: 500px; width: 90%; text-align: center;
    position: relative; 
    border: 1px solid rgba(255,255,255,0.1);
}
.modal-content img.result-badge-img { max-width: 100px; max-height: 100px; margin: 0 auto 1.25rem; }
.modal-content img.result-comment-img { max-width: 200px; max-height: 150px; object-fit: contain; margin: 1.25rem auto; border-radius: 10px; }
.expert-modal-content .expert-image { width: 120px; height: 120px; object-fit: cover; border-radius: 50%; margin: 1.25rem auto; border: 3px solid #5046E5;}

#authStatus {
    position: fixed; top: 10px; right: 10px; background-color: rgba(0,0,0,0.7);
    padding: 8px 12px; border-radius: 8px; font-size: 0.9em; z-index: 100;
}
#authButtonGoogle { 
     display: none; 
     margin-left: 10px; background-color: #dd4b39; 
     color: white; padding: 5px 10px; border-radius: 6px;
}
.close-modal-btn {
    position: absolute;
    top: 12px;
    right: 18px;
    font-size: 1.8rem; 
    line-height: 1; 
    color: #94a3b8; 
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem; 
}
.close-modal-btn:hover { color: #e2e8f0; }

#btnGoToMainFixed {
    background-color: #FF8C00; 
}
#btnGoToMainFixed:hover {
    background-color: #cc7000;
}

.ad-banner-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0,0,0,0.1); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; 
    border-top: 1px solid rgba(255,255,255,0.2);
    min-height: 50px; 
}

.ad-sidebar {
    position: fixed;
    top: 80px; 
    width: 160px; 
    background-color: rgba(0,0,0,0.05); 
    display: none; 
    z-index: 90; 
    padding: 10px;
    border-radius: 8px;
    min-height: 600px; 
}
.ad-sidebar-left {
    left: 20px;
}
.ad-sidebar-right {
    right: 20px;
}

@media (min-width: 1280px) { 
    .ad-sidebar {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    body.has-side-ads > #mainPage,
    body.has-side-ads > #quizPage { 
        padding-left: 200px; 
        padding-right: 200px;
        max-width: none; 
    }
    body.has-side-ads > #categoriesPage,
    body.has-side-ads > #profilePage,
    body.has-side-ads > #badgesPage,
    body.has-side-ads > #leaderboardPage {
        max-width: 56rem; 
        margin-left: auto;
        margin-right: auto;
    }
}
@media (max-width: 1279px) {
    .ad-sidebar {
        display: none !important;
    }
}
