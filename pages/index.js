import Head from "next/head";
import Image from "next/image";
import React, { useRef, useEffect } from "react";
import OfficeLayout from "../components/OfficeLayout";
import Navbar from "../components/Navbar";
import {
  useSession as justSession,
  useSupabaseClient as justSupabaseClient,
  useUser as justUser,
} from "@supabase/auth-helpers-react";
import { motion, AnimatePresence } from "framer-motion";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useOutsideAlerter } from "../components/custom-hooks/UseOutsideAlerter";
import useStore from "../store/store";
import moment from "moment";
import supabase from "../utils/supabase";
import { useRouter } from "next/router";

const today = {
  day: moment().format("ddd"),
  date: moment().format("D"),
  month: moment().format("MMM"),
  year: moment().format("YYYY"),
};
export default function Home(props) {
  const supabase = justSupabaseClient();
  const session = justSession();
  const user = justUser();

  const {
    loginModal,
    toggleLoginModal,
    updateUserEmail,
    setSelectedDate,
    setRecordsData,
  } = useStore((state) => state);
  const loginModalRef = useRef(null);
  useOutsideAlerter(loginModalRef, toggleLoginModal);

  useEffect(() => {
    setRecordsData(props.recordsArr);
  }, [props]);

  useEffect(() => {
    if (user?.email) {
      updateUserEmail(user.email);
    }
    setSelectedDate(today);
  }, [user]);

  return (
    <div>
      <Navbar />
      <AnimatePresence>
        {!session && loginModal ? (
          <motion.div
            ref={loginModalRef}
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 360 }}
            exit={{ rotate: 180, scale: 0 }}
            className="loginform"
          >
            <div className="email-warning">👉 use @afourtech domain only </div>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="default"
            />
          </motion.div>
        ) : (
          ""
        )}
      </AnimatePresence>
      <OfficeLayout />
    </div>
  );
}
export async function getServerSideProps() {
  let { data: recordsArr, error } = await supabase
    .from("records")
    .select("id,deskId,email,date");
  if (error) return { props: { recordsArr: [] } };
  return {
    props: { recordsArr },
  };
}
