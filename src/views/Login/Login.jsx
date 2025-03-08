import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import config from '../../config';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const apiUrl = config.BASE_URL;

  const onSubmit = async (data) => {
    const requestData = {
      ...data,
      remindMe: true,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/Auth/login`,
        requestData
      );
      console.log(response, 'response');
      console.log(response.data.data.token, 'response');
      // Store token in localStorage
      localStorage.setItem('token', JSON.stringify(response.data.data));
      // Set up axios to use the token in subsequent requests
      // axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast.error("Invalid Credentials")
      reset();
    }
  };
  // };

  return (

    <div className="container login-container">
      <div><Toaster /></div>
      <StyledWrapper>
        <div className="login-box">
          <p>Login</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="user-box">
              <input
                required
                name="username"
                type="text"
                autoComplete="off"
                value={'hardik@outrightsoftware.com'}
                {...register('userName', { required: true })}
              />
              <label>Username</label>
            </div>
            <div className="user-box">
              <input
                required
                name="password"
                type="password"
                autoComplete="off"
                value={'Admin@123'}
                {...register('password', { required: true })}
              />
              <label>Password</label>
            </div>
            <button type="submit">
              <span />
              <span />
              <span />
              <span />
              Submit
            </button>
          </form>
        </div>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    padding: 40px;
    margin: 20px auto;
    transform: translate(-50%, -55%);
    background: rgba(0, 0, 0, 0.9);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
    border-radius: 10px;
  }

  button {
    border: none;
    outline: none;
    color: black;
    background: #03e9f4;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
  }

  .login-box p:first-child {
    margin: 0 0 30px;
    padding: 0;
    color: #fff;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .login-box .user-box {
    position: relative;
  }

  .login-box .user-box input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
    background: transparent;
  }

  .login-box .user-box label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    pointer-events: none;
    transition: 0.5s;
  }

  .login-box .user-box input:focus ~ label,
  .login-box .user-box input:valid ~ label {
    top: -20px;
    left: 0;
    color: #fff;
    font-size: 12px;
  }

  .login-box form button {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    font-weight: bold;
    color: #fff;
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s;
    margin-top: 40px;
    letter-spacing: 3px;
  }

  .login-box button:hover {
    background: #fff;
    color: #272727;
    border-radius: 5px;
  }

  .login-box button span {
    position: absolute;
    display: block;
  }

  .login-box button span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #fff);
    animation: btn-anim1 1.5s linear infinite;
  }

  @keyframes btn-anim1 {
    0% {
      left: -100%;
    }

    50%,
    100% {
      left: 100%;
    }
  }

  .login-box button span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #fff);
    animation: btn-anim2 1.5s linear infinite;
    animation-delay: 0.375s;
  }

  @keyframes btn-anim2 {
    0% {
      top: -100%;
    }

    50%,
    100% {
      top: 100%;
    }
  }

  .login-box button span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #fff);
    animation: btn-anim3 1.5s linear infinite;
    animation-delay: 0.75s;
  }

  @keyframes btn-anim3 {
    0% {
      right: -100%;
    }

    50%,
    100% {
      right: 100%;
    }
  }

  .login-box button span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #fff);
    animation: btn-anim4 1.5s linear infinite;
    animation-delay: 1.125s;
  }

  @keyframes btn-anim4 {
    0% {
      bottom: -100%;
    }

    50%,
    100% {
      bottom: 100%;
    }
  }

  .login-box p:last-child {
    color: #aaa;
    font-size: 14px;
  }

  .login-box button.a2 {
    color: #fff;
    text-decoration: none;
  }

  .login-box button.a2:hover {
    background: transparent;
    color: #aaa;
    border-radius: 5px;
  }
`;

export default Login;
