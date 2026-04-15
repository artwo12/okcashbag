const benefits = [
    { id: 1, brand: 'GS25', title: '편의점 상시 적립', desc: '결제액의 최대 5% 적립 및 통신사 중복 할인', icon: '🏪' },
    { id: 2, brand: 'CU', title: '포켓CU 멤버십', desc: '매일 즐기는 간식, 결제 시 포인트 자동 적립', icon: '🛒' },
    { id: 3, brand: '스타벅스', title: '사이렌 오더 혜택', desc: 'OK캐쉬백 포인트로 별 적립 및 음료 구매', icon: '☕' },
    { id: 4, brand: '투썸플레이스', title: '케이크 & 커피 할인', desc: '시즌 케이크 예약 시 포인트 두배 적립', icon: '🍰' },
    { id: 5, brand: '롯데리아', title: '버거 세트 할인', desc: '인기 세트 메뉴 상시 15% 할인 혜택', icon: '🍔' },
    { id: 6, brand: 'CGV', title: '영화 & 팝콘 할인', desc: '영화 예매 시 포인트 사용만큼 추가 적립', icon: '🎬' },
    { id: 7, brand: 'SK에너지', title: '주유 리터당 적립', desc: '주유할 때마다 쌓이는 실속 있는 포인트', icon: '⛽' },
    { id: 8, brand: '11번가', title: '쇼킹딜 추가 할인', desc: '매월 지급되는 11번가 전용 할인 쿠폰', icon: '🛍️' },
    { id: 9, brand: 'SK텔레콤', title: 'T멤버십 연동', desc: 'T멤버십과 결합하여 혜택을 두 배로', icon: '📱' },
    { id: 10, brand: '하나카드', title: '결제 더블 적립', desc: '하나카드 결제 시 포인트 적립률 상향', icon: '💳' },
    { id: 11, brand: '야놀자', title: '숙박 & 레저 포인트', desc: '여행 갈 때 현금처럼 사용하는 포인트', icon: '🏨' },
    { id: 12, brand: '올리브영', title: '뷰티 & 헬스 적립', desc: '오늘의 특가 쇼핑하고 포인트 챙기기', icon: '💄' },
    { id: 13, brand: '배달의민족', title: '배달 포인트 사용', desc: '출출할 때 포인트로 결제하고 할인받기', icon: '🛵' },
    { id: 14, brand: '홈플러스', title: '마트 장보기 적립', desc: '온라인/오프라인 쇼핑 포인트 통합 관리', icon: '🏢' },
    { id: 15, brand: '교보문고', title: '도서 구매 적립', desc: '마음의 양식을 쌓고 포인트도 쌓고', icon: '📚' },
    { id: 16, brand: 'T맵', title: '주차 & 대리 할인', desc: '운전자를 위한 올인원 포인트 혜택', icon: '🚗' }
];

let currentTournament = [];
let winnersOfRound = [];
let currentMatchIndex = 0;
let roundName = "16강";

const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen')
};

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
}

function initGame() {
    // Shuffle benefits for random seeds
    currentTournament = [...benefits].sort(() => Math.random() - 0.5);
    winnersOfRound = [];
    currentMatchIndex = 0;
    roundName = "16강";
    updateProgressBar();
    loadMatch();
    showScreen('game');
}

function loadMatch() {
    const leftIndex = currentMatchIndex * 2;
    const rightIndex = currentMatchIndex * 2 + 1;

    const leftBenefit = currentTournament[leftIndex];
    const rightBenefit = currentTournament[rightIndex];

    const roundText = `${roundName} ${currentMatchIndex + 1} / ${currentTournament.length / 2}`;
    document.getElementById('current-round-text').textContent = roundName;
    document.getElementById('current-match-text').textContent = `${currentMatchIndex + 1} / ${currentTournament.length / 2}`;

    renderCard('card-left', leftBenefit);
    renderCard('card-right', rightBenefit);

    updateProgressBar();
}

