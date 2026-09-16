// DentaLizi - עמוד תרגול (לפי נושא או ערבוב)

(function () {
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const subject = getQueryParam("subject");
    const topic = getQueryParam("topic");
    const container = document.getElementById("quiz-container");
    const titleEl = document.getElementById("practice-title");
    const breadcrumbEl = document.getElementById("practice-breadcrumb");

    if (!subject || !window.TOPICS[subject]) {
      container.innerHTML = "<p>לא נבחר נושא תקין. חזרו לדף הבית ובחרו נושא לתרגול.</p>";
      return;
    }

    const subjectInfo = window.TOPICS[subject];
    const subjectHomeHref = subject + "/index.html";

    let questions;
    let title;

    if (topic === "shuffle") {
      questions = window.QuizEngine.shuffleArray(window.getAllQuestions(subject));
      title = subjectInfo.icon + " " + subjectInfo.label + " - מצב ערבוב";
    } else {
      questions = window.getTopicQuestions(subject, topic);
      const topicLabel = window.getTopicLabel(subject, topic);
      if (!topicLabel) {
        container.innerHTML = "<p>נושא לא נמצא. חזרו לדף הבית ובחרו נושא לתרגול.</p>";
        return;
      }
      title = subjectInfo.icon + " " + topicLabel;
    }

    document.title = title + " - DentaLizi";
    if (titleEl) titleEl.textContent = title;
    if (breadcrumbEl) {
      breadcrumbEl.innerHTML =
        '<a href="index.html">דף הבית</a> &laquo; <a href="' +
        subjectHomeHref +
        '">' +
        subjectInfo.label +
        "</a> &laquo; תרגול";
    }

    if (!questions || questions.length === 0) {
      container.innerHTML = "<p>לא נמצאו שאלות עבור נושא זה.</p>";
      return;
    }

    function startQuiz() {
      container.innerHTML = "";
      new window.QuizEngine.Quiz({
        container: container,
        questions: questions,
        mode: "practice",
        title: title,
        onFinish: function (score, answers) {
          window.QuizEngine.renderResults(container, questions, answers, {
            title: "סיימת את התרגול!",
            extraNote: "ענית נכון על " + score.correct + " מתוך " + score.total + " שאלות.",
            onRestartLabel: "תרגול נוסף (סדר חדש)",
            homeHref: "index.html",
            onRestart: function () {
              questions =
                topic === "shuffle"
                  ? window.QuizEngine.shuffleArray(window.getAllQuestions(subject))
                  : window.getTopicQuestions(subject, topic);
              startQuiz();
            }
          });
          container.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    startQuiz();
  });
})();
