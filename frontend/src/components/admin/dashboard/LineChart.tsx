"use client";
import React, { useEffect, useState } from "react";
import userService from "@/utils/apiCalls/admin/userService";
import { Chart } from "react-google-charts";
import { Loader2, AlertCircle, TrendingUp } from "lucide-react";

interface ChartData {
  date: Date;
  users: number;
}

export function LineChart() {
  const [data, setData] = useState([["Day", "Users"]]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trend, setTrend] = useState<{
    percentage: number;
    isPositive: boolean;
  } | null>(null);

  useEffect(() => {
    async function fetchChartData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await userService.getDashboardChartData();

        if (!response || !Array.isArray(response) || response.length < 2) {
          throw new Error("Invalid data format received");
        }

        // Format data and calculate trend
        const formattedData = response.map((row, index) => {
          if (index === 0) return row;
          return [new Date(row[0]), row[1]];
        });

        const recentValues = formattedData.slice(-3).map((row) => row[1]);
        const oldValue = recentValues[0];
        const newValue = recentValues[recentValues.length - 1];

        let trendPercentage = 0;
        if (oldValue !== 0) {
          trendPercentage = ((newValue - oldValue) / oldValue) * 100;
        }

        setTrend({
          percentage: Math.abs(trendPercentage),
          isPositive: newValue > oldValue,
        });

        setData(formattedData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setError(errorMessage);
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChartData();
  }, []);

  const options = {
    title: "User Activity Trends",
    curveType: "function",
    legend: { position: "none" },
    backgroundColor: { fill: "transparent", stroke: "#f3f4f6", strokeWidth: 1 },
    colors: ["#2563eb"],
    chartArea: {
      left: "10%",
      top: "15%",
      width: "85%",
      height: "70%",
    },
    titleTextStyle: {
      color: "#1f2937",
      fontSize: 18,
      bold: true,
    },
    hAxis: {
      title: "Date",
      titleTextStyle: { color: "#6b7280", fontSize: 12 },
      textStyle: { color: "#6b7280", fontSize: 11 },
      format: "MMM dd",
      gridlines: { color: "#f3f4f6", count: 7 },
    },
    vAxis: {
      title: "Active Users",
      titleTextStyle: { color: "#6b7280", fontSize: 12 },
      textStyle: { color: "#6b7280", fontSize: 11 },
      gridlines: { color: "#f3f4f6" },
      minorGridlines: { color: "#f8fafc" },
    },
    lineWidth: 2.5,
    pointSize: 4,
    pointShape: "circle",
    tooltip: {
      textStyle: { color: "#1f2937" },
      showColorCode: true,
      trigger: "both",
    },

    crosshair: {
      trigger: "both",
      color: "#94a3b8",
      opacity: 0.3,
    },
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-[400px] flex flex-col items-center justify-center text-gray-500 space-y-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="font-medium">Failed to load chart data</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (data.length <= 1) {
      return (
        <div className="h-[400px] flex flex-col items-center justify-center text-gray-500 space-y-2">
          <p className="font-medium">No data available</p>
          <p className="text-sm">Check back later for updates</p>
        </div>
      );
    }

    return (
      <>
        {trend && (
          <div className="flex items-center space-x-2 mb-4">
            <div
              className={`flex items-center space-x-1 text-sm ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${
                  trend.isPositive ? "" : "transform rotate-180"
                }`}
              />
              <span className="font-medium">
                {trend.percentage.toFixed(1)}%
              </span>
            </div>
            <span className="text-sm text-gray-500">vs previous period</span>
          </div>
        )}
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
          chartPackages={["corechart", "controls"]}
        />
      </>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      {renderContent()}
    </div>
  );
}
