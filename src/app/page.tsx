"use client";

import { ApartmentSelectModel } from "@/lib/db/schema";
import ApartmentList from "@/components/ApartmentList";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";

export type InitStatus = "initializing" | "initialized";

function Home() {
  const [initializing, setInitializing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apartments, setApartments] = useState<ApartmentSelectModel[]>([]);
  const page = +(useSearchParams().get("page") || "1");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const init: InitStatus = await (
          await fetch("/api/init-status", { method: "GET" })
        ).json();
        console.log(init);
        const initState = init === "initializing";
        console.log(initState);
        setInitializing(initState);

        const url = "/api/apartments?page=" + page;
        const response = await fetch(url, {
          method: "GET",
        });
        const data: ApartmentSelectModel[] = await response.json();
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
  }, [page, initializing]);

  const pageButtonHandler = (move: number) => {
    const newPage = page + move;
    if (newPage > 0) {
      router.push("/?page=" + newPage);
    }
  };

  const onReinitializeHandler = async () => {
    try {
      await fetch("/api/reinitialize", { method: "POST" });
    } catch (error) {
      console.log(error);
      setError("Unexpected error");
    }
    setInitializing(true);
    router.push("/");
  };

  const pages = {
    prev: page > 1,
    next: page < 500 / 20,
  };

  return (
    <div>
      <Header
        onReinitializeHandler={onReinitializeHandler}
        initializationState={initializing}
      />

      {loading && !initializing && !error && (
        <LoadingState text={"Loading..."} />
      )}
      {loading && initializing && !error && (
        <LoadingState text={"Initializing..."} />
      )}
      {error && <LoadingState text={error} />}
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
