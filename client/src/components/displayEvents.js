import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchEvents } from '../Requests/events';
import { likeEvent, dislikeEvent } from '../Requests/events';
import { userLikesEvent } from '../Requests/users';
import '../../src/globals.css'

const like = async (e, eventID) => {
    e.stopPropagation();
    try {
        userLikesEvent();
        const updatedUser = sessionStorage.getItem('user');

        if (updatedUser.data.liked_events.includes(eventID)) {
            likeEvent(eventID);
        } else {
            dislikeEvent(eventID);
        }
    } catch (error) {
        console.log(error);
    }
    fetchEvents();
};

const DisplayEvents = ({ filteredEvents, route}) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFilteredEvents = async () => {
        const filtered_events = await filteredEvents();
        setEvents(filtered_events);
        setLoading(false);
    }

    useEffect(() => {
        const navigationType = performance.getEntriesByType('navigation')[0]?.type;

        if (navigationType === 'reload') {
            fetchFilteredEvents();
        }
        else{
            fetchFilteredEvents()
        }
    }, []);
    if (loading) {
        return <div>Loading events...</div>;
    }
    else{
        return (
            <div className="past-events-container">
                <div className="past-events">
                {events.map(event => (
                    <div key={event.id}>
                        <Link to={`/${route}/${event.id}`} className="event">
                            <img src={event.img} alt={`Event ${event.id}`} />
                            <div className="event-topic">{event.topic}</div>
                            <div className="event-span">
                                <p>{event.date}</p>
                                <p>{event.time}</p>
                                <p>{event.location}</p>
                            </div>
                        </Link>
                        <div onClick={(e) => like(e, event.id)} className='like'>
                            <FontAwesomeIcon 
                                icon={faHeart} 
                                className='liked'
                            />
                            <p className='likes'>{event.likes}</p>
                        </div>
                    </div>
                ))}
            </div>
            </div>
           
        );
    }
};

export default DisplayEvents;