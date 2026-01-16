import ConversationsList from './ConversationsList';
import ChatInterface from './ChatInterface';
import styled from 'styled-components';
import { useState } from 'react';
import Logout from './authentication/Logout';
import Logo from './Logo';
import { useAdminSettings } from '../hooks/useAdminSettings';

const StyledChatLayout = styled.div`
  display: grid;
  height: 100vh;
  overflow-y: hidden;
  grid-template-rows: 100px 1fr;
  grid-template-columns: 2.5fr 6fr;
  grid-template-areas: 'header header' 'sidebar main';
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

function ChatLayout() {
  const { settings, loading, toggleNotificationSound } = useAdminSettings();

  const [selectedConvo, setSelectedConvo] = useState(null);

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

  return (
    <>
      <StyledChatLayout>
        <Header>
          <Logo />
          <NotificationLabel>
            <input
              type="checkbox"
              checked={settings.notification_sound_enabled}
              onChange={(e) => toggleNotificationSound(e.target.checked)}
            />
            {settings.notification_sound_enabled ? 'enabled' : 'not enabled'}
          </NotificationLabel>
          <Logout />
        </Header>
        <ConversationsList
          soundEnabled={settings.notification_sound_enabled}
          onSelectedConvo={handleSelectedConvo}
          onAcknowledgeConvo={acknowledgeConvo}
          selectedConvo={selectedConvo}
        />
        <ChatInterface
          selectedConvo={selectedConvo}
          onAcknowledgeConvo={acknowledgeConvo}
          visitor={selectedConvo}
        />
      </StyledChatLayout>
    </>
  );
}

export default ChatLayout;
