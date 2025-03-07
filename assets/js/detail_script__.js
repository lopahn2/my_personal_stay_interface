document.addEventListener("DOMContentLoaded", async () => {
    const logo =  document.querySelector(".logo");
    logo.addEventListener("click", function (event) {
        window.location.href = "index.html";
    });


    const mbtiScoreBarFill = document.getElementById('mbtiScoreBarFill');
    const mbtiScoreBarFill2 = document.getElementById('mbtiScoreBarFill2');
    const mbtiScoreText = document.getElementById('mbtiScoreText');
    
    // 25% 너비로 애니메이션 적용
    setTimeout(() => {
        mbtiScoreBarFill.style.width = '25%';
        mbtiScoreBarFill2.style.width = '60%';
    }, 500);

    const guesthouseId = getGuesthouseIdFromQuery(); // ✅ URL에서 id 가져오기
    const token = localStorage.getItem("token");
    const memberId = parseJwt(token).memberId;


    if (!guesthouseId) {
        // alert("잘못된 접근입니다.");
        // window.location.href = "/index.html"; // ✅ 잘못된 접근 시 홈으로 이동
        Swal.fire({
            title: '잘못된 접근',
            text: '다시 시도해주세요.',
            icon: 'warning',
        }).then(function(){
            location.href="index.html";                   
        });
        return;
    }

    try {
        fetchMemberInfo(guesthouseId);
        const guesthouseData = await fetchGuesthouseDetail(guesthouseId); // ✅ API 요청
        updateGuesthouseUI(guesthouseData); // ✅ UI 업데이트
        const profileList = await fetchProfiles(guesthouseId); // ✅ 함께 지낼 사람 목록 불러오기
        createProfileCards(profileList, guesthouseData.capacity); // ✅ 프로필 UI 및 신청자 수 업데이트
        // ✅ 사용자가 '좋아요'를 눌렀는지 확인 후 UI 반영
        await checkIfLiked(guesthouseId, memberId);
        // ✅ 사용자가 게스트하우스를 신청했는지 확인 후 UI 반영
        await checkIfBooked(guesthouseId, memberId);
    } catch (error) {
        console.error("데이터 로드 오류:", error);
        // alert("게스트하우스 정보를 불러오는 중 문제가 발생했습니다.");
        Swal.fire({
            // title: '오류 발생',
            title: '조회 실패',
            text: '게스트하우스 정보를 불러오지 못했습니다.',
            icon: 'warning',
        });
    }
});

/**
 * ✅ 현재 URL에서 게스트하우스 ID 추출 (?id=7 형태)
 */
const getGuesthouseIdFromQuery = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("id"));
};

/**
 * ✅ API 요청: 특정 게스트하우스 정보 불러오기
 */
const fetchGuesthouseDetail = async (guesthouseId) => {
    const token = localStorage.getItem("token");
    const url = `http://localhost:9000/guesthouse/${guesthouseId}`; // ✅ API 주소 설정

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*', // 모든 도메인에 대해 CORS 허용
            mode: 'cors', // CORS 요청 모드 설정
        }
    });


    if (!response.ok) throw new Error("게스트하우스 정보를 가져오는 데 실패했습니다.");
    const data = await response.json();

    // ✅ 태그를 배열로 변환
    const tagsArray = data.tags ? data.tags.split(",").map(tag => tag.trim()) : [];
    // ✅ 현재 사용자 MBTI 기반 점수 찾기
    const userMbti = parseJwt(token).mbti || "ENTP";
    const matchingScore = (data.scores.find(score => score.mbti === userMbti)?.totalScore || 0).toFixed(2);
    console.log(matchingScore);

    return {
        guestHouseId: data.guestHouseId,
        name: data.name,
        location: data.location,
        capacity: data.capacity,
        description: data.description,
        tags: tagsArray,
        imageUrl: data.bgImgUrl,
        regDate: data.regDate,
        mbtiScore: matchingScore
    };
};

/**
 * ✅ API 요청: 같이 지낼 사람들 목록 불러오기
 */
