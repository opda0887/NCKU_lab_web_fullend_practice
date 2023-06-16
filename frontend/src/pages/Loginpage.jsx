import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 根據要求，要用 FormData 傳送資料
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // fecth 到 login 這個 endpoint，並取得token
    fetch("http://localhost:8888/login", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        // 存储token到localstorage
        localStorage.setItem("token", data.access_token);
        nav("/userpage"); // 定向到"/userpage"页面
      })
      .catch((error) => {
        console.error(error);
        alert("Login failed");
      });
  };

  return (
    <div className="nckupract__app__loginpage">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Loginpage;
