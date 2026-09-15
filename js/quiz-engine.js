// DentaLiz - מנוע השאלונים (תרגול + סימולציה)
// אין תלות בספריות חיצוניות - JS טהור

(function () {
  const HEBREW_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו"];

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function formatTime(totalSeconds) {
    const safe = Math.max(0, totalSeconds);
    const h = Math.floor(safe / 3600);
    const m = Math.floor((safe % 3600) / 60);
    const s = safe % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    if (h > 0) {
      return String(h).padStart(2, "0") + ":" + mm + ":" + ss;
    }
    return mm + ":" + ss;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /**
   * Quiz - רכיב שאלון גנרי.
   * options:
   *   container: אלמנט DOM שבו יוצג השאלון
   *   questions: מערך שאלות {id, question, choices, correctIndex, solution}
   *   mode: 'practice' (משוב מיידי) | 'exam' (ללא משוב עד הגשה)
   *   timerSeconds: מספר שניות לטיימר (או null ללא טיימר)
   *   title: כותרת להצגה
   *   onFinish(score, answers, timeUp): callback בסיום
   */
  function Quiz(options) {
    this.container = options.container;
    this.questions = options.questions;
    this.mode = options.mode || "practice";
    this.timerSeconds = options.timerSeconds || null;
    this.remaining = this.timerSeconds;
    this.title = options.title || "";
    this.onFinish = options.onFinish || function () {};
    this.current = 0;
    this.answers = new Array(this.questions.length).fill(null);
    this.locked = new Array(this.questions.length).fill(false); // practice: true אחרי בחירה
    this.solutionShown = new Array(this.questions.length).fill(false);
    this.finished = false;
    this.timerHandle = null;

    this.render();
    if (this.timerSeconds) this.startTimer();
  }

  Quiz.prototype.startTimer = function () {
    const self = this;
    this.timerHandle = setInterval(function () {
      self.remaining--;
      self.updateTimerDisplay();
      if (self.remaining <= 0) {
        clearInterval(self.timerHandle);
        self.finish(true);
      }
    }, 1000);
  };

  Quiz.prototype.updateTimerDisplay = function () {
    const el = this.container.querySelector(".quiz-timer");
    if (!el) return;
    el.textContent = formatTime(this.remaining);
    if (this.remaining <= 60) {
      el.classList.add("quiz-timer--danger");
    }
  };

  Quiz.prototype.stopTimer = function () {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  };

  Quiz.prototype.render = function () {
    const self = this;
    const q = this.questions[this.current];
    const total = this.questions.length;
    const answeredCount = this.answers.filter(function (a) {
      return a !== null;
    }).length;

    let html = "";
    html += '<div class="quiz-header">';
    html += '<div><div class="quiz-title">' + escapeHtml(this.title) + "</div>";
    html +=
      '<div class="quiz-progress">שאלה ' +
      (this.current + 1) +
      " מתוך " +
      total +
      " &middot; נענו " +
      answeredCount +
      "</div></div>";
    if (this.timerSeconds) {
      html += '<div class="quiz-timer">' + formatTime(this.remaining) + "</div>";
    }
    html += "</div>";

    html += '<div class="progress-bar-track"><div class="progress-bar-fill" style="width:' +
      Math.round(((this.current + 1) / total) * 100) +
      '%"></div></div>';

    if (this.mode === "exam") {
      html += '<div class="jump-grid">';
      for (let i = 0; i < total; i++) {
        let cls = "jump-btn";
        if (i === this.current) cls += " current";
        if (this.answers[i] !== null) cls += " answered";
        html += '<button type="button" class="' + cls + '" data-jump="' + i + '">' + (i + 1) + "</button>";
      }
      html += "</div>";
    }

    html += '<div class="question-card">';
    html += '<p class="question-text">' + escapeHtml(q.question) + "</p>";
    html += '<div class="choices-list">';

    const userAnswer = this.answers[this.current];
    const isLocked = this.mode === "practice" && this.locked[this.current];

    q.choices.forEach(function (choiceText, idx) {
      let cls = "choice-btn";
      if (userAnswer === idx) cls += " selected";
      if (isLocked) {
        if (idx === q.correctIndex) cls += " correct";
        else if (idx === userAnswer) cls += " wrong";
      }
      const disabledAttr = isLocked ? "disabled" : "";
      html +=
        '<button type="button" class="' +
        cls +
        '" data-choice="' +
        idx +
        '" ' +
        disabledAttr +
        '><span class="choice-letter">' +
        (HEBREW_LETTERS[idx] || idx + 1) +
        "</span><span>" +
        escapeHtml(choiceText) +
        "</span></button>";
    });

    html += "</div>"; // choices-list

    if (this.mode === "practice" && isLocked) {
      const correct = userAnswer === q.correctIndex;
      html +=
        '<div class="feedback-msg ' +
        (correct ? "correct" : "wrong") +
        '">' +
        (correct ? "תשובה נכונה! כל הכבוד." : "תשובה שגויה. אפשר לראות את הפתרון המלא למטה.") +
        "</div>";

      if (this.solutionShown[this.current]) {
        html +=
          '<div class="solution-box"><h4>פתרון מלא</h4>' +
          escapeHtml(q.solution) +
          "</div>";
      } else {
        html += '<div class="btn-row"><button type="button" class="btn secondary" data-action="show-solution">הצג פתרון מלא</button></div>';
      }
    }

    html += "</div>"; // question-card

    html += '<div class="btn-row">';
    if (this.mode === "practice") {
      html += '<button type="button" class="btn secondary" data-action="prev" ' + (this.current === 0 ? "disabled" : "") + ">השאלה הקודמת</button>";
      if (this.current < total - 1) {
        html += '<button type="button" class="btn" data-action="next">השאלה הבאה</button>';
      } else {
        html += '<button type="button" class="btn" data-action="finish">סיום התרגול וצפייה בתוצאה</button>';
      }
    } else {
      html += '<button type="button" class="btn secondary" data-action="prev" ' + (this.current === 0 ? "disabled" : "") + ">הקודם</button>";
      html += '<button type="button" class="btn secondary" data-action="next" ' + (this.current === total - 1 ? "disabled" : "") + ">הבא</button>";
      html += '<button type="button" class="btn" data-action="finish">הגשת הבחינה</button>';
    }
    html += "</div>";

    this.container.innerHTML = html;
    this.attachEvents();
  };

  Quiz.prototype.attachEvents = function () {
    const self = this;
    const container = this.container;

    container.querySelectorAll("[data-choice]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const idx = parseInt(btn.getAttribute("data-choice"), 10);
        self.selectAnswer(idx);
      });
    });

    container.querySelectorAll("[data-jump]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        self.current = parseInt(btn.getAttribute("data-jump"), 10);
        self.render();
      });
    });

    const prevBtn = container.querySelector('[data-action="prev"]');
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (self.current > 0) {
          self.current--;
          self.render();
        }
      });
    }

    const nextBtn = container.querySelector('[data-action="next"]');
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (self.current < self.questions.length - 1) {
          self.current++;
          self.render();
        }
      });
    }

    const finishBtn = container.querySelector('[data-action="finish"]');
    if (finishBtn) {
      finishBtn.addEventListener("click", function () {
        if (self.mode === "exam") {
          const answeredCount = self.answers.filter(function (a) {
            return a !== null;
          }).length;
          const unanswered = self.questions.length - answeredCount;
          let msg = "האם להגיש את הבחינה?";
          if (unanswered > 0) {
            msg = "יש " + unanswered + " שאלות ללא מענה. " + msg;
          }
          if (!window.confirm(msg)) return;
        }
        self.finish(false);
      });
    }

    const solutionBtn = container.querySelector('[data-action="show-solution"]');
    if (solutionBtn) {
      solutionBtn.addEventListener("click", function () {
        self.solutionShown[self.current] = true;
        self.render();
      });
    }
  };

  Quiz.prototype.selectAnswer = function (idx) {
    if (this.mode === "practice" && this.locked[this.current]) return;
    this.answers[this.current] = idx;
    if (this.mode === "practice") {
      this.locked[this.current] = true;
    }
    this.render();
  };

  Quiz.prototype.computeScore = function () {
    let correct = 0;
    this.questions.forEach((q, i) => {
      if (this.answers[i] === q.correctIndex) correct++;
    });
    return { correct: correct, total: this.questions.length };
  };

  Quiz.prototype.finish = function (timeUp) {
    if (this.finished) return;
    this.finished = true;
    this.stopTimer();
    const score = this.computeScore();
    this.onFinish(score, this.answers, !!timeUp);
  };

  /**
   * renderResults - מציג מסך תוצאות + סקירת שאלות עם פתרון מלא
   * container: אלמנט DOM
   * questions, answers: כפי שנצברו ב-Quiz
   * options: { title, onRestart, onHome, extraNote }
   */
  function renderResults(container, questions, answers, options) {
    options = options || {};
    let correct = 0;
    questions.forEach(function (q, i) {
      if (answers[i] === q.correctIndex) correct++;
    });
    const total = questions.length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    let html = "";
    html += '<div class="results-summary">';
    html += "<h2>" + escapeHtml(options.title || "התוצאות שלך") + "</h2>";
    html += '<div class="results-score">' + correct + " / " + total + "</div>";
    html += '<div class="results-percent">ציון: ' + percent + "%</div>";
    if (options.extraNote) {
      html += '<p class="results-percent">' + escapeHtml(options.extraNote) + "</p>";
    }
    html += "</div>";

    html += "<h3>סקירת שאלות ופתרונות</h3>";

    questions.forEach(function (q, i) {
      const userIdx = answers[i];
      const wasCorrect = userIdx === q.correctIndex;
      const wasAnswered = userIdx !== null && userIdx !== undefined;
      let tagClass = "unanswered";
      let tagText = "לא נענתה";
      if (wasAnswered) {
        tagClass = wasCorrect ? "correct" : "wrong";
        tagText = wasCorrect ? "נכון" : "שגוי";
      }

      html += '<div class="review-item">';
      html += '<span class="review-tag ' + tagClass + '">' + tagText + "</span>";
      html += '<p class="question-text">' + (i + 1) + ". " + escapeHtml(q.question) + "</p>";
      html += '<div class="choices-list">';
      q.choices.forEach(function (choiceText, idx) {
        let cls = "choice-btn";
        if (idx === q.correctIndex) cls += " correct";
        else if (idx === userIdx) cls += " wrong";
        html +=
          '<div class="' +
          cls +
          '"><span class="choice-letter">' +
          (HEBREW_LETTERS[idx] || idx + 1) +
          "</span><span>" +
          escapeHtml(choiceText) +
          "</span></div>";
      });
      html += "</div>";
      html += '<div class="solution-box"><h4>פתרון מלא</h4>' + escapeHtml(q.solution) + "</div>";
      html += "</div>";
    });

    html += '<div class="btn-row">';
    if (options.onRestartLabel) {
      html += '<button type="button" class="btn" data-action="restart">' + escapeHtml(options.onRestartLabel) + "</button>";
    }
    html += '<a class="btn secondary" href="' + (options.homeHref || "../index.html") + '">חזרה לדף הבית</a>';
    html += "</div>";

    container.innerHTML = html;

    if (options.onRestart) {
      const btn = container.querySelector('[data-action="restart"]');
      if (btn) btn.addEventListener("click", options.onRestart);
    }
  }

  window.QuizEngine = {
    Quiz: Quiz,
    shuffleArray: shuffleArray,
    formatTime: formatTime,
    renderResults: renderResults,
    HEBREW_LETTERS: HEBREW_LETTERS
  };
})();
