import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DatePicker, { registerLocale } from "react-datepicker";
import br from "date-fns/locale/pt-BR";
import BarChart from "../components/Chart/BarChart";
import LineChart from "../components/Chart/LineChart";
import TextInputField from "../components/form/TextInputField";
import styles from "../styles/ReportsPage.module.css";
import * as ReportsApi from "../network/reportsApi";

registerLocale("br", br);

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
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
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

  const setValueChart = (data: any) => {
    setData({
      labels: data.map((d: any) => d.month),
      datasets: [
        {
          label: selectedChart,
          data: data.map((d: any) => d.value),
          backgroundColor: [`#f8ce41`],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    });
  };

  const getChart = async () => {
    try {
      const response = await ReportsApi.getReport(startDate, endDate);
      setValueChart(response);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };
  return (
    <div>
      <div className={styles.formContainer}>
        <div>
          <DatePicker
            className={styles.datePicker}
            selected={startDate}
            onChange={(date: Date) => {
              setStartDate(date);
            }}
            locale="br"
            showMonthYearPicker
            dateFormat="yyyy - MMMM"
            maxDate={endDate}
          />
        </div>
        <TextInputField
          name="chart"
          type="text"
          as="select"
          options={Object.values(Charts).map((c) => {
            return { value: c, key: c };
          })}
          register={register}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            getChart();
            setSelectedChart(e.target.value as Charts);
            setChartData(baseData);
          }}
        />
        <div className={styles.endDatePickerContainer}>
          <DatePicker
            className={styles.datePicker}
            selected={endDate}
            onChange={(date: Date) => {
              setEndDate(date);
            }}
            locale="br"
            showMonthYearPicker
            dateFormat="yyyy - MMMM"
            minDate={startDate}
          />
        </div>
      </div>
      <ChartComponent />
    </div>
  );
};

export default ReportsPage;
