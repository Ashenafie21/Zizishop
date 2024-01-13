import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./redux/authSlice";
import { auth } from "./utils/firebase";
import "./App.css";
import {
  HomePage,
  NavBar,
  SearchResults,
  Checkout,
  ProductPage,
  Login,
  Payment,
  Orders,
} from "./components";
// const stripekey = process.env.REACT_APP_STRIPE;
const stripekey  ='pk_test_51OPvWsE20rTG9mx1Sd2vvcDhqLQNQNZBpOzGK5Q8Bqclnz8MXOcVLKkXtcXw8aF9L58QxIlFv3x4RAzAP84NdjpZ00lZK1aYup'
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // console.log("Stripe Key:", stripekey);
        const stripeInstance = await loadStripe(stripekey); 
        setStripe(stripeInstance);
        // console.log(stripeInstance);
      } catch (error) {
        console.error("Error initializing Stripe:", error);
      }
    };

    initializeStripe();
  }, []);



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(setUser(authUser));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router >
      <NavBar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/payment"
          element={
            stripe ? (
              <Elements stripe={stripe}>
                <Payment />
              </Elements>
            ) : null
          }
        />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}

export default App;
