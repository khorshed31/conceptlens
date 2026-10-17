
import { useEffect, useState } from 'react';
import './App.css';

// Example data
const exampleForm = {
  topic: 'SQL WHERE vs HAVING',

  notes:
    'WHERE filters individual rows before grouping. ' +
    'HAVING filters groups after aggregation. ' +
    'WHERE can filter employees by salary before grouping. ' +
    'HAVING can filter groups using COUNT or SUM.',

  question:
    'What is the difference between WHERE and HAVING?',

  student_answer:
    'WHERE filters groups and HAVING filters rows.',
};

const emptyForm = {
  topic: '',
  notes: '',
  question: '',
  student_answer: '',
};

// Read Laravel JSON response
async function readResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const validationErrors = data?.errors
      ? Object.values(data.errors).flat().join(' ')
      : null;

    throw new Error(
      validationErrors ||
      data?.message ||
      `Request failed with HTTP ${response.status}`
    );
  }

  return data;
}

export default function App() {
  // Student input
  const [form, setForm] = useState(exampleForm);

  // Latest AI feedback
  const [result, setResult] = useState(null);

  // Previous analyses
  const [history, setHistory] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyError, setHistoryError] = useState('');

  // STEP 1: Load history when page opens
  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const response = await fetch('/api/analyses', {
          headers: {
            Accept: 'application/json',
          },
        });

        const data = await readResponse(response);

        if (active) {
          setHistory(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setHistoryError(err.message);
        }
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  // STEP 2: Update the form when user types
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // STEP 3: Submit student answer to Laravel
  async function handleAnalyze(event) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyses', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify(form),
      });

      const data = await readResponse(response);

      if (!data?.data?.feedback) {
        throw new Error(
          'Laravel returned an unexpected response.'
        );
      }

      // Display Gemini feedback
      setResult(data.data);

      // Add saved analysis to history
      setHistory((previous) => [
        data.data,
        ...previous.filter(
          (item) => item.id !== data.data.id
        ),
      ].slice(0, 20));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // STEP 4: Open a previous analysis
  function openHistory(item) {
    setResult(item);
    setError('');

    setForm({
      topic: item.topic,
      notes: item.notes,
      question: item.question,
      student_answer: item.student_answer,
    });
  }

  // STEP 5: Delete a previous analysis
  async function deleteAnalysis(id) {
    setError('');

    try {
      const response = await fetch(
        `/api/analyses/${id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      await readResponse(response);

      // Remove the deleted analysis
      setHistory((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (result?.id === id) {
        setResult(null);
      }

    } catch (err) {
      setError(err.message);
    }
  }

  // STEP 6: Start a new study attempt
  function startNew() {
    setForm({ ...emptyForm });
    setResult(null);
    setError('');
  }

  // Extract feedback from selected result
  const feedback = result?.feedback;

  // Display-friendly verdict names
  const verdictLabels = {
    correct: 'Correct Understanding',
    partially_correct: 'Partially Correct',
    incorrect: 'Misconception Detected',
    insufficient_information: 'Not Enough Information',
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="logo">✦</div>

          <div>
            <h1>ConceptLens AI</h1>
            <p>AI Misconception Detector for Students</p>
          </div>
        </div>

        <span className="header-badge">
          Laravel + React + Gemini
        </span>
      </header>

      <div className="layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2>Study History</h2>

          <button
            type="button"
            className="new-btn"
            onClick={startNew}
          >
            + New Analysis
          </button>

          {historyError && (
            <p className="error-text">
              {historyError}
            </p>
          )}

          {history.length === 0 && (
            <p className="muted">
              Your previous study attempts will
              appear here.
            </p>
          )}

          {history.map((item) => (
            <div
              className="history-card"
              key={item.id}
            >
              <button
                type="button"
                className="history-link"
                onClick={() => openHistory(item)}
              >
                <strong>{item.topic}</strong>
                <span>{item.question}</span>
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteAnalysis(item.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">

          <div className="intro">
            <span className="eyebrow">
              PERSONALIZED LEARNING
            </span>

            <h2>Understand Your Mistakes</h2>

            <p>
              Enter your study notes, a question,
              and your own answer. Gemini will help
              identify possible misconceptions.
            </p>
          </div>

          {/* STUDENT FORM */}
          <section className="panel">
            <h3>1. Study Information</h3>

            <form onSubmit={handleAnalyze}>

              <div className="field">
                <label htmlFor="topic">Topic</label>

                <input
                  id="topic"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="Example: SQL, Laravel, Mathematics"
                  required
                  maxLength={120}
                />
              </div>

              <div className="field">
                <label htmlFor="notes">
                  Study Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows={6}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Paste your study notes..."
                  required
                  minLength={50}
                  maxLength={10000}
                />

                <small>
                  Minimum 50 characters.
                  Provide enough information
                  to evaluate your answer.
                </small>
              </div>

              <div className="field">
                <label htmlFor="question">
                  Question
                </label>

                <textarea
                  id="question"
                  name="question"
                  rows={2}
                  value={form.question}
                  onChange={handleChange}
                  placeholder="Write a question..."
                  required
                  minLength={10}
                  maxLength={1000}
                />
              </div>

              <div className="field">
                <label htmlFor="student_answer">
                  Your Answer
                </label>

                <textarea
                  id="student_answer"
                  name="student_answer"
                  rows={4}
                  value={form.student_answer}
                  onChange={handleChange}
                  placeholder="Write your answer..."
                  required
                  minLength={3}
                  maxLength={2000}
                />
              </div>

              <button
                type="submit"
                className="analyze-btn"
                disabled={loading}
              >
                {loading
                  ? 'Analyzing your answer...'
                  : '✦ Detect Misconception'}
              </button>
            </form>
          </section>

          {/* ERROR */}
          {error && (
            <div className="error-box" role="alert">
              {error}
            </div>
          )}

          {/* AI FEEDBACK */}
          <section className="panel">
            <h3>2. AI Learning Feedback</h3>

            {loading && (
              <div className="empty-state" role="status">
                <div className="empty-icon">✦</div>
                <h4>Gemini is analyzing your answer</h4>
                <p>Checking for possible misconceptions...</p>
              </div>
            )}

            {!loading && !feedback && (
              <div className="empty-state">
                <div className="empty-icon">◇</div>
                <h4>No Feedback Yet</h4>
                <p>
                  Submit your answer to see
                  AI-generated learning feedback.
                </p>
              </div>
            )}

            {!loading && feedback && (
              <div className="feedback">

                {/* VERDICT */}
                <div className="feedback-card">
                  <h4>Understanding Status</h4>

                  <span
                    className={`verdict ${feedback.verdict}`}
                  >
                    {verdictLabels[feedback.verdict] ||
                      feedback.verdict}
                  </span>
                </div>

                {/* MISCONCEPTION */}
                <div className="feedback-card">
                  <h4>Possible Misconception</h4>
                  <p>{feedback.misconception}</p>
                </div>

                {/* EXPLANATION */}
                <div className="feedback-card">
                  <h4>Simple Explanation</h4>
                  <p>{feedback.explanation}</p>
                </div>

                {/* CORRECT ANSWER */}
                <div className="feedback-card correct-card">
                  <h4>Improved Answer</h4>
                  <p>{feedback.corrected_answer}</p>
                </div>

                {/* NOTE EVIDENCE */}
                <div className="feedback-card">
                  <h4>Evidence From Your Notes</h4>
                  <p>{feedback.note_evidence}</p>
                </div>

                {/* FOLLOW-UP */}
                <div className="feedback-card practice-card">
                  <h4>Practice Question</h4>
                  <p>{feedback.follow_up_question}</p>
                </div>

                <p className="disclaimer">
                  AI feedback may contain mistakes.
                  Verify important explanations
                  against your course materials.
                </p>
              </div>
            )}

          </section>
        </main>
      </div>
    </div>
  );
}
