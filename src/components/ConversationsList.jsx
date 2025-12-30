import { useEffect, useState } from 'react';

function ConversationsList() {
  const [visitors, setVisitors] = useState(null);

  useEffect(() => {
    async function getConversations() {
      const res = await fetch('/api/getVisitors');
      const data = await res.json();
      setVisitors(data.visitors);
    }
    getConversations();
  }, []);

  return (
    <div>
      {visitors?.map((visitor) => (
        <div>
          <div>{visitor.name}</div>
          <div>{visitor.phone_number}</div>
        </div>
      ))}
    </div>
  );
}

export default ConversationsList;
