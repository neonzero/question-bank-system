import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Practice from './pages/Practice';
import Exam from './pages/Exam';
import Admin from './pages/Admin';
import Dashboard from './components/Dashboard';
// Add dark mode toggle component

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/exam" element={<Exam />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default App;
