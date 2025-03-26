"use client"
import { useState } from "react";
import {
  VictoryChart,
  VictoryTheme,
  VictoryCandlestick,
  VictoryZoomContainer,
  VictoryAxis,
  ZoomDomain,
  DomainTuple,
} from "victory";
import Btn from "./Btn";
import { useCharts } from "../hooks/chartHook";
import { useWebsocket } from "../hooks/websocketHook";
import { exchangeRates } from "../@types/exchangeRates";
import { useTranslations } from "next-intl";

function Chart({ className = "" }: { className?: string }) {
  type ZoomState = {
    zoomDomain?: ZoomDomain;
    selectedDomain?: ZoomDomain;
    zoomedXDomain?: DomainTuple;
  };

  const t = useTranslations();
  const [state, setState] = useState<ZoomState>({});
  const [chartType, setChartType] = useState("day/USDGBP");

  const { chartData, loading, error } = useCharts(chartType);
  const loadingData = [
    {
      close: 0.77657,
      date: "2025-03-10",
      high: 0.77742,
      low: 0.77254,
      open: 0.77399,
    },
    {
      close: 0.7724,
      date: "2025-03-11",
      high: 0.77676,
      low: 0.77137,
      open: 0.77656,
    },
    {
      close: 0.7714,
      date: "2025-03-12",
      high: 0.77426,
      low: 0.77038,
      open: 0.77239,
    },
    {
      close: 0.77215,
      date: "2025-03-13",
      high: 0.77377,
      low: 0.77088,
      open: 0.77139,
    },
    {
      close: 0.77313,
      date: "2025-03-14",
      high: 0.77428,
      low: 0.77174,
      open: 0.77214,
    },
    {
      close: 0.7711,
      date: "2025-03-17",
      high: 0.77358,
      low: 0.77065,
      open: 0.77316,
    },
  ];

  const exchangeRates: exchangeRates | null = useWebsocket();

  const handleZoom = (domain: ZoomDomain) => {
    setState({ selectedDomain: domain, zoomedXDomain: domain.x });
  };

  if (loading) {
    return (
      <div
        className={`bg-primary p-4 max-w-[352px]  md:max-w-[660px] rounded-xl flex flex-col gap-4 ${className}`}
      >
        {exchangeRates ? (
          <ul className="text-white md:text-xl">
            <li>GBP/USD: {exchangeRates.GBPUSD.toFixed(4)}</li>
            <li>USD/GBP: {exchangeRates.USDGBP.toFixed(4)}</li>
          </ul>
        ) : (
          <p>{t("Loading")} {t("Chart")}...</p>
        )}
        <div className="max-w-[375px] bg-white rounded-xl md:max-w-[660px]">
          <h3 className="text-center text-2xl mt-4">{t("Loading")}...</h3>
          <VictoryChart
            width={375}
            theme={VictoryTheme.grayscale}
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

            <VictoryCandlestick data={loadingData} />
          </VictoryChart>
        </div>
        <ul className="flex gap-4 overflow-x-auto whitespace-nowrap -mx-4">
          <li>
            <Btn
              color={chartType === "day/USDGBP" ? "secondary" : "white"}
              label={t("Day")}
              w="w-[140px]"
              classname="ml-4"
            />
          </li>
          <li>
            <Btn
              color={chartType === "week/USDGBP" ? "secondary" : "white"}
              label={t("Week")}
              w="w-[140px]"
            />
          </li>
          <li>
            <Btn
              color={chartType === "month/USDGBP" ? "secondary" : "white"}
              label={t("Month")}
              w="w-[140px]"
            />
          </li>
          <li>
            <Btn
              color={chartType === "year/USDGBP" ? "secondary" : "white"}
              label={t("Year")}
              w="w-[140px]"
              classname="mr-4"
            />
          </li>
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-primary p-4 max-w-[352px]  md:max-w-[660px] rounded-xl flex flex-col gap-4 ${className}`}
      >
        {exchangeRates ? (
          <ul className="text-white md:text-xl">
            <li>GBP/USD: {exchangeRates.GBPUSD.toFixed(4)}</li>
            <li>USD/GBP: {exchangeRates.USDGBP.toFixed(4)}</li>
          </ul>
        ) : (
          <p>{t("Loading")}...</p>
        )}
        <div className="max-w-[375px] bg-white rounded-xl md:max-w-[660px]">
          Error: {error}
        </div>
        <ul className="flex gap-4 overflow-x-auto whitespace-nowrap -mx-4">
          <li>
            <Btn
              color={chartType === "day/USDGBP" ? "secondary" : "white"}
              label={t("Day")}
              w="w-[140px]"
              classname="ml-4"
              func={() => setChartType("day/USDGBP")}
            />
          </li>
          <li>
            <Btn
              color={chartType === "week/USDGBP" ? "secondary" : "white"}
              label={t("Week")}
              w="w-[140px]"
              func={() => setChartType("week/USDGBP")}
            />
          </li>
          <li>
            <Btn
              color={chartType === "month/USDGBP" ? "secondary" : "white"}
              label={t("Month")}
              w="w-[140px]"
              func={() => setChartType("month/USDGBP")}
            />
          </li>
          <li>
            <Btn
              color={chartType === "year/USDGBP" ? "secondary" : "white"}
              label={t("Year")}
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
    <div
      className={`bg-primary p-4 max-w-[352px]  md:max-w-[660px] rounded-xl flex flex-col gap-4 ${className}`}
    >
      {exchangeRates ? (
        <ul className="text-white md:text-xl">
          <li>GBP/USD: {exchangeRates.GBPUSD.toFixed(4)}</li>
          <li>USD/GBP: {exchangeRates.USDGBP.toFixed(4)}</li>
        </ul>
      ) : (
        <p>{t("Loading")}...</p>
      )}
      <div className="max-w-[375px]  md:max-w-[660px] bg-white rounded-xl">
        <div
          className="w-full h-[100px] overflow-scroll invisible" // or use opacity-0 or hidden as needed
          data-testid="scrollable-div"
        >
          <div className="h-[200px]">Scrollable Content</div>
        </div>
        <VictoryChart
          width={375}
          theme={VictoryTheme.clean}
          domainPadding={{ x: 25 }}
          containerComponent={
            <VictoryZoomContainer
              zoomDimension="x"
              zoomDomain={state.zoomDomain}
              onZoomDomainChange={handleZoom}
              data-testid="victory-zoom-container"
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

          <VictoryCandlestick data={chartData} />
        </VictoryChart>
      </div>
      <ul className="flex gap-4 overflow-x-auto whitespace-nowrap -mx-4">
        <li>
          <Btn
            color={chartType === "day/USDGBP" ? "secondary" : "white"}
            label={t("Day")}
            w="w-[140px]"
            classname={`ml-4 ${chartType === "day/USDGBP" ? "" : "border"}`}
            func={() => setChartType("day/USDGBP")}
          />
        </li>
        <li>
          <Btn
            color={chartType === "week/USDGBP" ? "secondary" : "white"}
            label={t("Week")}
            w="w-[140px]"
            func={() => setChartType("week/USDGBP")}
            classname={chartType === "week/USDGBP" ? "" : "border"}
          />
        </li>
        <li>
          <Btn
            color={chartType === "month/USDGBP" ? "secondary" : "white"}
            label={t("Month")}
            w="w-[140px]"
            func={() => setChartType("month/USDGBP")}
            classname={chartType === "month/USDGBP" ? "" : "border"}
          />
        </li>
        <li>
          <Btn
            color={chartType === "year/USDGBP" ? "secondary" : "white"}
            label={t("Year")}
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
