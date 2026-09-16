import { Link } from "react-router-dom";
import { HEBREW_LETTERS, countCorrect } from "../utils/quiz.js";

/**
 * ResultsReview - מסך תוצאות + סקירת שאלות עם פתרון מלא.
 * showSummary/showActions מאפשרים להטמיע את הסקירה בתוך מסך תוצאות גדול יותר
 * (כמו בסימולציה המלאה), בלי לשכפל את סיכום הציון או את כפתורי הניווט.
 */
export default function ResultsReview({
  questions,
  answers,
  title = "התוצאות שלך",
  extraNote = "",
  reviewHeading = "סקירת שאלות ופתרונות",
  onRestart,
  onRestartLabel,
  showSummary = true,
  showActions = true
}) {
  const total = questions.length;
  const correct = countCorrect(questions, answers);
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <>
      {showSummary ? (
        <div className="results-summary">
          <h2>{title}</h2>
          <div className="results-score">
            {correct} / {total}
          </div>
          <div className="results-percent">ציון: {percent}%</div>
          {extraNote ? <p className="results-percent">{extraNote}</p> : null}
        </div>
      ) : null}

      <h3>{reviewHeading}</h3>

      {questions.map((q, i) => {
        const userIdx = answers[i];
        const wasAnswered = userIdx !== null && userIdx !== undefined;
        const wasCorrect = userIdx === q.correctIndex;
        const tagClass = wasAnswered ? (wasCorrect ? "correct" : "wrong") : "unanswered";
        const tagText = wasAnswered ? (wasCorrect ? "נכון" : "שגוי") : "לא נענתה";

        return (
          <div className="review-item" key={q.id}>
            <span className={`review-tag ${tagClass}`}>{tagText}</span>
            <p className="question-text">
              {i + 1}. {q.question}
            </p>
            <div className="choices-list">
              {q.choices.map((choiceText, idx) => {
                let cls = "choice-btn";
                if (idx === q.correctIndex) cls += " correct";
                else if (idx === userIdx) cls += " wrong";
                return (
                  <div className={cls} key={idx}>
                    <span className="choice-letter">{HEBREW_LETTERS[idx] || idx + 1}</span>
                    <span>{choiceText}</span>
                  </div>
                );
              })}
            </div>
            <div className="solution-box">
              <h4>פתרון מלא</h4>
              {q.solution}
            </div>
          </div>
        );
      })}

      {showActions ? (
        <div className="btn-row">
          {onRestart && onRestartLabel ? (
            <button type="button" className="btn" onClick={onRestart}>
              {onRestartLabel}
            </button>
          ) : null}
          <Link className="btn secondary" to="/">
            חזרה לדף הבית
          </Link>
        </div>
      ) : null}
    </>
  );
}
