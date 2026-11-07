import DockMenu from "@/components/dock-menu"
import { ParkMap } from "./map-view"
import { ParkList } from "./list-view"
import Navbar from "@/components/navbar"

export default function Page() {
  return (
    <div className="flex flex-col gap-2 h-dvh overflow-auto">
        <Navbar/>
        <div className="grid lg:grid-cols-2 min-h-0 flex-1 overflow-auto gap-1">
            <ParkMap/>
            <div className="">
                <ParkList/>
            </div>
        </div>
    </div>
  )
}