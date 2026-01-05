import ConversationsList from './ConversationsList';
import ChatInterface from './ChatInterface';
import styled from 'styled-components';
import { useState } from 'react';
import Navigation from './Navigation';

const StyledChatLayout = styled.div`
  display: flex;
`;

function ChatLayout() {
  const [selectedConvo, setSelectedConvo] = useState(null);

  function handleSelectedConvo(visitorId) {
    console.log(selectedConvo);
    setSelectedConvo(visitorId);
  }

  return (
    <>
      <Navigation />
      <StyledChatLayout>
        <ConversationsList onSelectedConvo={handleSelectedConvo} />
        <ChatInterface selectedConvo={selectedConvo} />
      </StyledChatLayout>
    </>
  );
}

export default ChatLayout;
