// import React from 'react';
// import Sidebar from '../../components/sidebar.js';
// import FavouriteEvents from '../../components/favouriteEvents.js';
// import UpcomingEvents from '../../components/upcomingEvents.js';
// import FilteredEvents from '../../components/filteredEvents.js';
// import EventList from '../../components/search.js';
// import '../../globals.css';


// const Home = () => {

//     const Types = [
//         'Sports',
//         'Religion',
//         'Education',
//         'Music',
//         'Arts and Culture',
//         'Business and Networking',
//         'Food and Drink',
//         'Community and Social',
//         'Health and Wellness',
//         'Charity and Fundraising',
//         'Technology',
//         'Family',
//       ];

//     return (
//         <div className="DashboardContainer">
//             <Sidebar/>
//             <div className="ContentArea">
            
//                         <div>
//                             <h2 className='title-home'>
//                                 Favourite Events
//                             </h2>
//                         </div>
//                         <div className="past-events-container">
                            
//                             <FavouriteEvents />
//                         </div>

//                         {Types.map((type, index) => (
//                             <React.Fragment key={index}>
//                                 <h2 className='upcoming-events'>{type}</h2>
//                                   <div className="past-events-container">

                                    
//                                         <div className="past-events-container">
//                                         <FilteredEvents type={type} />
//                                         </div>
//                                   </div>
                                
//                             </React.Fragment>
//                         ))}

//                     </div>  
//                 </div>
//     );
// }

// export default Home;

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar.js';
import FavouriteEvents from '../../components/favouriteEvents.js';
import FilteredEvents from '../../components/filteredEvents.js';
import '../../globals.css';
import SearchBar from '../../components/SearchBar.js';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState(''); // State to store the search query

    const Types = [
        'Sports', 'Religion', 'Education', 'Music', 'Arts and Culture',
        'Business and Networking', 'Food and Drink', 'Community and Social',
        'Health and Wellness', 'Charity and Fundraising', 'Technology', 'Family',
    ];

    useEffect(() => {
        // Your scroll-related logic here if needed
    }, []);

    return (
        <div className="DashboardContainer">
            <Sidebar />
            <div className="ContentArea">
                <div className='Topbar'>
                    <h2 className='h2-topbar'>Get all your events with a single click</h2>
                    <SearchBar query={searchQuery} setQuery={setSearchQuery} /> {/* Pass query state to SearchBar */}
                </div>
                <div className='MainContent'>
                    <div>
                        <h2 className='title-home'>Favourite Events</h2>
                    </div>
                    <div className="past-events-container">
                        <FavouriteEvents />
                    </div>

                    {Types.map((type, index) => (
                        <React.Fragment key={index}>
                            <h2 className='upcoming-events'>{type}</h2>
                            <div className="past-events-container">
                                <div className="past-events-container">
                                    <FilteredEvents type={type} searchQuery={searchQuery} /> {/* Pass searchQuery to FilteredEvents */}
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>  
        </div>
    );
};

export default Home;
