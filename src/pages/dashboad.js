import React, { useState, useRef, useEffect } from "react";

import axios from "axios";

import { GiReceiveMoney } from "react-icons/gi";
import { FaArrowTrendUp } from "react-icons/fa6";

import dayjs from "dayjs";

import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import Filter from "../component/features/filter";

function Dashboard() {
  const [tableLeft, setTableLeft] = useState(0);
  const [dataCabang, setDataCabang] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  const tableRef = useRef(null);
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [isLoader, setIsLoader] = useState(false);
  const [isCek, setIsCek] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [bulan, setBulan] = useState({});
  const [caban, setCaban] = useState(null);
  const [tahun, setTahun] = useState(dayjs().format("YYYY"));
  const [totalTarget, setTotalTarget] = useState(0);
  const [totalCapaian, setTotalCapaian] = useState(0);
  const [totalPersen, setTotalPersen] = useState(0);

  const optionBulan = [
    { value: "3390", text: "Januari" },
    { value: "3391", text: "februari" },
    { value: "3400", text: "Maret" },
    { value: "3401", text: "April" },
    { value: "3402", text: "Mei" },
    { value: "3389", text: "Juni" },
    { value: "3046", text: "Juli" },
    { value: "3045", text: "Agustus" },
    { value: "3406", text: "September" },
    { value: "3407", text: "Oktober" },
    { value: "3408", text: "November" },
    { value: "3409", text: "Desember" },
  ];
  useEffect(() => {
    const setTablePosition = () => {
      if (tableRef.current) {
        const tableWidth = tableRef.current.clientWidth;
        const tableOffsetLeft = tableRef.current.offsetLeft;
        setTableLeft(tableOffsetLeft);
      }
    };

    setTablePosition();

    getDataTim();
  }, [activeTabIndex]);

  const [dataRencana, setDataRencana] = useState([]);
  const [dataBerjalan, setDataBerjalan] = useState([]);
  const [dataBerlalu, setDataBerlalu] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!bulan) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Pilih Bulan Terlebih Dahulu.",
      });
    }
    try {
      const filters = [
        { type: "multiple_select_has", field: "Bulan", value: bulan.value },
      ];
      const param = await Filter(filters);
      console.log(param);
      const response = await axios({
        method: "GET",
        url:
          "http://202.157.189.177:8080/api/database/rows/table/663/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;
      const dataClean = removeSpacesFromKeys(allData);
      const filterTahun = dataClean.filter((a) => a.Tahun[0].value == tahun);

      console.log("data Calena", dataClean);
      const dataKlinik = filterTahun.filter(
        (a) => a.Judul.includes("Klinik") && !a.Judul.includes("Gigi")
      );

      const dataLab = filterTahun.filter((a) => a.Judul.includes("Lab"));

      const dataGigi = filterTahun.filter((a) => a.Judul.includes("Gigi"));

      const totalKlinik = dataKlinik.reduce((total, item) => {
        return total + parseInt(item.TotalOmset || 0); // Asumsikan ada properti `capaian`
      }, 0);
      const totalLab = dataLab.reduce((total, item) => {
        return total + parseInt(item.TotalOmset || 0); // Asumsikan ada properti `capaian`
      }, 0);
      const totalGigi = dataGigi.reduce((total, item) => {
        return total + parseInt(item.TotalOmset || 0); // Asumsikan ada properti `capaian`
      }, 0);

      const dataChart = filterTahun.map((item, i) => {
        return {
          name: i + 1,
          text: item.NamaCabang[0].value,
          totalOmset: parseInt(item.TotalOmset),
          totalTarget: parseInt(item.TargetOmset),
        };
      });
      const klinikSorted = dataKlinik.sort(
        (a, b) => a.PersentaseCapaian - b.PersentaseCapaian
      );
      const LabSorted = dataLab.sort(
        (a, b) => a.PersentaseCapaian - b.PersentaseCapaian
      );
      const gigiSorted = dataGigi.sort(
        (a, b) => a.PersentaseCapaian - b.PersentaseCapaian
      );
      setDataChart(dataChart);

      setDataRencana(LabSorted);
      setIsStart(true);
      setDataBerlalu(gigiSorted);
      setDataBerjalan(klinikSorted);
    } catch (error) {
      setError(error.message);
    }
  };

  const getDataTim = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://202.157.189.177:8080/api/database/rows/table/703/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "penjualan");
      const data = response.data.results;
      const dataFilter = data.filter((a) => a.TahunDate == "2024");
      const totalTarget = dataFilter.reduce((total, item) => {
        return total + parseInt(item.Target || 0); // Asumsikan ada properti `capaian`
      }, 0);

      const totalOmset = dataFilter.reduce((total, item) => {
        return total + parseInt(item.Capaian || 0); // Asumsikan ada properti `capaian`
      }, 0);

      const persen = (totalOmset / totalTarget) * 100;

      setTotalTarget(totalTarget);
      setTotalCapaian(totalOmset);
      setTotalPersen(persen);
    } catch (error) {
      setError(error.message);
    }
  };
  const removeSpacesFromKeys = (dataArray) => {
    return dataArray.map((obj) => {
      const newObj = {};

      // Loop through each key in the object
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Remove spaces from the key name
          const newKey = key.replace(/\s+/g, "");
          newObj[newKey] = obj[key];
        }
      }

      return newObj;
    });
  };
  function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  }
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const data = [12, 19, 3, 5, 2, 3, 9];
  return (
    <div className="w-full h-full flex flex-col justify-start items-center pb-25 relative">
      <div className="w-full flex justify-between items-center  p-2 rounded-md mt-5 gap-4">
        <div
          data-aos="fade-up"
          data-aos-delay="450"
          className="w-[30%] flex flex-col justify-start items-center gap-2 py-4 px-4 h-[8rem] bg-blue-500 rounded-xl shadow-md text-white"
        >
          <div className="w-full flex justify-between items-start ">
            <h3 className="text-base font-medium">Target Penjualan</h3>
            <div className=" w-[2.5rem] h-[2.5rem] bg-white rounded-xl flex justify-center items-center p-3">
              <GiReceiveMoney className="text-blue-600 text-[2.3rem]" />
            </div>
          </div>
          <div className="w-full flex flex-col justify-between items-start gap-1">
            <h3 className="text-xl font-medium">{formatRupiah(totalTarget)}</h3>
            <h3 className="text-xs font-medium">Total Target Penjualan</h3>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="550"
          className="w-[30%] flex flex-col justify-start items-center gap-2 py-4 px-4 h-[8rem] bg-blue-500 rounded-xl shadow-md text-white"
        >
          <div className="w-full flex justify-between items-start ">
            <h3 className="text-base font-medium">Total Penjualan</h3>
            <div className=" w-[2.5rem] h-[2.5rem] bg-white rounded-xl flex justify-center items-center p-3">
              <GiReceiveMoney className="text-blue-600 text-[2.3rem]" />
            </div>
          </div>
          <div className="w-full flex flex-col justify-between items-start gap-1">
            <h3 className="text-xl font-medium">
              {formatRupiah(totalCapaian)}
            </h3>

            <h3 className="text-xs font-medium">Total Capaian Penjualan </h3>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="650"
          className="w-[30%] flex flex-col justify-start items-center gap-2 py-4 px-4 h-[8rem] bg-blue-500 rounded-xl shadow-md text-white"
        >
          <div className="w-full flex justify-between items-start ">
            <h3 className="text-base font-medium">Presentase</h3>
            <div className=" w-[2.5rem] h-[2.5rem] bg-white rounded-xl flex justify-center items-center p-3">
              <FaArrowTrendUp className="text-blue-600 text-[2.3rem]" />
            </div>
          </div>
          <div className="w-full flex flex-col justify-between items-start gap-1">
            <h3 className="text-xl font-medium">{Math.round(totalPersen)} %</h3>
            <h3 className="text-xs font-medium">
              Total Presentase Capaian Penjualan
            </h3>
          </div>
        </div>
      </div>

      {isStart == true && (
        <>
          {isCek == true && (
            <>
              <div className=" gap-2 flex  w-full p-4 rounded-xl justify-start items-start  flex-wrap mt-5">
                {dataChart.map((data) => (
                  <motion.div
                    initial={{ y: 1000, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", duration: 1.7, delay: 0.5 }}
                  >
                    <AnimatePresence>
                      <div className="p-2 hover:scale-150 cursor-pointer duration-300 bg-white shadow-md flex justify-center items-center rounded-md text-xs border-blue-500 border">
                        {data.name}. {data.text}
                      </div>
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ y: 1000, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 1.7 }}
              >
                <AnimatePresence>
                  {/* <BarChartComponent data={dataChart} /> */}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
