import { useEffect, useRef, useState } from "react";
import { HEBREW_LETTERS, formatTime, countCorrect } from "../utils/quiz.js";

/**
 * Quiz - שאלון גנרי.
 *   mode: 'practice' (משוב מיידי אחרי כל תשובה) | 'exam' (ללא משוב עד הגשה)
 *   timerSeconds: שניות לטיימר, או null ללא טיימר
 *   onFinish(score, answers, timeUp)
 */
export default function Quiz({
  questions,
  mode = "practice",
  timerSeconds = null,
  title = "",
  onFinish
}) {
  const total = questions.length;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(() => Array(total).fill(null));
  const [locked, setLocked] = useState(() => Array(total).fill(false));
  const [solutionShown, setSolutionShown] = useState(() => Array(total).fill(false));
  const [remaining, setRemaining] = useState(timerSeconds);

  const finishedRef = useRef(false);
  const finishRef = useRef(null);

  // מתעדכן אחרי כל רינדור, כך שהטיימר תמיד מסיים עם התשובות העדכניות
  useEffect(() => {
    finishRef.current = (timeUp) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinish({ correct: countCorrect(questions, answers), total }, answers, !!timeUp);
    };
  });

  useEffect(() => {
    if (!timerSeconds) return undefined;
    const id = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [timerSeconds]);

  useEffect(() => {
    if (timerSeconds && remaining === 0) finishRef.current(true);
  }, [remaining, timerSeconds]);

  const q = questions[current];
  const userAnswer = answers[current];
  const isLocked = mode === "practice" && locked[current];
  const answeredCount = answers.filter((a) => a !== null).length;

  function setAt(setter, index, value) {
    setter((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function selectAnswer(idx) {
    if (isLocked) return;
    setAt(setAnswers, current, idx);
    if (mode === "practice") setAt(setLocked, current, true);
  }

  function handleFinish() {
    if (mode === "exam") {
      const unanswered = total - answeredCount;
      let msg = "האם להגיש את הבחינה?";
      if (unanswered > 0) msg = `יש ${unanswered} שאלות ללא מענה. ${msg}`;
      if (!window.confirm(msg)) return;
    }
    finishRef.current(false);
  }

  return (
    <>
      <div className="quiz-header">
        <div>
          <div className="quiz-title">{title}</div>
          <div className="quiz-progress">
            שאלה {current + 1} מתוך {total} &middot; נענו {answeredCount}
          </div>
        </div>
        {timerSeconds ? (
          <div className={`quiz-timer${remaining <= 60 ? " quiz-timer--danger" : ""}`}>
            {formatTime(remaining)}
          </div>
        ) : null}
      </div>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.round(((current + 1) / total) * 100)}%` }}
        />
      </div>

      {mode === "exam" ? (
        <div className="jump-grid">
          {questions.map((question, i) => (
            <button
              key={question.id}
              type="button"
              className={`jump-btn${i === current ? " current" : ""}${
                answers[i] !== null ? " answered" : ""
              }`}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      ) : null}

      <div className="question-card">
        <p className="question-text">{q.question}</p>
        <div className="choices-list">
          {q.choices.map((choiceText, idx) => {
            let cls = "choice-btn";
            if (userAnswer === idx) cls += " selected";
            if (isLocked) {
              if (idx === q.correctIndex) cls += " correct";
              else if (idx === userAnswer) cls += " wrong";
            }
            return (
              <button
                key={idx}
                type="button"
                className={cls}
                disabled={isLocked}
                onClick={() => selectAnswer(idx)}
              >
                <span className="choice-letter">{HEBREW_LETTERS[idx] || idx + 1}</span>
                <span>{choiceText}</span>
              </button>
            );
          })}
        </div>

        {isLocked ? (
          <>
            <div className={`feedback-msg ${userAnswer === q.correctIndex ? "correct" : "wrong"}`}>
              {userAnswer === q.correctIndex
                ? "תשובה נכונה! כל הכבוד."
                : "תשובה שגויה. אפשר לראות את הפתרון המלא למטה."}
            </div>
            {solutionShown[current] ? (
              <div className="solution-box">
                <h4>פתרון מלא</h4>
                {q.solution}
              </div>
            ) : (
              <div className="btn-row">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setAt(setSolutionShown, current, true)}
                >
                  הצג פתרון מלא
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>

      <div className="btn-row">
        <button
          type="button"
          className="btn secondary"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          {mode === "practice" ? "השאלה הקודמת" : "הקודם"}
        </button>

        {mode === "practice" ? (
          current < total - 1 ? (
            <button type="button" className="btn" onClick={() => setCurrent((c) => c + 1)}>
              השאלה הבאה
            </button>
          ) : (
            <button type="button" className="btn" onClick={handleFinish}>
              סיום התרגול וצפייה בתוצאה
            </button>
          )
        ) : (
          <>
            <button
              type="button"
              className="btn secondary"
              disabled={current === total - 1}
              onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            >
              הבא
            </button>
            <button type="button" className="btn" onClick={handleFinish}>
              הגשת הבחינה
            </button>
          </>
        )}
      </div>
    </>
  );
}
