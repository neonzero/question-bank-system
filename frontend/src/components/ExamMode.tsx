import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import jsPDF from 'jspdf';

interface Props {
  numQuestions: number;
  duration?: number;
}

const ExamMode: React.FC<Props> = ({ numQuestions, duration = 30 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [sessionId, setSessionId] = useState<string>('');
  const [report, setReport] = useState<any>(null);

  const { data: sessionData } = useQuery(['startExam'], () => 
    api.post('/sessions/start-exam', { numQuestions, duration }),
    { onSuccess: (data) => setSessionId(data.sessionId) }
  );

  const questions = sessionData?.questions || [];

  const answerMutation = useMutation((data: any) => api.post('/sessions/answer', data));

  const endMutation = useMutation(() => api.post('/sessions/end', { sessionId }), {
    onSuccess: (data) => setReport(data),
  });

  const handleAnswer = async (answer: number) => {
    await answerMutation.mutateAsync({ sessionId, questionId: questions[currentIndex]._id, answer, timeSpent: 10 });
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    else endMutation.mutate();
  };

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    if (timeLeft <= 0) endMutation.mutate();
    return () => clearInterval(timer);
  }, [timeLeft]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Score: ${report.score}`, 10, 10);
    // Add questions loop
    doc.save('exam-report.pdf');
  };

  if (report) {
    return (
      <div>
        <h2>Exam Report</h2>
        <p>Score: {report.score}</p>
        <ul>
          {report.questions.map((q: any, idx: number) => (
            <li key={idx}>
              {q.text} - Your: {q.userAnswer}, Correct: {q.correctAnswer} - {q.explanation}
            </li>
          ))}
        </ul>
        <p>Weak Domains: {report.weakDomains.join(', ')}</p>
        <button onClick={exportPDF}>Export PDF</button>
      </div>
    );
  }

  return (
    <div>
      <p>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>
      <p>{questions[currentIndex]?.text}</p>
      {questions[currentIndex]?.options.map((opt: string, idx: number) => (
        <button key={idx} onClick={() => handleAnswer(idx)}>{opt}</button>
      ))}
    </div>
  );
};

export default ExamMode;
