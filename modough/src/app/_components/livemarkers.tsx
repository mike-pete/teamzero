/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client"
import Marker from "../marker"

const lineIds = [14128, 14129, 14130, 14131]
const lineReqBody = lineIds.flatMap(id => [{
    "lineDirId": id + "1",
    "callingApp": "RMD"
}, {
    "lineDirId": id + "0",
    "callingApp": "RMD"
}])

const busLocations = await fetch('https://go.sunmetro.net/RealTimeManager', {
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "version": "1.1",
        "method": "GetTravelPoints",
        "params": {
            "interval": 10,
            "travelPointsReqs": lineReqBody
        }
    }),
    method: 'POST'
}).then((res) => res.json()).then((locs ) => locs?.result?.travelPoints).then(tp => {
    const busArray= []
    tp.forEach(t => {
        const exists = busArray.findIndex(x => x.LineDirId === t.LineDirId)
        const points = t.EstimatedPoints || t.ScheduledPoints
        const latest = points.reduce((acc, ep) => {
            if (ep.Time > acc.Time) {
                return ep;
            }
            return acc;
        }, { Time: 0, Lat: 0, Lon: 0 })
        if (exists===-1) {
            busArray.push({ LineDirId: t.LineDirId, ...latest })
        }
        else {
            if(latest.Time > busArray[exists].Time){
                busArray[exists] = latest
            }
        }
    })
    return busArray;
})

export default busLocations;