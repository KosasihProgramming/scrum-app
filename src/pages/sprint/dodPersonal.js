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
import DodSprint from "./dodSprint";
import TableDodSprint from "../../component/sprintBacklog/DodSprint/tabelDod";
import TableDodPersonal from "../../component/sprintBacklog/DodSprint/tabelDodPersonal";

function DodPersonal({ params }) {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [dataTim, setDataTim] = useState([]);
  const tableRef = useRef(null);
  const [dataDod, setDataDod] = useState([]);
  const [userSet, setUserSet] = useState(false);
  const [dataSprint, setdataSprint] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dataAnggota, setDataAnggota] = useState([]);
  const [isLoadData, setIsLoadData] = useState(true);
  const { id, idUser, idProduct } = params;
  const [dataUser, setDataUser] = useState([]);
  const [dataPelaksana, setDataPelaksana] = useState([]);
  const [dataTodo, setDataTodo] = useState([]);
  const [idSprint, setIdSprint] = useState(id);
  const [totalPbi, setTotalPbi] = useState(0);
  const [totalCapaian, setTotalCapaian] = useState(0);
  console.log(params, "param page");

  const handleTabChange = (index) => {
    setActiveTabIndex(`tab${index + 1}`);
  };

  useEffect(() => {
    fetchData();
    getSingleDataUser(idUser);
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

      console.log(response.data, "data Sprint");
      const data = response.data;
      setdataSprint(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "UserId",
          value: `${idUser}`,
        },
        {
          type: "link_row_has",
          field: "Sprint",
          value: `${idSprint}`,
        },
      ];

      const param = await Filter(filters);
      console.log("objek param", filters);
      console.log(param, "params");
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/648/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      const allData = response.data.results;
      setDataPelaksana(allData[0]);
      const dataFilter = allData.filter((a) => a.DodSprint.length > 0);
      console.log(dataFilter, "all data");

      // Memetakan AnggotaSprint untuk mendapatkan data user masing-masing
      const dodDetailsPromises = dataFilter.map((dat) =>
        getSingleDataDod(dat.DodSprint[0].id)
      );

      // Menunggu semua promise selesai dan mengumpulkan hasilnya
      const dodDetails = await Promise.all(dodDetailsPromises);
      const combinedData = dataFilter.map((anggota, index) => ({
        ...anggota,
        dod: dodDetails[index],
      }));
      console.log(combinedData, "hasil dod");

      const finalData = combinedData.filter(
        (a) => a.DodSprint.length > 0 && a.dod.PBISprint.length > 0
      );
      const totalCapaian = finalData.reduce((total, item) => {
        return total + parseInt(item.Persentase || 0); // Asumsikan ada properti `capaian`
      }, 0);
      setTotalCapaian(totalCapaian / combinedData.length);
      setDataDod(finalData);
      setIsLoadData(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSingleDataDod = async (id) => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://103.181.182.230:6060/api/database/rows/table/640/${id}/?user_field_names=true`,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });

      const userData = response.data;
      console.log(userData);
      return userData;
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

      console.log(response.data, "data Anggota Sprint");
      const userData = response.data;

      setDataUser(response.data);
      setUserSet(true);
    } catch (error) {
      console.log(error);
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
  const persentase = Math.floor(parseInt(totalCapaian));
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
        <Link
          to={`/pbi-sprint/${id}/${idProduct}`}
          className={`p-2 flex justify-center items-center text-sm ${
            isOpen ? "text-slate-500 " : "text-blue-700 "
          } font-medium`}
        >
          PBI Sprint
        </Link>
        <IoIosArrowForward
          className={`text-2xl ${
            isOpen ? "text-slate-500 " : "text-blue-700 "
          } `}
        />
        {userSet == true && (
          <>
            <div className="p-2 flex justify-center items-center text-sm text-blue-700  font-medium">
              Dod Personal {dataUser.Nama}
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
            {userSet == true && (
              <>
                <div
                  data-aos="fade-up"
                  data-aos-delay="150"
                  className=" flex justify-between w-full bg-white rounded-xl px-6"
                >
                  <div className="w-full flex justify-start gap-4 items-center mb-2  p-2 border-b-2 border-b-blue-600 py-6 ">
                    <img
                      className="w-[6rem] h-[6rem] bg-cover object-cover shadow-md flex justify-center items-center rounded-xl"
                      src={`${
                        dataUser.Foto.length > 0
                          ? dataUser.Foto[0].url
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcsfuYy-W3XTybiWt3ggO_lkKgjWgt6ZqaSQ&s"
                      }`}
                    />
                    <div className="flex flex-col justify-start items-start gap-2">
                      <h4 className="text-xl font-medium capitaliza">
                        {dataUser.Nama}
                      </h4>
                      <p className="text-sm font-normal ">{dataUser.Email}</p>
                      <p className="text-sm font-normal ">
                        {" "}
                        {dataUser.Tim[0].value}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              data-aos="fade-up"
              data-aos-delay="150"
              className=" flex justify-between w-full bg-white rounded-xl pb-6 px-6"
            >
              <div className="flex flex-col justify-start gap-2 items-start w-[80%]">
                <h3 className="text-xl font-medium text-blue-700">
                  {dataSprint == null ? "" : dataSprint.Judul[0].value}
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
                    Capaian : {dataSprint == null ? "" : persentase + "%"}
                  </div>

                  <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Status:{" "}
                    {dataSprint == null ? "" : dataSprint.Status[0].value}
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Link
                  to={`/pbi-sprint/${id}/${idProduct}`}
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
        </>
      )}
      <div className="w-full flex justify-between items-center transition-transform duration-500 ease-in-out transform">
        <div
          ref={tableRef}
          className="w-full transform transition-transform duration-500 ease-in-out"
        >
          <TableDodPersonal
            idSprint={idSprint}
            width={50}
            data={dataDod}
            isLoadData={isLoadData}
            dataUser={dataUser}
            dataPelaksana={dataPelaksana}
            getData={fetchData}
            dataSprint={dataSprint}
          />
        </div>
      </div>
    </div>
  );
}

export default withRouter(DodPersonal);
