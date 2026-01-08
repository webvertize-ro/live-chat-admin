import ConversationsList from './ConversationsList';
import ChatInterface from './ChatInterface';
import styled from 'styled-components';
import { useState } from 'react';
import Logout from './authentication/Logout';
import Logo from './Logo';

const StyledChatLayout = styled.div`
  display: grid;
  height: 100vh;
  overflow-y: hidden;
  grid-template-rows: 100px 1fr;
  grid-template-columns: 2.5fr 6fr;
  grid-template-areas: 'header header' 'sidebar main';
`;

const Header = styled.div`
  grid-area: header;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
        <Header>
          <Logo />
          <Logout />
        </Header>
        <ConversationsList onSelectedConvo={handleSelectedConvo} />
        <ChatInterface selectedConvo={selectedConvo} />
      </StyledChatLayout>
    </>
  );
}

export default ChatLayout;
