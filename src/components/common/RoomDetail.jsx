import React, { useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



function TypeDetailModal(props) {

    console.log("Modal props:", props);
  return (
    <Modal
    {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          {props.detail.name}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TypeDetailModal;
