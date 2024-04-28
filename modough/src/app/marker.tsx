import React from "react";
import { twMerge } from "tailwind-merge";

interface MarkerProps {
  lat: number;
  lng: number;
  markerId: string;
  className?: string;
  children?: React.ReactElement | null;
  onClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    props: { lat: number; lng: number; markerId: string },
  ) => void;
}

const Marker = ({
  lat,
  lng,
  markerId,
  onClick,
  className,
  children,
}: MarkerProps) =>
  lat && lng ? (
    <div
      className={twMerge(
        "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white p-1 shadow-md",
        className,
      )}
      onClick={(e) => (onClick ? onClick(e, { markerId, lat, lng }) : null)}
    >
      {children}
    </div>
  ) : null;

export default Marker;
