import React from "react";
import { motion } from "framer-motion";

const Modal: React.FC<{
  msg: string;
}> = ({ msg }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.005 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ rotate: 180, scale: 0 }}
      className="modal"
    >
      <p>{msg}</p>
    </motion.div>
  );
};

export default Modal;
