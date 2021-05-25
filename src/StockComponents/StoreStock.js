import React, {useState, useRef} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';

function StoreStock() {
  const [newListItem, setNewListItem] = useState([]);
  const [show, setShow] = useState(false);
  const input = useRef();
  const changeOpen = () => setShow(true);
  const changeClose = () => setShow(false);

  var addToList = e => {
    e.preventDefault();
    setNewListItem([...newListItem, input.current.value]);
  };

  return (
    <div className="StoreStock">
      <h2>Watch List
          <btn onClick={changeOpen}>Add to the List</btn>
      </h2>

      <Modal show={show} onHide={changeClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <form onSubmit={addToList}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Input Stock Ticker</Form.Label>
              <br />
              <Form.Control type="text" ref={input} placeholder="Stock..." />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Add to List</Button>
          </Modal.Footer>
        </form>
      </Modal>

      <ul>
        {newListItem.map((item, b) => (
          <li key={b}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default StoreStock;