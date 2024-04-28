"use client";

import { IconBusStop, IconHome, IconSearch } from "@tabler/icons-react";
import GoogleMap, {
  type onGoogleApiLoadedProps,
} from "google-maps-react-markers";
import { Fragment, useMemo, useRef, useState } from "react";
import { env } from "~/env";
import { api } from "~/trpc/react";
import Marker from "./marker";

export default function Home() {
  const search = api.search.search.useMutation();
  const { data: housesData } = api.search.getAddresses.useQuery();
  const { data: stopsData } = api.search.getStops.useQuery();

  const saveAddress = api.search.saveAddress.useMutation();

  const [address, setAddress] = useState("");
  const [showAllStops, setShowAllStops] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<number>();
  const [selectedStop, setSelectedStop] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitting", address);
    setAddress("");
    search.mutate({ address: address.trim() });
  };

  if (search.data) {
    console.log("search data", search.data);
  }

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const onGoogleApiLoaded = ({ map }: onGoogleApiLoadedProps) => {
    mapRef.current = map;
    setMapReady(true);
  };

  const [bounds, setBounds] = useState<google.maps.LatLngBounds | undefined>(
    undefined,
  );

  const stopsToRender = useMemo(
    () =>
      stopsData?.filter((stop) => {
        if (!bounds) return true;
        const isWithinBounds = bounds.contains(
          new google.maps.LatLng(stop.latitude, stop.longitude),
        );

        const isDeliveryStop = housesData?.some(
          (house) => house.busStop === stop.stopId,
        );

        if (!showAllStops && !isDeliveryStop) {
          return false;
        }
        if (isWithinBounds) {
          return true;
        }
      }),
    [bounds, housesData, showAllStops, stopsData],
  );

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-zinc-50 py-8">
      <section className="flex h-[70vh] flex-col items-center justify-center gap-2">
        <h1 className="py-8 text-6xl font-bold text-zinc-500">Bus Delivery</h1>
        <div>
          <p className="text-lg font-semibold text-zinc-400">
            Find nearest bus stop for drop off
          </p>
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-grow rounded-lg rounded-r-none border-2 px-2 py-1 text-lg"
              placeholder="Address"
            />
            <button
              type="submit"
              className="rounded-lg rounded-l-none border-2 border-l-0 bg-zinc-100 px-2"
            >
              <IconSearch size={20} className="text-black/45" stroke={2.5} />
            </button>
          </form>
        </div>
        {search.data && (
          <div className="py-8">
            <div className="flex min-w-52 flex-col items-end gap-1 rounded-lg border-2 bg-white p-2">
              <p className="w-full text-sm font-semibold text-zinc-400">
                address:
              </p>
              <p className="w-full">{search.data.address}</p>
              <p className="w-full text-sm font-semibold text-zinc-400">
                nearest stop:
              </p>
              {search.data.nearestStop === null ? (
                <p className="w-full">No stops found</p>
              ) : (
                <p className="w-full">
                  {search.data.nearestStop.stopId} -{" "}
                  {stopsData?.find(stop => stop.id === search.data.nearestStop?.id)?.name}
                </p>
              )}
              <button className="inline-block rounded-lg bg-sky-400 px-2 py-0.5 text-sm font-semibold text-white" onClick={()=>{
                if(search.data.nearestStop){
                  saveAddress.mutate({
                    address: search.data.address,
                    busStopId: search.data.nearestStop.id,
                    latitude: search.data.coordinates.latitude,
                    longitude: search.data.coordinates.longitude,
                  });
                }
              }}>
                Save
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="w-full">
        <div className="flex p-2">
          <label className="flex cursor-pointer gap-1">
            <input
              type="checkbox"
              onChange={(e) => {
                setShowAllStops(e.target.checked);
              }}
            />
            show all {stopsData?.length} stops
          </label>
        </div>
        <div className="h-[calc(70vh-30px)] overflow-y-hidden">
          <GoogleMap
            apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            defaultCenter={{ lat: 31.7071416, lng: -106.4097731 }}
            defaultZoom={5}
            options={{
              disableDefaultUI: true,
              mapId: "ca09a10cff5bcbc4",
              minZoom: 8,
              zoom: 10,
            }}
            mapMinHeight="70vh"
            onGoogleApiLoaded={onGoogleApiLoaded}
            events={[
              {
                name: "onClick",
                handler: (e: MouseEvent) => {
                  e.preventDefault();
                },
              },
            ]}
            onChange={(map) => {
              setBounds(map.bounds);
            }}
          >
            {stopsToRender?.map(({ latitude, longitude, stopId }) => (
              <Marker
                key={stopId}
                lat={latitude}
                lng={longitude}
                markerId={stopId}
                className={
                  selectedStop === stopId
                    ? "text-emerald-700 outline outline-4 outline-emerald-500"
                    : ""
                }
                onClick={() => {
                  setSelectedHouse(undefined);
                  setSelectedStop(stopId);
                  mapRef.current?.setZoom(17);
                  mapRef.current?.panTo({ lat: latitude, lng: longitude });
                }}
              >
                <IconBusStop size={30} stroke={1.5} />
              </Marker>
            ))}
            {housesData?.map((house) => {
              let className = "";
              if (selectedHouse === house.id) {
                className = "outline-4 text-sky-700 outline outline-sky-500";
              } else if (selectedStop === house.busStop) {
                className = "outline-4 text-sky-500 outline outline-sky-300";
              }
              return (
                <Marker
                  key={"h" + house.id}
                  lat={house.latitude}
                  lng={house.longitude}
                  markerId={"h" + house.id}
                  onClick={() => {
                    setSelectedHouse(house.id);
                    setSelectedStop(house.busStop);
                    mapRef.current?.setZoom(17);
                    mapRef.current?.panTo({
                      lat: house.latitude,
                      lng: house.longitude,
                    });
                  }}
                  className={className}
                >
                  <IconHome size={30} />
                </Marker>
              );
            })}
          </GoogleMap>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-2 gap-4">
          {/* <div>ID</div> */}
          <div>Address</div>
          <div>Nearest Stop</div>
          {housesData?.map((house) => (
            <Fragment key={house.id}>
              {/* <div>{house.id}</div> */}
              <div key={house.id}>{house.address}</div>
              <div>
                {
                  stopsData?.find((stop) => stop.id === house.busStopTableID)
                    ?.description
                }
              </div>
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}
