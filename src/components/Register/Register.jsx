import { useFormik } from "formik";

import { Link } from "react-router-dom";
import * as Yup from "yup";

export default function Register() {
  function handleRegister(values) {
    console.log(values);
  }

  let myValidationSchema = Yup.object().shape({
    FirstName: Yup.string()
      .min(3, "min length is 3")
      .max(15, "max length is 15")
      .required("First Name is required"),
    LastName: Yup.string()
      .min(3, "min length is 3")
      .max(15, "max length is 15")
      .required("Last Name is required"),
    Email: Yup.string().email("invalid email").required("email is required"),
    Password: Yup.string()
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
        "password must contain at least 1 uppercase letter and 1 special char"
      )
      .required("password is required"),
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref("Password")], "invalid confirmation password")
      .required("confirm password is required"),
  });

  let formik = useFormik({
    initialValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
    },
    validationSchema: myValidationSchema,
    onSubmit: handleRegister,
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
        className="flex flex-wrap justify-around  mx-auto  container"
      >
        <div className="image w-2/5">
          <img className="" src="\src\assets\sign-up-seeker.png" alt="frame" />
        </div>
        <div className="sign-up">
          <h2 className=" text-3xl  font-extrabold">SIGN UP</h2>
          <h3 className="font-bold">Seeker</h3>
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-md mx-auto mb-0 my-form"
          >
            <div className="flex justify-between pt-3 font-bold text-[#000000]">
              <div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.FirstName}
                    type="text"
                    name="FirstName"
                    id="FirstName"
                    className="block py-2.5 px-0 w-[90%] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-black focus:outline-none focus:ring-0 focus:border-black peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="FirstName"
                    className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
                  >
                    First Name
                  </label>
                </div>
                {formik.errors.FirstName && formik.touched.FirstName ? (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert"
                  >
                    {formik.errors.FirstName}
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.LastName}
                    type="text"
                    name="LastName"
                    id="LastName"
                    className="block py-2.5 px-0 w-[90%] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-black focus:outline-none focus:ring-0 focus:border-black peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="LastName"
                    className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
                  >
                    Last Name
                  </label>
                </div>
                {formik.errors.LastName && formik.touched.LastName ? (
                  <div
                    className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert"
                  >
                    {formik.errors.LastName}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
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
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                {formik.errors.Password}
              </div>
            ) : (
              ""
            )}

            <div className="relative z-0 w-full mb-5 group">
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.ConfirmPassword}
                type="Password"
                name="ConfirmPassword"
                id="ConfirmPassword"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-black focus:outline-none focus:ring-0 focus:border-black peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="ConfirmPassword"
                className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
              >
                Confirm Password
              </label>
            </div>
            {formik.errors.ConfirmPassword && formik.touched.ConfirmPassword ? (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                {formik.errors.ConfirmPassword}
              </div>
            ) : (
              ""
            )}
            <div className="w-full">
              <button
                type="submit"
                className=" bg-[#6a0dad] text-white py-2 px-6 rounded-xl text-lg font-bold w-full mt-4"
              >
                {" "}
                <Link to={"/location"}>Sign Up</Link>
              </button>
            </div>

            <div className="login-link">
              <p>
                Already an account?{" "}
                <Link to={"/Login"} className="link-color ">
                  Login
                </Link>
              </p>
            </div>
            <div className="mt-3 login-link   ">
              <Link to={"/SignUpCompany"} className="link-color comp">
                Create Company Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
