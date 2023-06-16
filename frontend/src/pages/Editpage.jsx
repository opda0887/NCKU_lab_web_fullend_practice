import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Editpage = () => {
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const token = localStorage.getItem("token");
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
          console.log("Succeed in editpage"); // get json data
        } else {
          throw new Error("Failed to fetch user information");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to fetch user information");
      });
  }, [nav]);

  //todo: add handleEdit feature
  const handleEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (password) {
      formData.append("password", password);
    }
    if (birthday) {
      // 將日期字符串轉換為JavaScript的Date對象
      const dateObject = new Date(birthday);
      // 將JavaScript的Date對象轉換為ISO 8601格式的日期字符串
      const formattedDate = dateObject.toISOString();
      formData.append("birthday", formattedDate);
    }

    fetch("http://localhost:8888/user", {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("User updated successfully");
          nav("/userpage"); // 定向到"/userpage"页面
        } else {
          throw new Error("Edit failed");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Edit failed");
      });
  };

  return (
    <div className="nckupract__app__editpage">
      <h1>Edit page</h1>
      <form onSubmit={handleEdit}>
        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <label htmlFor="birthday">Birthday</label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
        />
        <button type="submit">Save change</button>
      </form>
    </div>
  );
};

export default Editpage;
