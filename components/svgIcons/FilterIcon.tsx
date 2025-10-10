import * as React from "react";

const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M11.667 14.167h-7.5m7.5 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0m4.166-8.334h-7.5m0 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"
    ></path>
  </svg>
);

export default FilterIcon;
