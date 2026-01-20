import ConversationsList from './ConversationsList';
import ChatInterface from './ChatInterface';
import styled from 'styled-components';
import { useState } from 'react';
import Logout from './authentication/Logout';
import Logo from './Logo';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faVolumeHigh,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faVolumeXmark } from '@fortawesome/free-solid-svg-icons';

const StyledChatLayout = styled.div`
  display: grid;
  height: 100vh;
  overflow-y: hidden;
  grid-template-rows: 100px 1fr;
  grid-template-columns: 2.5fr 6fr;
  grid-template-areas: 'header header' 'sidebar main';

  @media (mx-width: 576px) {
    grid-template: 'header' 100px 'main';
  }
`;

const Header = styled.div`
  grid-area: header;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const NotificationLabel = styled.label``;

const NotificationButton = styled.button`
  border: none;
  background-color: transparent;
  color: #1ca079;
  font-size: 1.2rem;

  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

function ChatLayout() {
  const { settings, loading, toggleNotificationSound } = useAdminSettings();

  const [selectedConvo, setSelectedConvo] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [isListOpen, setIsListOpen] = useState(true);

  function handleSelectedConvo(visitorId) {
    console.log(selectedConvo);
    setSelectedConvo(visitorId);
  }

  console.log('selectedConvo is: ', selectedConvo);

  async function acknowledgeConvo(visitor) {
    await fetch('/api/acknowledgeConversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: visitor.id }),
    });
  }

  if (loading) return null;

  const enabled = settings.notification_sound_enabled;

  return (
    <>
      <StyledChatLayout>
        <Header>
          <button type="button" onClick={(prev) => setIsListOpen(!prev)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <Logo />
          <div className="d-flex align-items-center justify-content-center gap-2">
            <NotificationLabel>
              <NotificationButton
                onClick={() => toggleNotificationSound(!enabled)}
              >
                {enabled ? (
                  <FontAwesomeIcon icon={faVolumeHigh} />
                ) : (
                  <FontAwesomeIcon icon={faVolumeXmark} />
                )}
              </NotificationButton>
            </NotificationLabel>
            <Logout />
          </div>
        </Header>
        {isListOpen && (
          <ConversationsList
            soundEnabled={settings.notification_sound_enabled}
            onSelectedConvo={handleSelectedConvo}
            onAcknowledgeConvo={acknowledgeConvo}
            selectedConvo={selectedConvo}
            setReplyTo={setReplyTo}
            isListOpen={isListOpen}
            setIsListOpen={setIsListOpen}
          />
        )}
        <ChatInterface
          replyTo={replyTo}
          setReplyTo={setReplyTo}
          selectedConvo={selectedConvo}
          onAcknowledgeConvo={acknowledgeConvo}
          visitor={selectedConvo}
        />
      </StyledChatLayout>
    </>
  );
}

export default ChatLayout;
