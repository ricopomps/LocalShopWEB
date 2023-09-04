import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { ChartData } from "../../network/reportsApi";

interface ChartProps {
  data: ChartData;
  chartType: "bar" | "line";
  currency?: boolean;
  showLabelInTitle?: boolean;
  showLabelInValue?: boolean;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({
  data,
  chartType,
  currency,
  showLabelInTitle,
  showLabelInValue = chartType === "line",
}: ChartProps) => {
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItem: TooltipItem<typeof chartType>[]) => {
            return showLabelInTitle
              ? tooltipItem[0].dataset.label
              : tooltipItem[0].label;
          },
          label: (tooltipItem: TooltipItem<typeof chartType>) => {
            const datasetLabel = showLabelInValue
              ? `${data.datasets[tooltipItem.datasetIndex].label}: `
              : "";

            const labelValue = currency
              ? "R$" + parseFloat(tooltipItem.formattedValue).toFixed(2)
              : `${tooltipItem.formattedValue}`;

            return datasetLabel + labelValue;
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

  if (chartType === "bar") {
    return <Bar data={data} options={options} />;
  } else if (chartType === "line") {
    return <Line data={data} options={options} />;
  } else {
    return <div>Unsupported chart type</div>;
  }
};

export default Chart;
