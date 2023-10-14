import React from "react";
import Link from "next/link";

const Header: React.FC<{
  onReinitializeHandler: () => Promise<void>;
  initializationState: boolean;
}> = ({ onReinitializeHandler, initializationState }) => {
  return (
    <header className="flex flex-row justify-between w-full bg-[#181818] ">
      <Link href="/">
        <h1 className="text-4xl p-6">SReality scraper</h1>
      </Link>
      <div className="p-6">
        <button
          onClick={onReinitializeHandler}
          className="flex uppercase w-52 h-12 text-xl justify-center items-center rounded-2xl bg-[#000000] transition-all hover:bg-[#303030] disabled:bg-[#303030] disabled:cursor-not-allowed"
          disabled={initializationState}
        >
          Reinitialize data
        </button>
      </div>
    </header>
  );
};

export default Header;
