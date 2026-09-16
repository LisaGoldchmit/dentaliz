import { Link } from "react-router-dom";
import usePageTitle from "../utils/usePageTitle.js";

export default function Home() {
  usePageTitle("DentaLizi - הדרך שלך לרפואת שיניים");

  return (
    <>
      <section className="hero">
        <h1>ברוכים הבאים לדנטליזי !</h1>
        <p>
          אתר המיועד למועמדים ללימודי רפואת שיניים באוניברסיטת תל אביב. מעניק לכם
          את המעטפה המושלמת לקראת מבחן הידע בכימיה ומתמטיקה.
        </p>
        <p>
          באתר תוכלו למצוא תרגול ממוקד לפי נושאים, מצבי תרגול אקראיים וסימולציות
          מלאות על זמן המדמות בדיוק את תנאי האמת של מבחן הידע.
        </p>
        <div className="btn-row">
          <Link className="btn" to="/math">
            התחילו לתרגל
          </Link>
        </div>
      </section>

      <section className="about-teaser">
        <div className="about-teaser-text">
          <h2>מי מאחורי האתר</h2>
          <p>
            היוש! אני ליזה, סטודנטית לרפואת שיניים באוניברסיטת תל אביב. האתר מרכז
            עבורכם את כל מה שצריך לתרגול ולסימולציות במקום אחד, כדי שלא תצטרכו
            לחפש יותר.
          </p>
          <Link className="btn secondary" to="/about">
            עוד עליי »
          </Link>
        </div>
      </section>

      <section className="cta-section">
        <h2>בואו נתחיל</h2>
        <div className="section-grid">
          <Link className="card" to="/math">
            <h3>מתמטיקה</h3>
            <p>
              בעיות מילוליות, סדרות, הסתברות, גיאומטריה, טריגונומטריה, חדו"א ועוד -
              עם תרגול לפי נושא ומצב ערבוב.
            </p>
            <span className="card-count">8 נושאים &middot; 80 שאלות</span>
          </Link>

          <Link className="card" to="/chemistry">
            <h3>כימיה</h3>
            <p>
              מבנה האטום, קשר כימי, סוגי חומרים, סטוכיומטריה, אנרגיה, חמצון חיזור,
              חומצה בסיס וכימיה אורגנית - עם תרגול לפי נושא ומצב ערבוב.
            </p>
            <span className="card-count">8 נושאים &middot; 80 שאלות</span>
          </Link>

          <Link className="card" to="/simulation">
            <h3>סימולציה מלאה</h3>
            <p>
              בחינה מלאה בתנאי זמן אמיתיים: 20 שאלות מתמטיקה (שעה) ו-30 שאלות כימיה
              (שעה וחצי).
            </p>
            <span className="card-count">מומלץ לקראת המבחן האמיתי</span>
          </Link>
        </div>
      </section>
    </>
  );
}
