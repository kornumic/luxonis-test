import { ApartmentSelectModel } from "@/lib/db/schema";

const ApartmentItem: React.FC<{ apartment: ApartmentSelectModel }> = ({
  apartment,
}) => {
  return (
    <li className="flex grid-cols-2 rounded-2xl items-top bg-[#181818] hover:bg-[#303030] border-white transition-all m-4 p-2">
      <div className="flex flex-col w-full pr-4 pl-2 truncate">
        <h2 className="text-2xl py-2 truncate">{apartment.title}</h2>
        <p className="py-2 truncate">{apartment.address}</p>
        <p className="flex items-end py-2 truncate">{apartment.price}</p>
      </div>
      <div className="h-36 w-56">
        <img
          src={apartment.src}
          alt={apartment.title}
          className="rounded-xl object-cover h-36 w-56"
        />
      </div>
    </li>
  );
};

export default ApartmentItem;
