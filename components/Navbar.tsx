import { motion } from "framer-motion";
import React from "react";
import {
  useSupabaseClient as justSupabaseClient,
  useSession as justSession,
} from "@supabase/auth-helpers-react";
import useStore from "../store/store";

const Navbar = () => {
  const supabase = justSupabaseClient();
  const session = justSession();

  const { toggleLoginModal } = useStore((state) => state);
  return (
    <div className="navbar">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.7 }}
        className="login-btn"
        onClick={() => session && supabase.auth.signOut()}
      >
        {session ? (
          <a> Logout 🤗</a>
        ) : (
          <a onClick={toggleLoginModal}> Login 🥺</a>
        )}
      </motion.button>
    </div>
  );
};

export default Navbar;
