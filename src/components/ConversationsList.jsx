import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useConversations from '../hooks/useConversations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

const StyledConversationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 650px;
  overflow-y: scroll;
  flex: 1.25;

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

const Conversation = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(225, 231, 239, 0.5);
`;

const Name = styled.div`
  display: flex;
  gap: 0.2rem;
`;

const LastSeen = styled.div`
  font-size: 0.75rem;
`;

const NameLastSeen = styled.div``;

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
  gap: 0.25rem;
`;

const ConversationLastMessage = styled.div``;

function ConversationsList({ onSelectedConvo }) {
  const { loading, conversations, error } = useConversations();

  if (loading) return <p>Loading conversations...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <StyledConversationsList>
      {conversations.map((visitor, i) => (
        <Conversation key={i} onClick={() => onSelectedConvo(visitor)}>
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
          <ConversationNotification>3</ConversationNotification>
        </Conversation>
      ))}
    </StyledConversationsList>
  );
}

export default ConversationsList;
