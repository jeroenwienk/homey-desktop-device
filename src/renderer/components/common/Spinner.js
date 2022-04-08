import React from 'react';
import styled, { keyframes, css } from 'styled-components';

export function Spinner({ size, rainbow, color }) {
  return (
    <SpinnerBase
      rainbow={rainbow}
      color={color}
      width={size ?? 48}
      height={size ?? 48}
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      />
    </SpinnerBase>
  );
}

const offset = 192;

export const rotator = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
`;

export const colors = keyframes`
  0% { stroke: #4285F4; }
  25% { stroke: #DE3E35; }
  50% { stroke: #F7C223; }
  75% { stroke: #1B9A59; }
  100% { stroke: #4285F4; }
`;

export const dash = keyframes`
  0% {
    stroke-dashoffset: ${offset + 1};
    transform: rotate(0deg);
  }
  50% {
    stroke-dashoffset: ${offset / 4};
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: ${offset + 1};
    transform: rotate(450deg);
  }
`;

const SpinnerBase = styled.svg`
  animation: ${rotator} 1.4s linear infinite;

  circle {
    stroke: ${(props) => (props.color ? props.color : '#d1d2d5')};
    stroke-dasharray: ${offset};
    stroke-dashoffset: 0;
    transform-origin: center;
    ${getAnimation}
  }
`;

function getAnimation(props) {
  if (props.rainbow) {
    return css`
      animation: ${dash} 1.4s ease-in-out infinite,
        ${colors} ${1.4 * 4}s ease-in-out infinite;
    `;
  }

  return css`
    animation: ${dash} 1.4s ease-in-out infinite;
  `;
}
