import moment from "moment";
import { formattedAmount } from "../utils/constants";
import "./order.css";
function Order({ order }) {
  const { amount, created, basket } = order.data;
  return (
    <div className="order">
      <div className="order__container">
        <h1 className="text-xl"> Order</h1>
        <div className="order__section text-lg">
          <p className="pb-2">
            Ordered date: {moment.unix(created).format("MMMM Do YYYY, h:mma")}
          </p>
          <p className="order__id ">Confirmation: {order.id}</p>
        </div>
        <div className="order__section ">
          <div className="order__details ">
            {basket && basket.length > 0 ? (
              basket.map((item) => (
                <div key={item.id} className="order__item flex p-6">
                  <img className="w-60 " src={item.image} alt={item.title} />
                  <div className="order__itemInfo pl-6 text-3xl">
                    <p> {item.title}</p>
                    <p className="order__itemPrice pb-2">
                      Price : {formattedAmount.format(item.price)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in the order.</p>
            )}
          </div>
          <h2 className="text-2xl font-bold">
            Order Total: {formattedAmount.format(amount / 100)}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Order;