const fetchProfiles = async (guesthouseId) => {
    const token = localStorage.getItem("token");
    const url = `http://localhost:9000/guesthouse/info/${guesthouseId}`; // ✅ API 주소 설정

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) throw new Error("프로필 정보를 가져오는 데 실패했습니다.");
    return response.json();
};

/**
 * ✅ UI 업데이트: 게스트하우스 정보
 */
const updateGuesthouseUI = (guesthouseData) => {
    document.querySelector("h3").textContent = guesthouseData.name;
    document.querySelector(".text-muted").textContent = guesthouseData.description;

    // ✅ 태그 리스트 업데이트
    const tagContainer = document.querySelector(".tag-list");
    tagContainer.innerHTML = guesthouseData.tags.length > 0
        ? guesthouseData.tags.map(tag => `<span class="tag">${tag}</span>`).join("")
        : "<span class='tag'>태그 없음</span>";

    // ✅ MBTI 점수 업데이트
    updateMbtiScore(guesthouseData.mbtiScore);
    const token = localStorage.getItem("token");
    const userMbti = parseJwt(token).mbti || "ENTP";
    document.querySelector(".mbti-compatibility-hint").textContent =
        `👀 ${userMbti}와 이 숙소와의 매칭 점수는 ${guesthouseData.mbtiScore}점!`;
};

/**
 * ✅ UI 업데이트: MBTI 매칭 점수
 */
const updateMbtiScore = (score) => {
    const mbtiScoreBarFill = document.getElementById('mbtiScoreBarFill');
    const mbtiScoreText = document.getElementById('mbtiScoreText');

    mbtiScoreText.textContent = `${score}점`;
    
    setTimeout(() => {
        mbtiScoreBarFill.style.width = `${score}%`;
    }, 500);
};

/**
 * ✅ UI 업데이트: 같이 지낼 사람들 프로필 카드 생성 및 신청자 수 업데이트
 */
const createProfileCards = (profileList, capacity) => {
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.innerHTML = '';

    // 신청자 수 업데이트: (신청 인원 / 전체 인원)
    document.getElementById('applicantCountText').textContent = `${profileList.length}/${capacity}`;

    // 신청자 수에 따른 score bar 업데이트
    const scoreBarFill = document.getElementById('mbtiScoreBarFill2');
    const ratio = (profileList.length / capacity) * 100;
    setTimeout(() => {
        scoreBarFill.style.width = `${ratio}%`;
    }, 500);

    profileList.forEach(profile => {
        const card = document.createElement('div');
        card.classList.add('profile-card');

        card.innerHTML = `
            <img src="${profile.imgUrl}" alt="${profile.name}" class="profile-image">
            <div class="profile-name">${profile.name}</div>
            <div class="profile-info">${profile.age}세 · ${profile.sex === 'M' ? '남성' : '여성'} · ${profile.mbti}</div>
            <div class="profile-intro">"${profile.introduce}"</div>
            <div class="profile-tags">
                <span class="profile-tag">🍽 ${profile.favorite}</span>
                <span class="profile-tag">🍷 ${profile.alcoholLimit}</span>
            </div>
        `;

        profileContainer.appendChild(card);
    });
};


/**
 * ✅ 신청하기 API 요청
 */
