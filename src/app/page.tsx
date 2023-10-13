"use client";

import ApartmentList from "@/components/ApartmentList";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import LoadingState from "@/components/LoadingState";
import useApartmentsList from "@/hooks/use-list";

export type InitStatus = "initializing" | "initialized";

function Home() {
  const {
    initializing,
    loading,
    error,
    apartments,
    fetchData,
    onReinitializeHandler,
    pageButtonHandler,
  } = useApartmentsList();
  const page = +(useSearchParams().get("page") || "1");

  useEffect(() => {
    fetchData();
  }, [page]);

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
