import React from "react";

const LoadingState: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span className="flex flex-row justify-center w-full h-full">
      <h1 className="text-2xl text-center p-6 align-middle">{text}</h1>
    </span>
  );
};

export default LoadingState;
