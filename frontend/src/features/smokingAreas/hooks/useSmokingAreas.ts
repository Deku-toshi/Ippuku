import { useEffect, useState } from "react";
import { fetchSmokingAreas } from "../../../api/smokingAreas/client";
import { toError } from "./toError";
import type { FetchState } from "../../../types/fetchState";
import type { SmokingAreaDisplay, SmokingAreaSearchParams } from "../types";

type UseSmokingAreasResult = {
  state: FetchState<SmokingAreaDisplay[]>;
  refetch: () => Promise<void>;
};

export const useSmokingAreas = (params?: SmokingAreaSearchParams): UseSmokingAreasResult => {
  const [state, setState] = useState<FetchState<SmokingAreaDisplay[]>>({ status: "loading" });

  const refetch = async () => {
    setState({ status: "loading" });
    try {
      const smokingAreas = await fetchSmokingAreas(params);
      setState({ status: "success", data: smokingAreas });
    } catch (e) {
      setState({ status: "error", error: toError(e) });
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  // フィルター変更時に喫煙所データを取得する。
  // refetch内のloading遷移はレンダー内計算で再現できず、useEffectの正当な用途。
  // refetchはレンダリングごとに再生成され、依存配列に入れると無限ループになるため除外。
  // 機能拡張時に TanStack Query を採用し、loading遷移・喫煙所データ取得・キャッシュ管理を委譲する設計に変更するかを検討。
  useEffect(() => {
    refetch();
  }, [params?.tobaccoTypeId, params?.electronicOnly]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  return { state, refetch };
};
