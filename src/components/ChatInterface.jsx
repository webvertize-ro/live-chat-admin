import { useState } from 'react';
import styled from 'styled-components';

const StyledChatInterface = styled.div`
  height: 400px;
  width: 500px;
  flex: 4;
  border: 1px solid green;
`;

const Header = styled.div``;

const Messages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  height: 400px;
  overflow-y: scroll;
`;

const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* background-color: lightgreen; */
  border-radius: 1rem;
  padding: 0.5rem;
  background-color: ${(props) =>
    props.senderType === 'user' ? 'green' : 'red'};
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  font-size: 1.2rem;
`;

const MessageDate = styled.div`
  font-size: 0.7rem;
`;

const Bottom = styled.div``;

function ChatInterface() {
  const [messages, setMessages] = useState();

  async function fetchMessages() {
    try {
      const res = await fetch(`api/getMessages?visitorId=${37}`);
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error(error);
    }
  }

  fetchMessages();

  return (
    <StyledChatInterface>
      <Header></Header>
      {messages?.map((msg, i) => (
        <MessageBubble key={i} senderType={msg.sender_type}>
          <strong>{msg.user_name}:</strong>
          <MessageContent>
            <Message>{msg.message}</Message>
            <MessageDate>{msg.created_at}</MessageDate>
          </MessageContent>
        </MessageBubble>
      ))}
      <Bottom></Bottom>
    </StyledChatInterface>
  );
}

export default ChatInterface;
