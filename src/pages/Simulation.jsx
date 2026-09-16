import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../components/Breadcrumb.jsx";
import Quiz from "../components/Quiz.jsx";
import ResultsReview from "../components/ResultsReview.jsx";
import usePageTitle from "../utils/usePageTitle.js";
import { SIMULATIONS } from "../data/simulations/index.js";
import { countCorrect } from "../utils/quiz.js";

const PART_META = {
  math: { label: "מתמטיקה", icon: "📐", seconds: 60 * 60 },
  chemistry: { label: "כימיה", icon: "🧪", seconds: 90 * 60 }
};

export default function Simulation() {
  usePageTitle("סימולציה מלאה - DentaLizi");

  const [phase, setPhase] = useState("intro");
  const [sim, setSim] = useState(null);
  const [order, setOrder] = useState(["math", "chemistry"]);
  const [partIndex, setPartIndex] = useState(0);
  const [answers, setAnswers] = useState({ math: [], chemistry: [] });
  const containerRef = useRef(null);

  useEffect(() => {
    if (phase !== "intro" && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [phase, partIndex]);

  function pickSimulation(selected) {
    setSim(selected);
    setPartIndex(0);
    setAnswers({ math: [], chemistry: [] });
    setPhase("chooseOrder");
  }

  function startWith(partOrder) {
    setOrder(partOrder);
    setPartIndex(0);
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
  const partQuestions = sim ? sim[subject] : [];

  return (
    <>
      <Breadcrumb items={[{ label: "דף הבית", to: "/" }, { label: "סימולציה מלאה" }]} />

      {phase === "intro" ? (
        <div>
          <section className="hero">
            <h1>⏱️ סימולציה מלאה</h1>
            <p>
              כל סימולציה היא מבחן שלם וקבוע, שמדמה את מבנה מבחן הידע: חלק מתמטיקה
              וחלק כימיה, כל אחד בתנאי זמן אמיתיים. השאלות בסימולציות אינן מופיעות
              בתרגול לפי נושאים, כך שאפשר לתרגל ואז להיבחן על חומר חדש.
            </p>
            <p>
              במהלך כל חלק לא יוצג משוב מיידי על התשובות - בדיוק כמו במבחן אמיתי -
              ותוכלו לראות את הציון המלא ואת הפתרונות המפורטים רק בסיום שני החלקים.
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

          <h2>בחרו סימולציה</h2>
          {SIMULATIONS.length === 0 ? <p>אין כרגע סימולציות זמינות.</p> : null}
          <div className="topic-list">
            {SIMULATIONS.map((s) => (
              <button
                type="button"
                className="card sim-card"
                key={s.id}
                onClick={() => pickSimulation(s)}
              >
                <h3>{s.label}</h3>
                <span className="card-count">
                  {s.math.length + s.chemistry.length} שאלות
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div ref={containerRef}>
        {phase === "chooseOrder" && sim ? (
          <div className="hero">
            <h2>{sim.label}</h2>
            <p>
              באיזה חלק תרצו להתחיל? שני החלקים ירוצו ברצף באותה סימולציה, ובסיום
              תוצג טבלת ציונים מלאה עם הפתרון המלא לכל שאלה.
            </p>
            <div className="btn-row">
              <button
                type="button"
                className="btn"
                onClick={() => startWith(["math", "chemistry"])}
              >
                התחלה עם מתמטיקה
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={() => startWith(["chemistry", "math"])}
              >
                התחלה עם כימיה
              </button>
            </div>
          </div>
        ) : null}

        {phase === "transition" ? (
          <div className="hero">
            <h2>
              {meta.icon} חלק {partIndex + 1}: {meta.label}
            </h2>
            <p>
              חלק זה כולל {partQuestions.length} שאלות, עם טיימר של{" "}
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
            key={`${sim.id}-${subject}`}
            questions={partQuestions}
            mode="exam"
            timerSeconds={meta.seconds}
            title={`${meta.icon} ${meta.label} - ${sim.label}`}
            onFinish={(score, partAnswers) => handlePartFinish(subject, partAnswers)}
          />
        ) : null}

        {phase === "results" ? <FinalResults sim={sim} answers={answers} /> : null}
      </div>
    </>
  );
}

function FinalResults({ sim, answers }) {
  const mathCorrect = countCorrect(sim.math, answers.math);
  const chemCorrect = countCorrect(sim.chemistry, answers.chemistry);
  const totalCorrect = mathCorrect + chemCorrect;
  const totalCount = sim.math.length + sim.chemistry.length;
  const percent = totalCount > 0 ? Math.round((totalCorrect / totalCount) * 100) : 0;

  return (
    <>
      <div className="results-summary">
        <h2>תוצאות {sim.label}</h2>
        <div className="results-score">
          {totalCorrect} / {totalCount}
        </div>
        <div className="results-percent">ציון כולל: {percent}%</div>
        <p className="results-percent">
          מתמטיקה: {mathCorrect} / {sim.math.length} &middot; כימיה: {chemCorrect} /{" "}
          {sim.chemistry.length}
        </p>
      </div>

      <ResultsReview
        questions={sim.math}
        answers={answers.math}
        reviewHeading="📐 סקירת חלק המתמטיקה"
        showSummary={false}
        showActions={false}
      />

      <ResultsReview
        questions={sim.chemistry}
        answers={answers.chemistry}
        reviewHeading="🧪 סקירת חלק הכימיה"
        showSummary={false}
      />
    </>
  );
}
