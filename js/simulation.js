// DentaLizi - סימולציה מלאה (מתמטיקה + כימיה, בתנאי זמן)

(function () {
  const MATH_COUNT = 20;
  const MATH_SECONDS = 60 * 60; // שעה אחת
  const CHEM_COUNT = 30;
  const CHEM_SECONDS = 90 * 60; // שעה וחצי

  function selectBalanced(subject, count) {
    const topics = window.TOPICS[subject].topics;
    const pools = topics.map(function (t) {
      return window.QuizEngine.shuffleArray(window.getTopicQuestions(subject, t.key));
    });
    const selected = [];
    let i = 0;
    let guard = 0;
    while (selected.length < count && guard < count * 20) {
      const pool = pools[i % pools.length];
      if (pool.length > 0) {
        selected.push(pool.shift());
      }
      i++;
      guard++;
      if (pools.every(function (p) { return p.length === 0; })) break;
    }
    return window.QuizEngine.shuffleArray(selected.slice(0, count));
  }

  document.addEventListener("DOMContentLoaded", function () {
    const introEl = document.getElementById("sim-intro");
    const containerEl = document.getElementById("sim-container");

    const state = {
      order: ["math", "chemistry"],
      partIndex: 0,
      questions: { math: [], chemistry: [] },
      answers: { math: [], chemistry: [] },
      timeUp: { math: false, chemistry: false }
    };

    const PART_META = {
      math: { label: "מתמטיקה", icon: "📐", count: MATH_COUNT, seconds: MATH_SECONDS },
      chemistry: { label: "כימיה", icon: "🧪", count: CHEM_COUNT, seconds: CHEM_SECONDS }
    };

    function startSimulation(order) {
      state.order = order;
      state.partIndex = 0;
      state.questions.math = selectBalanced("math", MATH_COUNT);
      state.questions.chemistry = selectBalanced("chemistry", CHEM_COUNT);
      introEl.hidden = true;
      containerEl.hidden = false;
      runPartTransition();
    }

    function runPartTransition() {
      const subject = state.order[state.partIndex];
      const meta = PART_META[subject];
      const isFirst = state.partIndex === 0;

      let html = '<div class="hero">';
      html += "<h2>" + meta.icon + " חלק " + (state.partIndex + 1) + ": " + meta.label + "</h2>";
      html += "<p>חלק זה כולל " + meta.count + " שאלות, עם טיימר של " +
        (meta.seconds >= 3600 ? meta.seconds / 3600 : meta.seconds / 60) +
        (meta.seconds >= 3600 ? " שעות" : " דקות") +
        ". ניתן לנווט בין השאלות בחופשיות ולהגיש בכל שלב - הבחינה תוגש אוטומטית כשהזמן ייגמר.</p>";
      html += "<div class='btn-row'><button type='button' class='btn' id='sim-start-part'>" +
        (isFirst ? "התחלת החלק" : "המשך לחלק הבא") +
        "</button></div>";
      html += "</div>";

      containerEl.innerHTML = html;
      document.getElementById("sim-start-part").addEventListener("click", runPart);
      containerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function runPart() {
      const subject = state.order[state.partIndex];
      const meta = PART_META[subject];
      containerEl.innerHTML = "";

      new window.QuizEngine.Quiz({
        container: containerEl,
        questions: state.questions[subject],
        mode: "exam",
        timerSeconds: meta.seconds,
        title: meta.icon + " " + meta.label + " - סימולציה",
        onFinish: function (score, answers, timeUp) {
          state.answers[subject] = answers;
          state.timeUp[subject] = timeUp;
          if (state.partIndex < state.order.length - 1) {
            state.partIndex++;
            runPartTransition();
          } else {
            showFinalResults();
          }
        }
      });
      containerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function showFinalResults() {
      const mathQs = state.questions.math;
      const chemQs = state.questions.chemistry;
      const mathAns = state.answers.math;
      const chemAns = state.answers.chemistry;

      let mathCorrect = 0;
      mathQs.forEach(function (q, i) {
        if (mathAns[i] === q.correctIndex) mathCorrect++;
      });
      let chemCorrect = 0;
      chemQs.forEach(function (q, i) {
        if (chemAns[i] === q.correctIndex) chemCorrect++;
      });

      const totalCorrect = mathCorrect + chemCorrect;
      const totalCount = mathQs.length + chemQs.length;
      const percent = Math.round((totalCorrect / totalCount) * 100);

      let html = "";
      html += '<div class="results-summary">';
      html += "<h2>תוצאות הסימולציה המלאה</h2>";
      html += '<div class="results-score">' + totalCorrect + " / " + totalCount + "</div>";
      html += '<div class="results-percent">ציון כולל: ' + percent + "%</div>";
      html +=
        '<p class="results-percent">מתמטיקה: ' +
        mathCorrect +
        " / " +
        mathQs.length +
        " &middot; כימיה: " +
        chemCorrect +
        " / " +
        chemQs.length +
        "</p>";
      html += "</div>";
      containerEl.innerHTML = html;

      const mathReviewWrap = document.createElement("div");
      const mathHeading = document.createElement("h3");
      mathHeading.textContent = "📐 סקירת חלק המתמטיקה";
      containerEl.appendChild(mathHeading);
      containerEl.appendChild(mathReviewWrap);
      window.QuizEngine.renderResults(mathReviewWrap, mathQs, mathAns, {
        title: "",
        homeHref: "index.html"
      });
      // מסתירים את סיכום הציון הפנימי הכפול ואת כפתורי הניווט בתוך בלוק הביניים
      const innerSummary = mathReviewWrap.querySelector(".results-summary");
      if (innerSummary) innerSummary.remove();
      const innerBtnRow = mathReviewWrap.querySelector(".btn-row");
      if (innerBtnRow) innerBtnRow.remove();

      const chemHeading = document.createElement("h3");
      chemHeading.textContent = "🧪 סקירת חלק הכימיה";
      const chemReviewWrap = document.createElement("div");
      containerEl.appendChild(chemHeading);
      containerEl.appendChild(chemReviewWrap);
      window.QuizEngine.renderResults(chemReviewWrap, chemQs, chemAns, {
        title: "",
        homeHref: "index.html"
      });
      const innerSummary2 = chemReviewWrap.querySelector(".results-summary");
      if (innerSummary2) innerSummary2.remove();

      containerEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.getElementById("sim-start-math-first").addEventListener("click", function () {
      startSimulation(["math", "chemistry"]);
    });
    document.getElementById("sim-start-chem-first").addEventListener("click", function () {
      startSimulation(["chemistry", "math"]);
    });
  });
})();
