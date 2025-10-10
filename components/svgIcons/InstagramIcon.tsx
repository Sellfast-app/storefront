import * as React from "react";

const InstagramIcon: React.FC<React.SVGProps<SVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="35"
    fill="none"
    viewBox="0 0 34 35"
  >
    <g filter="url(#filter0_d_15_435)">
      <circle cx="17" cy="16" r="14" fill="url(#paint0_linear_15_435)"></circle>
    </g>
    <path
      fill="#fff"
      d="M19.467 9.897a3.64 3.64 0 0 1 3.636 3.636v4.934a3.64 3.64 0 0 1-3.636 3.636h-4.934a3.64 3.64 0 0 1-3.636-3.636v-4.934a3.64 3.64 0 0 1 3.636-3.636zm-4.934 1.228a2.41 2.41 0 0 0-2.408 2.408v4.934a2.41 2.41 0 0 0 2.408 2.408h4.934a2.41 2.41 0 0 0 2.408-2.408v-4.934a2.41 2.41 0 0 0-2.408-2.408zM17 12.844A3.16 3.16 0 0 1 20.156 16 3.16 3.16 0 0 1 17 19.156 3.16 3.16 0 0 1 13.844 16 3.16 3.16 0 0 1 17 12.844m0 1.227a1.929 1.929 0 1 0 0 3.857 1.929 1.929 0 0 0 0-3.857m3.163-1.96a.756.756 0 1 1-.001 1.512.756.756 0 0 1 .001-1.513"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_15_435"
        x1="3.094"
        x2="3"
        y1="1.953"
        y2="29.953"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7024C4"></stop>
        <stop offset="0.415" stopColor="#C21975"></stop>
        <stop offset="0.702" stopColor="#C74C4D"></stop>
        <stop offset="1" stopColor="#E09B3D"></stop>
      </linearGradient>
      <filter
        id="filter0_d_15_435"
        width="33.744"
        height="33.744"
        x="0.128"
        y="0.564"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feOffset dy="1.436"></feOffset>
        <feGaussianBlur stdDeviation="1.436"></feGaussianBlur>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_15_435"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_15_435"
          result="shape"
        ></feBlend>
      </filter>
    </defs>
  </svg>
);

export default InstagramIcon;