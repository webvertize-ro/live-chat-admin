import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useConversations from '../hooks/useConversations';

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
  flex-direction: column;
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
          <ConversationName>
            <strong>Nume: </strong>
            <div>{visitor.name}</div>
          </ConversationName>
          <ConversationPhoneNumber>
            <strong>Phone Number</strong>
            <div>{visitor.phone_number}</div>
          </ConversationPhoneNumber>
        </Conversation>
      ))}
    </StyledConversationsList>
  );
}

export default ConversationsList;
