import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  products: [],
  productsNumber: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if the product exists in the array
      const productExists = state.products.find(
        (product) => product.id === action.payload.id
      );
      if (productExists) {
        productExists.quantity += parseInt(action.payload.quantity);
      } else {
        state.products.push({
          ...action.payload,
          quantity: parseInt(action.payload.quantity),
        });
      }
      state.productsNumber =
        state.productsNumber + parseInt(action.payload.quantity);
    },

    removeFromCart: (state, action) => {
      // Find the product to remove from the array
      const productToRemove = state.products.find(
        (product) => product.id === action.payload
      );
      if (productToRemove) {
        // Remove the quantity from the product number
        state.productsNumber = state.productsNumber - productToRemove.quantity;
        // Find the index of the product to remove
        const index = state.products.findIndex(
          (product) => product.id === action.payload
        );
        // Remove from the array
        state.products.splice(index, 1);
      }
    },

    incrementInCart: (state, action) => {
      const itemInc = state.products.find((item) => item.id === action.payload);
      if (itemInc.quantity >= 1) {
        itemInc.quantity = itemInc.quantity + 1;
      }
      state.productsNumber = state.productsNumber + 1;
    },
    // decrementInCart: (state, action) => {
    //   const itemDec = state.products.find((item) => item.id === action.payload);
    //   if (itemDec.quantity === 1) {
    //     const index = state.products.findIndex(
    //       (item) => item.id === action.payload
    //     );
    //     state.products.splice(index, 1);
    //   } else {
    //     itemDec.quantity--;
    //   }
    //   state.productsNumber = state.productsNumber - 1;
    // },
    decrementInCart: (state, action) => {
      const itemDec = state.products.find((item) => item.id === action.payload);

      // Check if the quantity is greater than 1 before decrementing
      if (itemDec.quantity > 1) {
        itemDec.quantity--;
        state.productsNumber = state.productsNumber - 1;
      }
    },
    emptyBasket: (state) => {
      state.products = [];
      state.productsNumber = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementInCart,
  decrementInCart,
  emptyBasket,
} = cartSlice.actions;
export default cartSlice.reducer;
