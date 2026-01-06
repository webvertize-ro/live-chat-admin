import ChatLayout from './components/ChatLayout';
import ConversationsList from './components/ConversationsList';
import '../App.css';
import { Route, Router, Routes } from 'react-router';

import Login from './pages/Login';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<ChatLayout />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