function renderCard(elementId, benefit) {
    const card = document.getElementById(elementId);
    card.innerHTML = `
        <div class="card-image"><span style="font-size: 3rem">${benefit.icon}</span></div>
        <div class="brand-name">${benefit.brand}</div>
        <div class="benefit-title">${benefit.title}</div>
        <div class="benefit-desc">${benefit.desc}</div>
    `;
    card.onclick = () => selectWinner(benefit);
}

function selectWinner(winner) {
    const cards = document.querySelectorAll('.benefit-card');
    cards.forEach(c => c.style.pointerEvents = 'none');
    
    // Add selected class to the clicked card
    const selectedCard = [...cards].find(c => c.innerHTML.includes(winner.brand));
    selectedCard.classList.add('selected');

    setTimeout(() => {
        winnersOfRound.push(winner);
        currentMatchIndex++;

        if (currentMatchIndex >= currentTournament.length / 2) {
            nextRound();
        } else {
            loadMatch();
        }
        
        // Reset styles for next match
        cards.forEach(c => {
            c.style.pointerEvents = 'all';
            c.classList.remove('selected');
        });
    }, 400);
}

function nextRound() {
    currentTournament = [...winnersOfRound];
    winnersOfRound = [];
    currentMatchIndex = 0;

    if (currentTournament.length === 8) roundName = "8강";
    else if (currentTournament.length === 4) roundName = "4강";
    else if (currentTournament.length === 2) roundName = "결승";
    else if (currentTournament.length === 1) {
        showResult(currentTournament[0]);
        return;
    }

    loadMatch();
}

function updateProgressBar() {
    // Total matches in 16-tournament is 8+4+2+1 = 15
    // This is a simple approximation for the progress bar
    let totalRounds = 15;
    let completedMatches = 0;
    
    // Calculate completed based on current round
    if (roundName === "16강") completedMatches = currentMatchIndex;
    else if (roundName === "8강") completedMatches = 8 + currentMatchIndex;
    else if (roundName === "4강") completedMatches = 8 + 4 + currentMatchIndex;
    else if (roundName === "결승") completedMatches = 8 + 4 + 2 + currentMatchIndex;

    const progress = (completedMatches / totalRounds) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function showResult(winner) {
    const winnerCard = document.getElementById('winner-card');
    winnerCard.innerHTML = `
        <div class="card-image" style="margin: 0 auto 1.5rem; background: #fff;"><span style="font-size: 3.5rem">${winner.icon}</span></div>
        <div class="brand-name">${winner.brand}</div>
        <div class="benefit-title" style="font-size: 2rem;">${winner.title}</div>
        <div class="benefit-desc">${winner.desc}</div>
    `;

    renderStats();
    showScreen('result');
    createConfetti();
}

function renderStats() {
    const statsList = document.getElementById('user-stats');
    // Mocked statistics
    const sortedStats = [...benefits]
        .map(b => ({ ...b, count: Math.floor(Math.random() * 1000) + 100 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const maxCount = sortedStats[0].count;

    statsList.innerHTML = sortedStats.map((item, index) => `
        <div class="stats-item">
            <div class="stats-rank">${index + 1}</div>
            <div class="stats-img"><span>${item.icon}</span></div>
            <div class="stats-info">
                <div class="stats-name">${item.brand}</div>
                <div class="stats-bar-bg">
                    <div class="stats-bar-fill" style="width: ${(item.count / maxCount) * 100}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function createConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    const colors = ['#FF3B30', '#FF8C32', '#FFFFFF', '#FFD700'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(confetti);

        const animation = confetti.animate([
            { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate3d(${(Math.random() - 0.5) * 200}px, ${window.innerHeight}px, 0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

// Event Listeners
document.getElementById('start-btn').addEventListener('click', initGame);
document.getElementById('retry-btn').addEventListener('click', () => showScreen('start'));
document.getElementById('share-btn').addEventListener('click', () => {
    alert('결과 URL이 복사되었습니다! 친구들에게 나의 최애 혜택을 자랑해보세요.');
});

// Create some background floating cards visually
function createFloatingCards() {
    // Already in HTML but maybe we want to randomize them
}
