import React from "react";
import ApartmentItem, { ApartmentData } from "@/components/ApartmentItem";

const ApartmentList: React.FC<{ apartments: ApartmentData[] }> = ({
  apartments,
}) => {
  return (
    <ul>
      {apartments.map((item) => {
        return <ApartmentItem key={item.id} apartment={item} />;
      })}
    </ul>
  );
};

export default ApartmentList;
