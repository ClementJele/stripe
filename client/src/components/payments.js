// PaymentApp.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import CompletePage from "./CompletePage";
import '../StripeStyling.css';
import '../loadingContainer.css';
import Sidebar from "./sidebar";

const stripePromise = loadStripe(process.env.STRIPE_PULIC_KEY);

export default function PaymentApp() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch('http://localhost:5252/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [{ id: "Volvo", amount: 14500 }]
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, []);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
    }
  };
  
  const options = {
    clientSecret,
    appearance,
  };

  const LoadingAnimation = () => {
    return (
      <div className="spinner-container">
        <svg className="pl" viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%" stopColor="hsl(313,90%,55%)" />
              <stop offset="100%" stopColor="hsl(223,90%,55%)" />
            </linearGradient>
            <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(313,90%,55%)" />
              <stop offset="100%" stopColor="hsl(223,90%,55%)" />
            </linearGradient>
          </defs>
          <circle 
            className="pl__ring" 
            cx="100" 
            cy="100" 
            r="82" 
            fill="none" 
            stroke="url(#pl-grad1)" 
            strokeWidth="36" 
            strokeDasharray="0 257 1 257" 
            strokeDashoffset="0.01" 
            strokeLinecap="round" 
            transform="rotate(-90,100,100)" 
          />
          <line 
            className="pl__ball" 
            stroke="url(#pl-grad2)" 
            x1="100" 
            y1="18" 
            x2="100.01" 
            y2="182" 
            strokeWidth="36" 
            strokeDasharray="1 165" 
            strokeLinecap="round" 
          />
        </svg>
      </div>
    );
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="DashboardContainer">
      <Sidebar />
      <div className="ContentArea">
        {loading && <LoadingAnimation />}

        {!loading && clientSecret && !paymentCompleted && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm onPaymentComplete={() => setPaymentCompleted(true)} />
          </Elements>
        )}

        {paymentCompleted && <CompletePage />}
      </div>
    </div>
  );
}