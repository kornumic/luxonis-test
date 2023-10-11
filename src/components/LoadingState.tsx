import React from "react";

//TODO - fix styling
const LoadingState: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex flex-row w-full h-full justify-center">
      <h1 className="text-2xl text-center">{text}</h1>
    </div>
  );
};

export default LoadingState;
