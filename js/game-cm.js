"use strict";

// const CARD_IMG = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
const BOARD_SIZE = 12;

// 카드 매칭을 위해 내가 개발한 부분
// 예시: 카드 이미지와 매칭 조건을 포함하는 객체 배열
const CARD_IMG = [
    { name: '1', matchCondition: 'a' },
    { name: '2', matchCondition: 'a' },
    { name: '3', matchCondition: 'b' },
    { name: '4', matchCondition: 'b' },
    { name: '5', matchCondition: 'c' },
    { name: '6', matchCondition: 'c' },
    { name: '7', matchCondition: 'd' },
    { name: '8', matchCondition: 'd' },
    { name: '9', matchCondition: 'e' },
    { name: '10', matchCondition: 'e' },
    { name: '11', matchCondition: 'f' },
    { name: '12', matchCondition: 'f' },
    { name: '13', matchCondition: 'g' },
    { name: '14', matchCondition: 'g' },
    { name: '15', matchCondition: 'h' },
    { name: '16', matchCondition: 'h' },
    { name: '17', matchCondition: 'i' },
    { name: '18', matchCondition: 'i' },
    { name: '19', matchCondition: 'j' },
    { name: '20', matchCondition: 'j' }
];

let stage = 3495; // 게임 스테이지
let time = 60; // 남은 시간
let timer = 0;
let score = 0;
let isFlip = false; // 카드 뒤집기 가능 여부

let cardDeck = [];

// 게임 시작
function startGame() {
    // 모달창을 통한 이미지 표시
    showInitialModal();

    // // 카드 덱 생성
    // makeCardDeck();

    // // 카드 화면에 세팅
    // settingCardDeck();

    // // 최초 1회 전체 카드 보여줌
    // showCardDeck();
}

// 초기 모달창 표시 함수
function showInitialModal() {
    const modalImage = document.createElement("img");
    modalImage.src = "img/game-cm/manual.png"; // 여기에 특정 이미지 경로를 지정하세요.
    // modalImage.style.width = "100%";
    modalImage.style.width = "100vw";
    modalImage.style.height = "132vw";    

    modalTitle.innerHTML = ''; // 기존 모달 내용을 비웁니다.
    modalTitle.appendChild(modalImage); // 이미지를 모달 타이틀에 추가합니다.
    modal.classList.add("show");

    // 이미지 클릭 시 카드 덱 재생성
    modalImage.addEventListener("click", function() {
        modal.classList.remove("show");
        // 카드 덱 생성
        makeCardDeck();

        // 카드 화면에 세팅
        settingCardDeck();

        // 최초 1회 전체 카드 보여줌
        showCardDeck();
    });
}

// 게임 재시작
function restartGame() {
    initGame();
    initScreen();
    startGame();
}

// 게임 종료
function stopGame(score) {
    showGameResult(score);
}

// 게임 설정 초기화
function initGame() {
    stage = 1;
    time = 60;
    isFlip = false;
    cardDeck = [];
}

// 게임 화면 초기화
function initScreen() {
    gameBoard.innerHTML = '';
    playerTime.innerHTML = time;
    playerStage.innerHTML = stage;
    playerTime.classList.remove("blink");
    void playerTime.offsetWidth;
    playerTime.classList.add("blink");
}

// 스테이지 클리어
const board = document.getElementsByClassName("board")[0];
const stageClearImg = document.getElementsByClassName("stage-clear")[0];

function clearStage() {
    clearInterval(timer);

    cardDeck = [];

    stageClearImg.classList.add("show");

}

// 게임 타이머 시작
function startTimer() {
    timer = setInterval(() => {
        playerTime.innerHTML = --time;
        score += 1;

        if (time === 0) {
            clearInterval(timer);
            stopGame(score);
        }
    }, 1000);
}


