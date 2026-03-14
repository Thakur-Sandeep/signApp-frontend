import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess,API_BASE_URL } from '../utils'
function Login() {

  const [loginInfo, setLoginInfo]= useState({
    email:'',
    password:''
  })

  const navigate=useNavigate();
  const handleChange= (e)=>{
    const {name,value} =e.target;
    const copyLoginInfo={...loginInfo};
    copyLoginInfo[name]=value;
    setLoginInfo(copyLoginInfo);

  }
  const handleLogin= async (e)=>{
    e.preventDefault()
    const {email,password}=loginInfo;
    if(!email || !password){
      return handleError('All fields are required');
    }
    try {
      const url=`${API_BASE_URL}/auth/login`;
      const response=await fetch(url,{
        method: "POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
      const result=await response.json();
      const {success,message,jwtToken,name,userId,error}=result;
      if(success){
        handleSuccess(message);
        localStorage.setItem('token',jwtToken);
        localStorage.setItem("loggedInUser",name);
        localStorage.setItem("userId",userId);

        setTimeout(()=>{
          navigate('/home')
        },1000)
      }else if(error){
        const details=error?.details[0].message;
        handleError(details);
      }else if(!success){
        handleError(message);
      }
      
    } catch (err) {
        handleError(err)
      
    }
  }
  return (
    <div className="min-h-screen w-full flex justify-center items-start pt-[50px] bg-white">
      
      <div className="bg-[#f0f8ff] p-8 md:px-12 rounded-xl w-[95%] max-w-[450px] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)]">
        <h1 className="text-3xl font-bold mb-5 text-gray-800">Login</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-700" htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={loginInfo.email}
              className="w-full text-xl p-2.5 border-b border-black bg-transparent outline-none placeholder:text-xs placeholder:italic"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-700" htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={loginInfo.password}
              className="w-full text-xl p-2.5 border-b border-black bg-transparent outline-none placeholder:text-xs placeholder:italic"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl py-2.5 rounded-md mt-2 transition-colors cursor-pointer active:scale-95">
            Login
          </button>

          <span className="text-sm text-center text-gray-600">
            Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Signup</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
