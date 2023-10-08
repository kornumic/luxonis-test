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
    <li>
      <h2>{apartment.title}</h2>
      <p>{apartment.address}</p>
      <p>{apartment.price}</p>
      <img src={apartment.src} alt={apartment.title} />
    </li>
  );
};

export default ApartmentItem;
