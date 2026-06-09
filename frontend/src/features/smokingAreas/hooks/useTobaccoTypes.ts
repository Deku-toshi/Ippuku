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

  /* eslint-disable react-hooks/set-state-in-effect */
  // 初回マウント時に一度だけデータを取得する。
  // refetch内のloading遷移はレンダー内計算で再現できず、useEffectの正当な用途。
  // 機能拡張時に TanStack Query を採用し、loading遷移・タバコ種別取得・キャッシュ管理を委譲する設計に変更するかを検討。
  useEffect(() => {
    refetch();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { state, refetch };
};
