import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "../../styles/button.css";
import "../../styles/input.css";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import DropdownSearch from "../features/dropdown";
import { GoArrowUpRight } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";
import { GoArrowRight } from "react-icons/go";
import { LuArrowRight } from "react-icons/lu";
import animationData from "../../styles/blue.json";
import Lottie from "react-lottie";
import { AnimatePresence, motion } from "framer-motion";
import ModalAddSatuan from "./modalSatuan";
import ModalEditSatuan from "./modalEditSatuan";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableSatuan(props) {
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
  const [idData, setIdData] = useState(0);
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState(false);

  const [filteredData, setFilteredData] = useState(props.data);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  useEffect(() => {
    setFilteredData(props.data);
  }, [props.data]);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = props.data.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios({
          method: "DELETE",
          url:
            "http://202.157.189.177:8080/api/database/rows/table/706/" +
            id +
            "/",
          headers: {
            Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          },
        });

        props.getData();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data successfully deleted.",
        });
      }
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: `Error: ${error.response.data.error}`,
        });
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        // The request was made, but no response was received
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "No response received from the server.",
        });
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error setting up request: ${error.message}`,
        });
        console.error("Error setting up request:", error.message);
      }
    }
  };
  const handleAdd = async (name) => {
    try {
      const data = {
        Name: name,
      };

      console.log(data, "Data being sent");

      const response = await axios({
        method: "POST",
        url: "http://202.157.189.177:8080/api/database/rows/table/706/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          "Content-Type": "application/json",
        },
        data: data,
      });

      props.getData();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data successfully saved.",
      });
      console.log("Data successfully saved", response);
      setIsAddData(false);
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: `Error: ${error.response.data.error}`,
        });
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "No response received from the server.",
        });
        console.error("No response received:", error.request);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error setting up request: ${error.message}`,
        });
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const editData = (data) => {
    setIsEditData(true);
    setIsAddData(false);
    setDataUpdate(data);
    setIdData(data.id);
  };

  const handleEdit = async (nama) => {
    try {
      const data = {
        Name: nama,
      };

      console.log(data, "Data being Update");

      const response = await axios({
        method: "PATCH",
        url: `http://202.157.189.177:8080/api/database/rows/table/706/${idData}/?user_field_names=true`,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          "Content-Type": "application/json",
        },
        data: data,
      });

      props.getData();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data Berhasil Diupdate.",
      });
      console.log("Data successfully saved", response);
      setIsEditData(false);
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: `Error: ${error.response.data.error}`,
        });
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "No response received from the server.",
        });
        console.error("No response received:", error.request);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error setting up request: ${error.message}`,
        });
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <div
      //   data-aos="fade-down"
      //   data-aos-delay="450"
      className="  w-full rounded-xl  mb-16 mt-10"
    >
      <div className="w-full flex justify-between items-center rounded-xl bg-white py-2 px-5 shadow-md gap-6">
        <button
          className="button-insert w-[15rem]"
          onClick={() => {
            setIsAddData(!isAddData);
          }}
        >
          Tambah
        </button>
      </div>

      <ModalAddSatuan
        open={isAddData}
        setOpen={() => setIsAddData(false)}
        addData={handleAdd}
      />
      <ModalEditSatuan
        open={isEditData}
        setOpen={() => setIsEditData(false)}
        editData={handleEdit}
        data={dataUpdate}
      />
      <div
        data-aos="fade-up"
        data-aos-delay="550"
        className="w-full text-left text-sm font-normal mt-5"
      >
       
        <motion.div
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 1.7 }}
        >
          <AnimatePresence>
            <div className="w-full text-left text-sm font-normal mt-5">
              <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 gap-4 flex justify-between items-center">
                <div className="font-medium flex justify-center items-center w-[60%]">
                  Nama
                </div>

                <div className="font-medium flex justify-center items-center w-[40%]">
                  Aksi
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
                        className={`hover:cursor-pointer py-4 px-4 gap-4 w-full text-sm border-b border-blue-blue-300 flex justify-between items-center 
                  `}
                      >
                        <div className="font-normal flex justify-start items-center w-[60%] flex-wrap text-wrap">
                          {data.Name}
                        </div>

                        <div className="font-normal flex justify-end items-center w-[40%] gap-4">
                          <div class="group relative">
                            <button
                              onClick={() => {
                                editData(data);
                              }}
                              className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-teal-600 hover:scale-125 bg-teal-100 "
                            >
                              <HiOutlinePencilSquare class="text-lg  duration-200 text-teal-700" />
                            </button>
                            <span
                              class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-teal-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                            >
                              Update<span></span>
                            </span>
                          </div>

                          <div class="group relative">
                            <button
                              onClick={() => {
                                handleDelete(data.id);
                              }}
                              className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-red-600 hover:scale-125 bg-red-100 "
                            >
                              <MdDeleteOutline class="text-lg  duration-200 text-red-700" />
                            </button>
                            <span
                              class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-red-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                            >
                              Hapus<span></span>
                            </span>
                          </div>
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

export default TableSatuan;
