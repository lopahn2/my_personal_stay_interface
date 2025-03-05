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
        { name: "서울 한옥 게스트하우스", score: 92, location: "서울", detailUrl: "detail.html", imageUrl: "https://image.theminda.com/data/goods/3000/3673/goods/16ed717b7ef90bbdf0922d24a23da20b.jpg" },
        { name: "부산 바다 전망 게스트하우스", score: 85, location: "부산", detailUrl: "detail.html", imageUrl: "https://pix10.agoda.net/hotelImages/746/746727/746727_15071417360032291638.jpg?ca=4&ce=1&s=414x232&ar=16x9" },
        { name: "제주 오름 게스트하우스", score: 78, location: "제주", detailUrl: "detail.html", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN82oI98qPmlRI4kmNB-Im7nYEc7hQXhQUfA&s" },
        { name: "강릉 휴식 게스트하우스", score: 95, location: "강릉", detailUrl: "detail.html", imageUrl: "https://cdn.constimes.co.kr/news/photo/202309/242299_49361_1946.jpg" },
        { name: "서울 한옥 게스트하우스", score: 92, location: "서울", detailUrl: "detail.html", imageUrl: "https://image.theminda.com/data/goods/3000/3673/goods/16ed717b7ef90bbdf0922d24a23da20b.jpg" },
        { name: "부산 바다 전망 게스트하우스", score: 85, location: "부산", detailUrl: "detail.html", imageUrl: "https://pix10.agoda.net/hotelImages/746/746727/746727_15071417360032291638.jpg?ca=4&ce=1&s=414x232&ar=16x9" },
        { name: "제주 오름 게스트하우스", score: 78, location: "제주", detailUrl: "detail.html", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN82oI98qPmlRI4kmNB-Im7nYEc7hQXhQUfA&s" },
        { name: "강릉 휴식 게스트하우스", score: 95, location: "강릉", detailUrl: "detail.html", imageUrl: "https://cdn.constimes.co.kr/news/photo/202309/242299_49361_1946.jpg" }
    ];
    const cardContainer = document.getElementById("card-container");

    // ✅ 게스트하우스 목록 UI 생성
    dataList.forEach(item => {
        const cardHTML = `
                    <div class="col-sm-6 col-md-4">
                        <div class="card" style="width: 18rem;">
                            <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text">${item.score}점, ${item.location}</p>
                                <a href="${item.detailUrl}" class="btn btn-detail">상세보기</a>
                            </div>
                        </div>
                    </div>
                `;
        cardContainer.innerHTML += cardHTML;
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
