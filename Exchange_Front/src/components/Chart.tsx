import { useState } from "react";
import {
  VictoryChart,
  VictoryTheme,
  VictoryCandlestick,
  VictoryZoomContainer,
  VictoryAxis,
} from "victory";
import Btn from "./Btn";
import { useCharts } from "../hooks/chartHook";
import { useWebsocket } from "../hooks/websocketHook";
import { exchangeRates } from "../@types/exchangeRates";

function Chart() {
  const [state, setState] = useState({});
  const [chartType, setChartType] = useState("day/USDGBP");

  const { chartData, loading, error } = useCharts(chartType);

  const exchangeRates: exchangeRates | null = useWebsocket();

  const handleZoom = (domain: any) => {
    setState({ selectedDomain: domain, zoomedXDomain: domain.x });
  };

  if (loading) {
    return (
      <div className="bg-primary p-4 max-w-[352px] rounded-xl flex flex-col gap-4">
        <div className="max-w-[375px] bg-white rounded-xl">
          <VictoryChart
            width={375}
            theme={VictoryTheme.clean}
            domainPadding={{ x: 25 }}
            containerComponent={
              <VictoryZoomContainer
                zoomDimension="x"
                zoomDomain={state.zoomDomain}
                onZoomDomainChange={handleZoom}
              />
            }
          >
            <VictoryAxis dependentAxis />

            {chartType !== "year/USDGBP" && (
              <VictoryAxis
                tickFormat={(t, i) => (i % 2 === 0 ? t : "")}
                style={{
                  tickLabels: { fontSize: 14, angle: -45, padding: 5 },
                }}
              />
            )}

            {chartType === "year/USDGBP" && (
              <VictoryAxis
                tickFormat={(t) => {
                  const date = new Date(t);
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();
                  return `${month}/${year}`;
                }}
                style={{
                  tickLabels: {
                    fontSize: 12,
                    angle: 0,
                    padding: 5,
                  },
                }}
                tickCount={4}
              />
            )}

            <VictoryCandlestick />
          </VictoryChart>
        </div>
        <ul className="flex gap-4 overflow-x-auto whitespace-nowrap -mx-4">
          <li>
            <Btn
              color={chartType === "day/USDGBP" ? "secondary" : "white"}
              label="Day"
              w="w-[140px]"
              classname="ml-4"
              func={() => setChartType("day/USDGBP")}
            />
          </li>
          <li>
            <Btn
              color={chartType === "week/USDGBP" ? "secondary" : "white"}
              label="Week"
              w="w-[140px]"
              func={() => setChartType("week/USDGBP")}
            />
          </li>
          <li>
            <Btn
              color={chartType === "month/USDGBP" ? "secondary" : "white"}
              label="Month"
              w="w-[140px]"
              func={() => setChartType("month/USDGBP")}
            />
          </li>
          <li>
            <Btn
              color={chartType === "year/USDGBP" ? "secondary" : "white"}
              label="Year"
              w="w-[140px]"
              classname="mr-4"
              func={() => setChartType("year/USDGBP")}
            />
          </li>
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary p-4 max-w-[352px] rounded-xl flex flex-col gap-4">
        <div className="max-w-[375px] bg-white rounded-xl">Error: {error}</div>
        <ul className="flex gap-4 overflow-x-auto whitespace-nowrap -mx-4">
          <li>
            <Btn
              color={chartType === "day/USDGBP" ? "secondary" : "white"}
              label="Day"
              w="w-[140px]"
              classname="ml-4"
              func={() => setChartType("day/USDGBP")}
            />
          </li>
          <li>
            <Btn
              color={chartType === "week/USDGBP" ? "secondary" : "white"}
              label="Week"
              w="w-[140px]"
              func={() => setChartType("week/USDGBP")}
            />
          </li>
          <li>
            <Btn
              color={chartType === "month/USDGBP" ? "secondary" : "white"}
              label="Month"
              w="w-[140px]"
              func={() => setChartType("month/USDGBP")}
            />
          </li>
          <li>
            <Btn
              color={chartType === "year/USDGBP" ? "secondary" : "white"}
              label="Year"
              w="w-[140px]"
              classname="mr-4"
              func={() => setChartType("year/USDGBP")}
            />
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-primary p-4 max-w-[352px] rounded-xl flex flex-col gap-4">
      {exchangeRates ? (
        <ul className="text-white">
           <li>GBP/USD: {exchangeRates.GBPUSD.toFixed(4)}</li>
          <li>USD/GBP: {exchangeRates.USDGBP.toFixed(4)}</li> 
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      <div className="max-w-[375px] bg-white rounded-xl">
        <VictoryChart
          width={375}
          theme={VictoryTheme.clean}
          domainPadding={{ x: 25 }}
          containerComponent={
            <VictoryZoomContainer
              zoomDimension="x"
              zoomDomain={state.zoomDomain}
              onZoomDomainChange={handleZoom}
            />
          }
        >
          {/* Add Y-axis */}
          <VictoryAxis dependentAxis />

          {/* Conditionally render the X-axis based on chartType */}
          {chartType !== "year/USDGBP" && (
            <VictoryAxis
              tickFormat={(t, i) => (i % 2 === 0 ? t : "")} // Show only every 2nd date
              style={{
                tickLabels: { fontSize: 14, angle: -45, padding: 5 }, // Increase font size for better readability
              }}
            />
          )}

          {/* For year chartType, show fewer ticks */}
          {chartType === "year/USDGBP" && (
            <VictoryAxis
              tickFormat={(t) => {
                // Format date as mm/yyyy (e.g., 01/2023)
                const date = new Date(t);
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${month}/${year}`;
              }}
              style={{
                tickLabels: {
                  fontSize: 12, // Slightly larger font for readability
                  angle: 0, // No rotation for readability
                  padding: 5,
                },
              }}
              tickCount={4} // Limit to 4 ticks (one per quarter)
            />
          )}

          <VictoryCandlestick data={chartData} />
        </VictoryChart>
      </div>
      <ul className="flex gap-4 overflow-x-auto whitespace-nowrap -mx-4">
        <li>
          <Btn
            color={chartType === "day/USDGBP" ? "secondary" : "white"}
            label="Day"
            w="w-[140px]"
            classname={`ml-4 ${chartType === "day/USDGBP" ? "" : "border"}`}
            func={() => setChartType("day/USDGBP")}
          />
        </li>
        <li>
          <Btn
            color={chartType === "week/USDGBP" ? "secondary" : "white"}
            label="Week"
            w="w-[140px]"
            func={() => setChartType("week/USDGBP")}
            classname={chartType === "week/USDGBP" ? "" : "border"}
          />
        </li>
        <li>
          <Btn
            color={chartType === "month/USDGBP" ? "secondary" : "white"}
            label="Month"
            w="w-[140px]"
            func={() => setChartType("month/USDGBP")}
            classname={chartType === "month/USDGBP" ? "" : "border"}
          />
        </li>
        <li>
          <Btn
            color={chartType === "year/USDGBP" ? "secondary" : "white"}
            label="Year"
            w="w-[140px]"
            classname={`mr-4 ${chartType === "year/USDGBP" ? "" : "border"}`}
            func={() => setChartType("year/USDGBP")}
          />
        </li>
      </ul>
    </div>
  );
}

export default Chart;
