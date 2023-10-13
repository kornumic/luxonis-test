import React from "react";

export type PageList = {
  current: number;
  prev: boolean;
  next: boolean;
};

const PagesChanger: React.FC<{
  pages: PageList;
  prevButtonHandler: () => void;
  nextButtonHandler: () => void;
}> = ({ pages, prevButtonHandler, nextButtonHandler }) => {
  return (
    <div className="flex flex-row justify-between row-end-2 p-4">
      <div>
        {pages.prev && (
          <button
            className="flex uppercase w-32 h-12 text-xl justify-center items-center rounded-2xl bg-[#181818] transition-all hover:bg-[#303030]"
            onClick={prevButtonHandler}
          >
            Previous
          </button>
        )}
      </div>
      <div>
        {pages.next && (
          <button
            className="flex uppercase w-32 h-12 text-xl justify-center items-center rounded-2xl bg-[#181818] transition-all hover:bg-[#303030]"
            onClick={nextButtonHandler}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default PagesChanger;
