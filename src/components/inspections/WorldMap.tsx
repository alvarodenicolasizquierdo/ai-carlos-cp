import { memo, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'at-risk' | 'critical';
  inspectionCount: number;
  hasCritical: boolean;
}

interface WorldMapProps {
  markers: MapMarker[];
  onMarkerClick: (id: string) => void;
}

/**
 * Simplified Mercator projection converting lat/lng to SVG coordinates.
 * The SVG viewBox is 1000x500 with origin top-left.
 */
function project(lng: number, lat: number): [number, number] {
  const x = ((lng + 180) / 360) * 1000;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = 250 - (mercN / Math.PI) * 250;
  return [x, Math.max(0, Math.min(500, y))];
}

// Simplified world landmass paths (Natural Earth-inspired, low-detail outlines)
// These are approximate continental outlines for a decorative map background.
const CONTINENT_PATHS = [
  // North America
  "M130,80 L160,60 L200,55 L230,70 L250,95 L245,120 L230,140 L220,155 L210,170 L195,180 L175,200 L165,195 L150,195 L140,180 L130,160 L120,140 L110,120 L115,100 Z",
  // Central America & Caribbean
  "M170,200 L180,210 L185,220 L190,230 L188,235 L182,232 L175,225 L168,215 Z",
  // South America
  "M210,240 L225,235 L240,240 L260,250 L275,260 L280,280 L285,300 L280,320 L270,340 L260,360 L250,380 L240,395 L230,400 L225,390 L220,370 L215,350 L210,330 L200,310 L195,290 L198,270 L205,255 Z",
  // Europe
  "M460,75 L480,65 L510,60 L530,65 L540,75 L535,90 L525,100 L515,110 L505,115 L495,110 L480,105 L470,100 L460,90 Z",
  // Africa
  "M460,150 L480,140 L510,140 L530,145 L545,155 L555,170 L560,190 L558,210 L555,230 L548,250 L540,270 L530,285 L520,295 L510,300 L500,298 L490,290 L480,275 L470,260 L462,240 L458,220 L455,200 L455,180 L457,165 Z",
  // Middle East
  "M540,110 L560,105 L580,110 L590,120 L585,135 L575,145 L560,148 L545,145 L535,135 L535,120 Z",
  // Russia / Northern Asia
  "M540,60 L580,50 L620,45 L660,40 L700,42 L740,45 L780,50 L810,55 L830,60 L840,70 L830,80 L800,85 L760,82 L720,78 L680,75 L640,72 L600,70 L560,68 L545,65 Z",
  // South Asia (India)
  "M600,140 L620,135 L640,140 L650,155 L645,170 L638,185 L630,195 L620,200 L610,195 L605,180 L600,165 L598,150 Z",
  // Southeast Asia
  "M660,170 L680,165 L700,170 L710,180 L705,195 L695,205 L680,210 L665,205 L655,195 L655,180 Z",
  // East Asia (China, Japan, Korea)
  "M660,80 L690,75 L720,78 L740,85 L750,95 L748,110 L740,125 L725,135 L710,140 L695,138 L680,130 L668,120 L660,108 L655,95 Z",
  // Japan
  "M760,90 L765,85 L770,90 L772,100 L770,110 L765,115 L760,110 L758,100 Z",
  // Indonesia / Maritime SEA
  "M680,220 L700,218 L720,220 L740,222 L750,225 L745,232 L730,235 L710,233 L690,230 L680,228 Z",
  // Australia
  "M740,290 L770,280 L800,278 L830,282 L850,290 L855,305 L850,320 L840,335 L825,345 L810,348 L790,345 L770,338 L755,325 L745,310 L740,298 Z",
  // New Zealand
  "M870,340 L875,335 L878,340 L880,350 L878,358 L873,360 L870,355 L868,348 Z",
  // Greenland
  "M310,30 L340,25 L360,30 L365,45 L355,55 L340,60 L325,55 L315,45 Z",
  // UK & Ireland
  "M445,70 L450,65 L458,68 L458,80 L452,85 L446,82 Z",
  // Scandinavia
  "M490,35 L500,30 L510,35 L515,50 L512,60 L505,65 L495,60 L490,50 Z",
];

const WorldMap = memo(({ markers, onMarkerClick }: WorldMapProps) => {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getStatusColor = useCallback((status: 'active' | 'at-risk' | 'critical') => {
    switch (status) {
      case 'active': return '#10b981';
      case 'at-risk': return '#f59e0b';
      case 'critical': return '#ef4444';
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 500"
      className="w-full h-full"
      style={{ width: '100%', height: '100%', minHeight: 200 }}
      role="img"
      aria-label="World map showing factory locations"
    >
      {/* Ocean background */}
      <rect width="1000" height="500" fill="hsl(var(--muted) / 0.3)" rx="8" />

      {/* Graticule lines */}
      {[...Array(7)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0" y1={(i + 1) * 62.5}
          x2="1000" y2={(i + 1) * 62.5}
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="0.5"
        />
      ))}
      {[...Array(11)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={(i + 1) * 83.3} y1="0"
          x2={(i + 1) * 83.3} y2="500"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="0.5"
        />
      ))}

      {/* Continent shapes */}
      {CONTINENT_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth="0.8"
        />
      ))}

      {/* Factory markers */}
      {markers.map((marker, index) => {
        const [cx, cy] = project(marker.lng, marker.lat);
        const isHovered = hoveredMarker === marker.id;
        const color = getStatusColor(marker.status);

        return (
          <g
            key={marker.id}
            onClick={() => onMarkerClick(marker.id)}
            onMouseEnter={() => setHoveredMarker(marker.id)}
            onMouseLeave={() => setHoveredMarker(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Pulse animation for critical markers */}
            {marker.hasCritical && (
              <motion.circle
                cx={cx} cy={cy}
                r={12}
                fill="none"
                stroke="#ef4444"
                strokeWidth={1.5}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 2.5 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            )}

            {/* Main marker dot */}
            <motion.circle
              cx={cx} cy={cy}
              r={isHovered ? 9 : 7}
              fill={color}
              opacity={0.9}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ delay: index * 0.1 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle
              cx={cx} cy={cy}
              r={3}
              fill="white"
              opacity={0.9}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.05 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />

            {/* Inspection count badge */}
            {marker.inspectionCount > 0 && (
              <>
                <circle
                  cx={cx + 8}
                  cy={cy - 8}
                  r={5}
                  fill="hsl(var(--primary))"
                />
                <text
                  x={cx + 8}
                  y={cy - 5.5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="6"
                  fontWeight="bold"
                >
                  {marker.inspectionCount}
                </text>
              </>
            )}

            {/* Factory label */}
            <text
              x={cx}
              y={cy + 16}
              textAnchor="middle"
              className="fill-foreground"
              style={{ fontSize: '7px', fontWeight: 500 }}
            >
              {marker.name.length > 18 ? marker.name.slice(0, 18) + '...' : marker.name}
            </text>

            {/* Tooltip on hover */}
            {isHovered && (
              <g>
                <rect
                  x={cx - 55} y={cy - 35}
                  width="110" height="22"
                  rx="4"
                  fill="hsl(var(--popover))"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity={0.95}
                />
                <text
                  x={cx} y={cy - 20}
                  textAnchor="middle"
                  fill="hsl(var(--popover-foreground))"
                  fontSize="7"
                  fontWeight="600"
                >
                  {marker.name} ({marker.inspectionCount} inspections)
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
});

WorldMap.displayName = 'WorldMap';

export default WorldMap;
