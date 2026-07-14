import { useState, useEffect } from "react";
import { useSmokingAreas } from "./features/smokingAreas/hooks/useSmokingAreas";
import { SmokingAreasMap } from "./SmokingAreasMap";
import type { SmokingAreaSearchParams } from "./features/smokingAreas/types"

export default function App() {
  const [ params, setParams ] = useState<SmokingAreaSearchParams>({});
  const [ selectedId, setSelectedId ] = useState<number | null>(null);

  const { state, refetch } = useSmokingAreas(params);

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  // フィルター後のデータに選択中の喫煙所が含まれなければ選択状態を解除する。
  // これによりフィルター解除時に選択状態が復活しない。
  // レンダー内計算だと解除時に selectedId が残り選択状態が復活するため、意図的に Effect 内で更新。
  // selectedId の変化には反応不要のため依存配列から除外。
  useEffect(() => {
    if (selectedId === null) return;
    if (state.status !== "success") return;
    const found = state.data.find((data) => data.id === selectedId);
    if (!found) setSelectedId(null);
  }, [state]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  return (
    <SmokingAreasMap
      smokingAreasState={state}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
      params={params}
      setParams={setParams}
      refetchSmokingAreas={refetch}
    />
  );
}
