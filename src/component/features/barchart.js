import * as React from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { AnimatePresence, motion } from "framer-motion";
import { IoCompassOutline } from "react-icons/io5";
const formatRupiah = (angka) => {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const chartSetting = {
  yAxis: [
    {
      label: "Total",
    },
  ],
  width: 830,
  height: 250,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)",
    },
  },
};

export default function BarChartComponent(props) {
  const data = props.data.map(({ nama, text, totalOmset, totalTarget }) => ({
    name: nama,
    text: text,
    totalOmset: parseInt(totalOmset),
    totalTarget: parseInt(totalTarget),
  }));
  console.log(data, "data");
  return (
    <div
      style={{ width: "100%" }}
      className="text-sm p-4 bg-white rounded-xl flex justify-center items-center shadow-sm mt-5 mb-20"
    >
      <BarChart
        dataset={props.data}
        xAxis={[{ scaleType: "band", dataKey: "name" }]}
        series={[
          {
            dataKey: "totalTarget",
            label: "Total Target",
            valueFormatter: (value) => `${formatRupiah(value)}`,
          },
          {
            dataKey: "totalOmset",
            label: "Total Pendapatan",
            valueFormatter: (value) => `${formatRupiah(value)}`,
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
