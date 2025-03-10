//추가 필요: 1.기본 프로필 데이터에서 guesthouse 사용목록 추가 2. detail.html과 연결

document.addEventListener("DOMContentLoaded", function () {
    // ✅ 1. 사용자 정보 데이터 (추후 서버에서 가져와야 함)
    const token = localStorage.getItem("token");
    // 로그인 토큰 확인: 토큰이 없으면 경고창을 띄우고 로그인 페이지로 이동
    if (!token) {
        Swal.fire({
            title: '로그인 상태가 아닙니다.',
            text: '로그인 페이지로 이동합니다.',
            icon: 'warning',
        }).then(function(){
            location.href="login.html";                   
        });
        return; // 이후 코드 실행 중단
    }

    let profileData = {};

    // 기본 프로필 데이터 (토큰이 없거나 필드가 없는 경우 fallback)
    const defaultProfileData = {
        img: "https://i.pinimg.com/236x/bd/ff/19/bdff1975dbbf0315aaf87a923d13759a.jpg",
        name: "홍길동",
        mbti: "INFJ",
        age: 25,
        gender: "남성",
        food: "삼겹살",
        alcohol: "소주 2병",
        intro: "여행을 좋아하는 개발자입니다.",
        guesthouse: "없음"
    };

    // 토큰이 존재하면 디코딩 시도 후 프로필 데이터 갱신
    if (token) {
        const decoded = parseJwt(token);
        if (decoded) {
            profileData = {
                memberId: decoded.memberId || null,
                img: decoded.imgUrl || defaultProfileData.img,
                name: decoded.name || defaultProfileData.name,
                mbti: decoded.mbti || defaultProfileData.mbti,
                age: decoded.age || defaultProfileData.age,
                gender: decoded.sex || defaultProfileData.gender,
                food: decoded.favorite || defaultProfileData.food,
                alcohol: decoded.alcoholLimit || defaultProfileData.alcohol,
                intro: decoded.introduce || defaultProfileData.intro,
                guesthouse: decoded.guesthouse || defaultProfileData.guesthouse// 신청 내역은 추가 필요
            
            };

        } else {
            profileData = defaultProfileData;
        }
    } else {
        profileData = defaultProfileData;
    }

    // ✅ 프로필 이미지 및 정보 표시
    document.getElementById("profile-img").style.backgroundImage = `url(${profileData.img})`;
    // document.getElementById("profile-info").innerHTML = `
    //     <h4><strong>${profileData.name}</strong></h4>
    //     <p>${profileData.mbti} / ${profileData.age}세 / ${profileData.gender}</p>
    //     <p>좋아하는 음식: ${profileData.food}</p>
    //     <p>주량: ${profileData.alcohol}</p>
    //     <p style="font-style:italic">"${profileData.intro}"</p>
    //     <p>현재 신청 내역: ${profileData.guesthouse}</p>
    // `;
    // ✅ 예약중인(신청중인) 게스트하우스 목록을 가져와 프로필의 guesthouse 필드를 업데이트
    if (profileData.memberId) {
        fetch(`http://localhost:9000/status/booked/${profileData.memberId}`)
            .then(response => response.json())
            .then(bookedData => {
                // bookedData는 BookedGuestHouseResDto 배열로 가정 (각 객체에 name 필드 존재)
                const bookedNames = bookedData.map(item => item.name).join(", ") || "없음";
                profileData.guesthouse = bookedNames;
                // 프로필 영역 업데이트 (기존 innerHTML을 다시 렌더링)
                document.getElementById("profile-info").innerHTML = `
                    <h4><strong>${profileData.name}</strong></h4>
                    <p>${profileData.mbti} / ${profileData.age}세 / ${profileData.gender}</p>
                    <p>좋아하는 음식: ${profileData.food}</p>
                    <p>주량: ${profileData.alcohol}</p>
                    <p style="font-style:italic">"${profileData.intro}"</p>
                    <p>현재 신청 내역: ${profileData.guesthouse}</p>
                `;
            })
            .catch(error => console.error("Error fetching booked guesthouse list:", error));
    } else {
        console.error("회원 고유번호(memberId)가 토큰에 포함되어 있지 않습니다.");
    }
    // ✅ 2. 전체 게스트하우스 목록 (추후 서버에서 가져와야 함)
    // const dataList = [
    //     { name: "서울 한옥 게스트하우스", score: 92, location: "서울", detailUrl: "detail.html", imageUrl: "https://image.theminda.com/data/goods/3000/3673/goods/16ed717b7ef90bbdf0922d24a23da20b.jpg" },
    //     { name: "부산 바다 전망 게스트하우스", score: 85, location: "부산", detailUrl: "detail.html", imageUrl: "https://pix10.agoda.net/hotelImages/746/746727/746727_15071417360032291638.jpg?ca=4&ce=1&s=414x232&ar=16x9" },
    //     { name: "제주 오름 게스트하우스", score: 78, location: "제주", detailUrl: "detail.html", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN82oI98qPmlRI4kmNB-Im7nYEc7hQXhQUfA&s" },
    //     { name: "강릉 휴식 게스트하우스", score: 95, location: "강릉", detailUrl: "detail.html", imageUrl: "https://cdn.constimes.co.kr/news/photo/202309/242299_49361_1946.jpg" },
    //     { name: "서울 한옥 게스트하우스", score: 92, location: "서울", detailUrl: "detail.html", imageUrl: "https://image.theminda.com/data/goods/3000/3673/goods/16ed717b7ef90bbdf0922d24a23da20b.jpg" },
    //     { name: "부산 바다 전망 게스트하우스", score: 85, location: "부산", detailUrl: "detail.html", imageUrl: "https://pix10.agoda.net/hotelImages/746/746727/746727_15071417360032291638.jpg?ca=4&ce=1&s=414x232&ar=16x9" },
    //     { name: "제주 오름 게스트하우스", score: 78, location: "제주", detailUrl: "detail.html", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN82oI98qPmlRI4kmNB-Im7nYEc7hQXhQUfA&s" },
    //     { name: "강릉 휴식 게스트하우스", score: 95, location: "강릉", detailUrl: "detail.html", imageUrl: "https://cdn.constimes.co.kr/news/photo/202309/242299_49361_1946.jpg" }
    // ];
    // 게스트하우스 목록을 백엔드에서 가져와 카드 형식으로 표시
    // API 주소(http://localhost:9000/guesthouse)는 실제 서버 주소로 변경하세요.
    fetch('http://localhost:9000/guesthouse')
        .then(response => response.json())
        .then(data => {
            // 로그인한 사용자의 MBTI에 따른 점수를 기준으로 내림차순 정렬
            data.sort((a, b) => {
                const scoreA = a.scores && a.scores.find(scoreObj => scoreObj.mbti === profileData.mbti)?.totalScore || 0;
                const scoreB = b.scores && b.scores.find(scoreObj => scoreObj.mbti === profileData.mbti)?.totalScore || 0;
                return scoreB - scoreA;
            });
            const cardContainer = document.getElementById("card-container");
            
            data.forEach(item => {
                // item은 GuestHouseRes 객체이며, item.scores는 ScoreRes 배열입니다.
                // 로그인한 사용자의 MBTI와 일치하는 score를 찾아 totalScore를 표시합니다.
                const userMbti = profileData.mbti;
                const matchingScore = item.scores && item.scores.find(scoreObj => scoreObj.mbti === userMbti);
                const scoreDisplay = matchingScore ? matchingScore.totalScore : 0;

                // 카드 UI 생성
                const cardHTML = `
                    <div>
                        <div class="card" onclick="location.href='detail.html?id=${item.guestHouseId}';">
                            <img src="${item.bgImgUrl}" class="card-img-top" alt="${item.name}">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text">${scoreDisplay}점, ${item.location}</p>
                            </div>
                        </div>
                    </div>
                `;

                cardContainer.innerHTML += cardHTML;
            });


        })
        .catch(error => console.error("Error fetching guesthouse list:", error));

    // // ✅ 게스트하우스 목록 UI 생성
    // dataList.forEach(item => {
    //     const cardHTML = `
    //                 <div class="col-sm-6 col-md-4">
    //                     <div class="card" style="width: 18rem;">
    //                         <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
    //                         <div class="card-body">
    //                             <h5 class="card-title">${item.name}</h5>
    //                             <p class="card-text">${item.score}점, ${item.location}</p>
    //                             <a href="${item.detailUrl}" class="btn btn-detail">상세보기</a>
    //                         </div>
    //                     </div>
    //                 </div>
    //             `;
    //     cardContainer.innerHTML += cardHTML;

    //     // const div = document.createElement("div");
    //     // div.className = "list-item" + (item.recommended ? " recommended" : " general");

    //     // const starSpan = document.createElement("span");
    //     // starSpan.className = "star";
    //     // starSpan.textContent = item.recommended ? "★" : "";

    //     // const nameLink = document.createElement("a");
    //     // nameLink.className = "name-link";
    //     // nameLink.textContent = item.name;
    //     // nameLink.href = item.link;

    //     // const scoreSpan = document.createElement("span");
    //     // scoreSpan.className = "score-circle";
    //     // scoreSpan.textContent = item.score;

    //     // div.appendChild(starSpan);
    //     // div.appendChild(nameLink);
    //     // div.appendChild(scoreSpan);
    //     // listElement.appendChild(div);
    // });

    // ✅ 3. 찜한 게스트하우스 목록
    // const likedDataList = [
    //     { name: "힐링하우스" },
    //     { name: "푸른바다" },
    //     { name: "달빛정원" },
    //     { name: "포레스트인" }
    // ];
    // const likedlistElement = document.getElementById("liked-list");

    // likedDataList.forEach(item => {
    //     const div = document.createElement("div");
    //     div.className = "list-item-small";
    //     div.textContent = item.name;
    //     likedlistElement.appendChild(div);
    // });

    // (API: GET /status/like/{id})
    if (profileData.memberId) {
        fetch(`http://localhost:9000/status/like/${profileData.memberId}`)
            .then(response => response.json())
            .then(likedData => {
                const likedlistElement = document.getElementById("liked-list");
                likedData.forEach(item => {
                    // LikedGuestHouseResDto 객체 (예: item.name, item.guestHouseId 등)
                    const div = document.createElement("div");
                    div.className = "list-item-small";
                    // 예시로 이름을 표시합니다. 필요에 따라 링크나 추가 정보를 표시 가능

                    const img = document.createElement("img");
                    img.src = item.bgImgUrl;

                    const span = document.createElement("span");
                    span.textContent = item.name;

                    likedlistElement.appendChild(div);
                    div.appendChild(img);
                    div.appendChild(span);
                });
            })
            .catch(error => console.error("Error fetching liked guesthouse list:", error));
    } else {
        console.error("회원 고유번호(memberId)가 토큰에 포함되어 있지 않습니다.");
    }
    // ✅ 4. 이용완료한 게스트하우스 목록
    if (profileData.memberId) {
        fetch(`http://localhost:9000/status/used/${profileData.memberId}`)
            .then(response => response.json())
            .then(usedData => {
                const usedlistElement = document.getElementById("used-list");
                usedData.forEach(item => {
                    // UsedGuestHouseResDto 객체 예시: item.name, item.guestHouseId 등
                    const div = document.createElement("div");
                    div.className = "list-item-small";
                    // 필요에 따라 링크나 추가 정보를 표시할 수 있음

                    const img = document.createElement("img");
                    img.src = item.bgImgUrl;

                    const span = document.createElement("span");
                    span.textContent = item.name;

                    usedlistElement.appendChild(div);
                    div.appendChild(img);
                    div.appendChild(span);
                });
            })
            .catch(error => console.error("Error fetching used guesthouse list:", error));
    } else {
        console.error("회원 고유번호(memberId)가 토큰에 포함되어 있지 않습니다.");
    }
    // const usedDataList = [
    //     { name: "소소한하루" },
    //     { name: "코지하우스" },
    //     { name: "스카이뷰" }
    // ];
    // const usedlistElement = document.getElementById("used-list");

    // usedDataList.forEach(item => {
    //     const div = document.createElement("div");
    //     div.className = "list-item-small";
    //     div.textContent = item.name;
    //     usedlistElement.appendChild(div);
    // });

    // ✅ 5. 로그아웃 버튼 클릭 시 로컬 스토리지에서 토큰 삭제 및 로그인 페이지로 이동
    document.querySelector(".logout-btn").addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token");
        Swal.fire({
            title: '로그아웃되었습니다.',
            icon: 'success',
        }).then(function(){
            location.href="login.html";                   
        });
    });
    // JWT 토큰 디코딩 함수
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
});

// New fade-in animations
const fadeInElements = [
    '.header',
    '.profile-img',
    '.profile-info',
    '.left',
    '.right',

    '.title',
    '.wishlist-usedlist',

    '.row',
    '.card-container',
    '.card'
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