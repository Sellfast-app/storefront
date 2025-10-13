import * as React from "react";

const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="17"
    fill="none"
    viewBox="0 0 16 17"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.333"
      d="M3.333 8.063h9.334"
    ></path>
  </svg>
);

export default MinusIcon;