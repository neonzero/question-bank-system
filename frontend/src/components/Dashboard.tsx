// frontend/src/components/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const { data: progress } = useQuery(['progress'], () => api.get('/dashboard/progress'));

  // Example: Line chart for trends
  const lineData = {
    labels: progress?.dates, // e.g., ['2025-08-01', ...]
    datasets: [{ label: 'Accuracy', data: progress?.accuracies }],
  };

  // Pie for domain breakdown
  const pieData = {
    labels: progress?.domains,
    datasets: [{ data: progress?.scores, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }],
  };

  return (
    <div className="dark:bg-gray-800">
      <h2>Progress Dashboard</h2>
      <Line data={lineData} />
      <Pie data={pieData} />
      <div>Weak Areas: {progress?.weakDomains.join(', ')}</div>
    </div>
  );
};

export default Dashboard;
