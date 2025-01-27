import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import "moment/locale/de";

function Footer() {
  moment.locale("de");
  const currentDate = moment().format("MMMM Do YYYY");

  return (
    <footer
      className="bg-dark text-white text-center py-3 mt-auto"
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div>&copy; Kopp Sebastian - Datum: {currentDate}</div>
    </footer>
  );
}

export default Footer;
