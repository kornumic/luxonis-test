import React from "react";
import ApartmentItem, { ApartmentData } from "@/components/ApartmentItem";
import PagesChanger, { PageList } from "@/components/PagesChanger";

const ApartmentList: React.FC<{
  apartments: ApartmentData[];
  pageButtonHandler: (move: number) => void;
  pages: PageList;
}> = ({ apartments, pageButtonHandler, pages }) => {
  return (
    <div className="mx-72">
      <PagesChanger
        pages={pages}
        prevButtonHandler={pageButtonHandler.bind(null, -1)}
        nextButtonHandler={pageButtonHandler.bind(null, 1)}
      />
      <ul className="flex flex-col justify-between">
        {apartments.map((item) => {
          return <ApartmentItem key={item.id} apartment={item} />;
        })}
      </ul>
      <PagesChanger
        pages={pages}
        prevButtonHandler={pageButtonHandler.bind(null, -1)}
        nextButtonHandler={pageButtonHandler.bind(null, 1)}
      />
    </div>
  );
};

export default ApartmentList;
