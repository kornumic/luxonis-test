import React from "react";

const Loading: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex flex-row w-max h-max justify-items-center">
      <h1 className="text-2xl text-center">{text}</h1>
    </div>
  );
};

export default Loading;
