import ChatLayout from './components/ChatLayout';
import ConversationsList from './components/ConversationsList';
import '../App.css';
import { Route } from 'react-router';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <Route path="/" element={<ChatLayout />} />
      <Route path="/login" element={<Login />} />
    </div>
  );
}

export default App;
