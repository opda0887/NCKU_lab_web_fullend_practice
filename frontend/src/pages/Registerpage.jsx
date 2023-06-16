import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registerpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const nav = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    if (birthday) {
      // 將日期字符串轉換為JavaScript的Date對象
      const dateObject = new Date(birthday);
      // 將JavaScript的Date對象轉換為ISO 8601格式的日期字符串
      const formattedDate = dateObject.toISOString();
      formData.append("birthday", formattedDate);
    }

    fetch("http://localhost:8888/user", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Register failed");
        }
      })
      .then((data) => {
        // 存储token到localstorage
        localStorage.setItem("token", data.access_token);
        alert("Register complete, please login your account");
        nav("/loginpage"); // 定向到"/login"页面
      })
      .catch((error) => {
        console.error(error);
        alert("Register failed");
      });
  };

  return (
    <div className="nckupract__app__registerpage">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <label htmlFor="birthday">Birthday:</label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registerpage;
