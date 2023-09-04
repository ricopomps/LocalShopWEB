import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { ChartData } from "../../network/reportsApi";

interface BarChartProps {
  data: ChartData;
  currency?: boolean;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, currency }: BarChartProps) => {
  console.log("currency", currency);
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"bar">) => {
            return currency
              ? "R$" + parseFloat(tooltipItem.formattedValue).toFixed(2)
              : tooltipItem.formattedValue;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category" as const,
        labels: data.labels,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
