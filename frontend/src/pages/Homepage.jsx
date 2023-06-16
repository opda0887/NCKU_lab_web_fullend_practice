import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  // set token to none
  localStorage.setItem("token", " ");

  return (
    <div className="nckupract__app__homepage">
      <h1>The homepage</h1>
      <Link className="login" to="/loginpage">
        Go to Login
      </Link>
      <Link className="register" to="/registerpage">
        Go to Rgister
      </Link>
    </div>
  );
};

export default Homepage;
