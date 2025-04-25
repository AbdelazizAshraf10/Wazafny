import React from "react";
import { motion, useInView } from "framer-motion";

function CompanyAbout({ about, industry, companySize, headquarters, founded }) {
  // Create a ref for the component to track when it's in view
  const ref = React.useRef(null);
  // Use the useInView hook to detect when the component is in the viewport
  const isInView = useInView(ref, { once: true, margin: "-100px" }); // once: true ensures animation runs only once, margin adjusts trigger point

  // Animation variants for the container (stagger children)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between each child animation
      },
    },
  };

  // Animation variants for each child section
  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref} // Attach the ref to the motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"} // Animate only when in view
    >
      {/* Overview Content */}
      <div className="p-4 sm:p-8">
        <motion.div variants={childVariants}>
          <h3 className="text-xl font-bold mb-4">About</h3>
          <p className="text-gray-700 text-base leading-7">
            {about || "No description available."}
          </p>
        </motion.div>

        <motion.div className="mt-6" variants={childVariants}>
          <h3 className="text-xl font-bold mb-2">Industry</h3>
          <p className="text-gray-700 text-base">
            {industry || "Not specified."}
          </p>
        </motion.div>

        <motion.div className="mt-4" variants={childVariants}>
          <h3 className="text-xl font-bold mb-2">Company size</h3>
          <p className="text-gray-700 text-base">
            {companySize || "Not specified."}
          </p>
        </motion.div>

        <motion.div className="mt-4" variants={childVariants}>
          <h3 className="text-xl font-bold mb-2">Headquarters</h3>
          <p className="text-gray-700 text-base">
            {headquarters || "Not specified."}
          </p>
        </motion.div>

        <motion.div className="mt-4" variants={childVariants}>
          <h3 className="text-xl font-bold mb-2">Founded</h3>
          <p className="text-gray-700 text-base">
            {founded || "Not specified."}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CompanyAbout;