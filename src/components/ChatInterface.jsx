import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../db/db';

const StyledChatInterface = styled.div`
  height: 400px;
  width: 500px;
  flex: 4;
  border: 1px solid green;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const Header = styled.div`
  background-color: blue;
  color: white;
  display: flex;
  height: 50px;
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

const StyledForm = styled.form``;

function ChatInterface({ selectedConvo }) {
  const [messages, setMessages] = useState();
  const [input, setInput] = useState();

  useEffect(() => {
    if (!selectedConvo) return;

    async function fetchMessages() {
      try {
        const res = await fetch(
          `api/getMessages?visitorId=${selectedConvo.id}`
        );
        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, [selectedConvo]);

  // subscribing to real-time changes
  useEffect(() => {
    if (!selectedConvo) return;

    const channel = supabase
      .channel(`messages-${selectedConvo}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `visitor_id=eq.${selectedConvo.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConvo]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input) return;

    try {
      const res = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: selectedConvo.name,
          message: input,
          sender_type: 'admin',
          visitor_id: selectedConvo.id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setInput('');

        // append new message
        // setMessages()
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (!selectedConvo) return <p>Select a conversation from the left</p>;

  return (
    <StyledChatInterface>
      <Header>
        <div>Name: {selectedConvo.name}</div>
        <div>Phone Number: {selectedConvo.phone_number}</div>
      </Header>
      <Messages>
        {messages?.map((msg, i) => (
          <MessageBubble key={i} senderType={msg.sender_type}>
            <strong>{msg.user_name}:</strong>
            <MessageContent>
              <Message>{msg.message}</Message>
              <MessageDate>{msg.created_at}</MessageDate>
            </MessageContent>
          </MessageBubble>
        ))}
      </Messages>

      <Bottom>
        <StyledForm onSubmit={sendMessage}>
          <input
            type="text"
            name="message"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-control"
          />
          <button className="btn btn-primary" type="submit">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </StyledForm>
      </Bottom>
    </StyledChatInterface>
  );
}

export default ChatInterface;
