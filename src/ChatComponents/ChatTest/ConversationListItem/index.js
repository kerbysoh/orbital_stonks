import React from 'react';

import './ConversationListItem.css';

export default function ConversationListItem(props) {

    const {firstname, id} = props.data;

    return (
      <div className="conversation-list-item">
        <img className="conversation-photo" src=""/>
        <div className="conversation-info">
          <h1 className="conversation-title">{firstname}</h1>
          <p className="conversation-snippet">{ id }</p>
        </div>
      </div>
    );
}