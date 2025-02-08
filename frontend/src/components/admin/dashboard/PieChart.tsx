"use client";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Loader2, AlertCircle, PieChart as PieIcon } from "lucide-react";
import userService from "@/utils/apiCalls/admin/userService";

interface ChartData {
  type: string;
  count: number;
}

export function PieChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await userService.getDashboardChartDataAccountType();

        if (!response || !Array.isArray(response)) {
          throw new Error("Invalid data format received");
        }

        setData(response);

        // Calculate total accounts (excluding header row)
        const total = response.slice(1).reduce((sum, row) => sum + row[1], 0);
        setTotalAccounts(total);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setError(errorMessage);
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const options = {
    title: "", // We'll handle the title separately
    backgroundColor: { fill: "transparent", stroke: "#f3f4f6", strokeWidth: 1 },

    colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"],
    legend: {
      position: "right",
      alignment: "center",
      textStyle: {
        color: "#4b5563",
        fontSize: 12,
        fontFamily: "Inter, system-ui, sans-serif",
      },
    },
    pieSliceTextStyle: {
      color: "white",
      fontSize: 14,
      fontFamily: "Inter, system-ui, sans-serif",
    },
    pieSliceBorderColor: "white",
    sliceVisibilityThreshold: 0.03,
    animation: {
      startup: true,
      duration: 1000,
      easing: "out",
    },
    tooltip: {
      showColorCode: true,
      text: "percentage",
      textStyle: {
        color: "#1f2937",
        fontSize: 12,
        fontFamily: "Inter, system-ui, sans-serif",
      },
    },
    chartArea: {
      left: "5%",
      top: "5%",
      width: "70%",
      height: "90%",
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

    if (!data || data.length <= 1) {
      return (
        <div className="h-[400px] flex flex-col items-center justify-center text-gray-500 space-y-2">
          <PieIcon className="h-8 w-8" />
          <p className="font-medium">No data available</p>
          <p className="text-sm">Check back later for updates</p>
        </div>
      );
    }

    return (
      <>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Account Distribution
          </h3>
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Intl.NumberFormat().format(totalAccounts)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              total accounts
            </span>
          </div>
        </div>
        <Chart
          chartType="PieChart"
          data={data}
          options={options}
          width="100%"
          height="400px"
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
