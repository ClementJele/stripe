import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Logout from './components/logout';
import Landing from './Pages/Landing/Landing';
import CreateEvent from './Pages/CreateEvent/CreateEvent';
import EventDetails from './Pages/EventDetails/EventDetails';
import EventDetailss from './components/eventDetails'; 
import Notifications from './Pages/Nofications/Notifications';
import MyEvents from './Pages/MyEvents/MyEvents';
import Calendar from './Pages/Calendar/Calendar';
import EventDetailsCard from './Pages/EventDetailsCard/EventDetailsCard';
import Home from './Pages/Home/Home';
import RegisterEvent from './components/RegisterEvent';  // Import RegisterEvent component
import DetailsCard from './components/detailsCard'; // Adjust the import path as necessary
import CompletePage from './components/CompletePage';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Payment from './components/payments';
import PurchaseTickets from './components/purchaseTickets';
import TicketsPage from './components/TicketsPage';
import LusionScene from './components/LusionScene'; 
// import LusionPage from './Pages/LusionScene/LusionPage';
import Reviews from '../src/Pages/Reviews/Reviews';


const stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY
console.log(stripeKey, 'KEY')
console.log(process.env.REACT_APP_USER_URI, 'testing')
const stripePromise = loadStripe(stripeKey);
console.log(process.env.REACT_APP_STRIPE_PUBLIC_KEY, 'STRIPE KEY')


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/:eventID" element={<EventDetailsCard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/myevents/:eventID" element={<EventDetails />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/lusionscene" element={<LusionScene />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/events/:eventID" element={<DetailsCard />} />
        <Route path="/events/:eventID/register" element={<RegisterEvent />} />
        <Route path="/payments/*" element={<Payment />} />
        <Route path="/purchase-tickets" element={<PurchaseTickets />} />
        <Route path="/eventDetails/:eventID" element={<EventDetailss />} /> 
        <Route 
          path="/completion" 
          element={
            <Elements stripe={stripePromise}>
              <CompletePage />
            </Elements>
          } 
        />
        {/* <Route path="/lusion" element={<LusionPage />} /> */}
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
