"use client";

import { ApartmentData } from "@/components/ApartmentItem";
import ApartmentList from "@/components/ApartmentList";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { InitStatus } from "@/app/api/init-status/route";

function Home() {
  const [initializing, setInitializing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apartments, setApartments] = useState<ApartmentData[]>([]);
  const page = +(useSearchParams().get("page") || "1");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const initializationStatus = await fetch("/api/init-status", {
          method: "GET",
        });
        const init: InitStatus = await initializationStatus.json();
        console.log(init);
        setInitializing(init === "initializing");

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
        setInitializing(false);
      }
    };

    fetchData();
  }, [page]);

  const pageButtonHandler = (move: number) => {
    const newPage = page + move;
    if (newPage > 0) {
      router.push("/?page=" + newPage);
    }
  };

  const pages = {
    prev: page > 1,
    next: page < 500 / 20,
  };

  return (
    <div>
      <Header />
      {loading && !initializing && !error && <Loading text={"Loading..."} />}
      {loading && initializing && !error && (
        <Loading text={"Initializing..."} />
      )}
      {error && <p>{error}</p>}
      {!loading && apartments.length > 0 && (
        <ApartmentList
          apartments={apartments}
          pageButtonHandler={pageButtonHandler}
          pages={pages}
        />
      )}
    </div>
  );
}

export default Home;
