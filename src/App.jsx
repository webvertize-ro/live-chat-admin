import ChatLayout from './components/ChatLayout';
import ConversationsList from './components/ConversationsList';
import '../App.css';
import { Route, Routes } from 'react-router';

import Login from './pages/Login';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChatLayout />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
