import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { motion } from "framer-motion";

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren", // Animate children after the container
      staggerChildren: 0.2, // Stagger child animations
    },
  },
};

// Animation variants for child elements (heading, form fields, button)
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Animation variants for the button (with a hover/tap effect)
const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

export default function Info() {
  function handleLogin(values) {
    console.log(values);
  }

  let myValidationSchema = Yup.object().shape({
    Headline: Yup.string().required("headline is required"),
  });

  let formik = useFormik({
    initialValues: {
      Headline: "",
    },
    validationSchema: myValidationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <motion.div
        className="border-2 border-solid border-[#d9d9d9] rounded-3xl p-12 pt-8 w-[61%] mx-auto my-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-3xl mb-3 text-[#242645] font-bold text-center py-3"
          variants={childVariants}
        >
          Tell Us More About You
        </motion.h2>
        <form
          onSubmit={formik.handleSubmit}
          className="mx-auto mb-1 my-form p-3"
        >
          <motion.div
            className="relative z-0 w-full mb-3 group"
            variants={childVariants}
          >
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.Headline}
              type="text"
              name="Headline"
              id="Headline"
              className="block py-2.5 px-0 w-full text-sm text-[#201A23] bg-transparent border-0 border-b-2 border-[#D9D9D9] appearance-none dark:border-[#D9D9D9] dark:focus:border-black focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="Headline"
              className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-[gray-400] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6"
            >
              Headline*
            </label>
          </motion.div>
          {formik.errors.Headline && formik.touched.Headline ? (
            <motion.div
              className="mb-9 text-sm text-red-600"
              role="alert"
              variants={childVariants}
            >
              {formik.errors.Headline}
            </motion.div>
          ) : null}

          <motion.div
            className="flex justify-center"
            variants={childVariants}
          >
            <motion.button
              type="submit"
              className="my-butt text-xl font-sans font-medium w-15 rounded-2xl bg-[#6A0DAD] text-white px-6 py-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link to={"/"}>Next</Link>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </>
  );
}