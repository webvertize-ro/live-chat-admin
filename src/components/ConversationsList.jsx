import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useConversations from '../hooks/useConversations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

const StyledConversationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: scroll;
  flex: 1.5;
  grid-area: sidebar;
  border-right: 1px solid #e0e0e0;
  padding: 16px;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(116, 164, 255, 0.352);
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1ca079;
    outline: 1px solid slategrey;
  }
`;

const StyledH4 = styled.h4`
  padding-left: 2rem;
  padding-top: 1rem;
`;

const ConversationsSearchBar = styled.div`
  padding: 1rem;
`;

const Conversation = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(225, 231, 239, 0.5);

  &:hover {
    cursor: pointer;
  }
`;

const NameLastSeen = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Name = styled.div`
  display: flex;
  gap: 0.2rem;
`;

const LastSeen = styled.div`
  font-size: 0.75rem;
`;

const ConversationAvatar = styled.div`
  background-color: lightgrey;
  padding: 0.75rem;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConversationInfo = styled.div``;

const ConversationNotification = styled.div`
  background-color: #89b11c;
  color: #fff;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  height: 20px;
  width: 20px;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
`;

const ConversationName = styled.div`
  display: flex;
`;

const ConversationPhoneNumber = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ConversationLastMessage = styled.div``;

function ConversationsList({ onSelectedConvo }) {
  const { loading, conversations, error } = useConversations();
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    function calculateNotifications() {
      let totalNotifications = 0;
      conversations.forEach((conv) => {
        totalNotifications += conv.unread_count;
      });

      return totalNotifications;
    }

    calculateNotifications();

    document.title = `(${calculateNotifications()}) Chat Edion Trans`;
  }, [conversations]);

  if (loading) return <p>Loading conversations...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredConversations = conversations.filter((conversation) => {
    const query = searchInput.toLowerCase();

    return (
      conversation.name?.toLowerCase().includes(query) ||
      conversation.phone_number?.toLowerCase().includes(query)
    );
  });

  async function handleConversationClick(visitor) {
    onSelectedConvo(visitor);

    await fetch('/api/acknowledgeConversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: visitor.id }),
    });
  }

  // Notifications in the page title

  return (
    <StyledConversationsList>
      <StyledH4>Conversații</StyledH4>
      <ConversationsSearchBar>
        <form className="d-flex">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Caută..."
            aria-label="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          ></input>
        </form>
      </ConversationsSearchBar>
      {filteredConversations.map((visitor, i) => (
        <Conversation
          key={visitor.id}
          onClick={() => handleConversationClick(visitor)}
        >
          <ConversationAvatar>
            <FontAwesomeIcon icon={faUser} />
          </ConversationAvatar>
          <ConversationInfo>
            <ConversationName>
              <NameLastSeen>
                <Name>
                  <strong>Nume: </strong>
                  <div>{visitor.name}</div>
                </Name>
                <LastSeen>acum 2 min</LastSeen>
              </NameLastSeen>
            </ConversationName>
            <ConversationPhoneNumber>
              <strong>Phone Number:</strong>
              <div>{visitor.phone_number}</div>
            </ConversationPhoneNumber>
            <ConversationLastMessage>
              <div>{'ultimul mesaj din conversatie'}</div>
            </ConversationLastMessage>
          </ConversationInfo>
          {visitor.unread_count > 0 && (
            <ConversationNotification>
              {visitor.unread_count}
            </ConversationNotification>
          )}
        </Conversation>
      ))}
      {filteredConversations.length === 0 && <p>Nicio conversație găsită.</p>}
    </StyledConversationsList>
  );
}

export default ConversationsList;
