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
  flex: 1;
`;

const Conversation = styled.div`
  border: 1px solid black;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ConversationAvatar = styled.div``;

const ConversationInfo = styled.div``;

const ConversationNotification = styled.div`
  background-color: blueviolet;
  color: #fff;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  height: 20px;
  width: 20px;
  align-items: center;
  justify-content: center;
`;

const ConversationName = styled.div`
  display: flex;
`;

const ConversationPhoneNumber = styled.div`
  display: flex;
`;

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
              <strong>Nume: </strong>
              <div>{visitor.name}</div>
            </ConversationName>
            <ConversationPhoneNumber>
              <strong>Phone Number</strong>
              <div>{visitor.phone_number}</div>
            </ConversationPhoneNumber>
          </ConversationInfo>
          <ConversationNotification>3</ConversationNotification>
        </Conversation>
      ))}
    </StyledConversationsList>
  );
}

export default ConversationsList;
