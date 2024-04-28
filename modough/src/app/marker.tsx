import { IconBusStop } from "@tabler/icons-react";
import React from "react";

interface MarkerProps {
  lat: number;
  lng: number;
  markerId: string;
  highlight?: boolean;
  children?: React.ReactElement | null;
  onClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    props: { lat: number; lng: number; markerId: string },
  ) => void;
}

const Marker = ({ lat, lng, markerId, onClick, highlight=false, children }: MarkerProps) =>
  lat && lng ? (
    <div 
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white p-1 shadow-md ${highlight ?'outline outline-red-500' : ''}`}
      onClick={(e)=>(onClick ? onClick(e, {markerId, lat, lng}): null)}>
      {children}
    </div>
  ) : null;

export default Marker;
