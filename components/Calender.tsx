import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import Days from "./Days";
import useStore from "../store/store";

interface Day {
  day: string;
  date: string;
  month: string;
  year: string;
}
let currentDay = moment();
const today = {
  day: moment().format("ddd"),
  date: moment().format("D"),
  month: moment().format("MMM"),
  year: moment().format("YYYY"),
};

const Calender = () => {
  const [weekArr, setWeekArr] = useState<Array<Day>>([]);

  const { setSelectedDate } = useStore((state) => state);

  useEffect(() => {
    const weekDaysArr: Day[] = [];
    for (let i = 1; i <= 5; i++) {
      weekDaysArr.push({
        day: moment().weekday(i).format("ddd"),
        date: moment().weekday(i).format("D"),
        month: moment().weekday(i).format("MMM"),
        year: moment().weekday(i).format("YYYY"),
      });
    }
    setWeekArr(weekDaysArr);
  }, []);

  const getWeekData = (next) => {
    currentDay = next
      ? currentDay.add(7, "days")
      : currentDay.subtract(7, "days");
    const weekDaysArr: Day[] = [];
    for (let i = 1; i <= 5; i++) {
      weekDaysArr.push({
        day: currentDay.weekday(i).format("ddd"),
        date: currentDay.weekday(i).format("D"),
        month: currentDay.weekday(i).format("MMM"),
        year: currentDay.weekday(i).format("YYYY"),
      });
    }
    next ? setSelectedDate(weekDaysArr[0]) : setSelectedDate(weekDaysArr[4]);
    setWeekArr(weekDaysArr);
  };

  return (
    <div className="calender">
      <div className="calender-row">
        <motion.a
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.7 }}
          onClick={() => getWeekData(false)}
          className="cal-nav-btn"
        >
          &#x25C0;
        </motion.a>
        <AnimatePresence>
          {weekArr.map((i: Day) => (
            <Days dateObj={i} key={i.date}/>
          ))}
        </AnimatePresence>
        <motion.a
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.7 }}
          onClick={() => getWeekData(true)}
          className="cal-nav-btn"
        >
          &#x25B6;
        </motion.a>
      </div>
    </div>
  );
};

export default Calender;