const applyToGuesthouse = async () => {
    const guesthouseId = getGuesthouseIdFromQuery();
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const memberId = decoded.memberId;
    const mbti = decoded.mbti;

    // ✅ 현재 신청자 목록과 게스트하우스 정보를 가져와 capacity 확인
    const profileList = await fetchProfiles(guesthouseId);
    const guesthouseData = await fetchGuesthouseDetail(guesthouseId);
    
    // 신청자 수가 게스트하우스 capacity 이상이면 신청 불가 처리
    if (profileList.length >= guesthouseData.capacity) {
         Swal.fire({
             title: '신청 불가',
             text: '게스트하우스의 정원이 모두 찼습니다.',
             icon: 'warning'
         });
         return;
    }


    // ✅ 이미 신청한 경우 확인
    const bookedGuesthouses = await fetchUserBooks(memberId);
    const alreadyBooked = bookedGuesthouses.some(guesthouse => guesthouse.guestHouseId === guesthouseId);
    
    if (alreadyBooked) {
        // alert("이미 신청한 게스트하우스입니다.");
        Swal.fire({
            title: '신청 불가',
            text: '이미 신청한 게스트하우스입니다.',
            icon: 'info',
        });
        return; // ✅ 신청 중단
    }

    const url_book = `http://localhost:9000/status/book`; // ✅ 신청 API URL
    const requestBody_book = {
        memberId: memberId,
        guestHouseId: guesthouseId,
        bookReqDto: { flag: true },
        likeReqDto: { flag: false },
        usedReqDto: { flag: false }
    };

    try {
        // ✅ 신청 요청
        const response_book = await fetch(url_book, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody_book)
        });

        if (!response_book.ok) throw new Error("게스트하우스 신청에 실패했습니다.");

        // ✅ MBTI 점수 갱신 요청 (mbti[0], mbti[1], mbti[2], mbti[3] 각각 요청)
        const url_update = `http://localhost:9000/scores/update`;
        const requestBody_update = {
            "mbti": mbti,  // ✅ 각 자리 문자에 대해 반복
            "guestHouseId": guesthouseId
        };

        const response_update = await fetch(url_update, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody_update),
            mode: 'cors'
        });
        console.log(response_update);
        if (!response_update.ok) {
            console.error(`점수 갱신 실패 (${mbti[i]})`);
        }

        if (!response_book.ok) throw new Error("게스트하우스 신청에 실패했습니다.");
        // alert("신청이 완료되었습니다!");
        Swal.fire({
            title: '신청 완료',
            icon: 'success',
        });

        // ✅ 신청 성공 후 블러 해제
        document.getElementById('profileSection').classList.remove('profiles-blurred');
        updateApplicantCount(1);

        // 신청 시 프로필 리스트에 추가
        const profileContainer = document.getElementById('profileContainer');

        const card = document.createElement('div');
        card.classList.add('profile-card');

        card.innerHTML = `
            <img src="${decoded.imgUrl}" alt="${decoded.name}" class="profile-image">
            <div class="profile-name">${decoded.name}</div>
            <div class="profile-info">${decoded.age}세 · ${decoded.sex === 'M' ? '남성' : '여성'} · ${decoded.mbti}</div>
            <div class="profile-intro">"${decoded.introduce}"</div>
            <div class="profile-tags">
                <span class="profile-tag">🍽 ${decoded.favorite}</span>
                <span class="profile-tag">🍷 ${decoded.alcoholLimit}</span>
            </div>
        `;
        const firstChild = profileContainer.children[0];
        profileContainer.insertBefore(card, firstChild);
        
    } catch (error) {
        console.error("신청 오류:", error);
        // alert("신청 중 문제가 발생했습니다.");
        Swal.fire({
            title: '신청 실패',
            text: '신청 중 문제가 발생했습니다.',
            icon: 'warning',
        });
    }
};


/**
 * ✅ 신청 취소하기 API 요청
 */
const withdrawToGuesthouse = async () => {
    const guesthouseId = getGuesthouseIdFromQuery();
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const memberId = decoded.memberId;
    const mbti = decoded.mbti;

    // ✅ 신청 여부 확인
    const bookedGuesthouses = await fetchUserBooks(memberId);
    const isBooked = bookedGuesthouses.some(guesthouse => guesthouse.guestHouseId === guesthouseId);
    if (!isBooked) {
        // alert("취소할 수 없습니다.");
        Swal.fire({
            title: '취소 불가',
            text: '신청하지 않은 게스트하우스입니다.',
            icon: 'info',
        });
        return; // ✅ 취소 중단
    }

    const url = `http://localhost:9000/status/book`; // ✅ API URL
    const requestBody = {
        memberId: memberId,
        guestHouseId: guesthouseId,
        bookReqDto: { flag: false },
        likeReqDto: { flag: false },
        usedReqDto: { flag: false }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error("게스트하우스 신청 취소에 실패했습니다.");
        // alert("취소가 완료되었습니다!");
        Swal.fire({
            title: '취소 완료',
            icon: 'success',
        });

        // ✅ 취소 성공 후 블러 처리
        document.getElementById('profileSection').classList.add('profiles-blurred');
        updateApplicantCount(-1);

        // 취소 성공 후 
        findProfileByName(decoded.name).remove();
        

    } catch (error) {
        console.error("취소 오류:", error);
        // alert("취소 중 문제가 발생했습니다.");
        Swal.fire({
            title: '취소 실패',
            text: '취소 중 문제가 발생했습니다.',
            icon: 'warning',
        });
    }
};


