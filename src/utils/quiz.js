// DentaLizi - עזרים משותפים לשאלונים

export const HEBREW_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו"];

// מחזיר עותק מעורבב (Fisher-Yates) - לא משנה את המערך המקורי
export function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${String(h).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function countCorrect(questions, answers) {
  return questions.reduce(
    (n, q, i) => n + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );
}
