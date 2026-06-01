// Mark today as active in the streak calendar
export const markActivity = () => {
  const today = new Date().toDateString();
  localStorage.setItem(`ff-activity-${today}`, '1');
  updateStreak();
};

const updateStreak = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toDateString();

  const hadYesterday = localStorage.getItem(`ff-activity-${yKey}`) === '1';
  const current = parseInt(localStorage.getItem('ff-streak') || '0');

  if (hadYesterday) {
    localStorage.setItem('ff-streak', current + 1);
  } else {
    localStorage.setItem('ff-streak', 1); // reset streak
  }
};

// Cache tasks for profile stats
export const cacheTasks = (tasks) => {
  localStorage.setItem('ff-tasks-cache', JSON.stringify(tasks));
};