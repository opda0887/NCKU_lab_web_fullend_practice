import React from "react";
import { Routes, Route } from "react-router-dom"; // ! npm install react-router-dom
import {
  Homepage,
  Loginpage,
  Registerpage,
  Userdetails,
  Editpage,
} from "./pages";

const App = () => {
  return (
    <div className="nckuprct__app">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/loginpage" element={<Loginpage />} />
        <Route path="/registerpage" element={<Registerpage />} />
        <Route path="/userpage" element={<Userdetails />} />
        <Route path="/editpage" element={<Editpage />} />
      </Routes>
    </div>
  );
};

export default App;
