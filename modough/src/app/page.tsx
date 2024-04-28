"use client";
import { IconBusStop, IconSearch, IconHome } from "@tabler/icons-react";
import GoogleMap from "google-maps-react-markers";
import { useEffect, useRef, useState } from "react";
import { env } from "~/env";
import { api } from "~/trpc/react";
import Marker from "./marker";
import getBusLocations from "./_components/livemarkers";
import type { Addresses } from "@prisma/client";

export default function Home() {
  const search = api.search.search.useMutation();
  const houses = api.search.getAddresses.useQuery().data!;
  const stops = api.search.getStops.useQuery().data!;

  const saveAddress = api.search.saveAddress.useMutation();

  const [address, setAddress] = useState("");
  const [highlightIds, setHighlightIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitting", address);
    setAddress("");
    search.mutate({ address: address.trim() });
  };

  if (search.data) {
    console.log("search data", search.data);
  }

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    setMapReady(true);
  };

  const onMarkerClick = (e, { markerId, lat, lng }) => {
    console.log("This is ->", markerId);

    // inside the map instance you can call any google maps method
    mapRef.current.setCenter({ lat, lng });
    // ref. https://developers.google.com/maps/documentation/javascript/reference?hl=it
  };

  useEffect(()=>{

    const intervalId = setInterval(()=>{
      const buslocs = getBusLocations();
      console.log(buslocs)
    }, 10*1000)
    return ()=>clearInterval(intervalId)

  })

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-zinc-50 p-8">
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
        {/* {search.data && (
          <div className="py-8">
            <div className="flex min-w-52 flex-col items-end gap-1 rounded-lg border-2 bg-white p-2">
              <p className="w-full text-sm font-semibold text-zinc-400">
                address:
              </p>
              <p className="w-full">{search.data.address}</p>
              <p className="w-full text-sm font-semibold text-zinc-400">
                nearest stop:
              </p>
              <p className="w-full">{search.data.nearestStop.name}</p>
              <button className="inline-block rounded-lg bg-sky-400 px-2 py-0.5 text-sm font-semibold text-white">
                Save
              </button>
            </div>
          </div>
        )} */}
      </section>
      <section className="min-w-[600px] h-[calc(60vh-30px)] overflow-hidden rounded-xl">
        <GoogleMap
          apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          defaultCenter={{ lat: 31.9619072, lng: -106.3682048 }}
          defaultZoom={5}
          options={{
            disableDefaultUI: true,
            mapId: "ca09a10cff5bcbc4",
            minZoom: 8,
            zoom: 10,
          }}
          mapMinHeight="60vh"
          onGoogleApiLoaded={onGoogleApiLoaded}
          events={[
            {
              name:'onClick',
              handler: (e:MouseEvent)=>{e.preventDefault()}
            }
          ]}
          // onChange={(map) => console.log("Map moved", map)}

        >
          {[{ lat: 31.9619072, lng: -106.3682048, name: "ok" }].map(
            ({ lat, lng, name }, index) => (
              <Marker
                key={index}
                lat={lat}
                lng={lng}
                markerId={name}
                // highlight={highlightIds.includes(m.id)}
                onClick={onMarkerClick}
              >
                <IconBusStop size={30} />
              </Marker>
            ),
          )}
          {// stops foreach if in highlight ids or separately save the markers to display
          }
          {houses?.map(h => (
          <Marker
          key={"h" + h.id}
          lat={h.latitude}
          lng={h.longitude}
          markerId={"h" + h.id}
          highlight={highlightIds.includes("h"+h.id)}
          onClick={(e,{markerId})=>{
            e.preventDefault()
            // get busStop Id
            const targetBusStopId = houses.find(h=>h.id===+markerId.substring(1))?.busStopId
            if(!!targetBusStopId){
              // find houses with busStop Id
              const targetHouseIds = houses.filter(h=>h.busStopId===targetBusStopId)?.map((h)=>!!h && "h"+h.id)
              setHighlightIds([''+targetBusStopId, ...targetHouseIds])
            }
          }} >
            <IconHome size={30} />
          </Marker>))}
        </GoogleMap>
      </section>
      <section>
        <div className="grid grid-cols-3 gap-4">
          <div>ID</div>
          <div>Address</div>
          <div>Nearest Stop</div>
          {houses?.map(h => (<><div>{h.id}</div><div key={h.id}>{h.address}</div><div>{stops?.find((s)=>s.id===h.busStopId)?.description}</div></>))}

        </div>

      </section>
    </div>
  );
}
