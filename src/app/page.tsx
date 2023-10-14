"use client";

import ApartmentList from "@/components/ApartmentList";
import React, { useEffect } from "react";
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
    pages,
    fetchData,
    onReinitialize,
    onNextPage,
    onPrevPage,
  } = useApartmentsList();

  useEffect(() => {
    fetchData().then();
  }, [fetchData]);

  return (
    <div>
      <Header
        onReinitialize={onReinitialize}
        initializationState={initializing}
      />
      {error && <LoadingState text={error} />}
      {loading && !initializing && !error && (
        <LoadingState text={"Loading..."} />
      )}
      {!loading && initializing && !error && (
        <LoadingState text={"Initializing..."} />
      )}
      {!loading && !initializing && !error && apartments.length > 0 && (
        <ApartmentList
          apartments={apartments}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          pages={pages}
        />
      )}
    </div>
  );
}

export default Home;
