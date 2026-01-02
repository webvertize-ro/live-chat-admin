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
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleSelectFile = (file) => {
    if (!file) return;

    setAttachment(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    setPreviewUrl(null);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input && !attachment) return;

    let fileData = null;

    if (attachment) {
      const formData = new FormData();
      formData.append('file', attachment);
      formData.append('visitor_id', selectedConvo.id);

      const uploadRes = await fetch('/api/uploadAttachment', {
        method: 'POST',
        body: formData,
      });

      fileData = await uploadRes.json();
    }

    // Send message (text + optional file)
    await fetch('/api/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: selectedConvo.name,
        message: input || null,
        sender_type: 'admin',
        visitorId: selectedConvo.id,
        type: attachment
          ? attachment.type.startsWith('image')
            ? 'image'
            : 'file'
          : 'text',
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_mime: fileData?.mime,
      }),
    });

    // Reset UI
    setInput('');
    clearAttachment();
  };

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
          <input
            type="file"
            onChange={(e) => handleSelectFile(e.target.files[0])}
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
