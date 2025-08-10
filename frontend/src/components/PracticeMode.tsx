import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

interface Props {
  selectedDomains: string[];
  numQuestions: number;
}

const PracticeMode: React.FC<Props> = ({ selectedDomains, numQuestions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  const { data: sessionData } = useQuery(['startPractice'], () => 
    api.post('/sessions/start-practice', { domains: selectedDomains, numQuestions }),
    { onSuccess: (data) => setSessionId(data.sessionId) }
  );

  const questions = sessionData?.questions || [];

  const answerMutation = useMutation((data: any) => api.post('/sessions/answer', data));

  const handleAnswer = async (answer: number) => {
    const res = await answerMutation.mutateAsync({ sessionId, questionId: questions[currentIndex]._id, answer, timeSpent: 10 }); // Mock time
    setFeedback({ correct: res.data.correct, explanation: res.data.explanation });
  };

  const handleNext = () => {
    setFeedback(null);
    setCurrentIndex(currentIndex + 1);
  };

  // Add skip/flag/retry logic similarly (e.g., bookmark via API patch to user)

  useEffect(() => {
    // Keyboard shortcuts
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      // Add more
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!questions.length) return <div>Loading...</div>;

  return (
    <div className="p-4 dark:text-white">
      <p>{questions[currentIndex]?.text}</p>
      {questions[currentIndex]?.options.map((opt: string, idx: number) => (
        <button key={idx} onClick={() => handleAnswer(idx)} className="block border p-2">{opt}</button>
      ))}
      {feedback && (
        <div className={feedback.correct ? 'text-green-500' : 'text-red-500'}>
          {feedback.correct ? 'Correct!' : 'Wrong'} - {feedback.explanation}
        </div>
      )}
      <button onClick={handleNext}>Next</button>
      {/* Add skip, flag, retry buttons */}
    </div>
  );
};

export default PracticeMode;
