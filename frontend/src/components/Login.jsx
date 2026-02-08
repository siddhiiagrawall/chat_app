import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '..';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState({
    userName: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      navigate("/");
      console.log(res);
      dispatch(setAuthUser(res.data.user));
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Login failed. Please check your connection.";
      toast.error(errorMessage);
    }
    setUser({
      userName: "",
      password: ""
    })
  }
  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Enter your credentials to access your account</p>

        <form onSubmit={onSubmitHandler}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              value={user.userName}
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
              type="text"
              placeholder="Enter your username"
              className="login-input"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              placeholder="Enter your password"
              className="login-input"
              required
            />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="login-links">
          <Link to="/signup">Don't have an account? Create Account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login