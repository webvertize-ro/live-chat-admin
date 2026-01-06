import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { faPaperPlane, faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../db/db';
import { faXmark, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import LoadingComponent from './LoadingComponent';

const StyledChatInterface = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: main;
  overflow-y: scroll;
`;

const Header = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 1rem;
  height: 50px;
  border-bottom: 1px solid #1ca079;
  padding: 0.75rem;
`;

const HeaderName = styled.div``;

const HeaderPhone = styled.div``;

const Messages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  height: 400px;
  overflow-y: scroll;
  padding: 1.5rem;
  flex: 10;
  justify-content: ${(props) => (props.loadingMessages ? 'center' : 'unset')};
  align-items: ${(props) => (props.loadingMessages ? 'center' : 'unset')};
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

const Bottom = styled.div`
  flex: 1;
  height: 100%;
`;

const StyledForm = styled.form`
  display: flex;
  height: 100%;
`;

const CustomLabel = styled.label`
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const InputMessage = styled.input`
  flex: 20;
`;

const SendingButton = styled.button`
  background-color: rgb(28, 160, 121);
  color: #fff;
  border: none;
  flex: 1;
`;

const FileUploadInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  margin-bottom: 0.5rem;
  background: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const StyledButton = styled.button`
  margin-left: 0.5rem;
`;

function ChatInterface({ selectedConvo }) {
  const [messages, setMessages] = useState();
  const [input, setInput] = useState();
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!selectedConvo) return;

    async function fetchMessages() {
      setLoadingMessages(true);
      try {
        const res = await fetch(
          `api/getMessages?visitorId=${selectedConvo.id}`
        );
        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        console.error(error);
      }
      setLoadingMessages(false);
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

    // determine the type of message
    let messageType = 'text';

    if (attachment && input) {
      messageType = 'mixed';
    } else if (attachment) {
      messageType = attachment.type.startsWith('image') ? 'image' : 'file';
    }

    // Send message (text + optional file)
    await fetch('/api/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: selectedConvo.user_name,
        message: input || null,
        sender_type: 'admin',
        visitor_id: selectedConvo.id,
        type: messageType,
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_mime: fileData?.mime,
      }),
    });

    // Reset UI
    setInput('');
    clearAttachment();
  };

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

  if (!selectedConvo)
    return (
      <StyledChatInterface>
        <p>Select a conversation from the left</p>
      </StyledChatInterface>
    );

  return (
    <StyledChatInterface>
      <Header>
        <div>
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div>
          <HeaderName>{selectedConvo.name}</HeaderName>
          <HeaderPhone>Phone Number: {selectedConvo.phone_number}</HeaderPhone>
        </div>
      </Header>
      <Messages loadingMessages={loadingMessages}>
        {loadingMessages ? (
          <LoadingComponent />
        ) : (
          messages?.map((msg, i) => (
            <MessageBubble key={i} senderType={msg.sender_type}>
              {console.log('message is: ', msg)}
              <strong>{msg.user_name}:</strong>
              <MessageContent>
                {/* messages with files and with images */}
                {msg.file_url && msg.file_mime?.startsWith('image/') ? (
                  <img src={msg.file_url} alt={msg.file_name} width="100" />
                ) : msg.file_url ? (
                  <a href={msg.file_url} target="_blank" rel="noreferref">
                    {msg.file_name}
                  </a>
                ) : null}
                {/* text messages */}
                {msg.message && <Message>{msg.message}</Message>}
                <MessageDate>{msg.created_at}</MessageDate>
              </MessageContent>
            </MessageBubble>
          ))
        )}
      </Messages>

      {/* File Preview */}
      {attachment && (
        <PreviewContainer>
          {previewUrl ? (
            <img src={previewUrl} width="100" />
          ) : (
            <div>{attachment.name}</div>
          )}
          <StyledButton type="button" onClick={clearAttachment}>
            <FontAwesomeIcon icon={faXmark} />
          </StyledButton>
        </PreviewContainer>
      )}

      <Bottom>
        <StyledForm onSubmit={sendMessage}>
          <CustomLabel for="file-upload">
            <FontAwesomeIcon icon={faPaperclip} />
          </CustomLabel>
          <InputMessage
            type="text"
            name="message"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-control"
          />
          <FileUploadInput
            id="file-upload"
            type="file"
            onChange={(e) => handleSelectFile(e.target.files[0])}
          />
          <SendingButton type="submit">
            <FontAwesomeIcon icon={faPaperPlane} />
          </SendingButton>
        </StyledForm>
      </Bottom>
    </StyledChatInterface>
  );
}

export default ChatInterface;
