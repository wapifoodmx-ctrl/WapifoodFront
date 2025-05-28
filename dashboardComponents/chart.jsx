import { scaleTime, scaleLinear, max, line as d3_line, curveNatural } from "d3";

export function LineChartFull({ data = [], title = "Ventas totales" }) {
  // Validar que hay datos
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No hay datos disponibles</div>;
  }

  // Agrupar datos por fecha y sumar los valores del mismo día
  const dataAgrupada = data.reduce((acc, item) => {
    const fecha = item.date;
    if (acc[fecha]) {
      acc[fecha] += item.value;
    } else {
      acc[fecha] = item.value;
    }
    return acc;
  }, {});

  // Convertir a array y ordenar por fecha
  const dataOrdenada = Object.entries(dataAgrupada)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Procesar datos
  const processedData = dataOrdenada.map((d) => ({ ...d, date: new Date(d.date) }));
  
  // Validar que hay datos procesados
  if (processedData.length === 0) {
    return <div className="text-center text-gray-500">No hay datos disponibles</div>;
  }

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

          {/* X axis labels - Mejorado para mostrar todas las fechas disponibles */}
          {processedData.map((day, i) => {
            // Mostrar todas las fechas si hay pocas, o cada 2 si hay muchas
            const shouldShow = processedData.length <= 5 || i % Math.ceil(processedData.length / 4) === 0 || i === processedData.length - 1;
            
            if (!shouldShow) return null;
            
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


