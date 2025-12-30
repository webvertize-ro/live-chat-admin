import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Visitor = styled.div`
  border: 1px solid black;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

function ConversationsList() {
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
    <div>
      {visitors?.map((visitor) => (
        <Visitor>
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
    </div>
  );
}

export default ConversationsList;
