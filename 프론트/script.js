document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const skipButton = document.getElementById('skipButton');
    const skipOptionContainer = document.getElementById('skipOptionContainer');
    const chatDisplay = document.getElementById('chatDisplay');
    const mainQuestionSpan = document.getElementById('mainQuestion');
    const calendarSection = document.getElementById('calendarSection');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const currentMonthYearSpan = document.getElementById('currentMonthYear');
    const calendarDaysDiv = document.getElementById('calendarDays');
    const backToFirstPageButton = document.getElementById('backToFirstPageButton');

    let currentStage = 'location'; // 'location' 또는 'date'
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    let startDate = null; // 선택된 시작 날짜
    let endDate = null;   // 선택된 종료 날짜

    // 텍스트 영역 높이 자동 조절
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });

    // 메시지 전송 버튼 클릭 이벤트
    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            displayMessage(message, 'user');
            userInput.value = '';
            userInput.style.height = '50px'; // 높이 초기화

            // 실제 백엔드 연동 시 여기에 AI 호출 로직이 들어갈 예정입니다.
            // 현재 단계에 따라 다른 응답을 처리할 수 있습니다.
            // 예: if (currentStage === 'location') { ... } else if (currentStage === 'date') { ... }
        }
    });

    // 건너뛰기 버튼 클릭 이벤트
    skipButton.addEventListener('click', () => {
        currentStage = 'date'; // 단계를 날짜 선택으로 변경

        // 메인 질문 변경
        mainQuestionSpan.textContent = '언제 여행을 가고 싶으신가요? 캘린더에서 날짜를 선택하거나 직접 입력해주세요.';

        // skip 옵션 숨기기
        skipOptionContainer.classList.add('hidden');

        // 입력창 플레이스홀더 변경
        userInput.placeholder = '예: 2025년 8월 10일 ~ 8월 15일, 3박 4일...';

        // 캘린더 섹션 표시
        calendarSection.classList.remove('hidden');
        calendarSection.classList.add('flex'); // flex 속성을 추가하여 컬럼 레이아웃 유지

        // 캘린더 렌더링
        renderCalendar(currentMonth, currentYear);

        // 채팅창 초기화 및 숨기기 (새로운 대화 시작처럼)
        chatDisplay.innerHTML = '';
        chatDisplay.classList.add('hidden');

        // 날짜 선택 상태 초기화
        startDate = null;
        endDate = null;
    });

    // 첫 페이지로 돌아가기 버튼 클릭 이벤트
    backToFirstPageButton.addEventListener('click', () => {
        currentStage = 'location'; // 단계를 여행지 선택으로 변경

        // 캘린더 섹션 숨기기
        calendarSection.classList.add('hidden');

        // 첫 페이지 질문 다시 표시
        mainQuestionSpan.textContent = '어디로 여행을 떠나고 싶으신가요?';

        // skip 옵션 다시 표시
        skipOptionContainer.classList.remove('hidden');

        // 입력창 플레이스홀더 초기화
        userInput.placeholder = '예: 파리, 일본 도쿄, 제주도 등...';
        userInput.value = ''; // 입력창 비우기

        // 채팅창 초기화 및 숨기기
        chatDisplay.innerHTML = '';
        chatDisplay.classList.add('hidden');

        // 날짜 선택 상태 초기화
        startDate = null;
        endDate = null;
    });

    // 캘린더 렌더링 함수
    function renderCalendar(month, year) {
        calendarDaysDiv.innerHTML = ''; // 기존 날짜 초기화
        const firstDay = new Date(year, month, 1).getDay(); // 해당 월의 첫째 날 요일 (0:일, 1:월 ...)
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날 (총 일수)

        currentMonthYearSpan.textContent = `${year}년 ${month + 1}월`;

        // 첫째 날 이전의 빈 칸 채우기
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('p-2');
            calendarDaysDiv.appendChild(emptyDay);
        }

        // 날짜 채우기
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            // 기본 스타일 클래스
            dayElement.classList.add('p-2', 'rounded-lg', 'cursor-pointer', 'hover:bg-indigo-200', 'transition-colors', 'duration-150');
            dayElement.textContent = day;
            dayElement.dataset.date = new Date(year, month, day).toISOString(); // ISO 형식으로 날짜 저장

            const currentDate = new Date(year, month, day);
            // 오늘 날짜 하이라이트
            const today = new Date();
            if (currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
                dayElement.classList.add('bg-indigo-600', 'text-white', 'font-bold');
            }

            // 선택된 날짜 범위 하이라이트 적용
            if (startDate && endDate) {
                if (currentDate >= startDate && currentDate <= endDate) {
                    dayElement.classList.add('bg-indigo-300', 'text-indigo-900');
                    if (currentDate.getTime() === startDate.getTime()) {
                        dayElement.classList.add('rounded-l-lg'); // 시작일 강조
                    }
                    if (currentDate.getTime() === endDate.getTime()) {
                        dayElement.classList.add('rounded-r-lg'); // 종료일 강조
                    }
                }
            } else if (startDate && currentDate.getTime() === startDate.getTime()) {
                dayElement.classList.add('bg-indigo-500', 'text-white', 'font-bold'); // 시작일만 선택된 경우
            }


            // 날짜 클릭 이벤트 리스너
            dayElement.addEventListener('click', () => {
                const clickedDate = new Date(year, month, day);
                clickedDate.setHours(0, 0, 0, 0); // 시간 정보를 제거하여 정확한 날짜 비교

                if (!startDate || (startDate && endDate)) {
                    // 시작일이 없거나, 이미 시작일과 종료일이 모두 선택된 경우 (새로운 선택 시작)
                    startDate = clickedDate;
                    endDate = null; // 종료일 초기화
                    userInput.value = `${year}년 ${month + 1}월 ${day}일`;
                } else if (startDate && !endDate) {
                    // 시작일만 선택된 경우 (종료일 선택)
                    if (clickedDate < startDate) {
                        endDate = startDate; // 기존 시작일을 종료일로
                        startDate = clickedDate; // 클릭된 날짜를 새로운 시작일로
                    } else {
                        endDate = clickedDate; // 클릭된 날짜를 종료일로
                    }
                    
                    if (startDate.getTime() === endDate.getTime()) {
                        userInput.value = `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일 (하루)`;
                    } else {
                        userInput.value = `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일 ~ ${endDate.getFullYear()}년 ${endDate.getMonth() + 1}월 ${endDate.getDate()}일`;
                    }
                }
                
                // 캘린더 다시 렌더링하여 하이라이트 적용
                renderCalendar(currentMonth, currentYear);
            });
            calendarDaysDiv.appendChild(dayElement);
        }
    }

    // 이전 달 버튼
    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // 다음 달 버튼
    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Enter 키를 눌러 메시지 전송
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // 채팅 메시지를 화면에 표시하는 함수
    function displayMessage(message, sender) {
        // 채팅 표시 영역이 숨겨져 있으면 보이게 함
        chatDisplay.classList.remove('hidden');

        const messageElement = document.createElement('div');
        messageElement.classList.add('p-3', 'rounded-lg', 'max-w-[80%]', 'my-2');

        if (sender === 'user') {
            messageElement.classList.add('bg-indigo-100', 'text-indigo-900', 'self-end', 'ml-auto');
            chatDisplay.classList.add('flex', 'flex-col', 'items-end'); // 사용자 메시지를 오른쪽에 정렬
        } else {
            messageElement.classList.add('bg-gray-200', 'text-gray-800', 'self-start', 'mr-auto');
            chatDisplay.classList.remove('items-end'); // AI 메시지는 왼쪽에 정렬
            chatDisplay.classList.add('flex', 'flex-col', 'items-start');
        }
        messageElement.textContent = message;
        chatDisplay.appendChild(messageElement);

        // 스크롤을 가장 아래로 이동
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
});
