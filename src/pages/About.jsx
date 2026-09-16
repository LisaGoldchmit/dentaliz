import Breadcrumb from "../components/Breadcrumb.jsx";
import usePageTitle from "../utils/usePageTitle.js";

export default function About() {
  usePageTitle("אודות - DentaLizi");

  return (
    <>
      <Breadcrumb items={[{ label: "דף הבית", to: "/" }, { label: "אודות" }]} />

      <section className="hero">
        <h1>קצת עליי</h1>

        <p>היוש! אני ליזה, סטודנטית לרפואת שיניים באוניברסיטת תל אביב.</p>

        <p>
          במהלך מיוני הקבלה מצאתי את עצמי מלקטת חומרים מאינספור מקומות, מוציאה
          המון כסף על סימולציות שונות ובעיקר טובעת בחוסר ודאות מול שאלות שלא
          הכרתי. בדיוק מהתסכול הזה הקמתי את הפלטפורמה הזו כדי לתת לכם מענה מדויק,
          נוח, זמין ונגיש, היה לי כשאני עברתי את השלבים האלה.
        </p>

        <p>
          האתר מרכז עבורכם את כל מה שצריך לתרגול ולסימולציות במקום אחד, כדי שלא
          תצטרכו לחפש יותר.
        </p>

        <p>בהצלחה לכולם !</p>
      </section>
    </>
  );
}
