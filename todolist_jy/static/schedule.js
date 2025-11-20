// static/schedule.js

document.addEventListener('DOMContentLoaded', () => {
  const scheduleView = document.getElementById('scheduleView');
  if (!scheduleView) return;

  const userId = localStorage.getItem("loggedInUser") || "guest";
  const STORAGE_KEY = `domado-schedule-${userId}`;

  let schedules = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  let currentDate = getToday();

  const dateBarEl = document.getElementById("scheduleDateBar");
  const currentDateEl = document.getElementById("scheduleCurrentDate");
  const listEl = document.getElementById("scheduleList");

  // 🔹 기존: const addBtn = document.getElementById("addScheduleBtn");
  // 🔹 변경: 사이드바 "추가" 버튼 사용
  const globalAddBtn = document.getElementById("globalAddBtn");

  if (!dateBarEl || !currentDateEl || !listEl) {
    console.warn("Schedule elements missing");
    return;
  }

  function getToday() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function createDatePills() {
    dateBarEl.innerHTML = "";
    const base = new Date(currentDate);

    for (let offset = -3; offset <= 3; offset++) {
      const d = new Date(base);
      d.setDate(d.getDate() + offset);
      const key = d.toISOString().slice(0, 10);

      const pill = document.createElement("button");
      pill.className = "date-btn";
      pill.dataset.date = key;
      pill.textContent = key.slice(5);
      if (key === currentDate) pill.classList.add("selected");

      pill.onclick = () => {
        currentDate = key;
        render();
      };

      dateBarEl.appendChild(pill);
    }
  }

  function render() {
    // 날짜 선택 표시
    document.querySelectorAll("#scheduleDateBar .date-btn").forEach(p => {
      p.classList.toggle("selected", p.dataset.date === currentDate);
    });

    currentDateEl.textContent = currentDate;

    listEl.innerHTML = "";
    const list = schedules[currentDate] || [];

    if (!list.length) {
      const li = document.createElement("li");
      li.textContent = "일정을 추가해 보세요.";
      li.className = "hint-text";
      listEl.appendChild(li);
      return;
    }

    list.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "schedule-item";

      const time = document.createElement("span");
      time.className = "schedule-time";
      time.textContent = item.time || "-";

      const text = document.createElement("span");
      text.className = "schedule-text";
      if (item.done) text.classList.add("done");
      text.textContent = item.text;

      const doneBtn = document.createElement("button");
      doneBtn.className = "btn-icon btn-check";
      doneBtn.textContent = item.done ? "✅" : "✔";
      doneBtn.onclick = () => {
        item.done = !item.done;
        save();
        render();
      };

      const delBtn = document.createElement("button");
      delBtn.className = "btn-icon btn-delete";
      delBtn.textContent = "🗑";
      delBtn.onclick = () => {
        list.splice(i, 1);
        save();
        render();
      };

      li.append(time, text, doneBtn, delBtn);
      listEl.appendChild(li);
    });
  }

    function addSchedule() {
    const time = prompt("시간 (예: 10:00, 생략 가능)");
    const text = prompt("일정 내용");
    if (!text) return;

    if (!schedules[currentDate]) schedules[currentDate] = [];
    schedules[currentDate].push({ time: time || "", text, done: false });
    save();
    render();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  }

  // 🔹 사이드바 '추가' 버튼 클릭 시, 일정 뷰가 active일 때만 동작
  if (globalAddBtn) {
    globalAddBtn.addEventListener("click", () => {
      if (!scheduleView.classList.contains('active')) return;
      addSchedule();
    });
  }

  createDatePills();
  render();
});
