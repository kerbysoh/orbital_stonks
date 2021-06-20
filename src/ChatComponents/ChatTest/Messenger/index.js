import React from 'react';
import ConversationList from '../ConversationList';
import Message from '../Message';
import './Messenger.css';

export default function Messenger(props) {
    return (
      <div className="messenger">

        <div className="scrollable sidebar">
          <ConversationList />
        </div>
         <div className="scrollable content">
          <Message />
        </div>
        
      </div>
    );
}