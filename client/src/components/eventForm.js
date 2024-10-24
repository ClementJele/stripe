import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { fetchEvents } from '../Requests/events';

// Styled-components
const FormContainer = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: linear-gradient(to right,#fafafa, #7b7b7b);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);`
;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  background-color: transparent;`
;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;`
;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;`
;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
  }`
;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  min-height: 120px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }`
;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #003b5b;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0178b8;
  }`
;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  margin-top: 1rem;
  border-radius: 5px;`
;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
  }`
;

const availableVenues = async () => {
  let venues;
  const value = process.env.REACT_APP_VENUES_API_KEY;
  const url = `${process.env.REACT_APP_VENUES_API}`;
  await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': value,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      venues = data;
    })
    .catch(error => console.error('Error:', error.message));
  return venues;
};

const EventForm = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    event_type: '',
    end_date: '',
    end_time: '',
    location: '',
    capacity: '',
    firstname: '',
    lastname: '',
    email: '',
    poster: null, // State to hold the file
    isPaid: 'free', // Field to determine if tickets are free or paid
    ticketPrices: { // Store ticket prices as an object
      general: '',
      vip: '',
    },
  });

  const [venues, setVenues] = useState([]);
  const eventTypes = [
    'Sports',
    'Religion',
    'Education',
    'Music',
    'Arts and Culture',
    'Business and Networking',
    'Food and Drink',
    'Community and Social',
    'Health and Wellness',
    'Charity and Fundraising',
    'Technology',
    'Family',
  ];
  // Handle input changes
// Handle input changes
const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'location') {
    const selectedVenue = venues.find((venue) => venue.Name === value);
    if (selectedVenue) {
      setFormData({
        ...formData,
        [name]: value,
        capacity: selectedVenue.Capacity,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
        capacity: '',
      });
    }
  } else if (name === 'ticketPriceGeneral' || name === 'ticketPriceVIP') {
    const ticketType = name === 'ticketPriceGeneral' ? 'general' : 'vip';
    setFormData({
      ...formData,
      ticketPrices: {
        ...formData.ticketPrices,
        [ticketType]: value,
      },
    });
  } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
};

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      poster: file,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataImg = new FormData();
    formDataImg.append('image', formData.poster);
    let posterUrl;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_STORAGE_URI}/api/storage/upload`,
        formDataImg,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setImageUrl(response.data.imageUrl);
      posterUrl = response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image', error);
    }

    // Prepare event data
    const { title, description, location, event_type, capacity, firstname, lastname, email, ticketPrices, isPaid } = formData;
    const startDateArr = formData.start_date.split('-');
    const startTimeArr = formData.start_time.split(':');
    const endDateArr = formData.end_date.split('-');
    const endTimeArr = formData.end_time.split(':');

    const event = {
      name: title,
      description,
      start_date: new Date(startDateArr[0], startDateArr[1] - 1, startDateArr[2], startTimeArr[0], startTimeArr[1]),
      end_date: new Date(endDateArr[0], endDateArr[1] - 1, endDateArr[2], endTimeArr[0], endTimeArr[1]),
      location,
      event_type,
      poster: posterUrl,
      capacity,
      likes: 0,
      creator: {
        name: firstname,
        surname: lastname,
        email,
      },
      ticket: {
        type: isPaid === 'paid' ? 'paid' : 'free',
        price: {
          general: ticketPrices.general ? parseFloat(ticketPrices.general) : 0, // Convert to float
          vip: ticketPrices.vip ? parseFloat(ticketPrices.vip) : 0, // Convert to float
        },
      },
    };
    

    // Create the event
    try {
      const createdEvent = await axios.post(
        `${process.env.REACT_APP_API_URI}/api/events/create`,
        event,
        {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      ).then((response) => {
        return response.data._id;
      });

      const myEvent = {
        entry: createdEvent,
      };
      const user = JSON.parse(sessionStorage.getItem('user'));

      await axios.put(
        `${process.env.REACT_APP_USER_URI}/api/users/event/${user._id}`,
        myEvent,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      await fetchEvents();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchVenues = async () => {
      const venuesData = await availableVenues();
      setVenues(venuesData);
    };

    fetchVenues();
  }, []);

  return (
    <FormContainer>
      <FormTitle>Create a New Event</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Event Title</Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Event Type</Label>
          <Select name="event_type" value={formData.event_type} onChange={handleChange} required>
            <option value="">Select Event Type</option>
            {eventTypes.map((type) => (
              <option value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Start Date</Label>
          <Input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Start Time</Label>
          <Input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>End Date</Label>
          <Input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>End Time</Label>
          <Input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Location</Label>
          <Select name="location" value={formData.location} onChange={handleChange} required>
            <option value="">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue.Id} value={venue.Name}>
                {venue.Name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Capacity</Label>
          <Input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Label>First Name</Label>
          <Input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Last Name</Label>
          <Input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Poster Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {imageUrl && <ImagePreview src={imageUrl} alt="Poster Preview" />}
        </FormGroup>

        <FormGroup>
          <Label>Ticket Type</Label>
          <Select name="isPaid" value={formData.isPaid} onChange={handleChange}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </Select>
        </FormGroup>

        {formData.isPaid === 'paid' && (
          <>
            <FormGroup>
              <Label>General Ticket Price</Label>
              <Input
                type="number"
                name="ticketPriceGeneral"
                value={formData.ticketPrices.general}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>VIP Ticket Price</Label>
              <Input
                type="number"
                name="ticketPriceVIP"
                value={formData.ticketPrices.vip}
                onChange={handleChange}
              />
            </FormGroup>
          </>
        )}

        <Button type="submit">Create Event</Button>
      </form>
    </FormContainer>
  );
};

export default EventForm;