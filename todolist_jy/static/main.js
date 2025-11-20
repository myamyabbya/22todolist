// static/main.js

document.addEventListener('DOMContentLoaded', () => {
  const scheduleBtn = document.getElementById('scheduleBtn');
  const memoBtn = document.getElementById('memoBtn');
  const scheduleView = document.getElementById('scheduleView');
  const memoView = document.getElementById('memoView');

  // 요소들 없으면 (다른 페이지) 그냥 종료
  if (!scheduleBtn || !memoBtn || !scheduleView || !memoView) return;

  scheduleBtn.addEventListener('click', () => {
    scheduleView.classList.add('active');
    memoView.classList.remove('active');
    scheduleBtn.classList.add('active');
    memoBtn.classList.remove('active');
  });

  memoBtn.addEventListener('click', () => {
    memoView.classList.add('active');
    scheduleView.classList.remove('active');
    memoBtn.classList.add('active');
    scheduleBtn.classList.remove('active');
  });
});
