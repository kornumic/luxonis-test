import React from "react";
import ApartmentItem from "@/components/ApartmentItem";
import PagesChanger, { PageList } from "@/components/PagesChanger";
import { ApartmentSelectModel } from "@/lib/db/schema";

const ApartmentList: React.FC<{
  apartments: ApartmentSelectModel[];
  onNextPage: () => void;
  onPrevPage: () => void;
  pages: PageList;
}> = ({ apartments, onNextPage, onPrevPage, pages }) => {
  return (
    <div className=" md:mx-32 lg:mx-72">
      <PagesChanger
        pages={pages}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
      <ul className="flex flex-col justify-between">
        {apartments.map((item) => {
          return <ApartmentItem key={item.id} apartment={item} />;
        })}
      </ul>
      <PagesChanger
        pages={pages}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    </div>
  );
};

export default ApartmentList;
