import React from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormatToBE from '../../../utils/FormatToBE';
import AccommodationService from "../../../services/api/accommodation/accommodation.service";


const BookPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isCredit, setIsCredit] = React.useState(false);
   const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  const createBooking = async() => {
    try{
      await AccommodationService.createBooking(checkIn, checkOut)
      if(isCredit) {
        navigate('/credit-card');
      }else{
        navigate('/qr-code');
      }
    }
    catch (error) {
      console.error("Error creating booking:", error);
      // Handle error appropriately, e.g., show a notification
    }finally {
      // Optionally, redirect or show a success message
      console.log("Booking created successfully");
    }
  }
    return (

            <div className="container">

              <div className="mb-2" style={{ color: '#888', fontSize: '1em' }}>
                <span className="me-3">เช็คอิน: <b>{FormatToBE(checkIn) || 'ไม่ระบุ'}</b></span>
                <span className="me-3">เช็คเอาท์: <b>{FormatToBE(checkOut) || 'ไม่ระบุ'}</b></span>

            </div>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
        <Form.Control
          placeholder="Username"
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
      </InputGroup>

      <Form.Label htmlFor="basic-url">Your vanity URL</Form.Label>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon3">
          https://example.com/users/
        </InputGroup.Text>
        <Form.Control id="basic-url" aria-describedby="basic-addon3" />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control aria-label="Amount (to the nearest dollar)" />
        <InputGroup.Text>.00</InputGroup.Text>
      </InputGroup>

      <InputGroup>
        <InputGroup.Text>With textarea</InputGroup.Text>
        <Form.Control as="textarea" aria-label="With textarea" />
      </InputGroup>

       <Button variant="primary" onClick={createBooking()}>Booking Now</Button>
    </div>
        
    );
}

export default BookPage;