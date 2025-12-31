import ConversationsList from './ConversationsList';
import ChatInterface from './ChatInterface';
import styled from 'styled-components';
import { useState } from 'react';

const StyledChatLayout = styled.div`
  display: flex;
`;

function ChatLayout() {
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);
  return (
    <StyledChatLayout className="container">
      <ConversationsList />
      <ChatInterface />
    </StyledChatLayout>
  );
}

export default ChatLayout;
