document.addEventListener("DOMContentLoaded", async () => {
    const guesthouseId = getGuesthouseIdFromQuery(); // ✅ URL에서 id 가져오기

    if (!guesthouseId) {
        alert("잘못된 접근입니다.");
        window.location.href = "/index.html"; // ✅ 잘못된 접근 시 홈으로 이동
        return;
    }

    try {
        const guesthouseData = await fetchGuesthouseDetail(guesthouseId); // ✅ API 요청
        updateGuesthouseUI(guesthouseData); // ✅ UI 업데이트
        const profileList = await fetchProfiles(guesthouseId); // ✅ 함께 지낼 사람 목록 불러오기
        createProfileCards(profileList); // ✅ 프로필 UI 업데이트
    } catch (error) {
        console.error("데이터 로드 오류:", error);
        alert("게스트하우스 정보를 불러오는 중 문제가 발생했습니다.");
    }
});

/**
 * ✅ 현재 URL에서 게스트하우스 ID 추출 (?id=7 형태)
 */
const getGuesthouseIdFromQuery = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
};

/**
 * ✅ API 요청: 특정 게스트하우스 정보 불러오기
 */
const fetchGuesthouseDetail = async (guesthouseId) => {
    const token = localStorage.getItem("token");
    const url = `http://localhost:9000/guesthouse/2`; // ✅ API 주소 설정

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
    const userMbti = localStorage.getItem("userMbti") || "ENTP";
    const matchingScore = data.scores.find(score => score.mbti === userMbti)?.totalScore || 0;

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
    document.querySelector(".left-panel-image").src = guesthouseData.imageUrl;

    // ✅ 태그 리스트 업데이트
    const tagContainer = document.querySelector(".tag-list");
    tagContainer.innerHTML = guesthouseData.tags.length > 0
        ? guesthouseData.tags.map(tag => `<span class="tag">${tag}</span>`).join("")
        : "<span class='tag'>태그 없음</span>";

    // ✅ MBTI 점수 업데이트
    updateMbtiScore(guesthouseData.mbtiScore);
};

/**
 * ✅ UI 업데이트: MBTI 매칭 점수
 */
const updateMbtiScore = (score) => {
    const mbtiScoreBarFill = document.getElementById('mbtiScoreBarFill');
    const mbtiScoreText = document.getElementById('mbtiScoreText');

    mbtiScoreText.textContent = `${score}%`;
    
    setTimeout(() => {
        mbtiScoreBarFill.style.width = `${score}%`;
    }, 500);
};

/**
 * ✅ UI 업데이트: 같이 지낼 사람들 프로필 카드 생성
 */
const createProfileCards = (profileList) => {
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.innerHTML = '';

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
    const url = `http://localhost:9000/status/book`; // ✅ API URL (수정 가능)

    const requestBody = {
        memberId: localStorage.getItem("memberId"), // ✅ 현재 로그인한 사용자 ID (localStorage에서 가져옴)
        guestHouseId: getGuesthouseIdFromQuery(),
        bookReqDto: { flag: true }, // ✅ 신청 (bookReqDto.flag = true)
    };
    console.log(requestBody);
    try {
        console.log("1");
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        console.log("2");
        if (!response.ok) throw new Error("게스트하우스 신청에 실패했습니다.");

        console.log("3");
        alert("신청이 완료되었습니다!");
        window.location.reload(); // ✅ 신청 후 페이지 새로고침

    } catch (error) {
        console.error("신청 오류:", error);
        alert("신청 중 문제가 발생했습니다.");
    }
};

/**
 * ✅ 신청 취소하기 API 요청
 */
const withdrawToGuesthouse = async (jwt) => {
    const url = `http://localhost:9000/status/book`; // ✅ API URL (수정 가능)

    const requestBody = {
        memberId: getMemberIdFromJWT(), // ✅ 현재 로그인한 사용자 ID
        guestHouseId: guestHouseId,
        bookReqDto: { flag: false } // ✅ 취소 (bookReqDto.flag = false)
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error("신청 취소에 실패했습니다.");

        alert("신청이 취소되었습니다.");
        window.location.reload(); // ✅ 취소 후 페이지 새로고침

    } catch (error) {
        console.error("취소 오류:", error);
        alert("취소 중 문제가 발생했습니다.");
    }
};

/**
 * ✅ JWT에서 `memberId` 추출하는 함수
 */
const getMemberIdFromJWT = (jwt) => {
    try {
        const payloadBase64 = jwt.split(".")[1]; // JWT의 Payload 부분 추출
        const payloadDecoded = JSON.parse(atob(payloadBase64)); // Base64 디코딩 후 JSON 변환
        console.log(payloadDecoded);
        return payloadDecoded.memberId; // ✅ memberId 값 반환
    } catch (error) {
        console.error("JWT 디코딩 오류:", error);
        return null; // 에러 발생 시 null 반환
    }
};
