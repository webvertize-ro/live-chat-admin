import styled from 'styled-components';

const StyledChatInterface = styled.div`
  height: 400px;
  width: 500px;
  flex: 4;
  border: 1px solid green;
`;

const Header = styled.div``;
const Messages = styled.div``;
const Bottom = styled.div``;

function ChatInterface() {
  return (
    <StyledChatInterface>
      <Header></Header>
      <Messages></Messages>
      <Bottom></Bottom>
    </StyledChatInterface>
  );
}

export default ChatInterface;
