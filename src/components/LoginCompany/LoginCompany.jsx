import React from "react";
import style from "./LoginCompany.module.css";
import { useFormik } from "formik";
import values from "./../../../node_modules/lodash-es/values";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function LoginCompany() {
  function handleLogin(values) {
    console.log(values);
  }

  let myValidationSchema = Yup.object().shape({
    Email: Yup.string().email("invalid email").required("email is required"),
    Password: Yup.string()
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
        "password must contain at least 1 uppercase letter and 1 special char"
      )
      .required("password is required"),
  });

  let formik = useFormik({
    initialValues: {
      Email: "",
      Password: "",
    },
    validationSchema: myValidationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "2rem",
          textAlign: "center",
        }}
        className="flex flex-wrap justify-around  mx-auto mt-9"
      >
        <div className="image w-2/6">
          <img
            className=" scale-125 mt-2 mr-9"
            src="\src\assets\company-sign-up.png"
            alt="frame"
          />
        </div>
        <div className="sign-up">
          <h2 className="text-3xl font-extrabold">LOGIN</h2>
          <h3 className="font-semibold">Company</h3>
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-md mx-auto mb-1 my-form"
          >
            <div className="relative z-0 w-full mb-5 group">
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Email}
                type="email"
                name="Email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-black focus:outline-none focus:ring-0  peer"
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
                className="p-1 mb-4 text-sm font-semibold text-red-800 rounded-lg bg-white  dark:text-red-400"
                role="alert"
              >
                {formik.errors.Email}
              </div>
            ) : (
              ""
            )}
            <div className="relative z-0 w-full mb-5 group">
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.Password}
                type="Password"
                name="Password"
                id="Password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-black focus:outline-none focus:ring-0 focus:border-black peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="Password"
                className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </div>
            {formik.errors.Password && formik.touched.Password ? (
              <div
                className="p-1 mb-4   text-sm font-semibold text-red-800 rounded-lg bg-white  dark:text-red-400"
                role="alert"
              >
                {formik.errors.Password}
              </div>
            ) : (
              ""
            )}

            <div className="w-full">
              <button
                type="submit"
                className=" bg-[#6a0dad] text-white py-2 px-6 rounded-xl text-lg font-bold log-butt w-full "
              >
                LOGIN
              </button>
            </div>

            <div className="forget">
              <Link to={"/Forget"} className="link-color comp" href="#">
                Forget your password?
              </Link>
            </div>
            <div className="login-link">
              <p>
                New User?{" "}
                <Link to={"/SignUpCompany"} className="link-color " href="#">
                  Create Account
                </Link>
              </p>
            </div>

            <div className="mt-3 login-link   ">
              <Link to={"/Login"} className="link-color comp mt-4" href="#">
                Login As Seeker Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
