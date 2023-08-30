import React, { useState } from "react";
import BarChart from "../components/Chart/BarChart";
import LineChart from "../components/Chart/LineChart";
import TextInputField from "../components/form/TextInputField";
import { useForm } from "react-hook-form";

enum Charts {
  profits = "Lucros",
  sales = "Vendas",
}

interface ChartData {
  data: {
    label: string;
    value: string | number;
  }[];
}
const ReportsPage = () => {
  const [selectedChart, setSelectedChart] = useState<Charts>(Charts.profits);
  const baseData = {
    data: [
      {
        label: "Primeiro",
        value: 10,
      },
      {
        label: "Segundo",
        value: 20,
      },
      {
        label: "Terceiro",
        value: 30,
      },
    ],
  };
  const [chartData, setChartData] = useState<ChartData>();
  const [data, setData] = useState({
    labels: chartData?.data.map((d) => d.label),
    datasets: [
      {
        label: selectedChart,
        data: chartData?.data.map((d) => d.value),
        backgroundColor: [`#f8ce41`],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  const { register } = useForm();

  const ChartComponent = () => {
    switch (selectedChart) {
      case Charts.profits: {
        return <BarChart data={data} />;
      }
      case Charts.sales: {
        return <LineChart data={data} />;
      }
    }
  };
  return (
    <div>
      <TextInputField
        name="chart"
        type="text"
        as="select"
        options={Object.values(Charts).map((c) => {
          return { value: c, key: c };
        })}
        register={register}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setSelectedChart(e.target.value as Charts);
          setChartData(baseData);
          setData({
            labels: chartData?.data.map((d) => d.label),
            datasets: [
              {
                label: selectedChart,
                data: chartData?.data.map((d) => d.value),
                backgroundColor: [`#f8ce41`],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
          });
        }}
      />
      <ChartComponent />
    </div>
  );
};

export default ReportsPage;
