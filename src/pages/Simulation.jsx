import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import Quiz from "../components/Quiz.jsx";
import ResultsReview from "../components/ResultsReview.jsx";
import usePageTitle from "../utils/usePageTitle.js";
import { TOPICS, getTopicQuestions } from "../data/topics.js";
import { shuffleArray, countCorrect } from "../utils/quiz.js";

const PART_META = {
  math: { label: "מתמטיקה", icon: "📐", count: 20, seconds: 60 * 60 },
  chemistry: { label: "כימיה", icon: "🧪", count: 30, seconds: 90 * 60 }
};

// בוחר שאלות בפיזור מאוזן בין הנושאים. סדר הנושאים מעורבב בכל הרצה, כך
// שכאשר הכמות אינה מתחלקת שווה בשווה, הנושא שמקבל שאלה "נוספת" משתנה.
function selectBalanced(subject, count) {
  const topics = shuffleArray(TOPICS[subject].topics);
  const pools = topics.map((t) => shuffleArray(getTopicQuestions(subject, t.key)));
  const selected = [];
  let i = 0;
  while (selected.length < count) {
    if (pools.every((p) => p.length === 0)) break;
    const pool = pools[i % pools.length];
    if (pool.length > 0) selected.push(pool.shift());
    i++;
  }
  return shuffleArray(selected.slice(0, count));
}

export default function Simulation() {
  usePageTitle("סימולציה מלאה - DentaLizi");

  const [phase, setPhase] = useState("intro");
  const [order, setOrder] = useState(["math", "chemistry"]);
  const [partIndex, setPartIndex] = useState(0);
  const [questions, setQuestions] = useState({ math: [], chemistry: [] });
  const [answers, setAnswers] = useState({ math: [], chemistry: [] });
  const containerRef = useRef(null);

  useEffect(() => {
    if (phase !== "intro" && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [phase, partIndex]);

  function startSimulation(partOrder) {
    setOrder(partOrder);
    setPartIndex(0);
    setQuestions({
      math: selectBalanced("math", PART_META.math.count),
      chemistry: selectBalanced("chemistry", PART_META.chemistry.count)
    });
    setAnswers({ math: [], chemistry: [] });
    setPhase("transition");
  }

  function handlePartFinish(subject, partAnswers) {
    setAnswers((prev) => ({ ...prev, [subject]: partAnswers }));
    if (partIndex < order.length - 1) {
      setPartIndex((i) => i + 1);
      setPhase("transition");
    } else {
      setPhase("results");
    }
  }

  const subject = order[partIndex];
  const meta = PART_META[subject];

  return (
    <>
      <Breadcrumb
        items={[{ label: "דף הבית", to: "/" }, { label: "סימולציה מלאה" }]}
      />

      {phase === "intro" ? (
        <div>
          <section className="hero">
            <h1>⏱️ סימולציה מלאה</h1>
            <p>
              סימולציה זו מדמה את מבנה מבחן הקבלה: חלק מתמטיקה וחלק כימיה, כל אחד
              בתנאי זמן אמיתיים. במהלך כל חלק לא יוצג משוב מיידי על התשובות - בדיוק
              כמו במבחן אמיתי - ותוכלו לראות את הציון המלא ואת הפתרונות המפורטים רק
              בסיום שני החלקים.
            </p>
          </section>

          <div className="sim-parts">
            <div className="sim-part">
              <h3>📐 חלק מתמטיקה</h3>
              <p>20 שאלות &middot; טיימר של שעה אחת (60 דקות)</p>
            </div>
            <div className="sim-part">
              <h3>🧪 חלק כימיה</h3>
              <p>30 שאלות &middot; טיימר של שעה וחצי (90 דקות)</p>
            </div>
          </div>

          <div className="info-box">
            טיפ: אפשר לבחור באיזה חלק להתחיל. שני החלקים ירוצו ברצף באותה סימולציה,
            ובסיום תוצג טבלת ציונים מלאה עם אפשרות לחזור על כל שאלה ולראות את
            הפתרון המלא שלה.
          </div>

          <div className="btn-row">
            <button
              type="button"
              className="btn"
              onClick={() => startSimulation(["math", "chemistry"])}
            >
              התחלה עם מתמטיקה
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={() => startSimulation(["chemistry", "math"])}
            >
              התחלה עם כימיה
            </button>
          </div>
        </div>
      ) : null}

      <div ref={containerRef}>
        {phase === "transition" ? (
          <div className="hero">
            <h2>
              {meta.icon} חלק {partIndex + 1}: {meta.label}
            </h2>
            <p>
              חלק זה כולל {meta.count} שאלות, עם טיימר של{" "}
              {meta.seconds >= 3600
                ? `${meta.seconds / 3600} שעות`
                : `${meta.seconds / 60} דקות`}
              . ניתן לנווט בין השאלות בחופשיות ולהגיש בכל שלב - הבחינה תוגש
              אוטומטית כשהזמן ייגמר.
            </p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => setPhase("part")}>
                {partIndex === 0 ? "התחלת החלק" : "המשך לחלק הבא"}
              </button>
            </div>
          </div>
        ) : null}

        {phase === "part" ? (
          <Quiz
            key={subject}
            questions={questions[subject]}
            mode="exam"
            timerSeconds={meta.seconds}
            title={`${meta.icon} ${meta.label} - סימולציה`}
            onFinish={(score, partAnswers) => handlePartFinish(subject, partAnswers)}
          />
        ) : null}

        {phase === "results" ? (
          <FinalResults questions={questions} answers={answers} />
        ) : null}
      </div>
    </>
  );
}

function FinalResults({ questions, answers }) {
  const mathCorrect = countCorrect(questions.math, answers.math);
  const chemCorrect = countCorrect(questions.chemistry, answers.chemistry);
  const totalCorrect = mathCorrect + chemCorrect;
  const totalCount = questions.math.length + questions.chemistry.length;
  const percent = totalCount > 0 ? Math.round((totalCorrect / totalCount) * 100) : 0;

  return (
    <>
      <div className="results-summary">
        <h2>תוצאות הסימולציה המלאה</h2>
        <div className="results-score">
          {totalCorrect} / {totalCount}
        </div>
        <div className="results-percent">ציון כולל: {percent}%</div>
        <p className="results-percent">
          מתמטיקה: {mathCorrect} / {questions.math.length} &middot; כימיה: {chemCorrect} /{" "}
          {questions.chemistry.length}
        </p>
      </div>

      <ResultsReview
        questions={questions.math}
        answers={answers.math}
        reviewHeading="📐 סקירת חלק המתמטיקה"
        showSummary={false}
        showActions={false}
      />

      <ResultsReview
        questions={questions.chemistry}
        answers={answers.chemistry}
        reviewHeading="🧪 סקירת חלק הכימיה"
        showSummary={false}
      />
    </>
  );
}
