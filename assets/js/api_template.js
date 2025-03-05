/**
 * API 요청을 보내는 함수
 * @param {string} url - 요청할 API URL (예: 'http://localhost:9000/scores/init')
 * @param {string} method - 요청 방식 ('POST', 'GET', 'PUT', 'DELETE' 등)
 * @param {Object} data - 요청에 포함할 데이터 (JSON 객체)
 * @param {Function} onSuccess - 요청 성공 시 실행할 콜백 함수
 */
function apiRequest(url, method, data, onSuccess) {
    fetch(url, {
        method: method, // 요청 방식 동적으로 설정
        headers: {
            'Content-Type': 'application/json', // JSON 형식 전송
            'Access-Control-Allow-Origin': '*'  // CORS 설정
        },
        body: method !== 'GET' ? JSON.stringify(data) : null, // GET 요청이면 body 생략
        mode: 'cors' // CORS 요청 모드
    })
    .then(response => {
        if (!response.ok) {
            // HTTP 상태 코드가 200~299 범위가 아니라면 에러 처리
            return response.json().then(errData => {
                throw new Error(`에러 ${response.status}: ${errData.message || '서버 오류 발생'}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (onSuccess) {
            onSuccess(data); // 성공 시 지정된 콜백 실행
        }
    })
    .catch(error => {
        // 실패 시 에러 메시지를 화면에 표시 (직관적 오류 처리)
        alert(error.message);
        console.error('API 요청 실패:', error);
    });
}

/**
 * POST 사용 예시
 */
// const url = 'http://localhost:9000/scores/init';
// const data = { mbti: 'ESFJ', guestHouseId: '7' };

// apiRequest(url, 'POST', data, (responseData) => {
//     console.log('성공:', responseData);
// });


/**
 * GET 사용 예시
 */
// const url = 'http://localhost:9000/guesthouses';

// apiRequest(url, 'GET', null, (responseData) => {
//     console.log('게스트하우스 목록:', responseData);
// });