/**
 * ✅ JWT에서 `memberId` 추출하는 함수
 */
const getMemberIdFromJWT = (jwt) => {
    try {
        const payloadBase64 = jwt.split(".")[1]; // JWT의 Payload 부분 추출
        const payloadDecoded = JSON.parse(atob(payloadBase64)); // Base64 디코딩 후 JSON 변환
        return payloadDecoded.memberId; // ✅ memberId 값 반환
    } catch (error) {
        console.error("JWT 디코딩 오류:", error);
        return null; // 에러 발생 시 null 반환
    }
};


function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1]; // payload 부분 추출
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = decodeURIComponent(escape(atob(base64))); // ✅ UTF-8 변환 적용
        return JSON.parse(decoded); // JSON 파싱
    } catch (e) {
        console.error("Invalid JWT Token", e);
        return null;
    }
}


/**
 * ✅ 찜하기 버튼 토글 기능
 */
const toggleBookmark = async (btn) => {
    const guesthouseId = getGuesthouseIdFromQuery();
    const token = localStorage.getItem("token");
    const memberId = parseJwt(token).memberId;

    if (!guesthouseId) {
        // alert("잘못된 접근입니다.");
        Swal.fire({
            title: '잘못된 접근입니다.',
            icon: 'warning',
        });
        return;
    }

    // ✅ 현재 찜 상태 확인
    const likedGuesthouses = await fetchUserLikes(memberId);
    const isLiked = likedGuesthouses.some(guesthouse => guesthouse.guestHouseId === guesthouseId);

    // ✅ 찜 상태를 토글 (현재 찜 상태면 해제, 아니라면 추가)
    const newLikeStatus = !isLiked;
    const requestBody = {
        memberId: memberId,
        guestHouseId: guesthouseId,
        likeReqDto: { flag: newLikeStatus }, // ✅ 여기서 토글
        bookReqDto: { flag: false },
        usedReqDto: { flag: false }
    };

    const url = `http://localhost:9000/status/like`; // ✅ API URL

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody),
            mode: 'cors'
        });

        if (!response.ok) throw new Error("찜 상태 변경에 실패했습니다.");

        // ✅ 찜 상태 업데이트 성공 시 버튼 UI 변경
        btn.classList.toggle('active', newLikeStatus);
        // alert(newLikeStatus ? "찜한 게스트하우스에 추가되었습니다!" : "찜한 게스트하우스에서 제거되었습니다!");
        Swal.fire({
            title: newLikeStatus ? '찜 완료' : '찜 취소 완료',
            text: newLikeStatus ? '찜한 게스트하우스에 추가되었습니다.' : "찜한 게스트하우스에서 제거되었습니다.",
            icon: 'success',
        });
    } catch (error) {
        console.error("찜 토글 오류:", error);
        // alert("찜 상태 변경 중 문제가 발생했습니다.");
        Swal.fire({
            title: '찜 실패',
            text: '상태 변경 중 문제가 발생했습니다.',
            icon: 'warning',
        });
    }
};



document.querySelector(".logout-btn").addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    // alert("로그아웃되었습니다.");
    // window.location.href = "login.html";
    Swal.fire({
        title: '로그아웃되었습니다.',
        icon: 'success',
    }).then(function(){
        location.href="login.html";                   
    });
});

// New fade-in animations
const fadeInElements = [
    '.header',
    '.left-panel',
    '.right-panel',

    '.mbti-score-container',
    '.action-buttons',
    '.profile-container'
];

// Staggered fade-in animation
fadeInElements.forEach((selector, index) => {
    const element = document.querySelector(selector);
    if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 * (index + 1)); // Staggered delay
    }
});

