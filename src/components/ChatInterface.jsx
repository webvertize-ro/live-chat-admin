import styled from 'styled-components';

const StyledChatInterface = styled.div`
  height: 400px;
  width: 500px;
  flex: 1;
`;

function ChatInterface() {
  return (
    <StyledChatInterface>
      This is where the messages will be!
    </StyledChatInterface>
  );
}

export default ChatInterface;
