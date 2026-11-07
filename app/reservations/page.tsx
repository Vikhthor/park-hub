import { Reservations } from "./list-view"
import Navbar from "@/components/navbar"

export default function Page() {
  return (
    <div className="@container/main flex flex-col h-dvh gap-2">
        <Navbar/>
        <div className="flex-1 min-h-0">
            <Reservations/>
        </div>
    </div>
  )
}