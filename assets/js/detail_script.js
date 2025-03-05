let hasApplied = false;

function toggleBookmark(btn) {
    btn.classList.toggle('active');
}

function applyToGuesthouse() {
    if (!hasApplied) {
        hasApplied = true;
        document.getElementById('profileSection').classList.remove('profiles-blurred');
        
        alert('게스트하우스에 신청되었습니다.');
    }
}

function withdrawToGuesthouse() {
    if (hasApplied) {
        hasApplied = false;
        document.getElementById('profileSection').classList.add('profiles-blurred');
        
        alert('신청 취소 완료되었습니다.');
    }
}

function createProfileCards(profiles) {
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.innerHTML = '';

    profiles.forEach(profile => {
        const card = document.createElement('div');
        card.classList.add('profile-card');

        card.innerHTML = `
            <img src="${profile.imageUrl}" alt="${profile.name}" class="profile-image">
            <div class="profile-name">${profile.name}</div>
            <div class="profile-info">${profile.age}세 · ${profile.job}</div>
            <div class="profile-info">${profile.introduction}</div>
            <div class="profile-tags">
                ${profile.tags.map(tag => `<span class="profile-tag">${tag}</span>`).join('')}
            </div>
        `;

        profileContainer.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const sampleProfiles = [
        {
            name: '김서연',
            age: 27,
            job: '디자이너',
            introduction: '여행을 좋아하고 새로운 사람들을 만나는 것을 즐깁니다.',
            imageUrl: 'https://img.khan.co.kr/news/2020/10/16/2020101601001687000138341.webp',
            tags: ['조용한', '창의적']
        },
        {
            name: '이준호',
            age: 32,
            job: '개발자',
            introduction: '세계 각국을 여행하며 다양한 문화를 경험하고 싶어요.',
            imageUrl: 'https://i.namu.wiki/i/Iokwjd6FMZBnhFVdRXwpWPViNiCH2QRQi6mnddsOXdCO7qDhB9WMdNUOXPHrNKElvgTwxft_hS7YNJYljMdW1x-g1V5nGnqiXIHZYR_KglBpbtzt5y4VpAOVggBnBhOMt9MpxEndXiaflutqngvM5g.webp',
            tags: ['모험적', '열정적']
        },
        {
            name: '박지은',
            age: 25,
            job: '마케터',
            introduction: '새로운 사람들과 소통하고 이야기 나누는 것을 좋아해요.',
            imageUrl: 'https://i.namu.wiki/i/5DxyKOUjOZyH-CXJ_qa_h5n8s0bihNGKnc0mGPlCpYCItP3E98eWJlS5PQteZtNJt8Shz6-TguTiuD7p2aEtOn2awED_zGvZS7mhtTWBwnml9IEBkQlpC5Ky2IzwOhp0431_J2fU6vcOuKEprWYmkw.webp',
            tags: ['사교적', '활발한']
        },
        {
            name: '최민지',
            age: 29,
            job: '요가 강사',
            introduction: '자연과 함께하는 여행을 좋아하고 평화로운 분위기를 추구해요.',
            imageUrl: 'https://i.namu.wiki/i/N4fah7tpvwPXd4Biha35ea29KTUtxd9m0gCgtgbFYmQyjHaM7Zune83GeTxNEsx_FtTyTN_vMFp8GRWQ-H07UMzYs8UfyABJZ2aBdpDOBv6bW6ZAUxevxH3j5QeRgLgWclEH2TAwVBXnDKE3LDDUCg.webp',
            tags: ['평화로운', '건강']
        },
        {
            name: '이정훈',
            age: 31,
            job: '건축가',
            introduction: '새로운 경험과 다양한 사람들과의 교류를 즐깁니다.',
            imageUrl: 'https://i.namu.wiki/i/xCbKDdF_PUSxR1ywlU806DL9yQ6UbErkuclKwquSukeElI1N4zY_APgmjZPoFQPZTI-sUuPmeYGaAyrrGwT73cGrq8Vts0XtpiOjYUXDvCkNiEGAXpvdp0DMc_BICgx1w-AHuG7ox9E-KC4uhbYMdA.webp',
            tags: ['창의적', '호기심']
        },
        {
            name: '김지현',
            age: 26,
            job: '교사',
            introduction: '여행을 통해 새로운 문화와 삶의 관점을 배우고 싶어요.',
            imageUrl: 'https://i.namu.wiki/i/ORhFWV_tmQ4aZcyYeT9hmGT4VFbwXgsxMv5pltqwy6TjLJ_GJ89zJ3-3iu4ERrQBf9QdDntyyh_8IszeRzBFYJ8Q27UcMPCgg33ulQo8oy4vC6hEdAEiYEd45pPOdDHQ1CMPBPA--SmONHtLfwaTVw.webp',
            tags: ['따뜻한', '배움']
        },
    ];

    createProfileCards(sampleProfiles);
});

document.addEventListener('DOMContentLoaded', () => {
    const mbtiScoreBarFill = document.getElementById('mbtiScoreBarFill');
    const mbtiScoreBarFill2 = document.getElementById('mbtiScoreBarFill2');
    const mbtiScoreText = document.getElementById('mbtiScoreText');
    
    // 25% 너비로 애니메이션 적용
    setTimeout(() => {
        mbtiScoreBarFill.style.width = '25%';
        mbtiScoreBarFill2.style.width = '60%';
    }, 500);

});

document.querySelector(".logout-btn").addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    alert("로그아웃되었습니다.");
    window.location.href = "login.html";
});

const logo =  document.querySelector(".logo");
logo.addEventListener("click", function (event) {
    window.location.href = "login.html";
});

