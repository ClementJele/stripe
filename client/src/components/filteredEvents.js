// import React, { useEffect, useState } from 'react';
// import DisplayEvents from "./displayEvents";
// import { fetchEvents } from "../Requests/events";

// function stringifyDate(date1, date2) {
//     date1 = new Date(date1);
//     date2 = new Date(date2);
    
//     const monthNames = [
//         "January", "February", "March", "April", "May", "June", 
//         "July", "August", "September", "October", "November", "December"
//     ];

//     const start_hour = String(date1.getHours()).padStart(2, '0');
//     const start_minute = String(date1.getMinutes()).padStart(2, '0');
//     const end_hour = String(date2.getHours()).padStart(2, '0');
//     const end_minute = String(date2.getMinutes()).padStart(2, '0');

//     const time = `${start_hour}:${start_minute} - ${end_hour}:${end_minute}`;
//     const date = `${date1.getDate()} ${monthNames[date1.getMonth()]} ${date1.getFullYear()}`;
    
//     return [time, date];
// }

// const FilteredEvents = ({type}) => {
//     const filteredEvents = async () => {
//         const Events = [];
//         await fetchEvents();
//         const data = JSON.parse(sessionStorage.getItem('events'));
//         for (let i = 0; i < Object.keys(data).length; i++) {
//             const event = {
//                 id: data[i]._id,
//                 img: data[i].poster,
//                 topic: data[i].name,
//                 event_type: data[i].event_type,
//                 time: stringifyDate(data[i].start_date, data[i].end_date)[0],
//                 date: stringifyDate(data[i].start_date, data[i].end_date)[1],
//                 location: data[i].location,
//                 likes: data[i].likes
//             };
    
//             if(data[i].event_type == type){
//                 Events.push(event);
//             }
//         }
//         return Events;
//     };

//     return (
//         <DisplayEvents filteredEvents={filteredEvents} route={"home"}/>
//     );
// }

// export default FilteredEvents;
import React, { useEffect, useState } from 'react';
import DisplayEvents from "./displayEvents";
import { fetchEvents } from "../Requests/events";
import SearchBar from "./SearchBar";

function stringifyDate(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const start_hour = String(date1.getHours()).padStart(2, '0');
    const start_minute = String(date1.getMinutes()).padStart(2, '0');
    const end_hour = String(date2.getHours()).padStart(2, '0');
    const end_minute = String(date2.getMinutes()).padStart(2, '0');

    const time = `${start_hour}:${start_minute} - ${end_hour}:${end_minute}`;
    const date = `${date1.getDate()} ${monthNames[date1.getMonth()]} ${date1.getFullYear()}`;
    
    return [time, date];
}

const FilteredEvents = ({type}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEvents = async () => {
        const Events = [];
        await fetchEvents();
        const data = JSON.parse(sessionStorage.getItem('events'));
        
        for (let i = 0; i < Object.keys(data).length; i++) {
            const event = {
                id: data[i]._id,
                img: data[i].poster,
                topic: data[i].name,
                event_type: data[i].event_type,
                time: stringifyDate(data[i].start_date, data[i].end_date)[0],
                date: stringifyDate(data[i].start_date, data[i].end_date)[1],
                location: data[i].location,
                likes: data[i].likes
            };
    
            // First check if event matches the type filter
            const matchesType = !type || data[i].event_type === type;
            
            // Then check if event matches the search query
            const matchesSearch = !searchQuery || 
                event.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase());

            // Only add event if it matches both conditions
            if (matchesType && matchesSearch) {
                Events.push(event);
            }
        }
        return Events;
    };

    return (
        <div >
            
            <DisplayEvents 
                filteredEvents={filteredEvents} 
                route={"home"}
            />
        </div>
    );
};

export default FilteredEvents;