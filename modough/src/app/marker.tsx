import { IconBusStop } from "@tabler/icons-react";
import React from "react";

interface MarkerProps {
  lat: number;
  lng: number;
  markerId: string;
  onClick?: (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    props: { lat: number; lng: number; markerId: string },
  ) => void;
}

const Marker = ({ lat, lng, markerId, onClick }: MarkerProps) =>
  lat && lng ? (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1 shadow-md">
      <IconBusStop className="" size={30} />
    </div>
  ) : null;

export default Marker;
