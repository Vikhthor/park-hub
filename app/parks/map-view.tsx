import { OsrmRouteMap, RouteMap, RouteProgressMap} from "@/components/map-route"

export function ParkMap() {
  return (
    <div className="flex w-full min-h-[300px] flex-col gap-3">
        <RouteProgressMap/>
    </div>
  )
}