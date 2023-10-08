import Image from "next/image";

export type ApartmentData = {
  id: number;
  title: string;
  address: string;
  price: string;
  src: string;
};

const ApartmentItem: React.FC<{ apartment: ApartmentData }> = ({
  apartment,
}) => {
  return (
    <li className="flex grid-cols-2 rounded-2xl items-top bg-[#181818] hover:bg-[#303030] border-white transition-all m-4 p-2">
      <div className="w-full pr-4 pl-2">
        <h2 className="text-2xl py-2">{apartment.title}</h2>
        <p className="py-2">{apartment.address}</p>
        <p className="flex items-end py-2">{apartment.price}</p>
      </div>
      <div className="flex ">
        <img
          src={apartment.src}
          alt={apartment.title}
          width="250rem"
          height="250rem"
          className="rounded-xl"
        />
      </div>
    </li>
  );
};

export default ApartmentItem;
