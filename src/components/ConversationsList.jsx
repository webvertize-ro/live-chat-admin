import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useConversations } from '../hooks/useConversations';

const StyledConversationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 650px;
  overflow-y: scroll;
  flex: 1;
`;

const Visitor = styled.div`
  border: 1px solid black;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

function ConversationsList() {
  const { conversations, loading, error } = useConversations();

  if (loading) return <p>Loading conversations...</p>;
  if (error) return <p>Error: {error}</p>;

  const [visitors, setVisitors] = useState(null);

  useEffect(() => {
    async function getConversations() {
      const res = await fetch('/api/getVisitors');
      const data = await res.json();
      setVisitors(data.visitors || []);
    }
    getConversations();
  }, []);

  return (
    <StyledConversationsList>
      {visitors?.map((visitor) => (
        <Visitor key={visitor.id}>
          <div>
            <strong>Name</strong>
            <div>{visitor.name}</div>
          </div>
          <div>
            <strong>Phone Number</strong>
            <div>{visitor.phone_number}</div>
          </div>
        </Visitor>
      ))}
    </StyledConversationsList>
  );
}

export default ConversationsList;
