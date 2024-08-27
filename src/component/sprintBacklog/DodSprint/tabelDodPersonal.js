import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "../../../styles/button.css";
import "../../../styles/input.css";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { MdOutlinePlaylistAdd } from "react-icons/md";

import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";

import { HiOutlinePencilSquare } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";
import { FaArrowUpRightDots } from "react-icons/fa6";
import ModalAddDodSprint from "./modalProduct";
import ModalEditDodSprint from "./modalEditDodSprint";
import Filter from "../../features/filter";
import ModalAddCapaian from "../../CapaianDod/modalAddCapaian";
import AOS from "aos";
import "aos/dist/aos.css";
import ModalPeriksaGambar from "../../CapaianDod/modalPeriksaGambar";
import TableCapaian from "../../CapaianDod/tableCapaian";
import ModalEditCapaian from "../../CapaianDod/modalEditCapaian";
import { FaUserGroup } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

import { useLoading } from "../../features/context/loadContext";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableDodPersonal(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);

  const { setIsLoad } = useLoading();

  const [isCapaian, setIsCapaian] = useState(false);
  const [isCekGambar, setIsCekGambar] = useState(false);
  const [isCek, setIsCek] = useState(false);
  const [isCekDisplay, setIsdisplay] = useState(true);
  const [isAddCapaian, setIsAddCapaian] = useState(false);
  const [isEditCapaian, setIsEditCapaian] = useState(false);
  const [dataCapaian, setDataCapaian] = useState([]);
  const [dataCapaianUpdate, setDataCapaianUpdate] = useState([]);
  const [dataSelected, setDataSelected] = useState({});
  const [capaianSelected, setCapaianSelected] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // State u
  const [totalCapaian, setTotalCapaian] = useState(0);
  // Filter data berdasarkan kata kunci pencarian
  const filteredData = props.data.filter((data) => {
    return data.Judul[0].value.toLowerCase().includes(searchTerm.toLowerCase());
  });
  console.log(props.idProduct, "id");
  useEffect(() => {
    AOS.init({ duration: 700 });
  }, [props.data]);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getSingleDataDod = async () => {
    alert("data Dod");
    try {
      const response = await axios({
        method: "GET",
        url: `http://202.157.189.177:8080/api/database/rows/table/578/${dataSelected.id}/?user_field_names=true`,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });

      console.log(response.data, "data dod Sprint");

      setDataSelected(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDataCapaian = async (item) => {
    console.log(item);
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
      const filterdata = data.filter((a) => a.isCheck == true);
      const totalCapaian = filterdata.reduce((total, item) => {
        return total + parseInt(item.Capaian || 0); // Asumsikan ada properti `capaian`
      }, 0);
      setTotalCapaian(totalCapaian);
      console.log("total", totalCapaian);
      await props.getData();
      if (isCek) {
        setDataCapaian(data);
      } else {
        setDataCapaian(data);
        setDataCapaianUpdate(data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleCapaian = (data) => {
    console.log(data, "dod Sprint");
    setDataSelected(data);
    setIsCapaian(true);
    getDataCapaian(data);
    setIsdisplay(true);
  };

  const handleCekGambar = (data) => {
    console.log(data);
    setIsCekGambar(true);
    setIsCek(!isCek);
    setIsdisplay(!isCekDisplay);
    setCapaianSelected(data);
  };
  const handleUpdateCapaian = (data) => {
    console.log(data);
    setCapaianSelected(data);
    setIsEditCapaian(true);
  };
  console.log(dataSelected, "dod select");
  return (
    <div className="  w-full rounded-xl  mb-16 mt-5">
      <ModalAddCapaian
        open={isAddCapaian}
        setOpen={() => setIsAddCapaian(false)}
        totalCapaian={totalCapaian}
        data={dataSelected}
        getData={getDataCapaian}
        optionUser={props.dataUser}
        dataPelaksana={props.dataPelaksana}
        select={true}
      />
      <ModalEditCapaian
        open={isEditCapaian}
        setOpen={() => setIsEditCapaian(false)}
        totalCapaian={totalCapaian}
        data={capaianSelected}
        dataSprint={dataSelected}
        optionUser={props.dataUser}
        dataPelaksana={props.dataPelaksana}
        getData={getDataCapaian}
        select={true}
      />

      <ModalPeriksaGambar
        data={capaianSelected}
        open={isCekGambar}
        dataDodSprint={dataSelected}
        getData={getDataCapaian}
        fetchDod={() => {
          props.getData();
        }}
        getDataDod={getSingleDataDod}
        setOpen={() => setIsCekGambar(false)}
        setCek={() => setIsCek(true)}
        setIsDisplay={() => {
          setIsdisplay(false);
        }}
        isPersonal={true}
        dataAll={dataCapaian}
        setTotalCapaian={(value) => {
          setTotalCapaian(value);
        }}
        dataUpdate={(data) => {
          setDataCapaianUpdate(data);
        }}
        setDodSprint={(data) => {
          setDataSelected(data);
        }}
        setDataCapaian={(data) => {
          setDataCapaian(data);
        }}
      />
      <motion.div
        initial={{ y: 1000, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
      >
        <AnimatePresence>
          <div className="w-full text-left text-sm font-normal mt-5">
            <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 gap-4 flex justify-between items-center">
              <div className="font-medium flex justify-center items-center w-[40%]">
                Judul
              </div>
              <div className="font-medium flex justify-center items-center w-[10%]">
                Target
              </div>
              <div className="font-medium flex justify-center items-center w-[10%]">
                Capaian
              </div>
              <div className="font-medium flex justify-center items-center w-[30%]">
                Aksi
              </div>
            </div>

            <div className="  shadow-md flex flex-col justify-start items-center w-full rounded-xl  p-2 mt-5 bg-white">
              {isCapaian ? (
                <>
                  {/* <motion.div
                      initial={{ y: 1000, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
                    >
                      <AnimatePresence> */}
                  <div
                    className={`hover:cursor-pointer py-4 bg-white px-4 gap-4 w-full text-sm border-b border-blue-blue-300 flex justify-between items-center `}
                  >
                    <div className="font-normal flex justify-start items-center w-[40%] overflow-wrap break-words word-break break-all">
                      {dataSelected.Judul[0].value}
                    </div>
                    <div className="font-normal flex justify-start items-center w-[10%]">
                      {dataSelected.Target} {dataSelected.Satuan[0].value}
                    </div>
                    <div className="font-normal flex justify-start items-center w-[10%]">
                      {totalCapaian} {dataSelected.Satuan[0].value}
                    </div>
                    <div className="font-normal flex justify-end items-center w-[30%] gap-6">
                      <button
                        className="cssbuttons-io-button w-[10rem]"
                        onClick={(e) => {
                          setIsCapaian(false);
                          setDataSelected({});
                          setIsCek(false);
                          setIsdisplay(true);
                        }}
                      >
                        Tutup
                        <div className="icon">
                          <RiDeleteBack2Fill className="text-xl text-blue-600" />
                        </div>
                      </button>
                      <button
                        className="cssbuttons-io-button w-[15rem]"
                        onClick={(e) => {
                          setIsAddCapaian(true);
                          setIsCek(false);
                          setIsdisplay(true);
                          setDataCapaianUpdate(dataCapaian);
                        }}
                      >
                        Tambah Capaian
                        <div className="icon">
                          <MdOutlinePlaylistAdd className="text-xl text-teal-600" />
                        </div>
                      </button>
                    </div>
                  </div>
                  {/* </AnimatePresence>
                    </motion.div> */}
                </>
              ) : (
                <>
                  {currentData.map((data) => (
                    <div
                      // data-aos="fade-up"
                      key={data.id}
                      className={`hover:cursor-pointer py-4 bg-white px-4 gap-4 w-[100%] text-sm border-b border-blue-blue-300 flex justify-between items-center `}
                    >
                      <div className="font-normal flex justify-start items-center w-[40%] overflow-wrap break-words word-break break-all">
                        {data.Judul[0].value}
                      </div>
                      <div className="font-normal flex justify-start items-center w-[10%]">
                        {data.Target} {data.Satuan[0].value}
                      </div>
                      <div className="font-normal flex justify-start items-center w-[10%]">
                        {data.Capaian} {data.Satuan[0].value}
                      </div>
                      <div className="font-normal flex justify-center items-center w-[30%] gap-6">
                        <button
                          onClick={() => handleCapaian(data)}
                          class="w-[150px] border font-medium border-blue-600 bg-blue-100 h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-600 before:to-blue-400 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-blue-700  hover:text-[#fff]"
                        >
                          Tambah Capaian
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </AnimatePresence>
      </motion.div>
      {isCapaian == false && (
        <>
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
        </>
      )}
      {/* {isCek == true && isCapaian == true && (
        <>
          <TableCapaian
            dataCapaian={dataCapaianUpdate}
            dataSelected={dataSelected}
            handleCekGambar={handleCekGambar}
            getData={getDataCapaian}
            dataUpdate={(data) => {
              setDataCapaianUpdate(data);
            }}
            setDataCapaian={(data) => {
              setDataCapaian(data);
            }}
            setCek={() => setIsCek(true)}
            setTotalCapaian={(value) => {
              setTotalCapaian(value);
            }}
            setDisplay={() => setIsdisplay(false)}
            handleEdit={handleUpdateCapaian}
          />
        </>
      )} */}
      {isCapaian && (
        <>
          <TableCapaian
            dataCapaian={dataCapaian}
            dataSelected={dataSelected}
            handleCekGambar={handleCekGambar}
            getData={getDataCapaian}
            setCek={() => setIsCek(true)}
            setDisplay={() => setIsdisplay(false)}
            dataUpdate={(data) => {
              setDataCapaianUpdate(data);
            }}
            setTotalCapaian={(value) => {
              setTotalCapaian(value);
            }}
            setDataCapaian={(data) => {
              setDataCapaian(data);
            }}
            handleEdit={handleUpdateCapaian}
          />
        </>
      )}
    </div>
  );
}

export default TableDodPersonal;
