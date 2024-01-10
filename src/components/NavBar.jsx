import React, { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth, db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import Search from "./Search";
import Sidebar from "./sideBar";

function NavBar() {
  const cart = useSelector((state) => state.cart.productsNumber);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      dispatch(setUser(null));
      // Reset addressData after logout
      setAddressData({
        city: "",
        zipCode: "",
      });
      navigate("/");
    });
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const [addressData, setAddressData] = useState({
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (user && user.uid) {
          const addressSnapshot = await db
            .collection("users")
            .doc(user.uid)
            .get();

          if (addressSnapshot.exists) {
            const userData = addressSnapshot.data();
            setAddressData({
              city: userData.city || "",
              zipCode: userData.zipCode || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user's address:", error);
      }
    };

    if (user) {
      fetchAddress();
    }
  }, [user]);

  return (
    <header className="min-w-[1000px] mx-auto w-full">
      <div className="flex bg-amazonclone-light_blue text-white h-[60px]">
        {/* Left */}
        <div className="flex items-center m-4">
          <Link to={"/"}>
            <img
              className="h-[35px] w-[100px] m-2"
              src={"../images/amazon.png"}
              alt="Amazon logo"
            />
          </Link>
          <div className="pr-4 pl-4">
            <div className="text-xs xl:text-sm">
              Deliver to {user ? ` ${user.displayName || ""}` : ""}
            </div>
            <div className="text-sm xl:text-base font-bold">
              {addressData.city && addressData.zipCode
                ? `${addressData.city}, ${addressData.zipCode}`
                : "United States"}
            </div>
          </div>
        </div>
        {/* middle */}
        <div className="flex grow relative items-center">
          <Search />
        </div>
        {/* right */}
        <div className="flex items-center m-4">
          <>
            <div className="pr-4 pl-4">
              <div className="w-7 flex items-center mr-3">
                <img
                  src="../images/amricanflag.jpg"
                  alt="American flag"
                  className="mr-1"
                />
                <p>EN</p>
              </div>
            </div>
          </>
          <>
            <Link to={"/login"}>
              <div className="pr-4 pl-4">
                <div className="text-xs xl:text-sm">
                  Hello, {user ? user.displayName || user.email : "Signin"}
                </div>
                <div className="text-sm xl:text-base font-bold">
                  Accounts & Lists
                </div>
              </div>
            </Link>
            <Link to={"/orders"}>
              <div className="pr-4 pl-4">
                <div className="text-xs xl:text-sm">Returns</div>
                <div className="text-sm xl:text-base font-bold">& Orders</div>
              </div>
            </Link>
          </>
          <Link to={"/checkout"}>
            <div className="flex pr-3">
              <ShoppingCartIcon className="h-[48px]" />
              <div className="relative">
                <div className="absolute right-[9px] font-bold m-2 text-orange-400">
                  {cart}
                </div>
              </div>
              <div className="mt-7 text-xs xl:text-sm font-bold">Cart</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex items-center pb-3 bg-amazonclone-light_blue text-white">
        <div
          className="cursor-pointer flex items-center mr-3"
          onClick={handleToggleSidebar}
        >
          {/* Hamburger icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          All
        </div>

        {/* Render Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          handleToggleSidebar={handleToggleSidebar}
          handleSignOut={handleSignOut}
          user={user}
        />
        <div className="flex items-center ml-3">
          <div className="mr-3 cursor-pointer">Deals</div>
          <div className="pr-3 pl-3 mr-3 cursor-pointer">Medical Care</div>
          <div className="mr-3 cursor-pointer">Best Sellers</div>
          <div className="mr-3 cursor-pointer">Amazon Basics</div>
          <div className="mr-3 cursor-pointer">Registry</div>
          <div className="mr-3 cursor-pointer">Today's Deals</div>
          <div className="mr-3 cursor-pointer">New Releases</div>
          <div className="cursor-pointer">Prime</div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
