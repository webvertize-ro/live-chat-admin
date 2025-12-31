import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledChatInterface = styled.div`
  height: 400px;
  width: 500px;
  flex: 4;
  border: 1px solid green;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background-color: blue;
  color: white;
  display: flex;
`;

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
  background-color: lightgreen;
  border-radius: 1rem;
  padding: 0.5rem;
  align-self: ${(props) =>
    props.senderType === 'user' ? 'flex-start' : 'flex-end'};
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

function ChatInterface({ selectedConvo }) {
  const [messages, setMessages] = useState();
  const [visitor, setVisitor] = useState();

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(
          `api/getMessages?visitorId=${selectedConvo ? selectedConvo : 1}`
        );
        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, [selectedConvo]);

  useEffect(() => {
    async function fetchVisitor() {
      try {
        const res = await fetch(
          `/api/getVisitors?visitorId=${selectedConvo ? selectedConvo : 1}`
        );
        const data = await res.json();
        setVisitor(data.visitors);
      } catch (error) {
        console.error(error);
      }
    }
    fetchVisitor();
  }, [selectedConvo]);

  if (!selectedConvo) return <p>Select a conversation from the left</p>;

  return (
    <StyledChatInterface>
      <Header>{visitor.name}</Header>
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
