
import { useFormik } from 'formik'

import { Link } from 'react-router-dom';
import * as Yup from "yup";

export default function Info() {
  function handleLogin(values){
    console.log(values);
    
  }

    
  
  let myValidationSchema=Yup.object().shape({
    Headline:Yup.string().required("headline is required"),
    
    
     })

let formik = useFormik({
 initialValues:{
  
  Headline:"",
 
  
  
 },
 validationSchema:myValidationSchema 
,
 onSubmit:handleLogin

});
  return (
    <>
       <div className=' border-2 border-solid border-[#d9d9d9] rounded-3xl p-12 pt-8  w-[75%] mx-auto mt-9 '>
        <h2 className='text-3xl mb-3 font-bold  py-3'>Tell us more about you</h2>
        <form onSubmit={formik.handleSubmit} className=" mx-auto mb-1 my-form p-3 ">

    <div className="relative z-0 w-full mb-9 group">
          <input onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.Headline} type="text" name="Headline" id="Headline" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-black focus:outline-none focus:ring-0 focus:border-black peer" placeholder=" " required />
          <label htmlFor="Headline" className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6">Headline*</label>
      </div>
      {formik.errors.Headline && formik.touched.Headline ? <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
      {formik.errors.Headline}
    </div> :''}
   
   

  <button type="submit" className=" my-butt  text-xl font-bold rounded-2xl "><Link to={"/"}>Next</Link></button>
  </form>
  
  
  
      </div>
    </>
  )
}
