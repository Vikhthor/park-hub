import { ParkMap } from "./parks/map-view"
import { ParkList } from "./parks/list-view"
import Navbar from "@/components/navbar"

export default function Page() {
  return (
    <div>
      <div className="@container/main flex flex-col h-dvh gap-2">
        <Navbar/>
        <div className="grid lg:grid-cols-2 flex-1 min-h-0">
            <ParkMap/>
            <div className="">
                <ParkList/>
            </div>
            {/* <DockMenu/> */}
        </div>
      </div>
    </div>
  )
}
