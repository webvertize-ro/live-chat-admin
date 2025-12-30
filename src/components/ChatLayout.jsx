import ConversationsList from './ConversationsList';
import ChatInterface from './ChatInterface';
import styled from 'styled-components';

const StyledChatLayout = styled.div`
  display: flex;
`;

function ChatLayout() {
  return (
    <StyledChatLayout>
      <ConversationsList />
      <ChatInterface />
    </StyledChatLayout>
  );
}

export default ChatLayout;