/**
 * ✅ API 요청: 사용자의 '좋아요'한 게스트하우스 목록 가져오기
 */
const fetchUserLikes = async (memberId) => {
    const token = localStorage.getItem("token");
    const url = `http://localhost:9000/status/like/${memberId}`; // ✅ API 주소

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("좋아요 목록을 가져오는 데 실패했습니다.");
        return response.json();
    } catch (error) {
        console.error("좋아요 목록 불러오기 오류:", error);
        return [];
    }
};

/**
 * ✅ 사용자가 해당 게스트하우스를 '좋아요' 했는지 확인 후 UI 업데이트
 */
const checkIfLiked = async (guesthouseId, memberId) => {
    const likedGuesthouses = await fetchUserLikes(memberId); // ✅ 사용자의 좋아요 목록 가져오기
    // ✅ 좋아요 목록에 현재 게스트하우스가 포함되어 있는지 확인
    const isLiked = likedGuesthouses.some(guesthouse => guesthouse.guestHouseId === guesthouseId);

    // ✅ 찜 버튼 활성화
    const bookmarkBtn = document.querySelector(".bookmark-btn");
    if (isLiked) {
        bookmarkBtn.classList.add('active');
    }
};

/**
 * ✅ API 요청: 사용자의 '신청'한 게스트하우스 목록 가져오기
 */
const fetchUserBooks = async (memberId) => {
    const token = localStorage.getItem("token");
    const url = `http://localhost:9000/status/booked/${memberId}`; // ✅ API 주소

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("좋아요 목록을 가져오는 데 실패했습니다.");
        return response.json();
    } catch (error) {
        console.error("좋아요 목록 불러오기 오류:", error);
        return [];
    }
};

/**
 * ✅ 사용자가 해당 게스트하우스를 '신청' 했는지 확인 후 UI 업데이트
 */
const checkIfBooked = async (guesthouseId, memberId) => {
    const BookedGuesthouses = await fetchUserBooks(memberId); // ✅ 사용자의 신청 목록 가져오기
    // ✅ 신청 목록에 현재 게스트하우스가 포함되어 있는지 확인
    const isBooked = BookedGuesthouses.some(guesthouse => guesthouse.guestHouseId === guesthouseId);

    // ✅ 블러 처리 해제
    if (isBooked) {
        document.getElementById('profileSection').classList.remove('profiles-blurred');
    }
};

async function fetchMemberInfo(memberId) {
    try {
        const response = await fetch(`http://127.0.0.1:9000/member/${memberId}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*', // 모든 도메인에 대해 CORS 허용
                mode: 'cors', // CORS 요청 모드 설정
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        // 멤버 정보가 존재하는 경우 업데이트
        if (data.imgUrl && data.name) {
            document.querySelector(".left-panel-profile-image").src = data.imgUrl;
            document.querySelector(".profile-name").textContent = data.name;
        }
    } catch (error) {
        console.error("Error fetching member info:", error);
    }
}

const updateApplicantCount = (change) => {
    const applicantText = document.getElementById("applicantCountText");
    const progressBar = document.getElementById("mbtiScoreBarFill2");

    let [current, max] = applicantText.textContent.split("/").map(Number);

    // ✅ 신청자가 0 이상 && 최대 인원 이하일 때만 변경
    current = Math.max(0, Math.min(max, current + change));

    // ✅ 신청자 수 UI 업데이트
    applicantText.textContent = `${current}/${max}`;

    // ✅ 진행 바 너비 업데이트 (비율 계산)
    progressBar.style.width = `${(current / max) * 100}%`;
};

function findProfileByName(name) {
    const container = document.getElementById('profileContainer');
    if (!container) {
        console.error("Container element not found");
        return null;
    }

    const profileCards = container.getElementsByClassName('profile-card');

    for (let card of profileCards) {
        const profileNameElement = card.querySelector('.profile-name');
        if (profileNameElement && profileNameElement.textContent.trim() === name) {
            console.log(profileNameElement.textContent.trim());
            return card; // 해당 profile-card 요소 반환
        }
    }

    return null; // 찾지 못한 경우 null 반환
}