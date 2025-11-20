// static/memo.js

let selectedDate = new Date().toISOString().split('T')[0];
const memosByDate = {};

document.addEventListener('DOMContentLoaded', () => {
  // 메모 뷰가 없는 페이지에서는 아무 것도 안 함
  const memoView = document.getElementById('memoView');
  if (!memoView) return;

  const dateBar = document.getElementById('dateBar');        // HTML id 확인 필수!
  const memoInputBox = document.getElementById('memoInputBox');
  const addBtn = document.querySelector('.add-btn');
  const saveBtn = document.getElementById('saveMemo');
  const cancelBtn = document.getElementById('cancelMemo');
  const memoListDiv = document.getElementById('memoList');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');

  const toggleMonthBtn = document.getElementById('toggleMonth');
  const monthCalendar = document.getElementById('monthCalendar');
  const monthLabel = document.getElementById('monthLabel');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const calendarGrid = document.getElementById('calendarGrid');

  let currentMonth = new Date(selectedDate);

  function renderWeekDates() {
    if (!dateBar) return;
    dateBar.innerHTML = '';

    const today = new Date(selectedDate);
    const dayOfWeek = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const btn = document.createElement('button');
      btn.className = 'date-btn';
      btn.textContent = d.getDate();

      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (dateStr === selectedDate) btn.classList.add('selected');

      btn.addEventListener('click', () => {
        selectedDate = dateStr;
        renderWeekDates();
        renderMemos();
      });

      dateBar.appendChild(btn);
    }
  }

  addBtn.addEventListener('click', () => {
    memoInputBox.classList.remove('hidden');
    titleInput.value = '';
    contentInput.value = '';
    titleInput.focus();

    saveBtn.onclick = saveNewMemo;
    cancelBtn.onclick = () => memoInputBox.classList.add('hidden');
  });

  function saveNewMemo() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title) return alert('제목을 입력하세요.');

    if (!memosByDate[selectedDate]) memosByDate[selectedDate] = [];
    memosByDate[selectedDate].push({ title, content });

    memoInputBox.classList.add('hidden');
    renderMemos();
  }

  function renderMemos() {
    memoListDiv.innerHTML = '';
    const memos = memosByDate[selectedDate] || [];

    memos.forEach((m, index) => {
      const div = document.createElement('div');
      div.className = 'memo-item';

      const tomatoImg = document.createElement('img');
      tomatoImg.src = '/static/img/memopin.png';
      tomatoImg.className = 'tomato-img';
      div.appendChild(tomatoImg);

      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = `<strong>${m.title}</strong><br>${m.content || ''}`;
      div.appendChild(contentDiv);

      div.addEventListener('click', () => {
        memoInputBox.classList.remove('hidden');
        titleInput.value = m.title;
        contentInput.value = m.content;

        saveBtn.onclick = () => {
          m.title = titleInput.value.trim();
          m.content = contentInput.value.trim();
          memoInputBox.classList.add('hidden');
          renderMemos();
        };

        cancelBtn.onclick = () => {
          if (confirm('이 메모를 삭제하시겠습니까?')) {
            memosByDate[selectedDate].splice(index, 1);
          }
          memoInputBox.classList.add('hidden');
          renderMemos();
        };
      });

      memoListDiv.appendChild(div);
    });
  }

  function renderMonthCalendar() {
    if (!monthCalendar || !calendarGrid || !monthLabel) return;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    monthLabel.textContent = `${year}년 ${month + 1}월`;

    calendarGrid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      calendarGrid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day';
      dayDiv.textContent = day;

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (dateStr === selectedDate) dayDiv.classList.add('selected');

      dayDiv.addEventListener('click', () => {
        selectedDate = dateStr;
        renderWeekDates();
        renderMemos();
        monthCalendar.classList.remove('show');
      });

      calendarGrid.appendChild(dayDiv);
    }
  }

  if (toggleMonthBtn) {
    toggleMonthBtn.addEventListener('click', () => {
      monthCalendar.classList.toggle('show');
      renderMonthCalendar();
    });
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      renderMonthCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      renderMonthCalendar();
    });
  }

  renderWeekDates();
  renderMemos();
});