function makeCardDeck() {
    // 이미지 중에서 BOARD_SIZE만큼 랜덤으로 뽑도록 변경
    let randomNumberArr = [];
    
    while (randomNumberArr.length < BOARD_SIZE) {
        // 랜덤 값 뽑기
        
        // 원본 let randomNumber = getRandom(CARD_IMG.length, 0);
        let randomNumber_tmp = getRandom(CARD_IMG.length/2, 1);
        let randomNumber = randomNumber_tmp*2 - 1



        // 중복 검사
        if (randomNumberArr.indexOf(randomNumber-1) === -1) {
            randomNumberArr.push(randomNumber-1);
        }
        if (randomNumberArr.indexOf(randomNumber) === -1) {
            randomNumberArr.push(randomNumber);
        }
    }

    shuffle(randomNumberArr);


    // 섞은 값으로 카드 세팅
    // 여기가 문제
    // showGameResult(i);   
    // for (let i = 0; i < BOARD_SIZE; i++) {
    //     cardDeck.push({card: CARD_IMG[randomNumberArr[i]].name, isOpen: false, isMatch: false});
    // }
    let i = 0;
    while(i<BOARD_SIZE){
        cardDeck.push({card: CARD_IMG[randomNumberArr[i]].name, isOpen: false, isMatch: false});
        i+=1;
    }
    return cardDeck;
}


// 카드 섞기
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// 난수 생성
function getRandom(max, min) {
    return parseInt(Math.random() * (max - min)) + min;
}

// 카드 화면에 세팅
const gameBoard = document.getElementsByClassName("game__board")[0];
const cardBack = document.getElementsByClassName("card__back");
const cardFront = document.getElementsByClassName("card__front");

function settingCardDeck() {

    for (let i = 0; i < BOARD_SIZE; i++) {
        gameBoard.innerHTML = gameBoard.innerHTML +
        `
            <div class="card" data-id="${i}" data-card="${cardDeck[i].card}">
                <div class="card__back"></div>
                <div class="card__front"></div>
            </div>
        `;

        cardFront[i].style.backgroundImage = `url('img/game-cm/card-pack/${cardDeck[i].card}.png')`;
    }

}

// 전체 카드 보여주는 함수
function showCardDeck() {
    let cnt = 0;
    
    let showCardPromise = new Promise((resolve, reject) => {
        let showCardTimer = setInterval(() => {
            cardBack[cnt].style.transform = "rotateY(180deg)";
            cardFront[cnt++].style.transform = "rotateY(0deg)";

            if (cnt === cardDeck.length) {
                clearInterval(showCardTimer);

                resolve();
            }
        }, 200);
    });

    showCardPromise.then(() => {
        // showCardPromise 성공인 경우 실행할 코드
        setTimeout(hideCardDeck, 4000);
    })
}

// 전체 카드 숨기는 함수
function hideCardDeck() {
    for (let i = 0; i < cardDeck.length; i++) {
        cardBack[i].style.transform = "rotateY(0deg)";
        cardFront[i].style.transform = "rotateY(-180deg)";
    }

    // 전체 카드 숨기고 0.1초 뒤 isFlip = true, 게임 타이머 시작
    // 바로 클릭이 가능하도록 할 때(isFlip = true 값을 바로 줬을 때) 에러가 나는 경우가 있어 0.1초 후 부터 카드 뒤집기가 가능하도록 설정
    setTimeout(() => {
        isFlip = true;

        // 게임 타이머 시작
        startTimer();
    }, 100);
}

// 카드 클릭 이벤트
gameBoard.addEventListener("click", function(e) {
    if (isFlip === false) {
        return;
    }

    if (e.target.parentNode.className === "card") {
        let clickCardId = e.target.parentNode.dataset.id;

        if (cardDeck[clickCardId].isOpen === false) {
            openCard(clickCardId);
        }
    }
});

// 카드 오픈
function openCard(id) {
    // 화면에서 앞면으로 보이도록 스타일 조정
    cardBack[id].style.transform = "rotateY(180deg)";
    cardFront[id].style.transform = "rotateY(0deg)";

    // 선택한 카드의 open 여부를 true로 변경
    cardDeck[id].isOpen = true;

    // 선택한 카드가 첫 번째로 선택한 카드인지, 두 번째로 선택한 카드인지 판별하기 위해 오픈한 카드의 index를 저장하는 배열 요청
    let openCardIndexArr = getOpenCardArr(id);

    // 두 번째 선택인 경우 카드 일치 여부 확인
    // 일치 여부 확인 전까지 카드 뒤집기 불가(isFlip = false)
    if (openCardIndexArr.length === 2) {
        isFlip = false;
        
        checkCardMatch(openCardIndexArr);
    }
}

