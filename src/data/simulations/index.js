// DentaLizi - סימולציות מלאות קבועות
// כל סימולציה היא מבחן שלם וקבוע (אותן שאלות בכל פעם), עם שאלות שאינן מופיעות
// בבנקי התרגול לפי נושא.
//
// הקבצים נטענים אוטומטית לפי התבנית sim-*.js, ממוינים לפי שם הקובץ. כדי להוסיף
// סימולציה חדשה מספיק ליצור קובץ חדש בתיקייה הזו - אין צורך לערוך קובץ זה.

const modules = import.meta.glob("./sim-*.js", { eager: true });

export const SIMULATIONS = Object.keys(modules)
  .sort()
  .map((path) => modules[path].simulation)
  .filter(Boolean);

export function getSimulation(id) {
  return SIMULATIONS.find((s) => s.id === id) || null;
}
