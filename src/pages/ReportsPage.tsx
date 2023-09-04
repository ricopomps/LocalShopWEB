import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import DatePicker, { registerLocale } from "react-datepicker";
import br from "date-fns/locale/pt-BR";
import TextInputField from "../components/form/TextInputField";
import styles from "../styles/ReportsPage.module.css";
import * as ReportsApi from "../network/reportsApi";
import { ChartData } from "../network/reportsApi";
import Chart from "../components/Chart/Chart";

registerLocale("br", br);

export enum Charts {
  income = "Rendimentos",
  sales = "Produtos vendidos",
}

const ReportsPage = () => {
  const [selectedChart, setSelectedChart] = useState<Charts>(Charts.income);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [data, setData] = useState<ChartData | null>(null);

  const getChart = async () => {
    try {
      let chartData: ChartData;
      switch (selectedChart) {
        case Charts.income:
          chartData = await ReportsApi.getIncomeReport(startDate, endDate);
          break;

        case Charts.sales:
          chartData = await ReportsApi.getReportProductsSold(
            startDate,
            endDate
          );
          break;
      }
      setData(chartData);
    } catch (error: any) {
      console.log(error);
      setData(null);
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  useEffect(() => {
    getChart();
  }, [selectedChart, startDate, endDate]);

  const { register } = useForm();
  const ChartComponent = () => {
    if (!data) return <></>;
    switch (selectedChart) {
      case Charts.income: {
        return <Chart data={data} currency chartType="bar" />;
      }
      case Charts.sales: {
        return <Chart data={data} chartType="line" />;
      }
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
            setSelectedChart(e.target.value as Charts);
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
