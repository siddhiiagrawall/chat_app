import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '..';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Signup.css';

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  }

  const isFormValid = user.fullName && user.userName && user.password.length >= 6 && user.confirmPassword && user.gender;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.message) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">Join us and start chatting today</p>

        <form onSubmit={onSubmitHandler}>
          <div>
            <label className="signup-label">Full Name</label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className='signup-input'
              type="text"
              placeholder='John Doe'
              required
            />
          </div>
          <div>
            <label className="signup-label">Username</label>
            <input
              value={user.userName}
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
              className='signup-input'
              type="text"
              placeholder='johndoe123'
              required
            />
          </div>

          <div>
            <label className="signup-label">Password</label>
            <div className="password-input-container">
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className='signup-input'
                type={showPassword ? "text" : "password"}
                placeholder='Min 6 characters'
                required
              />
              <button
                type="button"
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="signup-helper-text">Must contain at least 6 characters</p>
          </div>

          <div>
            <label className="signup-label">Confirm Password</label>
            <div className="password-input-container">
              <input
                value={user.confirmPassword}
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                className='signup-input'
                type={showConfirmPassword ? "text" : "password"}
                placeholder='Confirm your password'
                required
              />
              <button
                type="button"
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="gender-selection">
            <label className="gender-radio">
              <input
                type="radio"
                name="gender"
                checked={user.gender === "male"}
                onChange={() => handleCheckbox("male")}
              />
              <span>Male</span>
            </label>
            <label className="gender-radio">
              <input
                type="radio"
                name="gender"
                checked={user.gender === "female"}
                onChange={() => handleCheckbox("female")}
              />
              <span>Female</span>
            </label>
          </div>

          <button
            type='submit'
            className='signup-button'
            disabled={!isFormValid || loading}
          >
            {loading ? <span className="spinner"></span> : "Sign Up"}
          </button>
        </form>

        <div className="signup-links">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup