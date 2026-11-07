"use client"

import { useState } from "react";
import { ParkingLayoutEditor } from "@/components/parking-layout-editor";
import type { ParkingLevel } from "@/components/parking-layout";

export default function OwnerLayoutPage() {
  const [saved, setSaved] = useState<ParkingLevel[] | null>(null);

  return (
    // The editor fills its parent, so give the parent a height (see the Tailwind notes on stacked layouts).
    <div style={{ height: "100dvh", padding: 16, boxSizing: "border-box" }}>
      <ParkingLayoutEditor
        // initialLevels={levelsFromYourApi}   // omit to start from a small template
        onSave={async (levels) => {
          // POST the layout to your API here. The shape is exactly what <ParkingLayout levels={...} /> expects.
          console.log(JSON.stringify(levels, null, 2));
          setSaved(levels);
        }}
      />
      {saved && <p role="status">Saved {saved.length} level(s).</p>}
    </div>
  );
}