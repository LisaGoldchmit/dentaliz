// DentaLizi - מטא-דאטה של הנושאים בכל מקצוע + גישה לבנקי השאלות

import { questions as wordProblems } from "./math/word-problems.js";
import { questions as growthDecay } from "./math/growth-decay.js";
import { questions as sequences } from "./math/sequences.js";
import { questions as probability } from "./math/probability.js";
import { questions as geometry } from "./math/geometry.js";
import { questions as analyticGeometry } from "./math/analytic-geometry.js";
import { questions as trigonometry } from "./math/trigonometry.js";
import { questions as calculus } from "./math/calculus.js";

import { questions as atomPeriodic } from "./chemistry/atom-periodic.js";
import { questions as bonding } from "./chemistry/bonding.js";
import { questions as materials } from "./chemistry/materials.js";
import { questions as stoichiometry } from "./chemistry/stoichiometry.js";
import { questions as energy } from "./chemistry/energy.js";
import { questions as redox } from "./chemistry/redox.js";
import { questions as acidBase } from "./chemistry/acid-base.js";
import { questions as organicFood } from "./chemistry/organic-food.js";

export const TOPICS = {
  math: {
    label: "מתמטיקה",
    icon: "📐",
    topics: [
      { key: "word-problems", label: "בעיות מילוליות" },
      { key: "growth-decay", label: "גדילה ודעיכה מעריכית" },
      { key: "sequences", label: "סדרות" },
      { key: "probability", label: "הסתברות" },
      { key: "geometry", label: "גיאומטריה" },
      { key: "analytic-geometry", label: "גיאומטריה אנליטית" },
      { key: "trigonometry", label: "טריגונומטריה" },
      { key: "calculus", label: "חשבון דיפרנציאלי ואינטגרלי" }
    ]
  },
  chemistry: {
    label: "כימיה",
    icon: "🧪",
    topics: [
      { key: "atom-periodic", label: "מבנה האטום והטבלה המחזורית" },
      { key: "bonding", label: "קשר כימי ומבנה מולקולות" },
      { key: "materials", label: "סוגי חומרים ותכונותיהם" },
      { key: "stoichiometry", label: "סטוכיומטריה וחישובים בכימיה" },
      { key: "energy", label: "אנרגיה בתגובות כימיות" },
      { key: "redox", label: "חמצון חיזור וקורוזיה" },
      { key: "acid-base", label: "חומצה בסיס" },
      { key: "organic-food", label: "כימיה אורגנית וכימיה של מזון" }
    ]
  }
};

export const QUESTION_BANKS = {
  math: {
    "word-problems": wordProblems,
    "growth-decay": growthDecay,
    sequences,
    probability,
    geometry,
    "analytic-geometry": analyticGeometry,
    trigonometry,
    calculus
  },
  chemistry: {
    "atom-periodic": atomPeriodic,
    bonding,
    materials,
    stoichiometry,
    energy,
    redox,
    "acid-base": acidBase,
    "organic-food": organicFood
  }
};

// כל השאלות של מקצוע (math / chemistry), משורשרות מכל הנושאים
export function getAllQuestions(subject) {
  const banks = QUESTION_BANKS[subject];
  if (!banks) return [];
  return TOPICS[subject].topics.reduce(
    (all, t) => all.concat(banks[t.key] || []),
    []
  );
}

// השאלות של נושא ספציפי
export function getTopicQuestions(subject, topicKey) {
  const banks = QUESTION_BANKS[subject];
  if (!banks) return [];
  return banks[topicKey] || [];
}

// התווית (בעברית) של נושא
export function getTopicLabel(subject, topicKey) {
  const subj = TOPICS[subject];
  if (!subj) return "";
  const found = subj.topics.find((t) => t.key === topicKey);
  return found ? found.label : "";
}
