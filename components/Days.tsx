import { motion } from "framer-motion";
import React from "react";
import useStore from "../store/store";

const Days = ({ dateObj }) => {
  const { date, day, year, month } = dateObj;
  const { setSelectedDate, selectedDate } = useStore((state) => state);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.005 }}
      animate={{ opacity: 1, scale: 1, rotate: 360 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.7 }}
      className={`days ${
        JSON.stringify(dateObj) === JSON.stringify(selectedDate)
          ? "currentDate"
          : ""
      }`}
      onClick={() => setSelectedDate({ day, date, month, year })}
    >
      <p className="days-date">{date}</p>
      <p className="days-day">{day}</p>
    </motion.div>
  );
};

export default Days;
