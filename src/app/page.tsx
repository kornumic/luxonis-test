"use client";

import { ApartmentData } from "@/components/ApartmentItem";
import ApartmentList from "@/components/ApartmentList";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apartments, setApartments] = useState<ApartmentData[]>([]);
  const page = useSearchParams().get("page") || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = "/api/apartments?page=" + page;
        const response = await fetch(url, {
          method: "GET",
        });
        const data: ApartmentData[] = await response.json();
        setApartments(data);
      } catch (error) {
        console.log(error);
        setError("Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div>
      <h1>Home</h1>
      {loading && <p>Loading...</p>}
      {!loading && <ApartmentList apartments={apartments} />}
    </div>
  );
}

export default Home;
