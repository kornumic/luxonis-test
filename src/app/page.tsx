"use client";

import { ApartmentSelectModel } from "@/lib/db/schema";
import ApartmentList from "@/components/ApartmentList";
import React, { useEffect, useState } from "react";
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
    const handleResponseStatus = (response: Response) => {
      if (response.status >= 500 && response.status < 600) {
        throw new Error("Internal server error: " + response.status);
      }
      if (response.status >= 400 && response.status < 500) {
        throw new Error("Bad request." + response.status);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const statusResponse = await fetch("/api/init-status", {
          method: "GET",
        });
        handleResponseStatus(statusResponse);
        const init: InitStatus = await statusResponse.json();

        const initState = init === "initializing";
        setInitializing(initState);

        const url = "/api/apartments?page=" + page;
        const response = await fetch(url, {
          method: "GET",
        });
        handleResponseStatus(response);

        const data: ApartmentSelectModel[] = await response.json();
        setApartments(data);
      } catch (error: any) {
        console.log(error.message);
        setError(error.message);
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

  const onReinitializeHandler = async () => {
    try {
      await fetch("/api/reinitialize", { method: "POST" });
    } catch (error) {
      console.log(error);
      setError("Unexpected error");
    }
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
