import { APIProvider, Map, AdvancedMarker, MapControl, ControlPosition, useMap } from "@vis.gl/react-google-maps";
import { TobaccoTypeFilter } from "./TobaccoTypeFilter";
import { formatSelectedTobaccoTypes } from "./features/smokingAreas/formatSelectedTobaccoTypes";
import { useTobaccoTypes } from "./features/smokingAreas/hooks/useTobaccoTypes";
import { useEffect, useRef, useState } from "react";
import { LocateFixed, Maximize, Minimize } from "lucide-react";
import type { SmokingAreaDisplay, SmokingAreaSearchParams } from "./features/smokingAreas/types";
import type { FetchState } from "./types/fetchState";

type SmokingAreasMapProps = {
  smokingAreasState: FetchState<SmokingAreaDisplay[]>;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  params: SmokingAreaSearchParams;
  setParams: (params: SmokingAreaSearchParams) => void;
  refetchSmokingAreas: () => Promise<void>;
};

const CurrentLocationHandler = ({ position }: { position: { lat: number, lng: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      map.panTo(position);
    }
  }, [map, position]);

  return (
    <MapControl position={ControlPosition.RIGHT_BOTTOM}>
      <button className="current-location-button" onClick={() => { if (map && position) map.panTo(position); }}>
        <LocateFixed size={20} color="currentColor" />
      </button>
    </MapControl>
  );
};

export const SmokingAreasMap = ({ smokingAreasState, selectedId, setSelectedId, params, setParams, refetchSmokingAreas }: SmokingAreasMapProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

  const [position, setPosition] = useState<{lat: number, lng: number} | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { state: tobaccoTypesState, refetch: refetchTobaccoTypes } = useTobaccoTypes();

  const renderOverlay = () => {
    if (smokingAreasState.status === "error" || tobaccoTypesState.status === "error") {
      return (
        <div className="error-overlay">
          <p>データの取得に失敗しました</p>
          <button onClick={() => { refetchSmokingAreas(); refetchTobaccoTypes(); }}>再取得</button>
        </div>
      );
    }
    if (smokingAreasState.status === "loading" || tobaccoTypesState.status === "loading") {
      return <div className="loading-overlay">Loading...</div>;
    }
    return null;
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1025);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
    });
  }, []);

  const getSelectedSmokingArea = (): SmokingAreaDisplay | null => {
    if (selectedId === null) return null;
    if (smokingAreasState.status !== "success") return null;
    return smokingAreasState.data.find((smokingArea) => smokingArea.id === selectedId) ?? null;
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      mapContainerRef.current?.requestFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const selectedSmokingArea = getSelectedSmokingArea();

  const selectedTobaccoTypeIds = selectedSmokingArea?.tobaccoTypeIds ?? [];
  const selectedTobaccoTypes = tobaccoTypesState.status === "success" ? 
                               formatSelectedTobaccoTypes(tobaccoTypesState.data, selectedTobaccoTypeIds) : "";

  const defaultCenter = { lat: 35.6812, lng: 139.7671 };

  return (
    <div className="map-container" ref={mapContainerRef}>
      <TobaccoTypeFilter params={params} setParams={setParams}/>
      {!isMobile && (
        <button className="fullscreen-button" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize size={20}/> : <Maximize size={20}/>}
        </button>
      )}
      {renderOverlay()}
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={16}
          mapId={mapId}
          disableDefaultUI={true}
          zoomControl={!isMobile}
          clickableIcons={false}
          keyboardShortcuts={false}
          draggableCursor="default"
          draggingCursor="move"
          gestureHandling="greedy"
          onClick={() => setSelectedId(null)}>
          <CurrentLocationHandler position={position}/>
          {position && <AdvancedMarker position={position}/>}
          {smokingAreasState.status === "success" && tobaccoTypesState.status === "success" && smokingAreasState.data.map((smokingArea) => {
            const isSelected = selectedId === smokingArea.id;
            return (
              <AdvancedMarker
                key={smokingArea.id}
                position={{ lat: smokingArea.latitude, lng: smokingArea.longitude}}
                onClick={() => setSelectedId(isSelected ? null : smokingArea.id)}
                zIndex={isSelected ? 5 : 0}>
                <div className="marker-wrapper">
                  <div className={isSelected ? "marker-dot marker-dot--selected" : "marker-dot"}/>
                  {isSelected && (
                    <div className="marker-popup" onClick={(e) => e.stopPropagation()}>
                      <button className="marker-popup-close" onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}>×</button>
                      <div className="marker-popup-name">
                        <strong>{smokingArea.name}</strong>
                      </div>
                      <div>対応：{selectedTobaccoTypes}</div>
                    </div>
                  )}
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
};
