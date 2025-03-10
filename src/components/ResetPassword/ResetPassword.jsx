
import { useFormik } from 'formik'

import { Link, useNavigate } from 'react-router-dom';
import * as Yup from "yup";

export default function ResetPassword() {

   function handleReset(values){
      console.log(values);
      
    }
   
  
  
    let myValidationSchema=Yup.object().shape({
      Password:Yup.string().matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,"password must contain at least 1 uppercase letter and 1 special char").required("password is required"),
      ConfirmPassword:Yup.string().oneOf([Yup.ref("Password")],"invalid confirmation password").required("confirm password is required"),
       })
  
  let formik = useFormik({
   initialValues:{
  
    Password:"",
    ConfirmPassword:""
    
   },
   validationSchema:myValidationSchema 
  ,
   onSubmit:handleReset
  
  });
  
  
    return (<>
   <div className='flex flex-wrap justify-around  mx-auto w-full  mt-5'>
 
     <div className='border-2 border-solid border-[#d9d9d9] rounded-[7%] p-12 pt-8  w-[40%]'>
        <h2 className='text-xl font-extrabold pb-7'>Create New Password</h2>
        <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto mb-1 my-form ">
    
    
    <div className="relative z-0 w-full mb-5 group">
        <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.Password} type="Password" name="Password" id="Password" className="block py-3.5 pb-5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-black focus:outline-none focus:ring-0 focus:border-black peer" placeholder=" " required />
        <label htmlFor="Password" className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6">Password</label>
    </div>
    {formik.errors.Password && formik.touched.Password ? <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
    {formik.errors.Password}
  </div> :''}

  <div className="relative z-0 w-full mb-5 group">
      <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.ConfirmPassword} type="Password" name="ConfirmPassword" id="ConfirmPassword" className="block py-3.5 pb-5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-black focus:outline-none focus:ring-0 focus:border-black peer" placeholder=" " required />
      <label htmlFor="ConfirmPassword" className=" left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6">Confirm Password</label>
  </div>
  {formik.errors.ConfirmPassword && formik.touched.ConfirmPassword ? <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  {formik.errors.ConfirmPassword}
</div> :''}
  
  
  <div className="w-full">
  <button type="submit" className="  w-[75%] bg-[#6a0dad] text-white my-7 mt-10 py-2 px-6 rounded-lg text-lg font-bold ">Update Password</button>
   
  </div >
  
  
      
    </form> 
  
  
      </div>
   </div>
      </>
     
    )
}
