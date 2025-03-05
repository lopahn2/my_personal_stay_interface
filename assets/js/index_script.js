document.addEventListener("DOMContentLoaded", function () {
    // ✅ 1. 사용자 정보 데이터 (추후 서버에서 가져와야 함)
    const profileData = {
        img: "https://i.pinimg.com/236x/bd/ff/19/bdff1975dbbf0315aaf87a923d13759a.jpg", // 프로필 이미지 URL
        name: "홍길동",
        mbti: "INFJ",
        age: 25,
        gender: "남성",
        food: "삼겹살",
        alcohol: "소주 2병",
        intro: "여행을 좋아하는 개발자입니다.",
        guesthouse: "여수 낭만 게스트하우스"
    };

    // ✅ 프로필 이미지 및 정보 표시
    document.getElementById("profile-img").style.backgroundImage = `url(${profileData.img})`;
    document.getElementById("profile-info").innerHTML = `
        <h4><strong>${profileData.name}</strong></h4>
        <p>${profileData.mbti} / ${profileData.age}세 / ${profileData.gender}</p>
        <p>좋아하는 음식: ${profileData.food}</p>
        <p>주량: ${profileData.alcohol}</p>
        <p style="font-style:italic">"${profileData.intro}"</p>
        <p>현재 신청 내역: ${profileData.guesthouse}</p>
    `;

    // ✅ 2. 전체 게스트하우스 목록 (추후 서버에서 가져와야 함)
    const dataList = [
        { name: "서울 한옥 게스트하우스", score: 92, recommended: true, link: "detail.html" },
        { name: "부산 바다 전망 게스트하우스", score: 85, recommended: true, link: "detail.html" },
        { name: "제주 오름 게스트하우스", score: 78, recommended: true, link: "detail.html" },
        { name: "창원 휴식 게스트하우스", score: 95, recommended: false, link: "detail.html" }
    ];
    const listElement = document.getElementById("list");

    // ✅ 게스트하우스 목록 UI 생성
    dataList.forEach(item => {
        const div = document.createElement("div");
        div.className = "list-item" + (item.recommended ? " recommended" : " general");

        const starSpan = document.createElement("span");
        starSpan.className = "star";
        starSpan.textContent = item.recommended ? "★" : "";

        const nameLink = document.createElement("a");
        nameLink.className = "name-link";
        nameLink.textContent = item.name;
        nameLink.href = item.link;

        const scoreSpan = document.createElement("span");
        scoreSpan.className = "score-circle";
        scoreSpan.textContent = item.score;

        div.appendChild(starSpan);
        div.appendChild(nameLink);
        div.appendChild(scoreSpan);
        listElement.appendChild(div);
    });

    // ✅ 3. 찜한 게스트하우스 목록
    const likedDataList = [
        { name: "힐링하우스" },
        { name: "푸른바다" },
        { name: "달빛정원" },
        { name: "포레스트인" }
    ];
    const likedlistElement = document.getElementById("liked-list");

    likedDataList.forEach(item => {
        const div = document.createElement("div");
        div.className = "list-item-small";
        div.textContent = item.name;
        likedlistElement.appendChild(div);
    });

    // ✅ 4. 이용완료한 게스트하우스 목록
    const usedDataList = [
        { name: "소소한하루" },
        { name: "코지하우스" },
        { name: "스카이뷰" }
    ];
    const usedlistElement = document.getElementById("used-list");

    usedDataList.forEach(item => {
        const div = document.createElement("div");
        div.className = "list-item-small";
        div.textContent = item.name;
        usedlistElement.appendChild(div);
    });

    // ✅ 5. 로그아웃 버튼 클릭 시 로컬 스토리지에서 토큰 삭제 및 로그인 페이지로 이동
    document.querySelector(".logout-btn").addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token");
        alert("로그아웃되었습니다.");
        window.location.href = "login.html";
    });
});