// 오픈한 카드의 index를 저장하는 배열 반환
function getOpenCardArr(id) {
    let openCardIndexArr = [];

    // 반복문을 돌면서 isOpen: true이고 isMatch: false인 카드의 인덱스를 배열에 저장
    cardDeck.forEach((element, i) => {
        if (element.isOpen === false || element.isMatch === true) {
            return;
        }
        openCardIndexArr.push(i);
    });

    return openCardIndexArr;
}

// 카드 일치 여부 확인
function checkCardMatch(indexArr) {
    let firstCard = cardDeck[indexArr[0]];
    let secondCard = cardDeck[indexArr[1]];
    if (firstCard.card === secondCard.card || CARD_IMG[firstCard.card-1].matchCondition === CARD_IMG[secondCard.card-1].matchCondition) {
        // 카드 일치 처리
        firstCard.isMatch = true;
        secondCard.isMatch = true;

        matchCard(indexArr);
    } else {
        // 카드 불일치 처리
        firstCard.isOpen = false;
        secondCard.isOpen = false;

        closeCard(indexArr);
    }
}

// 카드 일치 처리
function matchCard(indexArr) {
    // 카드를 전부 찾았으면 스테이지 클리어
    if (checkClear() === true) {
        clearStage();
        stopGame(score);

        return;
    }

    // 바로 클릭 시 에러가 나는 경우가 있어 0.1초 후 부터 카드 뒤집기가 가능하도록 설정
    setTimeout(() => {
        isFlip = true;
    }, 100);
}

// 카드를 전부 찾았는지 확인하는 함수
function checkClear() {
    // 카드를 전부 찾았는지 확인
    let isClear = true;

    cardDeck.forEach((element) => {
        // 반복문을 돌면서 isMatch: false인 요소가 있다면 isClear에 false 값을 저장 후 반복문 탈출
        if (element.isMatch === false) {
            isClear = false;
            return;
        }
    });

    return isClear;
}

// 카드 불일치 처리
function closeCard(indexArr) {
    // 0.8초 동안 카드 보여준 후 닫고, 카드 뒤집기가 가능하도록 설정
    setTimeout(() => {
        for (let i = 0; i < indexArr.length; i++) {
            cardBack[indexArr[i]].style.transform = "rotateY(0deg)";
            cardFront[indexArr[i]].style.transform = "rotateY(-180deg)";
        }

        isFlip = true;
    }, 800);
}

// 게임 종료 시 출력 문구
const modal = document.getElementsByClassName("modal")[0];

function showGameResult(score) {
    let resultText = "세계 최고의 금융보안 전문기관";


    modalTitle.innerHTML = `
    <h1 class="modal__content-title--result color-red">
        게임 종료!
    </h1>
    <span class="modal__content-title--stage">
        <strong>금융보안원</strong>
    </span>
    <p class="modal__content-title--desc">
        ${resultText}
    </p>
    <br>
    <span>
        <strong>기록 : ${score}</strong>
    </span>
    `;
    modal.classList.add("show");
}




// 모달창 닫으면 게임 재시작
const modalTitle = document.getElementsByClassName("modal__content-title")[0];
const modalCloseButton = document.getElementsByClassName("modal__content-close-button")[0];

modal.addEventListener('click', function(e) {
    if (e.target === modal || e.target === modalCloseButton) {
        modal.classList.remove("show");
        // restartGame();
    }
});

// 기본 값 세팅 및 다른 색깔 찾기 게임 자동 시작
const playerTime = document.getElementById("player-time");
const playerStage = document.getElementById("player-stage");

window.onload = function() {
    playerTime.innerHTML = time;
    playerStage.innerHTML = stage;

    startGame();
}
