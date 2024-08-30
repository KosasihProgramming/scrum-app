import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "../../../styles/button.css";
import "../../../styles/input.css";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import DropdownSearch from "../../features/dropdown";
import { GoArrowUpRight } from "react-icons/go";
import { AnimatePresence, motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";

import axios from "axios";
import Swal from "sweetalert2";
import { GoArrowRight } from "react-icons/go";
import { LuArrowRight } from "react-icons/lu";

import Loader from "../../features/loader";
import { useLoading } from "../../features/context/loadContext";
import animationData from "../../../styles/blue.json";
import Lottie from "react-lottie";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableMonthly(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [tab, setTab] = useState("tab1");
  const [search, setSearch] = useState("");
  const [judul, setJudul] = useState("");
  const [target, setTarget] = useState("");
  const [bulan, setBulan] = useState({});
  const [status, setStatus] = useState({});
  const [dataUpdate, setDataUpdate] = useState({});
  const [tim, setTim] = useState({});
  const [tanggalMulai, setTanggalMulai] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );
  const [tanggalBerakhir, setTanggalBerakhir] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );
  const peran = sessionStorage.getItem("peran");
  const [idData, setIdData] = useState(0);
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(""); // State untuk filter tim
  const { setIsLoad } = useLoading();
  // Filter data berdasarkan NamaTim[0].id dan juga pencarian
  const filteredData = props.data.filter((data) => {
    const matchTeam =
      selectedTeam === "" || data.NamaCabang[0].id === selectedTeam;
    const matchSearch =
      data.Judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.NamaCabang[0].value.toLowerCase().includes(searchTerm.toLowerCase());

    return matchTeam && matchSearch;
  });
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleTeamChange = (item) => {
    setSelectedTeam(item.value); // Simpan id tim yang dipilih
    setCurrentPage(1); // Reset halaman ke halaman pertama setelah filter diterapkan
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update kolom pencarian
    setCurrentPage(1); // Reset halaman ke halaman pertama setelah pencarian diterapkan
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  function formatDate(dateString) {
    // Regex untuk memeriksa format DD/MM/YYYY
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);

    if (match) {
      // Mengambil bagian dari tanggal
      const day = match[1];
      const month = match[2];
      const year = match[3];

      // Mengembalikan format YYYY-MM-DD
      return `${year}-${month}-${day}`;
    }

    // Jika tidak cocok dengan format DD/MM/YYYY, kembalikan string aslinya
    return dateString;
  }
  function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  }

  return (
    <div
      //   data-aos="fade-down"
      //   data-aos-delay="450"
      className="  w-full rounded-xl  mb-16 mt-5 relative"
    >
      <motion.div
        initial={{ y: 1000, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 1.7, delay:0.2 }}
      >
        <AnimatePresence>
          <div className="w-full flex justify-between items-center rounded-xl bg-white py-2 px-5 shadow-md gap-6">
            <div className="flex justify-start items-center gap-10 w-[45rem]">
              <div className="w-auto flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999] w-[18rem]">
                  <DropdownSearch
                    options={props.optionCabang}
                    change={handleTeamChange}
                    name={"Cabang"}
                    isSearch={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatePresence>
      </motion.div>
      <div className="w-full text-left text-sm font-normal mt-5">
        <motion.div
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 1.7 }}
        >
          <AnimatePresence>
            <div className="w-full text-left text-sm font-normal mt-5">
              <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 gap-4 flex justify-between items-center">
                <div className="font-medium flex justify-center items-center w-[20%]">
                  Judul
                </div>
                <div className="font-medium flex justify-center items-center w-[20%]">
                  Cabang
                </div>
                <div className="font-medium flex justify-center items-center w-[15%]">
                  Base
                </div>
                <div className="font-medium flex justify-center items-center w-[15%]">
                  Target
                </div>
                <div className="font-medium flex justify-center items-center w-[15%]">
                  Total Omset
                </div>
                <div className="font-medium flex justify-center items-center w-[10%]">
                  Persentase
                </div>
              </div>
              {currentData.length == 0 && (
                <>
                  <div className="w-full flex justify-center items-center mt-5 rounded-xl bg-white">
                    <div className="w-[100%]  h-[20rem] pb-5 bg-transparent px-2 flex rounded-xl justify-center flex-col items-center">
                      <Lottie
                        options={defaultOptions}
                        height={250}
                        width={250}
                      />
                      <h3 className="text-base text-blue-500 font-medium text-center">
                        Belum Ada Data Cuyy..
                      </h3>
                    </div>
                  </div>
                </>
              )}
              {currentData.length > 0 && (
                <>
                  <div
                    className={`bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl p-2 mt-5 duration-500 
                  h-auto
                  `}
                  >
                    {currentData.map((data) => (
                      <div
                        key={data.id}
                        className={`${
                          data.PersentaseCapaian >= 90
                            ? "bg-teal-500 text-white rounded-md"
                            : "bg-white"
                        }hover:cursor-pointer py-4 px-4 gap-4 w-full text-sm border-b border-blue-blue-300 flex justify-between items-center 
                  `}
                      >
                        <div
                          className={`font-normal ${
                            data.PersentaseCapaian >= 90 ? " text-white" : ""
                          } flex justify-center items-center w-[20%] flex-wrap text-wrap`}
                        >
                          {data.Judul}
                        </div>
                        <div
                          className={`font-normal ${
                            data.PersentaseCapaian >= 90 ? " text-white" : ""
                          } flex justify-center items-center w-[20%] flex-wrap text-wrap`}
                        >
                          {data.NamaCabang[0].value}
                        </div>
                        <div
                          className={`font-normal ${
                            data.PersentaseCapaian >= 90 ? " text-white" : ""
                          } flex justify-center items-center w-[15%] flex-wrap text-wrap`}
                        >
                          {formatRupiah(data.Base)}
                        </div>
                        <div
                          className={`font-normal ${
                            data.PersentaseCapaian >= 90 ? " text-white" : ""
                          } flex justify-center items-center w-[15%] flex-wrap text-wrap`}
                        >
                          {formatRupiah(data.TargetOmset)}
                        </div>
                        <div
                          className={`font-normal ${
                            data.PersentaseCapaian >= 90 ? " text-white" : ""
                          } flex justify-center items-center w-[15%] flex-wrap text-wrap`}
                        >
                          {formatRupiah(data.TotalOmset)}
                        </div>
                        <div
                          className={`font-normal ${
                            data.PersentaseCapaian >= 90 ? " text-white" : ""
                          } flex justify-center items-center w-[10%] flex-wrap text-wrap`}
                        >
                          {data.PersentaseCapaian}%
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="mt-10 flex justify-start w-full bg-white rounded-xl py-2 px-4 shadow-md">
              {Array.from(
                { length: Math.ceil(filteredData.length / dataPerPage) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  className={`mx-1 rounded-xl border h-12 w-12 py-2 px-2 ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-none"
                      : "bg-transparent border-blue-600  border"
                  }`}
                  onClick={() => paginate(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default TableMonthly;
