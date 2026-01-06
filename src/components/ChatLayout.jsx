import ConversationsList from './ConversationsList';
import ChatInterface from './ChatInterface';
import styled from 'styled-components';
import { useState } from 'react';

const StyledChatLayout = styled.div`
  display: grid;
  height: 100vh;

  grid-template-rows: 60px 1fr;

  grid-template-columns: 1fr 4fr;

  grid-template-areas: 'header header' 'sidebar main';
`;

const Header = styled.div`
  grid-area: header;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 16px;
`;

function ChatLayout() {
  const [selectedConvo, setSelectedConvo] = useState(null);

  function handleSelectedConvo(visitorId) {
    console.log(selectedConvo);
    setSelectedConvo(visitorId);
  }

  return (
    <>
      <StyledChatLayout>
        <Header>logo</Header>
        <ConversationsList onSelectedConvo={handleSelectedConvo} />
        <ChatInterface selectedConvo={selectedConvo} />
      </StyledChatLayout>
    </>
  );
}

export default ChatLayout;
