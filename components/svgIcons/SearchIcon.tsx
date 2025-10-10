import * as React from "react";

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.333"
      d="m17.5 17.5-3.617-3.617m1.95-4.716a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0"
    ></path>
  </svg>
);

export default SearchIcon;
