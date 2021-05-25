import React from 'react'
import {Link} from 'react-router-dom'

function openForm() {
  document.getElementById("myForm").style.display = "block";
    }

    function closeForm() {
  document.getElementById("myForm").style.display = "none";
    }

function Trade() {
    
    return (
        <>
        <button class="open-button" onClick={openForm}>Chat</button>

        <div class="chat-popup" id="myForm">
        <form action="/action_page.php" class="form-container">
            <h1>Chat</h1>

            <label for="msg"><b>Message</b></label>
            <textarea placeholder="Type message.." name="msg" required></textarea>

            <button type="submit" class="btn">Send</button>
            <button type="button" class="btn cancel" onClick={closeForm}>Close</button>
        </form>
        </div>
        <button><Link to = '/'>Home</Link></button>
        
        </>
    )
    
}
    
    
    export default Trade;
