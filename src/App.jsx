import ChatLayout from './components/ChatLayout';
import ConversationsList from './components/ConversationsList';
import '../App.css';
import { Route, BrowserRouter, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Login from './pages/Login';

function App() {
  return (
    <div>
      <QueryClientProvider client={QueryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ChatLayout />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
