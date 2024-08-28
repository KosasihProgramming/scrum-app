import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ProgressBar from "../../features/progressBar";
import "../../../styles/button.css";
import "../../../styles/input.css";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import { LuArrowRight } from "react-icons/lu";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import { MdDeleteOutline } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Link } from "react-router-dom";
import DropdownSearch from "../../features/dropdown";
import ModalProduct from "./modalPBISprint";
import FormAddProduct from "./formAddPBISprint";
import axios from "axios";
import Swal from "sweetalert2";
import ModalEditProduct from "./modalEditSprint";
import ModalAddPBISprint from "./modalPBISprint";
import ModalEditPBISprint from "./modalEditSprint";
import DodSprint from "../../../pages/sprint/dodSprint";
import ModalAddAnggota from "../anggotaSprint/modalAnggota";
import Aos from "aos";
import animationData from "../../../styles/blue.json";
import Lottie from "react-lottie";
import { useLoading } from "../../features/context/loadContext";
import ModalCopyPbiSprint from "../../CopyPbiSprint/modalCopy";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TablePBISprint(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [tab, setTab] = useState("tab1");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [dataUpdate, setDataUpdate] = useState({});
  const [isAddAnggota, setIsAddAnggota] = useState(false);
  const [idData, setIdData] = useState(0);
  const [isAddData, setIsAddData] = useState(false);
  const [isCopy, setIscopy] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
  const { setIsLoad } = useLoading();
  const [searchTerm, setSearchTerm] = useState(""); // State u
  useEffect(() => {
    Aos.init({ duration: 700 });
  }, [props.data]);

  // Filter data berdasarkan kata kunci pencarian
  const filteredData = props.data.filter((data) => {
    return (
      data.Judul[0].value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.Bobot.toString().includes(searchTerm) ||
      data.Capaian.toString().includes(searchTerm) ||
      data.PersentaseCapaian.toString().includes(searchTerm)
    );
  });

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update kolom pencarian
    setCurrentPage(1); // Reset halaman ke halaman pertama setelah pencarian diterapkan
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  const handleItemClick = (data) => {
    setIsOpen(true);
    props.setOpen(true);
    setSelectedData(data);
    setSelectedId(data.id);
  };
  const getSingleDataPBI = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://202.157.189.177:8080/api/database/rows/table/577/${selectedData.id}/?user_field_names=true`,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });

      console.log(response.data, "data PBI Sprint");

      setSelectedData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseClick = () => {
    setIsOpen(false);
    props.setOpen(false);

    setSelectedId(null);
    setSelectedData(null);
  };
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
        setIsLoad(true);
        const response = await axios({
          method: "DELETE",
          url:
            "http://202.157.189.177:8080/api/database/rows/table/577/" +
            id +
            "/",
          headers: {
            Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          },
        });
        setIsLoad(false);

        props.getData();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data successfully deleted.",
        });
      }
    } catch (error) {
      setIsLoad(false);

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

  const handleAdd = async (target, plan, product) => {
    try {
      // Validate the data
      if (!product || !target) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);

        const data = {
          Bobot: target,
          Unplan: plan,
          Sprint: [parseInt(props.idSprint)], // Ensure this is an array
          PBIProduct: [product.value], // Ensure this is an array
        };

        console.log(data, "Data being sent");

        const response = await axios({
          method: "POST",
          url: "http://202.157.189.177:8080/api/database/rows/table/577/?user_field_names=true",
          headers: {
            Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
            "Content-Type": "application/json",
          },
          data: data,
        });
        setIsLoad(false);

        props.getData();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data successfully saved.",
        });
        console.log("Data successfully saved", response);
        setIsAddData(false);
      }
    } catch (error) {
      setIsLoad(false);

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

  const editData = (data) => {
    setIsEditData(true);
    setIsAddData(false);
    setDataUpdate(data);
    setIdData(data.id);
  };
  const copyData = (data) => {
    setIsEditData(false);
    setIsAddData(false);
    setSelectedData(data);
    setIscopy(true);
  };

  const handleEdit = async (target, plan, product) => {
    try {
      // Validate the data
      if (!product || !target) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);

        const data = {
          Bobot: target,
          Unplan: plan,
          Sprint: [parseInt(props.idSprint)], // Ensure this is an array
          PBIProduct: [product.value], // Ensure this is an array
        };

        console.log(data, "Data being Update");

        const response = await axios({
          method: "PATCH",
          url: `http://202.157.189.177:8080/api/database/rows/table/577/${idData}/?user_field_names=true`,
          headers: {
            Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
            "Content-Type": "application/json",
          },
          data: data,
        });
        setIsLoad(false);

        props.getData();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data Berhasil Diupdate.",
        });
        console.log("Data successfully saved", response);
        setIsEditData(false);
      }
    } catch (error) {
      setIsLoad(false);

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
  const openAnggota = () => {
    setIsAddAnggota(true);
  };
  return (
    <motion.div
      initial={{ y: 1000, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
    >
      <AnimatePresence>
        <div className="  w-full rounded-xl  mb-16 mt-5">
          {props.isOpen == false && (
            <>
              <div className="w-full flex justify-between items-center rounded-xl bg-white py-2 px-5 shadow-md gap-6">
                <div className="flex justify-start items-center gap-10 w-[25rem]">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Cari..."
                      name="text"
                      className="input border p-2 rounded-lg w-full"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-6 items-center">
                  <button
                    className="button-insert w-[15rem]"
                    onClick={() => {
                      openAnggota();
                    }}
                  >
                    Anggota Sprint
                  </button>
                  <button
                    className="button-insert w-[15rem]"
                    onClick={() => {
                      setIsAddData(!isAddData);
                    }}
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </>
          )}
          <ModalAddAnggota
            open={isAddAnggota}
            setOpen={() => {
              setIsAddAnggota(false);
            }}
            idSprint={props.idSprint}
            idProduct={props.idProduct}
            dataSprint={props.dataSprint}
            data={props.dataAnggota}
            dataUser={props.dataUser}
            getData={props.getDataAnggota}
          />

          <ModalAddPBISprint
            open={isAddData}
            setOpen={() => setIsAddData(false)}
            addData={handleAdd}
            optionProduct={props.optionProduct}
          />

          <ModalEditPBISprint
            open={isEditData}
            setOpen={() => setIsEditData(false)}
            editData={handleEdit}
            data={dataUpdate}
            optionProduct={props.optionProduct}
          />
          <ModalCopyPbiSprint
            open={isCopy}
            setOpen={() => {
              setIscopy(false);
            }}
            dataSprint={props.optionSprint}
            data={selectedData}
            idSprint={props.idSprint}
          />
          {props.isOpen == true && (
            <>
              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="mt-10 flex justify-between w-full flex-col bg-white rounded-xl py-6 px-6 shadow-md"
              >
                <div className=" flex justify-between w-full bg-white rounded-xl  ">
                  <div className="flex flex-col justify-start gap-2 items-start w-[80%]">
                    <h3 className="text-xl font-medium text-blue-700">
                      {selectedData.Judul[0].value}
                    </h3>
                    <h3 className="text-sm font-normal ">
                      {selectedData.Alasan[0].value}
                    </h3>
                    <div className="w-full flex justify-start gap-4 items-center mt-4">
                      <div className="bg-teal-50 rounded-md border border-teal-700 text-teal-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                        Bobot :{selectedData.Bobot}
                      </div>
                      <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                        Capaian : {selectedData.Capaian}
                      </div>
                      <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                        Persentase: {selectedData.PersentaseCapaian} %
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    <button
                      className="cssbuttons-io-button w-[10rem]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseClick();
                      }}
                    >
                      Tutup
                      <div className="icon">
                        <RiDeleteBack2Fill className="text-xl text-blue-600" />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="w-full  overflow-x-hidden mt-7">
                  <ProgressBar
                    bgcolor="#2563EB"
                    progress={parseInt(selectedData.PersentaseCapaian)}
                    height={30}
                  />
                </div>
              </div>
            </>
          )}
          {props.isOpen == false && (
            <>
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
                  <div className="w-full text-left text-sm font-normal mt-5">
                    <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 gap-4 flex justify-between items-center">
                      <div className="font-medium flex justify-center items-center w-[30%]">
                        Judul
                      </div>
                      <div className="font-medium flex justify-center items-center w-[8%]">
                        Bobot
                      </div>
                      <div className="font-medium flex justify-center items-center w-[8%]">
                        Capaian
                      </div>
                      <div className="font-medium flex justify-center items-center w-[15%]">
                        Persentase
                      </div>
                      <div className="font-medium flex justify-center items-center w-[40%]">
                        Aksi
                      </div>
                    </div>
                    <motion.div
                      initial={{ y: 1000, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
                    >
                      <AnimatePresence>
                        <div className=" bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl  p-2 mt-5">
                          {currentData.map((data) => (
                            <div
                              key={data.id}
                              className="hover:cursor-pointer py-4 px-4  gap-4 w-full text-sm  border-b border-blue-blue-300 flex justify-between items-center"
                            >
                              <div className="font-normal flex justify-start items-center w-[30%]  overflow-wrap break-words word-break break-all">
                                {data.Judul[0].value}
                              </div>
                              <div className="font-normal flex justify-start items-center w-[8%]">
                                {data.Bobot}
                              </div>
                              <div className="font-normal flex justify-start items-center w-[8%]">
                                {data.Capaian}
                              </div>
                              <div className="font-normal flex justify-start items-center w-[15%]">
                                {data.PersentaseCapaian}%
                              </div>
                              <div className="font-normal flex justify-end items-center w-[40%] gap-4">
                                <div class="group relative">
                                  <button
                                    onClick={(e) => {
                                      copyData(data);
                                    }}
                                    className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-blue-600 hover:scale-125 bg-blue-100 "
                                  >
                                    <MdContentCopy class="text-lg  duration-200 text-blue-700" />
                                  </button>
                                  <span
                                    class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-blue-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                                  >
                                    Copy<span></span>
                                  </span>
                                </div>
                                <div class="group relative">
                                  <button
                                    onClick={() => editData(data)}
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
                                    onClick={() => handleDelete(data.id)}
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

                                <button
                                  onClick={() => handleItemClick(data)}
                                  className="cssbuttons-io-button w-[13rem]"
                                >
                                  Lihat Dod Sprint
                                  <div class="icon">
                                    <LuArrowRight className="text-xl text-blue-600" />
                                  </div>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AnimatePresence>
                    </motion.div>
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
                </>
              )}
            </>
          )}
          {props.isOpen === true && (
            <>
              <DodSprint
                params={{
                  id: props.idSprint,
                  idPbi: selectedId,
                  idPbiProduct: selectedData.PBIProduct[0].id,
                  dataPbi: selectedData,
                  getDataPBI: () => {
                    getSingleDataPBI();
                  },
                }}
              />
            </>
          )}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

export default TablePBISprint;
