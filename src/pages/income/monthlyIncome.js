import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import TableProduct from "../../component/productBacklog/tabelProduct";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import Loader from "../../component/features/loader";
import { DatePicker, Space } from "antd";
import { GiReceiveMoney } from "react-icons/gi";
import { FaArrowTrendUp } from "react-icons/fa6";
import TableMonthly from "../../component/income/monthlyIncome/tabelMonthly";
import dayjs from "dayjs";
import DropdownSearch from "../../component/features/dropdown";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import Filter from "../../component/features/filter";
import BarChartSell from "../../component/features/barchart";
import { FaChartColumn } from "react-icons/fa6";
import BarChart from "../../component/features/barchart";
import BarChartComponent from "../../component/features/barchart";
function MonthlyIncome() {
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
  const [totalKlinik, setTotalKlinik] = useState(0);
  const [totalLab, setTotalLab] = useState(0);
  const [totalGigi, setTotalGigi] = useState(0);

  const allTabs = [
    {
      id: "tab1",
      name: "Klinik",
    },
    {
      id: "tab2",
      name: "Lab",
    },
    {
      id: "tab3",
      name: "Gigi",
    },
  ];

  const handleTabChange = (index) => {
    setActiveTabIndex(`tab${index + 1}`);
  };

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
      setDataChart(dataChart);
      setTotalKlinik(totalKlinik);
      setTotalLab(totalLab);
      setTotalGigi(totalGigi);
      setDataRencana(dataLab);
      setIsStart(true);
      setDataBerlalu(dataGigi);
      setDataBerjalan(dataKlinik);
    } catch (error) {
      setError(error.message);
    }
  };

  const getDataTim = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://202.157.189.177:8080/api/database/rows/table/662/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results);
      const data = response.data.results;
      const dataClean = removeSpacesFromKeys(data);
      const dataOption = dataClean.map((item) => {
        return { value: item.id, text: item.NamaCabang };
      });
      setDataCabang(dataOption);
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
      <div className="w-full  h-[3rem] rounded-md flex justify-start items-center bg-white px-6">
        <Link
          to={"/product-backlog"}
          className="p-2 flex justify-center items-center text-sm text-blue-700  font-medium"
        >
          Penjualan Bulanan
        </Link>
        <IoIosArrowForward className="text-2xl text-blue-700" />
      </div>
      <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium"> Penjualan Bulanan</h3>
      </div>
      <div className="w-full flex justify-between items-center  p-2 rounded-md mt-5 gap-4">
        <div
          data-aos="fade-up"
          data-aos-delay="450"
          className="w-[30%] flex flex-col justify-start items-center gap-2 py-4 px-4 h-[8rem] bg-blue-500 rounded-xl shadow-md text-white"
        >
          <div className="w-full flex justify-between items-start ">
            <h3 className="text-base font-medium">Klinik</h3>
            <div className=" w-[2.5rem] h-[2.5rem] bg-white rounded-xl flex justify-center items-center p-3">
              <GiReceiveMoney className="text-blue-600 text-[2.3rem]" />
            </div>
          </div>
          <div className="w-full flex flex-col justify-between items-start gap-1">
            <h3 className="text-xl font-medium">{formatRupiah(totalKlinik)}</h3>
            <h3 className="text-xs font-medium">Total Penjualan Klinik</h3>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="550"
          className="w-[30%] flex flex-col justify-start items-center gap-2 py-4 px-4 h-[8rem] bg-blue-500 rounded-xl shadow-md text-white"
        >
          <div className="w-full flex justify-between items-start ">
            <h3 className="text-base font-medium">Laboratorium</h3>
            <div className=" w-[2.5rem] h-[2.5rem] bg-white rounded-xl flex justify-center items-center p-3">
              <GiReceiveMoney className="text-blue-600 text-[2.3rem]" />
            </div>
          </div>
          <div className="w-full flex flex-col justify-between items-start gap-1">
            <h3 className="text-xl font-medium">{formatRupiah(totalLab)}</h3>

            <h3 className="text-xs font-medium">Total Penjualan Lab</h3>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay="650"
          className="w-[30%] flex flex-col justify-start items-center gap-2 py-4 px-4 h-[8rem] bg-blue-500 rounded-xl shadow-md text-white"
        >
          <div className="w-full flex justify-between items-start ">
            <h3 className="text-base font-medium">Gigi</h3>
            <div className=" w-[2.5rem] h-[2.5rem] bg-white rounded-xl flex justify-center items-center p-3">
              <FaArrowTrendUp className="text-blue-600 text-[2.3rem]" />
            </div>
          </div>
          <div className="w-full flex flex-col justify-between items-start gap-1">
            <h3 className="text-xl font-medium">{formatRupiah(totalGigi)}</h3>
            <h3 className="text-xs font-medium">
              Total Penjualan Layanan Gigi
            </h3>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-start items-center mt-5 rounded-md">
        <div className=" w-full p-4 bg-white flex justify-start gap-6 items-center rounded-xl shadow-md">
          <div className="flex justify-start gap-4 items-center">
            <p className="text-sm font-normal">Pilih Bulan</p>
            <div className="w-auto flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
              <div className="flex items-center justify-center z-[999] w-[8rem]">
                <DropdownSearch
                  options={optionBulan}
                  change={(data) => {
                    setBulan(data);
                  }}
                  name={"Bulan"}
                  isSearch={true}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-4 items-center">
            <p className="text-sm font-normal">Pilih Tahun</p>
            <Space direction="vertical" size={12}>
              <DatePicker
                defaultValue={dayjs(tahun, "YYYY")}
                format={["YYYY"]}
                picker="year"
                onChange={(date) => {
                  setTahun(date.format("YYYY"));
                }}
                className="w-[10rem] flex p-2 font-normal border-blue-500 border rounded-lg justify-start items-center h-[2rem]"
              />
            </Space>
          </div>
          <button
            onClick={() => {
              fetchData();
            }}
            type="button"
            className="bg-blue-600 text-center w-[10rem] rounded-2xl h-10 relative text-black text-xs font-medium group"
          >
            <div className="bg-white rounded-xl h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[95%] z-10 duration-500">
              <IoSearch className="text-[18px] text-blue-700 hover:text-blue-700" />
            </div>
            <p className="translate-x-2 text-sm text-white">Cari Data</p>
          </button>
          <button
            onClick={() => {
              setIsCek(!isCek);
            }}
            type="button"
            className="bg-blue-600 text-center w-[10rem] rounded-2xl h-10 relative text-black text-xs font-medium group"
          >
            <div className="bg-white rounded-xl h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[95%] z-10 duration-500">
              <FaChartColumn className="text-[18px] text-blue-700 hover:text-blue-700" />
            </div>
            <p className="translate-x-2 text-sm text-white">
              {isCek ? "Tutup" : "Lihat"} Grafik
            </p>
          </button>
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
                      <div className="p-2 bg-white shadow-md flex justify-center items-center rounded-md text-xs border-blue-500 border">
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
                  <BarChartComponent data={dataChart} />
                </AnimatePresence>
              </motion.div>
            </>
          )}

          {isCek == false && (
            <>
              <div className="w-full flex justify-start items-center mt-5 rounded-md">
                <TabBar data={allTabs} onTabChange={handleTabChange} />
              </div>

              <div className="w-full flex justify-between items-center  transition-transform duration-500 ease-in-out transform">
                {activeTabIndex === "tab1" && (
                  <div
                    ref={tableRef}
                    style={{ left: tableLeft }}
                    className="w-full transform transition-transform duration-500 ease-in-out"
                  >
                    <TableMonthly
                      width={33}
                      setLoad1={() => {
                        setIsLoader(true);
                      }}
                      setCek={() => {
                        setIsCek(false);
                      }}
                      setLoad2={() => {
                        setIsLoader(false);
                      }}
                      data={dataBerjalan}
                      getData={fetchData}
                      optionCabang={dataCabang}
                    />
                  </div>
                )}
                {activeTabIndex === "tab2" && (
                  <div
                    ref={tableRef}
                    style={{ left: tableLeft }}
                    className="w-full transform transition-transform duration-500 ease-in-out"
                  >
                    <TableMonthly
                      width={33}
                      data={dataRencana}
                      getData={fetchData}
                      setLoad1={() => {
                        setIsLoader(true);
                      }}
                      setLoad2={() => {
                        setIsLoader(false);
                      }}
                      setCek={() => {
                        setIsCek(false);
                      }}
                      optionCabang={dataCabang}
                    />
                  </div>
                )}
                {activeTabIndex === "tab3" && (
                  <div
                    ref={tableRef}
                    style={{ left: tableLeft }}
                    className="w-full transform transition-transform duration-500 ease-in-out"
                  >
                    <TableMonthly
                      width={33}
                      data={dataBerlalu}
                      getData={fetchData}
                      setLoad1={() => {
                        setIsLoader(true);
                      }}
                      setLoad2={() => {
                        setIsLoader(false);
                      }}
                      setCek={() => {
                        setIsCek(false);
                      }}
                      optionCabang={dataCabang}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default MonthlyIncome;
