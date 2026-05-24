'use client';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { CheckCircle, XCircle, Trophy, RefreshCw, Lock, ThumbsUp, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function QuizSection({ quiz, pageId }) {
  const { user } = useAuthStore();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!quiz?.enabled || !quiz?.questions?.length) return null;

  if (!user) {
    return (
      <div style={{ marginTop: '2.5rem', padding: '1.5rem', border: '1.5px dashed #e5e7eb', borderRadius: 12, background: '#f9fafb', textAlign: 'center' }}>
        <Lock size={28} color="#9ca3af" style={{ margin: '0 auto 0.75rem' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem' }}>Quiz Available</h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem' }}>
          Sign in to take the quiz and track your progress. It's free!
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link href="/login" style={{ padding: '0.5rem 1.25rem', border: '1.5px solid #16a34a', borderRadius: 6, color: '#16a34a', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>Login</Link>
          <Link href="/signup" style={{ padding: '0.5rem 1.25rem', background: '#16a34a', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>Sign Up Free</Link>
        </div>
      </div>
    );
  }

  const handleSelect = (qIndex, optIndex) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      toast.error('Please answer all questions');
      return;
    }
    setLoading(true);
    try {
      const orderedAnswers = quiz.questions.map((_, i) => answers[i] ?? -1);
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, answers: orderedAnswers }),
      });
      const data = await res.json();
      if (res.ok) { setResults(data); setSubmitted(true); }
      else toast.error(data.error);
    } catch { toast.error('Failed to submit quiz'); }
    finally { setLoading(false); }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
  };

  const percentage = results ? results.percentage : 0;

  return (
    <div style={{ marginTop: '2.5rem', borderTop: '2px solid #e5e7eb', paddingTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <Trophy size={20} color="#16a34a" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>Knowledge Check</h2>
        <span style={{ fontSize: '0.75rem', background: '#f0fdf4', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: 20, fontWeight: 600, border: '1px solid #bbf7d0' }}>{quiz.questions.length} Questions</span>
      </div>

      {submitted && results && (
        <div style={{ padding: '1.25rem', borderRadius: 10, background: percentage >= 70 ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${percentage >= 70 ? '#bbf7d0' : '#fecaca'}`, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: percentage >= 70 ? '#16a34a' : '#dc2626', lineHeight: 1 }}>{percentage}%</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem' }}>{results.score}/{results.total} correct</div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, color: percentage >= 70 ? '#166534' : '#991b1b', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {percentage >= 90 ? <CheckCircle size={16} color="#16a34a" /> : percentage >= 70 ? <ThumbsUp size={16} color="#16a34a" /> : <BookOpen size={16} color="#16a34a" />} 
              {percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Good job!' : 'Keep studying!'}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
              {percentage >= 70 ? 'You\'ve passed this quiz. Move on to the next page!' : 'Review the material and try again.'}
            </p>
          </div>
          <button onClick={handleRetry} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: '0.8rem', color: '#374151' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {quiz.questions.map((q, qIndex) => {
          const selected = answers[qIndex];
          const result = submitted && results?.results?.[qIndex];

          return (
            <div key={qIndex} style={{ padding: '1.25rem', border: '1.5px solid #e5e7eb', borderRadius: 10, background: 'white' }}>
              <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 1rem', lineHeight: 1.5 }}>
                <span style={{ color: '#16a34a', marginRight: '0.4rem', fontFamily: 'IBM Plex Mono, monospace' }}>Q{qIndex + 1}.</span>
                {q.question}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {q.options.map((option, optIndex) => {
                  let borderColor = '#e5e7eb', bg = 'white', color = '#374151';
                  if (submitted) {
                    if (optIndex === q.correctOption) { borderColor = '#16a34a'; bg = '#f0fdf4'; color = '#166534'; }
                    else if (optIndex === selected && !result?.correct) { borderColor = '#dc2626'; bg = '#fef2f2'; color = '#991b1b'; }
                  } else if (selected === optIndex) { borderColor = '#16a34a'; bg = '#f0fdf4'; color = '#166534'; }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => handleSelect(qIndex, optIndex)}
                      className="quiz-option"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1rem', border: `1.5px solid ${borderColor}`, borderRadius: 8, background: bg, color, textAlign: 'left', cursor: submitted ? 'default' : 'pointer', transition: 'all 0.15s', fontFamily: 'IBM Plex Sans, sans-serif' }}
                    >
                      <span style={{ width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 600 }}>
                        {submitted && optIndex === q.correctOption ? <CheckCircle size={14} color="#16a34a" /> : submitted && optIndex === selected && !result?.correct ? <XCircle size={14} color="#dc2626" /> : String.fromCharCode(65 + optIndex)}
                      </span>
                      <span style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>{option}</span>
                    </button>
                  );
                })}
              </div>
              {submitted && result?.explanation && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                  <p style={{ fontSize: '0.8rem', color: '#166534', margin: 0 }}>
                    <strong>Explanation:</strong> {result.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={loading || Object.keys(answers).length < quiz.questions.length}
          style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', cursor: Object.keys(answers).length < quiz.questions.length ? 'not-allowed' : 'pointer', opacity: Object.keys(answers).length < quiz.questions.length ? 0.6 : 1, fontFamily: 'IBM Plex Sans, sans-serif' }}
        >
          {loading ? 'Submitting...' : 'Submit Answers'}
        </button>
      )}
    </div>
  );
}
