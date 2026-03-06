import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess, API_BASE_URL} from '../utils'
function Signup() {

  const [signupInfo, setSignupInfo]= useState({
    name:'',
    email:'',
    password:''
  })

  const navigate=useNavigate();

  const handleChange= (e)=>{
    const {name,value} =e.target;
    const copySignupInfo={...signupInfo};
    copySignupInfo[name]=value;
    setSignupInfo(copySignupInfo);

  }
  const handleSignup= async (e)=>{
    e.preventDefault()
    const {name,email,password}=signupInfo;
    if(!name || !email || !password){
      return handleError('All fields are required');
    }
    try {
      const url=`${API_BASE_URL}/auth/signup`;
      const response=await fetch(url,{
        method: "POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      });
      const result=await response.json();
      const {success,message,error}=result;

      if(success){
        handleSuccess(message);
        setTimeout(()=>{
          navigate('/login')
        },1000)
      }else if(error){
        const details=error?.details[0].message;
        handleError(details);
      }else if(!success){
        handleError(message);
      }
      console.log(result);
    } catch (err) {
        handleError(err)
      
    }
  }
  return (
    <div className="min-h-screen w-full flex justify-center items-start pt-[50px] bg-white">
      {/* Container replacement: shadow-2xl and bg-aliceblue */}
      <div className="bg-[#f0f8ff] p-8 md:px-12 rounded-xl w-[95%] max-w-[450px] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)]">
        <h1 className="text-3xl font-bold mb-5 text-gray-800">SignUp</h1>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="flex flex-col">
               <label className="text-xl mb-1 text-gray-700 font-medium" htmlFor='name'>Full Name</label>
               <input
                onChange={handleChange}
                type='text'
                name='name'
                autoFocus
                placeholder='Enter your name...'
                value={signupInfo.name}
                className="w-full text-xl p-2.5 border-b border-black bg-transparent outline-none placeholder:text-xs placeholder:italic focus:border-blue-600 transition-all"
                />
            </div>
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-700" htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
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
              value={signupInfo.password}
              className="w-full text-xl p-2.5 border-b border-black bg-transparent outline-none placeholder:text-xs placeholder:italic"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl py-2.5 rounded-md mt-2 transition-colors cursor-pointer active:scale-95">
            Sign Up
          </button>

          <span className="text-sm text-center text-gray-600">
           Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Signup
