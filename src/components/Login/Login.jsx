import React from 'react'
import style from './Login.module.css'
import { useFormik } from 'formik'
import values from './../../../node_modules/lodash-es/values';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from "yup";

export default function Login() {

   function handleLogin(values){
      console.log(values);
      
    }
   
  
  
    let myValidationSchema=Yup.object().shape({
      Email:Yup.string().email("invalid email").required("email is required"),
      Password:Yup.string().matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,"password must contain at least 1 uppercase letter and 1 special char").required("password is required"),
       })
  
  let formik = useFormik({
   initialValues:{
    
    Email:"",
    Password:"",
    
   },
   validationSchema:myValidationSchema 
  ,
   onSubmit:handleLogin
  
  });
  
  
    return (<>
   <div className='flex flex-wrap justify-around  mx-auto mt-5'>
   <div className="image w-2/6">
      <img className='' src="\src\assets\Frame2.png" alt="frame" />
    </div>
     <div className='sign-up'>
        <h2 className='font-bold text-2xl'>Login</h2>
        <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto mb-5 my-form">
    
    <div className="relative z-0 w-full mb-5 group">
        <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.Email} type="email" name="Email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label htmlFor="email" className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
    </div>
    {formik.errors.Email && formik.touched.Email ? <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
    {formik.errors.Email}
  </div> :''}
    <div className="relative z-0 w-full mb-5 group">
        <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.Password} type="Password" name="Password" id="Password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label htmlFor="Password" className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
    </div>
    {formik.errors.Password && formik.touched.Password ? <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
    {formik.errors.Password}
  </div> :''}
  
  
  <div className="w-full">
  <button type="submit" className=" my-butt log-butt w-full ">Login</button>
   
  </div >
  
  <div className="forget">
  <a className='link-color comp' href="#">Forget your password?</a>
  

  </div>
  <div className="login-link flex-column justify-around">
    <div>
    <p>New User? <Link to={"/"} className='link-color ' href="#">Create Account</Link></p>
        
    </div>
    <div>
    <a className='link-color comp mt-3' href="#">Login As Company Account</a>
      
    </div>
      </div>
    </form>
  
  
      </div>
   </div>
      </>
     
    )
}
