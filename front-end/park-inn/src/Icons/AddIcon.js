import React from "react";

const SVG = ({
  style = {},
  fill = "#000",
  width = "100%",
  className = "",
  viewBox = "0 0 32 32",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="30"
    viewBox="0 0 24 24"
    width="30"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      class="add-icon"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
    />
  </svg>
);

export default SVG;
