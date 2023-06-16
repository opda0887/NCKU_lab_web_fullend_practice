import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Userdetails = () => {
  const [userInfo, setUserInfo] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // 獲取 token
    const token = localStorage.getItem("token");

    // 發送GETrequest到/user端點
    fetch("http://localhost:8888/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // get json data
        } else {
          throw new Error("Failed to fetch user information");
        }
      })
      .then((data) => {
        setUserInfo(data.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to fetch user information");
        nav("/");
      });
  }, [nav]);

  const deleteUser = (e) => {
    e.preventDefault();

    // 獲取 token
    const token = localStorage.getItem("token");

    fetch("http://localhost:8888/user", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Delete user succeed");
          nav("/");
        } else {
          throw new Error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to delete user");
      });
  };

  // todo: add delete user methods
  return (
    <div className="nckupract__app__userdetails">
      {userInfo ? (
        <div className="nckupract__app__userdetails-userbox">
          <h2>User Information</h2>
          <p>
            <span className="bold">Username:</span> {userInfo.username}
          </p>
          <p>
            <span className="bold">Birthday:</span> {userInfo.birthday}
          </p>
          <p>
            <span className="bold">Create Time:</span> {userInfo.create_time}
          </p>
          <p>
            <span className="bold">Last Login:</span> {userInfo.last_login}
          </p>
          <Link className="edit" to="/editpage">
            Edit user details
          </Link>
          <button className="delete" onClick={deleteUser}>
            Delete user
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Userdetails;
