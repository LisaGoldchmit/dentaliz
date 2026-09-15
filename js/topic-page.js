// DentaLiz - בניית עמוד בחירת נושא (מתמטיקה / כימיה)
// מצפה ש-window.TOPICS ו-window.QUESTION_BANKS כבר נטענו, ושלגוף הדף יש data-subject

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const subject = document.body.getAttribute("data-subject");
    const subjectInfo = window.TOPICS[subject];
    if (!subjectInfo) return;

    const titleEl = document.querySelector("[data-subject-title]");
    if (titleEl) titleEl.textContent = subjectInfo.icon + " " + subjectInfo.label;

    const listEl = document.querySelector("[data-topic-list]");
    if (!listEl) return;

    let html = "";
    subjectInfo.topics.forEach(function (t) {
      const count = (window.QUESTION_BANKS[subject] && window.QUESTION_BANKS[subject][t.key] || []).length;
      html +=
        '<a class="card" href="../practice.html?subject=' +
        encodeURIComponent(subject) +
        "&topic=" +
        encodeURIComponent(t.key) +
        '">' +
        "<h3>" + t.label + "</h3>" +
        "<p>תרגול ממוקד בנושא, עם פתרון מלא ומפורט לכל שאלה.</p>" +
        '<span class="card-count">' + count + " שאלות</span>" +
        "</a>";
    });

    const totalCount = window.getAllQuestions(subject).length;
    html +=
      '<a class="card shuffle-card" href="../practice.html?subject=' +
      encodeURIComponent(subject) +
      '&topic=shuffle">' +
      "<h3>🔀 מצב ערבוב</h3>" +
      "<p>תרגול מעורב הכולל שאלות אקראיות מכל הנושאים ב" + subjectInfo.label + ".</p>" +
      '<span class="card-count">' + totalCount + " שאלות בסך הכל</span>" +
      "</a>";

    listEl.innerHTML = html;
  });
})();
