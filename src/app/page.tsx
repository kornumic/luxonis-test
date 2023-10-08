"use client";

import { ApartmentData } from "@/components/ApartmentItem";
import ApartmentList from "@/components/ApartmentList";
import { useEffect, useState } from "react";

function Home() {
  const [loading, setLoading] = useState(false);
  const [apartments, setApartments] = useState<ApartmentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch("/api/apartments", {
        method: "GET",
      });
      const data: ApartmentData[] = await response.json();
      setApartments(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      {loading && <p>Loading...</p>}
      {!loading && <ApartmentList apartments={apartments} />}
    </div>
  );
}

export default Home;
