import { useEffect } from 'react';

function ConversationsList() {
  useEffect(() => {
    async function getConversations() {
      const res = await fetch('/api/getVisitors');
      const data = await res.json();
      console.log(data);
    }
    getConversations();
  }, []);

  return <div></div>;
}

export default ConversationsList;
