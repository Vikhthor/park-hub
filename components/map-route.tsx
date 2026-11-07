"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapRoute,
  MarkerLabel,
  RouteMarker,
  RouteProgress,
} from "@/components/ui/map";
import { Car } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const stops = [
  { name: "City Hall", lng: -74.006, lat: 40.7128 },
  { name: "Empire State Building", lng: -73.9857, lat: 40.7484 },
  { name: "Grand Central Terminal", lng: -73.9772, lat: 40.7527 },
  { name: "Central Park", lng: -73.9654, lat: 40.7829 },
];

export function RouteMap() {
    const route = [
        [-74.006, 40.7128], // NYC City Hall
        [-73.9857, 40.7484], // Empire State Building
        [-73.9772, 40.7527], // Grand Central
        [-73.9654, 40.7829], // Central Park
    ] as [number, number][];
  return (
    <div className="h-[420px] w-full">
      <Map center={[-73.98, 40.75]} zoom={11.2}>
        <MapRoute coordinates={route} color="#3b82f6" width={4} opacity={0.8} />

        {stops.map((stop, index) => (
          <MapMarker key={stop.name} longitude={stop.lng} latitude={stop.lat}>
            <MarkerContent>
              <div className="flex size-4.5 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-semibold text-white shadow-lg">
                {index + 1}
              </div>
            </MarkerContent>
            <MarkerTooltip>{stop.name}</MarkerTooltip>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}

/////////////////

export function RouteProgressMap() {
  const [progress, setProgress] = useState(0.45);

  const route: [number, number][] = [
    [-122.394, 37.7953],
    [-122.3952, 37.7967],
    [-122.397, 37.7986],
    [-122.3975, 37.7992],
    [-122.3976, 37.7993],
    [-122.3981, 37.799],
    [-122.3984, 37.7989],
    [-122.4066, 37.7979],
    [-122.4071, 37.7981],
    [-122.4072, 37.7982],
    [-122.4072, 37.7984],
    [-122.4082, 37.8034],
    [-122.4064, 37.8037],
    [-122.4063, 37.8036],
    [-122.4063, 37.8034],
    [-122.4067, 37.8032],
    [-122.4067, 37.803],
    [-122.4067, 37.8028],
    [-122.4064, 37.8025],
    [-122.4062, 37.802],
    [-122.406, 37.8019],
    [-122.4058, 37.8018],
    [-122.4056, 37.8018],
    [-122.4055, 37.8019],
    [-122.4054, 37.8021],
    [-122.4056, 37.8025],
    ];

  return (
    <div className="relative h-full w-full">
      <Map center={[-122.4008, 37.7996]} zoom={14.2}>
        <MapRoute
          coordinates={route}
          progress={progress}
          color="#94a3b8"
          width={5}
          opacity={0.8}
          dashArray={[0.5, 1.5]}
        >
          <RouteProgress color="#3b82f6" width={5} opacity={1} />

          <RouteMarker at="start">
            <MarkerContent>
              <div className="border-foreground bg-background size-3.5 rounded-full border-2 shadow-md" />
            </MarkerContent>
          </RouteMarker>

          <RouteMarker at="progress">
            <MarkerContent>
              <div className="ring-background grid size-6 place-items-center rounded-full bg-blue-500 shadow-md ring-2">
                <Car className="size-3 text-white" />
              </div>
              <MarkerLabel
                position="top"
                className="bg-background/90 border-border/50 rounded-md border px-1.5 py-0.5 tabular-nums shadow-sm"
              >
                {Math.round(progress * 100)}%
              </MarkerLabel>
            </MarkerContent>
          </RouteMarker>

          <RouteMarker at="end">
            <MarkerContent>
              <div className="bg-foreground ring-background size-3.5 rounded-full shadow-md ring-2" />
            </MarkerContent>
          </RouteMarker>
        </MapRoute>
      </Map>

      <div className="bg-background/95 border-border/50 absolute bottom-3 left-3 w-56 rounded-lg border p-3 shadow-lg backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">Progress</span>
          <span className="text-muted-foreground tabular-nums">
            {Math.round(progress * 100)}%
          </span>
        </div>
        <Slider
          value={[progress]}
          onValueChange={(value) => setProgress(value as number)}
          min={0}
          max={1}
          step={0.01}
          aria-label="Route progress"
        />
      </div>
    </div>
  );
}

////////////

const start = { name: "Amsterdam", lng: 4.9041, lat: 52.3676 };
const end = { name: "Rotterdam", lng: 4.4777, lat: 51.9244 };

// One color for every route: the selected one separates itself by weight and
// opacity, not hue. Shared by the lines and the list, so a swatch always
// matches its route.
const routeColor = "#3b82f6";
const inactiveOpacity = 0.35;

interface RouteData {
  coordinates: [number, number][];
  duration: number; // seconds
  distance: number; // meters
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function OsrmRouteMap() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`,
        );
        const data = await response.json();

        if (data.routes?.length > 0) {
          const routeData: RouteData[] = data.routes.map(
            (route: {
              geometry: { coordinates: [number, number][] };
              duration: number;
              distance: number;
            }) => ({
              coordinates: route.geometry.coordinates,
              duration: route.duration,
              distance: route.distance,
            }),
          );
          setRoutes(routeData);
        }
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoutes();
  }, []);

  return (
    <div className="relative h-[500px] w-full">
      <Map center={[4.69, 52.14]} zoom={8.5} loading={isLoading}>
        {routes.map((route, index) => (
          <MapRoute
            key={index}
            coordinates={route.coordinates}
            active={index === selectedIndex}
            color={routeColor}
            width={5}
            opacity={inactiveOpacity}
            activeWidth={6}
            activeOpacity={1}
            onClick={() => setSelectedIndex(index)}
          />
        ))}

        <MapMarker longitude={start.lng} latitude={start.lat}>
          <MarkerContent>
            <div className="border-foreground bg-background size-3.5 rounded-full border-2 shadow-md" />
          </MarkerContent>
        </MapMarker>

        <MapMarker longitude={end.lng} latitude={end.lat}>
          <MarkerContent>
            <div className="bg-foreground ring-background size-3.5 rounded-full shadow-md ring-2" />
          </MarkerContent>
        </MapMarker>
      </Map>

      {routes.length > 0 && (
        <div
          role="radiogroup"
          aria-label="Route options"
          className="bg-background/95 border-border/50 absolute top-3 left-3 w-48 space-y-0.5 rounded-lg border p-1 shadow-lg backdrop-blur-md"
        >
          {routes.map((route, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={index}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors",
                  isActive ? "bg-muted" : "hover:bg-muted/50",
                )}
              >
                <span
                  className="h-4 w-0.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: routeColor,
                    opacity: isActive ? 1 : inactiveOpacity,
                  }}
                />
                <span
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    !isActive && "text-muted-foreground",
                  )}
                >
                  {formatDuration(route.duration)}
                </span>
                <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                  {formatDistance(route.distance)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
