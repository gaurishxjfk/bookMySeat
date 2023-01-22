import React from "react";
import Calender from "./Calender";
import Desk from "./Desk";

const deskIds = ["R1", "L1", "R2", "L2", "R3", "L3"];
const OfficeLayout = () => {
  return (
    <main className="officeLayout">
      <Calender />
      <div className="DeskLayout">
        {deskIds.map((i) => (
          <Desk key={i} id={i} />
        ))}
      </div>
    </main>
  );
};

export default OfficeLayout;
