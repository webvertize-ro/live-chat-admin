import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { faPaperPlane, faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../db/db';
import { faXmark, faPaperclip, faL } from '@fortawesome/free-solid-svg-icons';
import LoadingComponent from './LoadingComponent';
import { formatDate } from '../utils/formatDate';
import Lightbox, { LightboxRoot } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import edionTransLogo from '../assets/ediontrans_logo.svg';

const StyledChatInterface = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.noConvo ? 'center' : '')};
  justify-content: ${(props) => (props.noConvo ? 'center' : '')};
  grid-area: main;
  overflow-y: scroll;
  margin-bottom: 1rem;
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
  background-color: ${(props) =>
    props.senderType === 'admin' ? '#1ca079' : '#fefc69'};
  border-radius: 1rem;
  padding: 0.5rem;
  align-self: ${(props) =>
    props.senderType === 'user' ? 'flex-start' : 'flex-end'};
  max-width: 500px;
  color: ${(props) => (props.senderType === 'admin' ? '#fff' : '#000')};
`;

const StyledImg = styled.img`
  /* max-width: 50px; */
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatImg = styled.img`
  border-radius: 0.5rem;

  &:hover {
    cursor: pointer;
  }
`;

const StyledLink = styled.a`
  color: #fff;
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
  border-radius: 0 !important;
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
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
`;

const StyledPreviewImg = styled.img`
  border-radius: 0.5rem;
`;

const StyledButton = styled.button`
  margin-left: 0.5rem;
  border: none;
  background-color: transparent;
`;

function ChatInterface({ selectedConvo, onAcknowledgeConvo, visitor }) {
  const [messages, setMessages] = useState();
  const [input, setInput] = useState();
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Build the slides array from messages
  const imageMessages =
    messages?.filter(
      (msg) => msg.file_url && msg.file_mime.startsWith('image/')
    ) || [];

  const slides = imageMessages?.map((msg) => ({
    src: msg.file_url,
    alt: msg.file_name || 'Image',
  }));

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

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
        setLoadingMessages(false);

        // Scroll to the bottom after initial load
        setTimeout(() => scrollToBottom('smooth'), 400);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, [selectedConvo]);

  // scroll when a new message arrives
  useEffect(() => {
    if (messages?.length === 0) return;
    scrollToBottom();
  }, [messages?.length]);

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
    setLoadingSendMessage(true);

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
    setLoadingSendMessage(false);
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
      <StyledChatInterface noConvo={!selectedConvo ? true : false}>
        <p>Selecteză o conversație din stânga</p>
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
              <div className="d-flex justify-content-center align-items-center gap-1">
                {msg.sender_type === 'admin' ? (
                  <StyledImg
                    src={edionTransLogo}
                    alt="Edion Trans Logo"
                    width="25"
                  />
                ) : (
                  ''
                )}
                <strong>{msg.user_name}</strong>
              </div>

              <MessageContent>
                {/* messages with files and with images */}
                {msg.file_url && msg.file_mime?.startsWith('image/') ? (
                  <ChatImg
                    src={msg.file_url}
                    alt={msg.file_name}
                    width="100"
                    onClick={() => {
                      const index = imageMessages.findIndex(
                        (img) => img.file_url === msg.file_url
                      );
                      setLightboxIndex(index);
                      setIsLightboxOpen(true);
                    }}
                  />
                ) : msg.file_url ? (
                  <StyledLink
                    href={msg.file_url}
                    target="_blank"
                    rel="noreferref"
                  >
                    {msg.file_name}
                  </StyledLink>
                ) : null}
                {/* text messages */}
                {msg.message && <Message>{msg.message}</Message>}
                <MessageDate>{formatDate(msg.created_at)}</MessageDate>
              </MessageContent>
            </MessageBubble>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </Messages>

      {/* File Preview */}
      {attachment && (
        <PreviewContainer>
          <h5>Previzualizare {previewUrl ? 'imagine' : 'document'}</h5>
          <div className="d-flex align-items-center justify-content-center">
            {previewUrl ? (
              <div className="d-flex flex-column align-items-center gap-1">
                <StyledPreviewImg src={previewUrl} width="120" />
                <div>{attachment.name}</div>
              </div>
            ) : (
              <div>{attachment.name}</div>
            )}
            <StyledButton type="button" onClick={clearAttachment}>
              <FontAwesomeIcon icon={faXmark} />
            </StyledButton>
          </div>
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
            onClick={() => onAcknowledgeConvo(visitor)}
          />
          <FileUploadInput
            id="file-upload"
            type="file"
            onChange={(e) => handleSelectFile(e.target.files[0])}
          />
          <SendingButton type="submit">
            {loadingSendMessage ? (
              <LoadingComponent size={'sm'} />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} />
            )}
          </SendingButton>
        </StyledForm>
      </Bottom>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </StyledChatInterface>
  );
}

export default ChatInterface;
