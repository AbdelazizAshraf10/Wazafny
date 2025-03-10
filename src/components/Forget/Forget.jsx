import React from "react";
import style from "./Forget.module.css";
import { useFormik } from "formik";
import values from "./../../../node_modules/lodash-es/values";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function Forget() {
  function handleLogin(values) {
    console.log(values);
  }

  let myValidationSchema = Yup.object().shape({
    Email: Yup.string().email("invalid email").required("email is required"),
  });

  let formik = useFormik({
    initialValues: {
      Email: "",
    },
    validationSchema: myValidationSchema,
    onSubmit: handleLogin,
  });
  return (
    <>
      <div className=" border-2 border-solid border-[#d9d9d9] rounded-[7%] p-12 pt-8  fPass mx-auto mt-9 ">
        <h2 className="text-xl font-extrabold p-3">Forgot Password?</h2>
        <p className="p-3">
          Enter the email address you used when you joined and we’ll send you
          instructions to reset your password.
        </p>
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-md mx-auto mb-1 my-form p-3 "
        >
          <div className="relative z-0 w-full mb-10 group">
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.Email}
              type="email"
              name="Email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-black focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>
          {formik.errors.Email && formik.touched.Email ? (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              {formik.errors.Email}
            </div>
          ) : (
            ""
          )}
          <Link to={"/OtpConfirmation"}>
            <button
              type="submit"
              className=" my-butt log-butt w-full text-xl font-bold rounded-2xl "
            >
              Send OTP
            </button>
          </Link>
          
        </form>
      </div>
    </>
  );
}
