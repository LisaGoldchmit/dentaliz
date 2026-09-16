import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb.jsx";
import usePageTitle from "../utils/usePageTitle.js";
import { TOPICS, getTopicQuestions, getAllQuestions } from "../data/topics.js";

export default function TopicPicker({ subject }) {
  const subjectInfo = TOPICS[subject];
  usePageTitle(`${subjectInfo.label} - DentaLizi`);

  const totalCount = getAllQuestions(subject).length;

  return (
    <>
      <Breadcrumb
        items={[{ label: "דף הבית", to: "/" }, { label: subjectInfo.label }]}
      />

      <section className="hero">
        <h1>
          {subjectInfo.icon} {subjectInfo.label}
        </h1>
        <p>
          בחרו נושא לתרגול ממוקד, או נסו את מצב הערבוב - תרגול מעורב הכולל שאלות
          אקראיות מכל הנושאים יחד. כל שאלה מלווה בפתרון מלא ומפורט.
        </p>
        <div className="btn-row">
          <Link className="btn" to={`/practice/${subject}/shuffle`}>
            🔀 מצב ערבוב &middot; {totalCount} שאלות
          </Link>
        </div>
      </section>

      <div className="topic-list">
        {subjectInfo.topics.map((t) => (
          <Link className="card" to={`/practice/${subject}/${t.key}`} key={t.key}>
            <h3>{t.label}</h3>
            <span className="card-count">
              {getTopicQuestions(subject, t.key).length} שאלות
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
