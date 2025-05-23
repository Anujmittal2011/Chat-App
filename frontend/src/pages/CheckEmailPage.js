import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaRegCircleUser } from "react-icons/fa6";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: ''
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔁 Hardcoded backend URL
    const URL = `https://chat-app-zac0.onrender.com/api/email`;

    try {
      const response = await axios.post(URL, data, {
        withCredentials: true
      });

      toast.success(response.data.message);

      if (response.data.success) {
        setData({ email: '' });
        navigate('/password', {
          state: response?.data?.data
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }

    console.log('Submitted data:', data);
  };

  return (
    <div className='mt-5'>
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className='w-fit mx-auto mb-3'>
          <FaRegCircleUser size={80} />
        </div>

        <h3>Welcome to Chat App!</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wider"
          >
            Let's Go
          </button>
        </form>

        <p className=" text-lg px-4 my-2">
          New User?
          <Link to="/register" className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
