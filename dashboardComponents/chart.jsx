import { scaleTime, scaleLinear, max, line as d3_line, curveNatural } from "d3";

// Datos mockeados de ventas
let salesData = [
  { date: "2023-04-30", value: 5 },
  { date: "2023-05-01", value: 7 },
  { date: "2023-05-02", value: 7 },
  { date: "2023-05-03", value: 7.5 },
  { date: "2023-05-04", value: 9 },
  { date: "2023-05-05", value: 10.5 },
  { date: "2023-05-06", value: 11 },
  { date: "2023-05-07", value: 10.5 },
  { date: "2023-05-08", value: 8 },
  { date: "2023-05-09", value: 9 },
  { date: "2023-05-10", value: 9.5 },
  { date: "2023-05-11", value: 10 },
  { date: "2023-05-12", value: 9 },
  { date: "2023-05-13", value: 8.5 },
  { date: "2023-05-14", value: 6 },
  { date: "2023-05-15", value: 7 },
  { date: "2023-05-16", value: 9 },
  { date: "2023-05-17", value: 10 },
  { date: "2023-05-18", value: 10.5 },
  { date: "2023-05-19", value: 11 },
  { date: "2023-05-20", value: 11 },
  { date: "2023-05-21", value: 11.5 },
  { date: "2023-05-22", value: 12 },
  { date: "2023-05-23", value: 12 },
];

export function LineChartFull({ data = salesData, title = "Ventas por Día" }) {
  // Procesar datos
  const processedData = data.map((d) => ({ ...d, date: new Date(d.date) }));
  
  // Escalas
  let xScale = scaleTime()
    .domain([processedData[0].date, processedData[processedData.length - 1].date])
    .range([0, 100]);
    
  let yScale = scaleLinear()
    .domain([0, max(processedData.map((d) => d.value)) ?? 0])
    .range([100, 0]);

  // Línea
  let line = d3_line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value))
    .curve(curveNatural);

  let d = line(processedData);

  if (!d) {
    return <div className="text-center text-gray-500">No hay datos disponibles</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="relative h-72 w-full">
        {/* Chart area */}
        <div className="absolute inset-0 h-full w-full overflow-visible">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {yScale
              .ticks(6)
              .map(yScale.tickFormat(6, "d"))
              .map((active, i) => (
                <g transform={`translate(0,${yScale(+active)})`} className="text-gray-300" key={i}>
                  <line
                    x1={0}
                    x2={100}
                    stroke="currentColor"
                    strokeDasharray="2,2"
                    strokeWidth={0.5}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}

            {/* Line */}
            <path
              d={d}
              fill="none"
              stroke="url(#lineFull-gradient)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="lineFull-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" /> {/* green-500 */}
                <stop offset="100%" stopColor="#16a34a" /> {/* green-600 */}
              </linearGradient>
            </defs>
          </svg>

          {/* Y axis labels */}
          {yScale
            .ticks(6)
            .map(yScale.tickFormat(6, "d"))
            .map((value, i) => {
              if (i < 1) return null;
              return (
                <div
                  key={i}
                  style={{
                    top: `${yScale(+value)}%`,
                    left: "0%",
                  }}
                  className="absolute text-xs tabular-nums -translate-y-1/2 text-gray-500 w-full text-right pr-4"
                >
                  {value}
                </div>
              );
            })}

          {/* X axis labels */}
          {processedData.map((day, i) => {
            if (i % 4 !== 0 && i !== processedData.length - 1) return null;
            return (
              <div key={i} className="overflow-visible text-gray-500">
                <div
                  style={{
                    left: `${xScale(day.date)}%`,
                    top: "88%",
                    transform: `translateX(-50%)`,
                  }}
                  className="absolute text-xs"
                >
                  {day.date.toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


