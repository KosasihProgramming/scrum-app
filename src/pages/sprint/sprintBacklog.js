import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import axios from "axios";
import TableSprint from "../../component/sprintBacklog/Sprint/tabelSprint";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Filter from "../../component/features/filter";
import DropdownSearch from "../../component/features/dropdown";
import dayjs from "dayjs";

function SprintBacklog() {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [tableLeft, setTableLeft] = useState(0);
  const tableRef = useRef(null);
  const [dataTim, setDataTim] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [isLoadData, setIsLoadData] = useState(true);
  const [dataProduct, setDataProduct] = useState([]);
  const tableRef2 = useRef(null);
  const [tahun, setTahun] = useState(dayjs().locale("id").format("YYYY"));
  const [bulanAwal, setBulanAwal] = useState(null);
  const [bulanAkhir, setBulanAkhir] = useState(null);
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
    setActiveTabIndex(allTabs[index].id);
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

    setTablePosition();

    // Memastikan fetchData dipanggil setelah setBulanAwal dan setBulanAkhir telah disetel
    fetchData(combinedArray);

    getDataTim();
    getDataProduct();
  }, []);

  const [dataRencana, setDataRencana] = useState([]);
  const [dataBerjalan, setDataBerjalan] = useState([]);
  const [dataBerlalu, setDataBerlalu] = useState([]);
  const [error, setError] = useState(null);
  const optionBulan = [
    { text: "Januari", value: 3307 },
    { text: "Februari", value: 3308 },
    { text: "Maret", value: 3309 },
    { text: "April", value: 3310 },
    { text: "Mei", value: 3311 },
    { text: "Juni", value: 3312 },
    { text: "Juli", value: 3313 },
    { text: "Agustus", value: 3314 },
    { text: "September", value: 3315 },
    { text: "Oktober", value: 3316 },
    { text: "November", value: 3317 },
    { text: "Desember", value: 3318 },
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
      { text: "Januari", value: 3307 },
      { text: "Februari", value: 3308 },
      { text: "Maret", value: 3309 },
      { text: "April", value: 3310 },
      { text: "Mei", value: 3311 },
      { text: "Juni", value: 3312 },
      { text: "Juli", value: 3313 },
      { text: "Agustus", value: 3314 },
      { text: "September", value: 3315 },
      { text: "Oktober", value: 3316 },
      { text: "November", value: 3317 },
      { text: "Desember", value: 3318 },
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

  const getSprint = async (id) => {
    try {
      const filters = [
        { type: "link_row_has", field: "ProductBacklog", value: `${id}` },
      ];

      const param = await Filter(filters);

      const response = await axios({
        method: "GET",
        url:
          "http://202.157.189.177:8080/api/database/rows/table/575/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;
      return allData;
    } catch (error) {
      setError(error.message);
    }
  };
  const fetchData = async (month) => {
    const bulan = month.map((a) => a.value);
    let allData = []; // Array untuk menampung semua data hasil fetch
    console.log(bulan);
    try {
      for (const b of bulan) {
        const filters = [
          { type: "multiple_select_has", field: "Bulan", value: b },
        ];

        const param = await Filter(filters);

        const response = await axios({
          method: "GET",
          url:
            "http://202.157.189.177:8080/api/database/rows/table/597/?" + param,
          headers: {
            Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          },
        });

        const data = response.data.results;
        allData = [...allData, ...data]; // Menggabungkan data dari setiap bulan
      }

      console.log("All data after fetch:", allData);
      const tahunData = allData.filter((a) =>
        a.Judul[0].value.toLowerCase().includes(tahun)
      );
      // Memetakan AnggotaSprint untuk mendapatkan data user masing-masing
      const sprint = tahunData.map((dat) => getSprint(dat.id));

      // Menunggu semua promise selesai dan mengumpulkan hasilnya
      const sprinData = await Promise.all(sprint);
      const combinedArray = sprinData.flat();

      console.log("Combined Sprint Data:", combinedArray);

      const dataBerjalan = combinedArray.filter(
        (a) => a.Status[0].value === "Berjalan"
      );
      const dataBerlalu = combinedArray.filter(
        (a) => a.Status[0].value === "Berlalu"
      );
      const dataRencana = combinedArray.filter(
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
        url: "http://202.157.189.177:8080/api/database/rows/table/273/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      const data = response.data.results;

      const dataOption = data.map((item) => {
        return { value: item.id, text: item.Name };
      });
      setDataTim(dataOption);
    } catch (error) {
      setError(error.message);
    }
  };
  const getDataProduct = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://202.157.189.177:8080/api/database/rows/table/597/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      const data = response.data.results;

      const dataOption = data.map((item) => {
        return {
          value: item.id,
          text: item.Judul[0].value,
          tim: item.Tim[0].id,
        };
      });

      setDataProduct(dataOption);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div>
      {" "}
      <div className="w-full h-full flex flex-col justify-start items-center pb-25">
        <div className="w-full  h-[3rem] rounded-md flex justify-start items-center bg-white px-6">
          <Link
            to={"/sprint-backlog"}
            className="p-2 flex justify-center items-center text-sm text-blue-700  font-medium"
          >
            Sprint Backlog
          </Link>
          <IoIosArrowForward className="text-2xl text-blue-700" />
        </div>
        <div className="w-full flex justify-start items-center mt-5  bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-xl">
          <h3 className="text-white text-base font-medium"> SPRINT BACKLOG</h3>
        </div>
        <div className="w-full flex justify-start items-center mt-10 rounded-md">
          <TabBar data={allTabs} width={50} onTabChange={handleTabChange} />
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
              cari
            </button>
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          {activeTabIndex === "tab1" && (
            <div
              ref={tableRef}
              style={{ left: tableLeft }}
              className="w-full transform transition-transform duration-500 ease-in-out"
            >
              <TableSprint
                data={dataBerjalan}
                bulanAwal={bulanAwal}
                isLoadData={isLoadData}
                bulanAkhir={bulanAkhir}
                getData={fetchData}
                setIsSearch={() => {
                  setIsSearch(!isSearch);
                }}
                optionTim={dataTim}
                setBulanAwal={(data) => {
                  setBulanAwal(data);
                  fetchData(data, bulanAkhir);
                }}
                setBulanAkhir={(data) => {
                  setBulanAkhir(data);
                  fetchData(bulanAwal, data);
                }}
                optionProduct={dataProduct}
              />
            </div>
          )}
          {activeTabIndex === "tab2" && (
            <div
              ref={tableRef}
              style={{ left: tableLeft }}
              className="w-full transform transition-transform duration-500 ease-in-out"
            >
              <TableSprint
                data={dataRencana}
                isLoadData={isLoadData}
                getData={fetchData}
                setIsSearch={() => {
                  setIsSearch(!isSearch);
                }}
                optionProduct={dataProduct}
                bulanAwal={bulanAwal}
                bulanAkhir={bulanAkhir}
                setBulanAwal={(data) => {
                  setBulanAwal(data);
                  fetchData(data, bulanAkhir);
                }}
                setBulanAkhir={(data) => {
                  setBulanAkhir(data);
                  fetchData(bulanAwal, data);
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
              <TableSprint
                data={dataBerlalu}
                getData={fetchData}
                isLoadData={isLoadData}
                optionProduct={dataProduct}
                bulanAwal={bulanAwal}
                setIsSearch={() => {
                  setIsSearch(!isSearch);
                }}
                setBulanAwal={(data) => {
                  setBulanAwal(data);
                  fetchData(data, bulanAkhir);
                }}
                setBulanAkhir={(data) => {
                  setBulanAkhir(data);
                  fetchData(bulanAwal, data);
                }}
                bulanAkhir={bulanAkhir}
                optionTim={dataTim}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SprintBacklog;
