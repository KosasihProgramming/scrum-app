import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import TableProduct from "../../component/productBacklog/tabelProduct";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import Loader from "../../component/features/loader";
import DropdownSearch from "../../component/features/dropdown";
import Filter from "../../component/features/filter";
import dayjs from "dayjs";
function ProductBacklog() {
  const [tableLeft, setTableLeft] = useState(0);
  const [dataTim, setDataTim] = useState([]);
  const tableRef = useRef(null);
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [isLoader, setIsLoader] = useState(false);
  const [tahun, setTahun] = useState(dayjs().locale("id").format("YYYY"));
  const [bulanAwal, setBulanAwal] = useState(null);
  const [bulanAkhir, setBulanAkhir] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [isLoadData, setIsLoadData] = useState(true);
  const allTabs = [
    {
      id: "tab1",
      name: "Berjalan",
    },
    {
      id: "tab2",
      name: "Rencana",
    },
    {
      id: "tab3",
      name: "Berlalu",
    },
  ];

  const handleTabChange = (index) => {
    setActiveTabIndex(`tab${index + 1}`);
  };

  useEffect(() => {
    const setTablePosition = () => {
      if (tableRef.current) {
        const tableWidth = tableRef.current.clientWidth;
        const tableOffsetLeft = tableRef.current.offsetLeft;
        setTableLeft(tableOffsetLeft);
      }
    };

    const inMonth = getBulan();

    const filterMonth = optionBulan.find((a) => a.text === inMonth.awal);
    const filterMonth2 = optionBulan.find((a) => a.text === inMonth.akhir);
    const combinedArray = [filterMonth, filterMonth2];

    if (filterMonth && filterMonth2) {
      setBulanAwal(filterMonth);
      setBulanAkhir(filterMonth2);
    } else {
      console.error("Bulan tidak ditemukan dalam optionBulan");
    }

    // Memastikan fetchData dipanggil setelah setBulanAwal dan setBulanAkhir telah disetel
    fetchData(combinedArray);
    setTablePosition();
    getDataTim();
  }, []);

  const [dataRencana, setDataRencana] = useState([]);
  const [dataBerjalan, setDataBerjalan] = useState([]);
  const [dataBerlalu, setDataBerlalu] = useState([]);
  const [error, setError] = useState(null);
  const optionBulan = [
    { text: "Januari", value: 2813 },
    { text: "Februari", value: 2814 },
    { text: "Maret", value: 2815 },
    { text: "April", value: 2816 },
    { text: "Mei", value: 2817 },
    { text: "Juni", value: 2818 },
    { text: "Juli", value: 2819 },
    { text: "Agustus", value: 2820 },
    { text: "September", value: 2821 },
    { text: "Oktober", value: 2822 },
    { text: "November", value: 2823 },
    { text: "Desember", value: 2824 },
  ];
  const getBulan = () => {
    const bulanIndonesia = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const now = new Date();
    const currentMonthIndex = now.getMonth(); // Mengambil indeks bulan ini
    const currentYear = now.getFullYear();

    const namaBulanIni = bulanIndonesia[currentMonthIndex];
    console.log(`Bulan ini: ${namaBulanIni} ${currentYear}`);

    let nextMonthIndex = currentMonthIndex + 1;
    let nextYear = currentYear;

    if (nextMonthIndex > 11) {
      nextMonthIndex = 0; // Jika bulan depan adalah Januari (indeks 0)
      nextYear += 1; // Tambahkan tahun
    }

    const namaBulanDepan = bulanIndonesia[nextMonthIndex];
    return { awal: namaBulanIni, akhir: namaBulanDepan };
  };
  const getValueMonth = (bulanAwal, bulanAkhir) => {
    const optionBulan = [
      { text: "Januari", value: 2813 },
      { text: "Februari", value: 2814 },
      { text: "Maret", value: 2815 },
      { text: "April", value: 2816 },
      { text: "Mei", value: 2817 },
      { text: "Juni", value: 2818 },
      { text: "Juli", value: 2819 },
      { text: "Agustus", value: 2820 },
      { text: "September", value: 2821 },
      { text: "Oktober", value: 2822 },
      { text: "November", value: 2823 },
      { text: "Desember", value: 2824 },
    ];

    let result = [];

    // Indeks dari bulan awal dan bulan akhir
    const startIndex = optionBulan.findIndex(
      (bulan) => bulan.text === bulanAwal
    );
    const endIndex = optionBulan.findIndex(
      (bulan) => bulan.text === bulanAkhir
    );

    // Validasi jika bulan tidak ditemukan
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Bulan awal atau bulan akhir tidak valid");
    }

    // Menangani kasus jika bulan akhir berada sebelum bulan awal (melintasi tahun)
    if (startIndex <= endIndex) {
      for (let i = startIndex; i <= endIndex; i++) {
        result.push(optionBulan[i]);
      }
    } else {
      // Mengambil bulan-bulan dari bulan awal hingga Desember
      for (let i = startIndex; i < optionBulan.length; i++) {
        result.push(optionBulan[i]);
      }
      // Mengambil bulan-bulan dari Januari hingga bulan akhir
      for (let i = 0; i <= endIndex; i++) {
        result.push(optionBulan[i]);
      }
    }

    return result;
  };
  const fetchData = async (month) => {
    const bulan = month.map((a) => a.text);
    let allData = []; // Array untuk menampung semua data hasil fetch
    console.log(bulan, "ini");
    try {
      for (const b of bulan) {
        const filters = [{ type: "contains", field: "Bulan", value: b }];

        const param = await Filter(filters);

        const response = await axios({
          method: "GET",
          url:
            "http://103.181.182.230:6060/api/database/rows/table/635/?" + param,
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
          },
        });

        const data = response.data.results;
        allData = [...allData, ...data]; // Menggabungkan data dari setiap bulan
      }

      console.log("All data after fetch:", allData);
      const tahunData = allData.filter((a) =>
        a.Judul[0].value.toLowerCase().includes(tahun)
      );

      const dataBerjalan = tahunData.filter(
        (a) => a.Status[0].value === "Berjalan"
      );
      const dataBerlalu = tahunData.filter(
        (a) => a.Status[0].value === "Berlalu"
      );
      const dataRencana = tahunData.filter(
        (a) => a.Status[0].value === "Rencana"
      );

      setDataRencana(dataRencana);
      setIsLoadData(false);
      setDataBerlalu(dataBerlalu);
      setDataBerjalan(dataBerjalan);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };
  const getDataTim = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://103.181.182.230:6060/api/database/rows/table/632/?user_field_names=true",
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log(response.data.results);
      const data = response.data.results;

      const dataOption = data.map((item) => {
        return { value: item.id, text: item.Name };
      });
      setDataTim(dataOption);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center pb-25 relative">
      <div className="w-full  h-[3rem] rounded-md flex justify-start items-center bg-white px-6">
        <Link
          to={"/product-backlog"}
          className="p-2 flex justify-center items-center text-sm text-blue-700  font-medium"
        >
          Product Backlog
        </Link>
        <IoIosArrowForward className="text-2xl text-blue-700" />
      </div>
      <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium">PRODUCT BACKLOG</h3>
      </div>
      <div className="w-full flex justify-start items-center mt-10 rounded-md">
        <TabBar data={allTabs} onTabChange={handleTabChange} />
      </div>

      <div
        className={`w-full flex justify-between items-center rounded-xl bg-white duration-300  shadow-md gap-4 ${
          isSearch ? "h-[5rem] py-2 px-5 mt-5 " : "h-0"
        }`}
      >
        <div
          className={`flex justify-start items-center gap-6 w-[58rem] ${
            isSearch == false ? "hidden" : "flex"
          }`}
        >
          <div className="w-auto flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
            <div className="flex items-center justify-center z-[999] w-[12rem]">
              <DropdownSearch
                options={optionBulan}
                change={(data) => {
                  setBulanAwal(data);
                }}
                value={bulanAwal}
                name={"Bulan Awal"}
                isSearch={false}
              />
            </div>
          </div>
          -
          <div className="w-auto flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
            <div className="flex items-center justify-center z-[999] w-[12rem]">
              <DropdownSearch
                options={optionBulan}
                change={(data) => {
                  setBulanAkhir(data);
                }}
                value={bulanAkhir}
                name={"Bulan Akhir"}
                isSearch={false}
              />
            </div>
          </div>
        </div>
        <div className={`${isSearch == false ? "hidden" : "flex"}`}>
          <button
            className={`button-insert w-[15rem] ${
              isSearch == false ? "hidden" : "flex"
            }`}
            onClick={() => {
              const month = getValueMonth(bulanAwal.text, bulanAkhir.text);
              console.log(month, "getmonth");
              setIsLoadData(true);
              fetchData(month);
            }}
          >
            Cari
          </button>
        </div>
      </div>

      <div className="w-full flex justify-between items-center  transition-transform duration-500 ease-in-out transform">
        {activeTabIndex === "tab1" && (
          <div
            ref={tableRef}
            style={{ left: tableLeft }}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TableProduct
              width={33}
              setLoad1={() => {
                setIsLoader(true);
              }}
              setLoad2={() => {
                setIsLoader(false);
              }}
              data={dataBerjalan}
              getData={fetchData}
              optionTim={dataTim}
              isLoadData={isLoadData}
              setIsSearch={() => {
                setIsSearch(!isSearch);
              }}
            />
          </div>
        )}
        {activeTabIndex === "tab2" && (
          <div
            ref={tableRef}
            style={{ left: tableLeft }}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TableProduct
              width={33}
              data={dataRencana}
              getData={fetchData}
              isLoadData={isLoadData}
              setIsSearch={() => {
                setIsSearch(!isSearch);
              }}
              setLoad1={() => {
                setIsLoader(true);
              }}
              setLoad2={() => {
                setIsLoader(false);
              }}
              optionTim={dataTim}
            />
          </div>
        )}
        {activeTabIndex === "tab3" && (
          <div
            ref={tableRef}
            style={{ left: tableLeft }}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TableProduct
              width={33}
              data={dataBerlalu}
              getData={fetchData}
              isLoadData={isLoadData}
              setIsSearch={() => {
                setIsSearch(!isSearch);
              }}
              setLoad1={() => {
                setIsLoader(true);
              }}
              setLoad2={() => {
                setIsLoader(false);
              }}
              optionTim={dataTim}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductBacklog;
