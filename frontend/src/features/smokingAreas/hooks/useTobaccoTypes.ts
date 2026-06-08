import type { TobaccoType } from "../../../features/smokingAreas/types";
import { useState, useEffect } from "react";
import { fetchTobaccoTypes } from "../../../api/tobaccoTypes/client";
import type { FetchState } from "../../../types/fetchState";
import { toError } from "./toError";

type UseTobaccoTypesResult = {
  state: FetchState<TobaccoType[]>;
  refetch: () => Promise<void>;
};

export const useTobaccoTypes = (): UseTobaccoTypesResult => {
  const [state, setState] = useState<FetchState<TobaccoType[]>>({ status: "loading" })

  const refetch = async () => {
    setState({ status: "loading" });
    try {
      const tobaccoTypes = await fetchTobaccoTypes();
      setState({ status: "success", data: tobaccoTypes });
    } catch (e) {
      setState({ status: "error", error: toError(e) });
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { state, refetch };
};
