// DentaLiz - מטא-דאטה של הנושאים בכל מקצוע
// נטען לפני קבצי הנתונים ולפני שאר קבצי ה-JS של האתר

window.TOPICS = {
  math: {
    label: "מתמטיקה",
    icon: "📐",
    topics: [
      { key: "rate", label: "בעיות הספק" },
      { key: "geometry", label: "גיאומטריה" },
      { key: "motion", label: "בעיות תנועה" },
      { key: "probability", label: "הסתברות" }
    ]
  },
  chemistry: {
    label: "כימיה",
    icon: "🧪",
    topics: [
      { key: "stoichiometry", label: "סטוכיומטריה" },
      { key: "bonding", label: "מבנה וקישור" },
      { key: "redox", label: "חמצון חיזור" },
      { key: "energy", label: "אנרגיה" }
    ]
  }
};

// מחזיר את כל השאלות של מקצוע (math / chemistry), משורשרות מכל הנושאים
window.getAllQuestions = function (subject) {
  const banks = window.QUESTION_BANKS && window.QUESTION_BANKS[subject];
  if (!banks) return [];
  let all = [];
  window.TOPICS[subject].topics.forEach(function (t) {
    const qs = banks[t.key] || [];
    all = all.concat(qs);
  });
  return all;
};

// מחזיר את השאלות של נושא ספציפי
window.getTopicQuestions = function (subject, topicKey) {
  const banks = window.QUESTION_BANKS && window.QUESTION_BANKS[subject];
  if (!banks) return [];
  return banks[topicKey] || [];
};

// מחזיר את התווית (בעברית) של נושא
window.getTopicLabel = function (subject, topicKey) {
  const subj = window.TOPICS[subject];
  if (!subj) return "";
  const found = subj.topics.find(function (t) { return t.key === topicKey; });
  return found ? found.label : "";
};
