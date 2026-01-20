import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useConversations from '../hooks/useConversations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import LoadingComponent from './LoadingComponent';

const StyledConversationsList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.loading ? 'center' : 'unset')};
  align-items: ${(props) => (props.loading ? 'center' : 'unset')};
  overflow-y: scroll;
  flex: 1.5;
  grid-area: sidebar;
  border-right: 1px solid #e0e0e0;
  position: relative;

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

  @media (max-width: 576px) {
    position: absolute;
    z-index: 999;
    overflow-y: scroll;
    height: 100vh;
  }
`;

const SearchBarTotal = styled.div`
  position: sticky;
  top: 0;
  background-color: rgba(26, 109, 65, 1);
  color: #fff;
  z-index: 10;
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
  background-color: ${(props) =>
    props.isSelected ? 'rgba(26, 109, 65, 0.75)' : '#fff'};
  color: ${(props) => (props.isSelected ? '#fff' : '#000')};
  transition: all 0.3s ease;

  &:hover {
    cursor: pointer;
    background-color: rgb(26, 109, 65, 0.75);
    color: #fff;
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

function ConversationsList({
  onSelectedConvo,
  onAcknowledgeConvo,
  selectedConvo,
  soundEnabled,
  setReplyTo,
}) {
  const { loading, conversations, error } = useConversations({ soundEnabled });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    function calculateNotifications() {
      let totalNotifications = 0;
      conversations.forEach((conv) => {
        totalNotifications += conv.unread_count_admin;
      });

      return totalNotifications;
    }

    calculateNotifications();

    document.title = `${
      calculateNotifications() > 0
        ? `(${calculateNotifications()}) Chat Edion Trans`
        : `Chat Edion Trans`
    }`;
  }, [conversations]);

  if (loading)
    return (
      <StyledConversationsList loading={loading}>
        <LoadingComponent />
      </StyledConversationsList>
    );
  if (error) return <p>Error: {error}</p>;

  const filteredConversations = conversations.filter((conversation) => {
    const query = searchInput.toLowerCase();

    return (
      conversation.name?.toLowerCase().includes(query) ||
      conversation.phone_number?.toLowerCase().includes(query)
    );
  });

  function handleConversationClick(visitor) {
    onSelectedConvo(visitor);
    onAcknowledgeConvo(visitor);
    setReplyTo(null);
  }

  // Notifications in the page title

  return (
    <StyledConversationsList>
      <SearchBarTotal>
        <StyledH4>Conversații</StyledH4>
        <ConversationsSearchBar>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Caută după nume sau număr de telefon..."
              aria-label="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            ></input>
          </form>
        </ConversationsSearchBar>
      </SearchBarTotal>

      {filteredConversations.map((visitor, i) => (
        <Conversation
          key={visitor.id}
          isSelected={visitor?.id === selectedConvo?.id}
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
              </NameLastSeen>
            </ConversationName>
            <ConversationPhoneNumber>
              <strong>Phone Number:</strong>
              <div>{visitor.phone_number}</div>
            </ConversationPhoneNumber>
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
