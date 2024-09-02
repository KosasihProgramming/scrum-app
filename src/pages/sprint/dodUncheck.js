import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import TablePBIProduct from "../../component/PbiProductBacklog/tabelProduct";
import axios from "axios";
import withRouter from "../../component/features/withRouter";
import Filter from "../../component/features/filter";
import TableDodProduct from "../../component/DodProductBacklog/tabelProduct";
import TableDodSprint from "../../component/sprintBacklog/DodSprint/tabelDod";
import ModalAddAnggota from "../../component/sprintBacklog/anggotaSprint/modalAnggota";
import ModalAddPelaksana from "../../component/sprintBacklog/PelaksanaSprint/modalPelaksana";
import { AnimatePresence, motion } from "framer-motion";
import TableDodUncheck from "../../component/sprintBacklog/DodSprint/tabelDodUnCheck";
import { Link } from "react-router-dom";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { useParams } from "react-router-dom";
import ProgressBar from "../../component/features/progressBar";
import { VscRefresh } from "react-icons/vsc";

function DodUncheck({ params }) {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [dataDod, setDataDod] = useState([]);
  const tableRef = useRef(null); // Mengambil params dari URL
  const { id, idProduct } = useParams();

  console.log("params", { id, idProduct });

  const [dataUser, setDataUser] = useState([]);
  const [idSprint, setIdSprint] = useState(id);
  const [userSet, setUserSet] = useState(false);
  const [dataSprint, setdataSprint] = useState(null);
  const [totalCapaian, setTotalCapaian] = useState(0);

  useEffect(() => {
    fetchData();
    getSingleDataSprint(idSprint);
    // getDataAnggota();
  }, [activeTabIndex]);

  const [error, setError] = useState(null);

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
      console.log("objek param", filters);
      console.log(param, "params");
      const response = await axios({
        method: "GET",
        url:
          "http://202.157.189.177:8080/api/database/rows/table/578/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      const allData = response.data.results;

      // Memetakan AnggotaSprint untuk mendapatkan data user masing-masing
      const dodDetailsPromises = allData.map((dat) => getDataCapaian(dat));

      // Menunggu semua promise selesai dan mengumpulkan hasilnya
      const dodDetails = await Promise.all(dodDetailsPromises);
      const combinedData = allData.map((anggota, index) => ({
        ...anggota,
        capaian: dodDetails[index],
      }));
      console.log(combinedData, "hasil dod");

      const finalData = combinedData.filter((a) => a.capaian.length > 0);
      const totalCapaian = finalData.reduce((total, item) => {
        return total + parseInt(item.Persentase || 0); // Asumsikan ada properti `capaian`
      }, 0);

      setDataDod(finalData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDataCapaian = async (item) => {
    console.log(item);
    if (!item) {
      alert("gagal, Data Dod Tidak Ada");
      return [];
    }
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "DodSprint",
          value: `${item.id}`,
        },
      ];
      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://202.157.189.177:8080/api/database/rows/table/714/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "dod");
      const data = response.data.results;
      // Hitung total capaian
      const filterdata = data.filter((a) => a.isCheck == false);

      return filterdata;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const getSingleDataSprint = async (id) => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://202.157.189.177:8080/api/database/rows/table/575/${id}/?user_field_names=true`,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });

      console.log(response.data, "data Sprint");
      const data = response.data;
      setdataSprint(data);
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
  const persentase = parseInt(dataSprint == null ? 0 : dataSprint.CapaianPBI);

  return (
    <motion.div
      initial={{ y: 1000, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
    >
      <AnimatePresence>
        <div className="w-full h-full flex flex-col justify-start items-center pb-25">
          <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
            <h3 className="text-white text-base font-medium">
              DOD SPRINT BELUM DIPERIKSA
            </h3>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="mt-10 flex flex-col justify-between w-full bg-white rounded-xl shadow-md"
          >
            <div
              data-aos="fade-up"
              data-aos-delay="150"
              className=" flex justify-between w-full bg-white rounded-xl pb-6 px-6 mt-5"
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
            <div className="w-full overflow-x-hidden pb-6 px-6 ">
              <ProgressBar
                bgcolor="#2563EB"
                progress={persentase}
                height={30}
              />
            </div>
          </div>

          <div className="w-full flex justify-between items-center transition-transform duration-500 ease-in-out transform">
            <div className="w-full transform transition-transform duration-500 ease-in-out">
              <TableDodUncheck
                idSprint={idSprint}
                width={50}
                data={dataDod}
                getData={fetchData}
              />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

export default DodUncheck;
