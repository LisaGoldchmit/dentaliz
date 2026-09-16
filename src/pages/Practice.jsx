import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb.jsx";
import Quiz from "../components/Quiz.jsx";
import ResultsReview from "../components/ResultsReview.jsx";
import usePageTitle from "../utils/usePageTitle.js";
import { TOPICS, getAllQuestions, getTopicQuestions, getTopicLabel } from "../data/topics.js";
import { shuffleArray } from "../utils/quiz.js";

export default function Practice() {
  const { subject, topic } = useParams();
  // כל "סבב" מקבל מזהה חדש, כדי לערבב מחדש ולאפס את מצב השאלון בתרגול חוזר
  const [runId, setRunId] = useState(0);
  const [result, setResult] = useState(null);

  const subjectInfo = TOPICS[subject];
  const isShuffle = topic === "shuffle";
  const topicLabel = isShuffle ? "" : getTopicLabel(subject, topic);

  const title = subjectInfo
    ? `${subjectInfo.icon} ${isShuffle ? `${subjectInfo.label} - מצב ערבוב` : topicLabel}`
    : "";

  usePageTitle(title ? `${title} - DentaLizi` : "תרגול - DentaLizi");

  const questions = useMemo(() => {
    if (!subjectInfo) return [];
    return isShuffle
      ? shuffleArray(getAllQuestions(subject))
      : getTopicQuestions(subject, topic);
    // runId נכלל בכוונה: תרגול חוזר מייצר סדר ערבוב חדש
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, topic, isShuffle, subjectInfo, runId]);

  if (!subjectInfo) {
    return <p>לא נבחר נושא תקין. חזרו לדף הבית ובחרו נושא לתרגול.</p>;
  }

  if (!isShuffle && !topicLabel) {
    return <p>נושא לא נמצא. חזרו לדף הבית ובחרו נושא לתרגול.</p>;
  }

  if (questions.length === 0) {
    return <p>לא נמצאו שאלות עבור נושא זה.</p>;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "דף הבית", to: "/" },
          { label: subjectInfo.label, to: `/${subject}` },
          { label: "תרגול" }
        ]}
      />
      <h1 style={{ color: "var(--color-accent)", marginTop: 0 }}>{title}</h1>

      {result ? (
        <ResultsReview
          questions={questions}
          answers={result.answers}
          title="סיימת את התרגול!"
          extraNote={`ענית נכון על ${result.score.correct} מתוך ${result.score.total} שאלות.`}
          onRestartLabel="תרגול נוסף (סדר חדש)"
          onRestart={() => {
            setResult(null);
            setRunId((id) => id + 1);
          }}
        />
      ) : (
        <Quiz
          key={runId}
          questions={questions}
          mode="practice"
          title={title}
          onFinish={(score, answers) => setResult({ score, answers })}
        />
      )}
    </>
  );
}
