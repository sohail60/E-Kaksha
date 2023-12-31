import "./Appbar.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import baseURL from "./config.js";
import { currUserState } from "../store/atoms/admin";
import { useRecoilValue, useSetRecoilState } from "recoil";

const Appbar = () => {
  const setCurrUser = useSetRecoilState(currUserState);
  const currUser = useRecoilValue(currUserState);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL,
  });

  useEffect(() => {
    async function call() {
      const data = await api.get("/profile", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      if (data.data.role == "admin") {
        setCurrUser("admin");
      } else if (data.data.role == "user") {
        setCurrUser("user");
      }
    }
    call();
  }, [currUser]);

  function openAdmin() {
    navigate("/admin");
  }

  function openStudent() {
    navigate("/student");
  }

  function openAllcourses() {
    navigate("/allcourse");
  }

  function openAddcourses() {
    navigate("/addcourse");
  }

  function openPurchasedcourses() {
    navigate("/purchasedcourse");
  }

  function logout() {
    localStorage.setItem("token", null);
    setCurrUser(null);
    navigate("/");
  }

  if (currUser == "admin") {
    return (
      <nav className="navbar">
        <p className="logo">E-Kaksha</p>
        <div className="nav-links">
          <a onClick={openAllcourses} className="navlink-btn admin">
            All Courses
          </a>
          <a onClick={openAddcourses} className="navlink-btn admin">
            Add Course
          </a>
          <a onClick={logout} className="navlink-btn admin">
            Logout
          </a>
        </div>
      </nav>
    );
  } else if (currUser == "user") {
    return (
      <nav className="navbar">
        <p className="logo">E-Kaksha</p>
        <div className="nav-links">
          <a onClick={openAllcourses} className="navlink-btn student">
            All Courses
          </a>
          <a onClick={openPurchasedcourses} className="navlink-btn student">
            Purchased Courses
          </a>
          <a onClick={logout} className="navlink-btn student">
            Logout
          </a>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar">
        <p className="logo">E-Kaksha</p>
        <div className="nav-links">
          <a onClick={openAdmin} className="navlink-btn admin">
            Admin
          </a>
          <a onClick={openStudent} className="navlink-btn student">
            Student
          </a>
        </div>
      </nav>
    );
  }
};
export default Appbar;
