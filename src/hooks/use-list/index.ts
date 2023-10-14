import { ApartmentSelectModel } from "@/lib/db/schema";
import { InitStatus } from "@/app/page";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const useApartmentsList = () => {
  const [initializing, setInitializing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apartments, setApartments] = useState<ApartmentSelectModel[]>([]);
  const router = useRouter();

  const page = +(useSearchParams().get("page") || "1");
  const pages = {
    current: page,
    prev: page > 1,
    next: page < 500 / 20,
  };

  const handleResponseStatus = (response: Response) => {
    if (response.status >= 500 && response.status < 600) {
      throw new Error("Internal server error: " + response.status);
    }
    if (response.status >= 400 && response.status < 500) {
      throw new Error("Bad request: " + response.status);
    }
  };

  const pageButtonHandler = (move: number) => {
    const newPage = page + move;
    if (newPage > 0) {
      router.push("/?page=" + newPage);
    }
  };

  const fetchData = useCallback(async () => {
    setInitializing(false);
    setLoading(true);
    setError(null);
    try {
      const statusResponse = await fetch("/api/init-status", {
        method: "GET",
      });
      handleResponseStatus(statusResponse);
      const init: InitStatus = await statusResponse.json();

      if (init === "initializing") {
        setInitializing(true);
        setLoading(false);
      }

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
  }, [page]);

  const onReinitializeHandler = async () => {
    try {
      await fetch("/api/reinitialize", { method: "POST" });
    } catch (error) {
      console.log(error);
      setError("Unexpected error");
    }
    fetchData().then();
  };

  return {
    initializing,
    loading,
    error,
    apartments,
    pages,
    fetchData,
    onReinitializeHandler,
    pageButtonHandler,
  };
};

export default useApartmentsList;
