import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-black/20">
      <div
        className="block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      ></div>
    </div>
  );
};

export default Loading;
