import React, { useEffect, useState } from "react";
import {
  useSession as justSession,
  useSupabaseClient as justSupabaseClient,
} from "@supabase/auth-helpers-react";
import Image from "next/image";
const verifiedChair = require("../public/verifiedChair.svg") as string;
const chair = require("../public/chair.svg") as string;
import { AnimatePresence, motion } from "framer-motion";
import Modal from "./Modal";
import useStore from "../store/store";
import moment from "moment";
import { useRouter } from "next/router";

const getProperName = (str: string) => {
  console.log(str);
  const fName = camalize(str.split("@")[0].split(".")[0]);
  const lName = camalize(str.split("@")[0].split(".")[1]);
  return `${fName} ${lName}`;
};
function camalize(str: string) {
  return str ? str.slice(0, 1).toUpperCase() + str.slice(1) : "";
}

const today = {
  day: moment().format("ddd"),
  date: moment().format("D"),
  month: moment().format("MMM"),
  year: moment().format("YYYY"),
};
let reqId = "";
const weekoff = ["Sat", "Sun"];
const Desk: React.FC<{ id: string }> = ({ id }) => {
  const supabase = justSupabaseClient();
  const session = justSession();
  const router = useRouter();

  const [toggleModal, setToggleModal] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookedEmail, setBookedEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const { toggleLoginModal, userEmail, selectedDate, recordsData } = useStore(
    (state) => state
  );

  const refreshDatas = () => router.replace(router.asPath);

  useEffect(() => {
    setBooked(false);
    setBookedEmail("");
    const deskData = recordsData.find(
      (i) =>
        i.deskId == id &&
        moment(i.date).isSame(
          moment(
            `${selectedDate.year}-${selectedDate.month}-${selectedDate.date}`
          )
        )
    );

    if (deskData) {
      setBooked(true);
      setBookedEmail(deskData.email);
      reqId = deskData.id;
    }
    setLoader(false);
  }, [recordsData, selectedDate]);

  useEffect(() => {
    if (toggleModal) {
      let timer1 = setTimeout(() => setToggleModal(false), 3000);

      return () => {
        clearTimeout(timer1);
      };
    }
  }, [toggleModal]);

  const handleSubmit = async () => {
    const dateIsBefore = moment(
      selectedDate.year + "/" + selectedDate.month + "/" + selectedDate.date
    ).isBefore(moment(today.year + "/" + today.month + "/" + today.date));

    const emailCheck = checkIfEmailExists();
    if (emailCheck) {
      setToggleModal(true);
      setErrMsg(
        "You can only reserve one seat, unless you're 2 body 1 soul 😕"
      );
    } else if (weekoff.includes(selectedDate.day)) {
      setToggleModal(true);
      setErrMsg(
        "Weekends are for relaxing 🥱 Please select a date that's not on a weekend."
      );
    } else if (dateIsBefore) {
      setToggleModal(true);
      setErrMsg(
        "Time travel not allowed, book a seat for a more recent date 💀"
      );
    } else {
      setLoader(true);
      const date = selectedDate
        ? selectedDate.year + "/" + selectedDate.month + "/" + selectedDate.date
        : today.year + "/" + today.month + "/" + today.date;
      try {
        console.log(today.year + "/" + today.month + "/" + today.date);
        const { data, error } = await supabase
          .from("records")
          .insert([{ date: date, email: userEmail, deskId: id }]);
        if (error) {
          setLoader(false);
          throw error;
        }
        console.log("Record updated!", data);
        refreshDatas();
      } catch (error) {
        setLoader(false);
        setToggleModal(true);
        setErrMsg(
          "Oops, some error occurred. Apologies, even Einstein made mistakes. 😓"
        );
      }
    }
  };

  const checkIfEmailExists = () => {
    return recordsData.find(
      (i) =>
        i.email == userEmail &&
        moment(i.date).isSame(
          moment(
            `${selectedDate.year}-${selectedDate.month}-${selectedDate.date}`
          )
        )
    );
  };

  const handleCancel = async () => {
    const dateIsBefore = moment(
      selectedDate.year + "/" + selectedDate.month + "/" + selectedDate.date
    ).isBefore(moment(today.year + "/" + today.month + "/" + today.date));

    if (bookedEmail !== userEmail) {
      setToggleModal(true);
      setErrMsg(`Hey you are not ${getProperName(bookedEmail)} 😒`);
      return true;
    } else if (dateIsBefore) {
      setToggleModal(true);
      setErrMsg(
        "Looks like you're trying to cancel a seat on a history lesson, unfortunately it's unchangeable."
      );
      return true;
    }

    setLoader(true);
    try {
      const { data, error } = await supabase
        .from("records")
        .delete()
        .eq("id", reqId);

      if (error) throw error;
      console.log(data, "deleted success!!");
      refreshDatas();
    } catch (error) {
      setToggleModal(true);
      setErrMsg(
        "Oops, some error occurred. Apologies, even Einstein made mistakes. 😓"
      );
    }
  };

  return (
    <div className={`desk-section`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.005 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: !toggleModal ? 1.05 : 1 }}
        className="desk"
      >
        <AnimatePresence>
          {toggleModal && <Modal msg={errMsg} />}
        </AnimatePresence>
        <div className={`deskEl`}>
          <Image
            src={booked ? verifiedChair : chair}
            alt="Chair icon"
            height={40}
            width={40}
            className={"deskImg"}
          />
          <p className={"deskText"}>
            {bookedEmail.length > 0 ? getProperName(bookedEmail) : ""}
          </p>
          {loader ? (
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: toggleModal ? 1 : 1.1 }}
              whileTap={{ scale: toggleModal ? 1 : 0.7 }}
              style={{
                background:
                  bookedEmail !== userEmail && booked
                    ? "linear-gradient(to right, #333399, #ff00cc)"
                    : booked
                    ? " linear-gradient(-20deg, #fc6076 0%, #ff9a44 100%)"
                    : "#364c70",
                cursor: "pointer",
              }}
              onClick={() =>
                !session
                  ? toggleLoginModal()
                  : booked
                  ? handleCancel()
                  : handleSubmit()
              }
            >
              {bookedEmail !== userEmail && booked
                ? "Reserved"
                : booked
                ? "Cancel"
                : "Reserve"}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Desk;
