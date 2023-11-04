import "./App.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from 'react-leaflet';
import { jawgToken } from './token.tsx';

export default function Map() {
    return (
        <MapContainer className='map' center={[41.8781, -87.63]} zoom={13}>
            <TileLayer
                attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`}
            />
        </MapContainer>
    )
}
