import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/UserSlice';
import Sidebar from '../component/Sidebar';
import chat from '../assets/chat-04.jpg';
import io from 'socket.io-client';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('user', user);

  const fetchUserDetails = async () => {
    try {
      const URL = `https://chat-app-zac0.onrender.com/api/user-details`;
      const response = await axios.get(URL, { withCredentials: true });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }

      console.log('Current user details:', response);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  /*** Socket connection ***/
  useEffect(() => {
    const socketConnection = io('https://chat-app-zac0.onrender.com', {
      auth: { token: localStorage.getItem('token') },
    });

    socketConnection.on('onlineUser', (data) => {
      console.log('Online users:', data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  const isBasePath = location.pathname === '/';

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      {/* Sidebar Section */}
      <section className={`bg-white ${!isBasePath && 'hidden'} lg:block`}>
        <Sidebar />
      </section>

      {/* Outlet Section */}
      <section className={`${isBasePath ? 'hidden' : ''}`}>
        <Outlet />
      </section>

      {/* Centered Logo and Message */}
      {isBasePath && (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <img src={chat} width={273} alt="Chat Logo" className="rounded" />
          <p className="text-lg text-slate-500 bg-white p-2  rounded">
            Select a user to send a message.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
