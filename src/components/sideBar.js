
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SideBar.css";

const Sidebar = ({
  isSidebarOpen,
  handleToggleSidebar,
  handleSignOut,
  user,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add or remove the 'overflow-hidden' class on the body based on sidebar status
    if (isSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSidebarOpen]);

  // Function to close the sidebar and navigate
  const handleLinkClick = (path) => {
    // Close the sidebar
    handleToggleSidebar();

    // Navigate to the specified path
    navigate(path);
  };

  // Function to handle sign out, close sidebar, and navigate to the home page
  const handleSignOutAndNavigateHome = async () => {
    // Sign out logic here (adjust as per your authentication system)
    await handleSignOut();

    // Close the sidebar
    handleToggleSidebar();

    // Navigate to the home page
    navigate("/");
  };

  return (
    <div>
      {/* Overlay for blurring the content */}
      <div
        className={`custom-overlay fixed top-0 left-0 h-screen w-screen bg-black opacity-70 z-40 ${
          isSidebarOpen ? "" : "hidden"
        }`}
        onClick={handleToggleSidebar} // Close sidebar when overlay is clicked
      />

      {/* Sidebar */}
      <div
        className={`custom-sidebar fixed top-0 left-0 h-screen w-[24rem] text-white z-50 ${
          isSidebarOpen ? "open" : "closed"
        }`}
      >
        <div onClick={handleToggleSidebar} className="cursor-pointer pr-50">
          {/* Close icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 mb-2 ml-auto -mr-10 custom-close-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        {/* Use handleLinkClick for all the links */}
        <Link to="/login" onClick={() => handleLinkClick("/login")}>
          <div className="flex -mt-12 text-xl font-bold items-center bg-gray-800 h-16 custom-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 mr-2 ml-5 custom-svg-icon"
            >
              <path
                strokeLinecap="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <div className="custom-greeting">
              Hello, {user ? user.displayName || user.email : "Signin"}
            </div>
          </div>
        </Link>
        {/* Additional links using handleLinkClick */}
        <div className="bg-white text-black pl-8 max-h-screen overflow-y-auto">
          <h1 className="custom-trending-title text-2xl bold pb-3 font-bold">
            Trending
          </h1>
          <Link to="/dashboard" onClick={() => handleLinkClick("/dashboard")}>
            <p className="custom-link"> Best Seller</p>
          </Link>
          <Link to="/profile" onClick={() => handleLinkClick("/profile")}>
            <div className="relative  py-3">
              <p>Movers & Shakers</p>
              <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-500 -ml-8 "></div>
            </div>
          </Link>

          <div className="relative space-y-3 py-2">
            <h1 className="text-xl font-bold">Digital Content & Devices</h1>
            <p>Prime Video</p>
            <p>Amazon Music </p>
            <p>echo & Alexa</p>
            <p>Fire Tablets</p>
            <p>Fire TV</p>
            <p>Kindle E-readers & Books </p>
            <p>Audible Books & Originals</p>
            <p>Amazon Photos</p>
            <p>Amazon Appstore</p>
            <div className="absolute left-0 right-0  bottom-0 h-px bg-gray-500 -ml-8 "></div>{" "}
          </div>
          <div className="space-y-3 relative py-3">
            <h1 className="text-xl font-bold">Shop By Department</h1>
            <p>Clothing, Shoes Jewelry & watches</p>
            <p> Books </p>
            <p>Mobies, Music & Games</p>
            <p> Electronics</p>
            <div className="absolute left-0 right-0  bottom-0 h-px bg-gray-500 -ml-8 "></div>{" "}
          </div>
          <div className="relative space-y-3 py-2">
            <h1 className="text-xl font-bold">Programs & Features</h1>
            <p>Whole Foods Market</p>
            <p>Medical Care & Pharmacy</p>
            <p>Amazon physical Stores</p>
            <p>Subscribe & Save</p>
            <div className="absolute left-0 right-0  bottom-0 h-px bg-gray-500 -ml-8 "></div>{" "}
          </div>
          <div className="mb-16">
            <div className="space-y-3 py-2 ">
              <h1>Help & Settings</h1>
              <p>Your Account</p>
              <p>English</p>
              <p>United States</p>
            </div>

            <div>
              {user && (
                <div
                  className=" cursor-pointer custom-sign-out"
                  onClick={handleSignOutAndNavigateHome}
                >
                  Sign Out
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
