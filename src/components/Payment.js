import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import "./Payment.css";
import { formattedAmount } from "../utils/constants";
import {
  removeFromCart,
  decrementInCart,
  incrementInCart,
  emptyBasket,
} from "../redux/cartSlice";
import ProductDetails from "./ProductDetails";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "../utils/CallApi";

function Payment() {
  const products = useSelector((state) => state.cart.products);
  const itemsNumber = useSelector((state) => state.cart.productsNumber);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const subtotal = useSelector((state) =>
    state.cart.products.reduce(
      (subtotal, product) => subtotal + product.price * product.quantity,
      0
    )
  );
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [clientSecret, setClientSecret] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [userAddress, setUserAddress] = useState(null);

  const [addressData, setAddressData] = useState({
    country: "",
    fullName: "",
    streetAddress: "",
    aptSuite: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const addressSnapshot = await db
          .collection("users")
          .doc(user?.uid)
          .get();

        if (addressSnapshot.exists) {
          const userData = addressSnapshot.data();
          // Only update the state if the form is not shown (addressData is empty)
          if (!showAddressForm) {
            setAddressData((prevAddressData) => ({
              ...prevAddressData, // Retain existing user data
              country: userData.country || "",
              fullName: userData.fullName || "",
              streetAddress: userData.streetAddress || "",
              aptSuite: userData.aptSuite || "",
              city: userData.city || "",
              state: userData.state || "",
              zipCode: userData.zipCode || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user's address:", error);
      }
    };

    if (user && !showAddressForm) {
      fetchAddress();
    }
  }, [user, showAddressForm]);
  
  const handleOverlayClick = (e) => {
    // Check if the clicked element is not within the form
    if (!e.target.closest(".new-address-form")) {
      setShowAddressForm(false);
    }
  };

  const handleAddressChangeClick = () => {
    // Show the address form when "Add Delivery Address" or "Change Address" is clicked
    setAddressData({
      country: "",
      fullName: "",
      streetAddress: "",
      aptSuite: "",
      city: "",
      state: "",
      zipCode: "",
    });

    setShowAddressForm(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    try {
      await db
        .collection("users")
        .doc(user?.uid)
        .set(addressData, { merge: true });

      // Reset the form after successfully saving the address
      // setAddressData({
      //   country: "",
      //   fullName: "",
      //   streetAddress: "",
      //   aptSuite: "",
      //   city: "",
      //   state: "",
      //   zipCode: "",
      // });

      setShowAddressForm(false);
    } catch (error) {
      console.error("Error saving user's address:", error);
    }
  };


  const handleSumit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const basketItems = products.map((product) => ({
      id: product.id,
      title: product.title,
      image: product.image_small,
      price: product.price,
      quantity: product.quantity,
    }));

    const orderData = {
      amount: subtotal * 100,
      created: Math.floor(Date.now() / 1000),
      subtotal: subtotal,
      basket: basketItems,
    };

    const orderId = `pi_${Math.random().toString(36).substring(2, 15)}`;

    try {
      await db
        .collection("users")
        .doc(user?.uid)
        .collection("orders")
        .doc(orderId)
        .set(orderData);

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      setSucceeded(true);
      setError(null);
      setProcessing(false);
      dispatch(emptyBasket());
      navigate("/orders");
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Failed to process payment. Please try again.");
      setProcessing(false);
    }
  };

  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };
  // Check if any of the address fields is empty

  const isAddressEmpty =
    !addressData.country ||
    !addressData.fullName ||
    !addressData.streetAddress ||
    !addressData.city ||
    !addressData.state ||
    !addressData.zipCode;

  return (
    <div className="payment">
      <div className="payment__container">
        <h1 className="text-xl">
          Checkout (
          <Link to="/checkout">
            <span className="text-blue-600 cursor-pointer">
              {itemsNumber} items
            </span>
          </Link>
          )
        </h1>

        <div className="payment__title ml-5">
          <h3>Review items and delivery</h3>
        </div>
        <div className="payment__section new__address">
          <div className="payment__title">
            <h3 className="itmes">Shippping address</h3>
            <h3 className="itmes" onClick={handleAddressChangeClick}>
              {addressData.streetAddress
                ? "Change Address"
                : "Add Delivery Address"}
            </h3>
          </div>
          <div className="payment__address">
            {user?.displayName && !showAddressForm && (
              <div>
                <p>{user?.displayName}</p>
                {isAddressEmpty ? (
                  <p>
                    <strong>Please add a delivery address</strong>
                  </p>
                ) : (
                  <>
                    <p>{addressData.streetAddress}</p>
                    <p>{addressData.aptSuite}</p>
                    <p>
                      {addressData.city}, {addressData.state}{" "}
                      {addressData.zipCode}
                    </p>
                    {/* ... (display other address fields) */}
                  </>
                )}
              </div>
            )}
            {!showAddressForm && !userAddress && (
              <button onClick={handleAddressChangeClick}>
                {addressData.streetAddress
                  ? "Change Address"
                  : "Add Delivery Address"}
              </button>
            )}
            {showAddressForm && (
              <div className="new-address-overlay" onClick={handleOverlayClick}>
                <div className="new-address-form">
                  <form onSubmit={handleAddressSubmit}>
                    <label htmlFor="country">Country/Region</label>
                    <input
                      type="text"
                      id="country"
                      value={addressData.country}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          country: e.target.value,
                        })
                      }
                    />

                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      value={addressData.fullName}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          fullName: e.target.value,
                        })
                      }
                    />

                    <label htmlFor="streetAddress">Street Address</label>
                    <input
                      type="text"
                      id="streetAddress"
                      value={addressData.streetAddress}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          streetAddress: e.target.value,
                        })
                      }
                    />

                    <label htmlFor="aptSuite">
                      Apt, Suite, Building, Floor
                    </label>
                    <input
                      type="text"
                      id="aptSuite"
                      value={addressData.aptSuite}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          aptSuite: e.target.value,
                        })
                      }
                    />

                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      value={addressData.city}
                      onChange={(e) =>
                        setAddressData({ ...addressData, city: e.target.value })
                      }
                    />

                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      value={addressData.state}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          state: e.target.value,
                        })
                      }
                    />

                    <label htmlFor="zipCode">Zip Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      value={addressData.zipCode}
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          zipCode: e.target.value,
                        })
                      }
                    />

                    <button type="submit">Save Address</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="payment__section">
          <div className="col-span-6 bg-white">
            {products.map((product) => {
              return (
                <div key={product.id}>
                  <div className="grid grid-cols-12 divide-y divide-gray-400 mr-4">
                    <div className="col-span-10 grid grid-cols-8 divide-y divide-gray-400">
                      <div className="col-span-2">
                        <Link to={`/product/${product.id}`}>
                          <img
                            className="p-4 m-auto"
                            src={product.image_small}
                            alt="Checkout product"
                          />
                        </Link>
                      </div>
                      <div className="col-span-6">
                        <div className="font-medium text-black mt-2">
                          <Link to={`/product/${product.id}`}>
                            <ProductDetails product={product} ratings={false} />
                          </Link>
                        </div>
                        <div>
                          <button
                            className="text-sm xl:text-base font-semibold rounded text-red-700 mt-2 mb-1 cursor-pointer"
                            onClick={() => dispatch(removeFromCart(product.id))}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="grid grid-cols-3 w-20 text-center">
                          <div
                            className="text-xl xl:text-2xl bg-gray-400 rounded cursor-pointer"
                            onClick={() =>
                              dispatch(decrementInCart(product.id))
                            }
                          >
                            -
                          </div>
                          <div className="text-lg xl:text-xl bg-gray-200">
                            {product.quantity}
                          </div>
                          <div
                            className="text-xl xl:text-2xl bg-gray-400 rounded cursor-pointer"
                            onClick={() =>
                              dispatch(incrementInCart(product.id))
                            }
                          >
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-lg xl:text-xl mt-2 mr-4 font-semibold">
                        {formattedAmount.format(product.price)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-[400px] ml-20 text-sm border border-solid">
            <div className="text-center">
              <p className="bg-yellow-400">use this payment method</p>
              <p>
                Choose a payment method to continue checking out. You'll still
                have a chance to review and edit your order before it's final.
              </p>
            </div>
            <div className="ml-5">
              <h1 className="text-2xl">Order Summary</h1>
              <p> Items: {formattedAmount.format(subtotal)}</p>
              <p>Shipping & Handling: ---</p>
              <p>Total before tax: --</p>
              <p>Estimated tex to be collected --</p>
              <h2 className="text-2xl font-bold ">
                Order Total: {formattedAmount.format(subtotal)}
              </h2>
            </div>
            <div className="payment__section">
              <div className="payment__title">
                <h3 className="text-xl font-semibold pr-2">Payment Method</h3>
              </div>
              <div className="payment__details">
                <form onSubmit={handleSumit}>
                  <CardElement onChange={handleChange} />
                  <div className="payment__priceContainer m-3">
                    <button disabled={processing || disabled || succeeded}>
                      <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                    </button>
                  </div>
                  {error && <div>{error}</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;