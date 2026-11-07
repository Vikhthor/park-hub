import type { SVGAttributes } from "react";

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="2" y="2" width="5" height="22" rx="2.5" fill="#F4C21B"></rect><rect x="19" y="2" width="5" height="22" rx="2.5" fill="#F4C21B"></rect><rect x="9.5" y="9" width="7" height="13" rx="3" fill="currentColor"></rect></svg>
      <span>ParkBay</span>
    </div>
  );
};

export default Logo;
