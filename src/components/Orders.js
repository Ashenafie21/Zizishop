

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import Order from "./Order";

import "./Orders.css";

const Orders = () => {
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = db
        .collection("users")
        .doc(user?.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) =>
          setOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );

      return () => {
        // Unsubscribe from the snapshot listener when the component unmounts
        unsubscribe();
      };
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <div className="orders">
      <h1 className="text-2xl ">Your Orders</h1>
      <div className="orders__order">
        {orders.length > 0 ? (
          orders.map((singleOrder) => (
            <div key={singleOrder.id}>
              <Order order={singleOrder} />
            </div>
          ))
        ) : (
          <p className="text-2xl text-center">
            You haven't placed any orders yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;

