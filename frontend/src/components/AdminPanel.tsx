import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import QuestionForm from './QuestionForm';

const AdminPanel = () => {
  const { data: questions } = useQuery(['questions'], () => api.get('/questions'));
  const { data: domains } = useQuery(['domains'], () => api.get('/domains'));

  // Add edit/delete buttons for questions/domains
  // Bulk upload: form with file input, post to /questions/bulk

  return (
    <div>
      <h2>Manage Questions</h2>
      <QuestionForm />
      <input type="file" onChange={(e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        api.post('/questions/bulk', formData);
      }} />
      <ul>{questions?.map((q: any) => <li key={q._id}>{q.text} <button onClick={() => api.delete(`/questions/${q._id}`)}>Delete</button></li>)}</ul>
      <h2>Manage Domains</h2>
      {/* Similar form for domains */}
    </div>
  );
};

export default AdminPanel;
