

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { auth } from "../utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useDispatch } from "react-redux";

function Login() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        navigate("/");
      })
      .catch((error) => setError("Invalid email or password "));
  };

  const register = (e) => {
    e.preventDefault();
    if (password !== reenteredPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, { displayName: name })
          .then(() => {
            setUser(user);
            navigate("/");
          })
          .catch((error) => setError(error.message));
      })
      .catch((error) => setError(error.message));
  };

  const toggleRegistration = () => {
    setIsRegistering(!isRegistering);
    setError(null);
  };

  return (
    <div className="login">
      <Link to="/">
        <img
          className="login__logo"
          src={"../images/amazon_login_logo.svg.png"}
          alt="Amazon Logo"
        />
      </Link>
      <div className="login__container">
        <h1>{isRegistering ? "Create Account" : "Sign-in"}</h1>

        <form className="login__form">
          {isRegistering && (
            <>
              <h5>Name</h5>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="login__input"
              />
            </>
          )}

          <h5>E-mail</h5>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login__input"
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login__input"
          />

          {isRegistering && (
            <>
              <h5>Re-enter Password</h5>
              <input
                type="password"
                value={reenteredPassword}
                onChange={(e) => setReenteredPassword(e.target.value)}
                className="login__input"
              />
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          {user ? (
            <button className="login__signInButton" disabled>
              Welcome, {user.displayName}
            </button>
          ) : (
            <button
              type="submit"
              onClick={isRegistering ? register : signIn}
              className="login__signInButton"
            >
              {isRegistering ? "Create Account" : "Sign In"}
            </button>
          )}
        </form>

        <p>
          {isRegistering
            ? "Already have an account? "
            : "By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & Sale. Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice."}
        </p>

        <button onClick={toggleRegistration} className="login__registerButton">
          {isRegistering
            ? "Already have an account? Sign in"
            : "Create your Amazon Account"}
        </button>
      </div>
    </div>
  );
}

export default Login;
