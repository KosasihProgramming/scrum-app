import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import axios from "axios";
import withRouter from "../../component/features/withRouter";
import Filter from "../../component/features/filter";
import TablePBISprint from "../../component/sprintBacklog/PBISprint/tabelPbiSprint";
import { Link } from "react-router-dom";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import ProgressBar from "../../component/features/progressBar";
import TableTodo from "../../component/sprintBacklog/TodoList/tableTodo";
import { VscRefresh } from "react-icons/vsc";
import dayjs from "dayjs";
function PbiSprintBacklog({ params }) {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [dataTim, setDataTim] = useState([]);
  const tableRef = useRef(null);
  const [dataPbiPlan, setDataPbiPlan] = useState([]);
  const [dataPbiUnPlan, setDataPbiUnPlan] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataSprint, setdataSprint] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadData, setIsLoadData] = useState(true);
  const [dataAnggota, setDataAnggota] = useState([]);
  const { id, idProduct } = params;
  const [dataUser, setDataUser] = useState([]);
  const [optionSprint, setOptionSprint] = useState([]);
  const [dataTodo, setDataTodo] = useState([]);
  const [idSprint, setIdSprint] = useState(id);
  const [totalPbi, setTotalPbi] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().locale("id").format("DD/MM/YYYY")
  );
  const [idProductBacklog, setIdProduct] = useState(idProduct);
  const allTabs = [
    {
      id: "tab1",
      name: "Plan",
    },
    {
      id: "tab2",
      name: "Unplan",
    },
    {
      id: "tab3",
      name: "Todo List",
    },
  ];

  const handleTabChange = (index) => {
    setActiveTabIndex(`tab${index + 1}`);
  };

  useEffect(() => {
    fetchData();
    getTodo();
    getSprint();
    getDataPbiProduct();
    getSingleDataSprint(idSprint);
  }, [activeTabIndex]);

  const getSingleDataSprint = async (id) => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://103.181.182.230:6060/api/database/rows/table/634/${id}/?user_field_names=true`,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });

      const data = response.data;

      setdataSprint(data);
      getDataAnggota();
      getDataUser(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "Sprint",
          value: `${idSprint}`,
        },
      ];

      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/639/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      const allData = response.data.results;
      const dataPlan = allData.filter((a) => a.Unplan === false);
      const dataUnplan = allData.filter((a) => a.Unplan === true);
      const planSorted = dataPlan.sort((a, b) => b.Bobot - a.Bobot);
      const unplanSorted = dataUnplan.sort((a, b) => b.Bobot - a.Bobot);
      await getSingleDataSprint(idSprint);
      setTotalPbi(allData.length);
      setDataPbiPlan(planSorted);
      setDataPbiUnPlan(unplanSorted);
      setIsLoadData(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getTodo = async (date) => {
    let tanggal = "";
    if (date) {
      tanggal = date;
    } else {
      tanggal = selectedDate;
    }
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "Sprint",
          value: `${idSprint}`,
        },
        { type: "contains", field: "Tanggal", value: tanggal },
      ];

      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/649/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log("all data Todo", response.data.results);
      const allData = response.data.results;
      setDataTodo(allData);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getDataUser = async (datas) => {
    try {
      const tim = await getSingleDataTim(datas);
      const filters = [
        {
          type: "link_row_has",
          field: "Tim",
          value: `${tim.id}`,
        },
      ];
      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/633/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      const data = response.data.results;

      const dataOption = data.map((item) => {
        return {
          value: item.id,
          text: item.Nama,
        };
      });
      setDataUser(dataOption);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSingleDataTim = async (datas) => {
    try {
      const filters = [
        {
          type: "equal",
          field: "Name",
          value: `${datas.Teams[0].value}`,
        },
      ];
      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/632/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      const data = response.data.results;

      return data[0];
    } catch (error) {
      console.log(error.message);
    }
  };
  const getDataAnggota = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://103.181.182.230:6060/api/database/rows/table/634/${idSprint}/?user_field_names=true`,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });

      const allData = response.data;

      // Mengambil array AnggotaSprint
      const anggotaSprint = allData.AnggotaSprint;

      // Memetakan AnggotaSprint untuk mendapatkan data user masing-masing
      const anggotaDetailsPromises = anggotaSprint.map((anggota) =>
        getSingleDataUser(anggota.id)
      );

      // Menunggu semua promise selesai dan mengumpulkan hasilnya
      const anggotaDetails = await Promise.all(anggotaDetailsPromises);

      // Menambahkan informasi tambahan dari getSingleDataUser ke anggotaSprint
      const combinedData = anggotaSprint.map((anggota, index) => ({
        ...anggota,
        userDetails: anggotaDetails[index],
      }));

      setDataAnggota(combinedData);
      return combinedData;
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleDataUser = async (id) => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://103.181.182.230:6060/api/database/rows/table/633/${id}/?user_field_names=true`,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });

      const userData = response.data;

      return userData;
    } catch (error) {
      console.log(error);
    }
  };
  const getSprint = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://103.181.182.230:6060/api/database/rows/table/634/?user_field_names=true",
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      const allData = response.data.results;
      const dataOption = allData.map((item) => {
        return { value: item.id, text: item.Judul[0].value };
      });
      setOptionSprint(dataOption);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getDataPbiProduct = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "ProductBacklog",
          value: `${idProductBacklog}`,
        },
      ];
      const param = await Filter(filters);

      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/636/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      const data = response.data.results;

      const dataOption = data.map((item) => {
        return { value: item.id, text: item.Judul, bobot: item.Bobot };
      });

      setDataProduct(dataOption);
    } catch (error) {
      console.log(error.message);
    }
  };
  function formatTanggal(tanggal) {
    const bulanIndo = [
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

    const [tahun, bulan, hari] = tanggal.split("-");

    const namaBulan = bulanIndo[parseInt(bulan) - 1];

    return `${parseInt(hari)} ${namaBulan} ${tahun}`;
  }
  function checkDate(date) {
    const today = new Date(); // Mendapatkan tanggal hari ini
    const targetDate = new Date(date); // Tanggal target

    // Mengecek apakah tanggal hari ini lebih dari tanggal target
    if (today > targetDate) {
      alert("Tanggal hari ini lebih dari 10 Desember 2020");
    }
  }
  const persentase = Math.floor(
    parseInt(dataSprint == null ? 0 : dataSprint.CapaianPBI)
  );
  return (
    <div className="w-full h-full flex flex-col justify-start items-center pb-25">
      <div className="w-full  h-[3rem] rounded-md flex justify-start items-center bg-white px-6">
        <Link
          to={"/sprint-backlog"}
          className="p-2 flex justify-center items-center text-sm text-slate-500  font-medium"
        >
          Sprint Backlog
        </Link>
        <IoIosArrowForward className="text-2xl text-slate-500" />
        <button
          onClick={() => {
            setIsOpen(false);
          }}
          className={`p-2 flex justify-center items-center text-sm ${
            isOpen ? "text-slate-500 " : "text-blue-700 "
          } font-medium`}
        >
          PBI Sprint
        </button>
        <IoIosArrowForward
          className={`text-2xl ${
            isOpen ? "text-slate-500 " : "text-blue-700 "
          } `}
        />
        {isOpen == true && (
          <>
            <div className="p-2 flex justify-center items-center text-sm text-blue-700  font-medium">
              Dod Sprint
            </div>
            <IoIosArrowForward className="text-2xl text-blue-700" />
          </>
        )}
      </div>
      <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium">PBI SPRINT</h3>
      </div>
      {isOpen == false && (
        <>
          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="mt-10 flex flex-col justify-between w-full bg-white rounded-xl shadow-md"
          >
            <div
              data-aos="fade-up"
              data-aos-delay="150"
              className=" flex justify-between w-full bg-white rounded-xl py-6 px-6"
            >
              <div className="flex flex-col justify-start gap-2 items-start w-[80%]">
                <h3 className="text-xl font-medium text-blue-700">
                  {dataSprint == null ? "" : dataSprint.Judul[0].value}
                </h3>
                <h3 className="text-sm font-normal ">
                  {dataSprint == null ? "" : dataSprint.Goal[0].value}
                </h3>
                <h6 className="text-sm font-normal">
                  {dataSprint == null
                    ? "2020-12-10"
                    : formatTanggal(dataSprint.TanggalMulai)}{" "}
                  -{" "}
                  {dataSprint == null
                    ? "2020-12-10"
                    : formatTanggal(dataSprint.TanggalBerakhir)}
                </h6>
                <div className="w-full flex justify-start gap-4 items-center mt-4">
                  <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Total PBI : {totalPbi}
                  </div>

                  <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Capaian : {dataSprint == null ? "" : persentase + "%"}
                  </div>

                  <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Status:{" "}
                    {dataSprint == null ? "" : dataSprint.Status[0].value}
                  </div>
                  <button
                    onClick={() => {
                      getSingleDataSprint(idSprint);
                    }}
                    className="cssbuttons-io-button w-[13rem]"
                  >
                    Refresh Progress
                    <div className="icon">
                      <VscRefresh className="text-xl text-blue-600" />
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Link
                  to="/sprint-backlog"
                  className="cssbuttons-io-button w-[10rem]"
                >
                  Tutup
                  <div className="icon">
                    <RiDeleteBack2Fill className="text-xl text-blue-600" />
                  </div>
                </Link>
              </div>
            </div>
            <div className="w-full overflow-x-hidden pb-6 px-6">
              <ProgressBar
                bgcolor="#2563EB"
                progress={persentase}
                height={30}
              />
            </div>
          </div>

          <div className="w-full flex justify-start items-center mt-5 rounded-md">
            <TabBar data={allTabs} onTabChange={handleTabChange} />
          </div>
        </>
      )}
      <div className="w-full flex justify-between items-center transition-transform duration-500 ease-in-out transform">
        {activeTabIndex === "tab1" && (
          <div
            ref={tableRef}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TablePBISprint
              idSprint={idSprint}
              width={50}
              isLoadData={isLoadData}
              data={dataPbiPlan}
              setOpen={(value) => setIsOpen(value)}
              isOpen={isOpen}
              getData={fetchData}
              dataAnggota={dataAnggota}
              getDataAnggota={getDataAnggota}
              optionSprint={optionSprint}
              dataSprint={dataSprint}
              idProduct={idProduct}
              dataUser={dataUser}
              optionProduct={dataProduct}
            />
          </div>
        )}
        {activeTabIndex === "tab2" && (
          <div
            ref={tableRef}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TablePBISprint
              width={50}
              idSprint={idSprint}
              setOpen={(value) => setIsOpen(value)}
              dataAnggota={dataAnggota}
              dataSprint={dataSprint}
              getDataAnggota={getDataAnggota}
              isLoadData={isLoadData}
              isOpen={isOpen}
              data={dataPbiUnPlan}
              getData={fetchData}
              optionSprint={optionSprint}
              idProduct={idProduct}
              optionProduct={dataProduct}
              optionTim={dataTim}
              dataUser={dataUser}
            />
          </div>
        )}

        {activeTabIndex === "tab3" && (
          <div
            ref={tableRef}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TableTodo
              data={dataTodo}
              dataAnggota={dataAnggota}
              id={idSprint}
              getData={getTodo}
              // idSprint={idSprint}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(PbiSprintBacklog);
