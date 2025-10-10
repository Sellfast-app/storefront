import * as React from "react";

const CartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <g clipPath="url(#clip0_15_453)">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        d="M1.538 1.538h1.5l1.995 9.314a1.5 1.5 0 0 0 1.5 1.185h7.335a1.5 1.5 0 0 0 1.462-1.177l1.238-5.572H3.84M6.75 15.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m8.25 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_15_453">
        <path fill="#fff" d="M0 0h18v18H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default CartIcon;
