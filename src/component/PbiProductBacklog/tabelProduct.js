import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "../../styles/button.css";
import "../../styles/input.css";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import { LuArrowRight } from "react-icons/lu";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import DropdownSearch from "../features/dropdown";
import ModalProduct from "./modalProduct";
import FormAddProduct from "./formAddProduct";
import axios from "axios";
import Swal from "sweetalert2";
import ModalEditProduct from "./modalEditProduct";
import DodProduct from "../../pages/product/dodProduct";
import { AnimatePresence, motion } from "framer-motion";
import Aos from "aos";
import ProgressBar from "../features/progressBar";
import { useLoading } from "../features/context/loadContext";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TablePBIProduct(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [isOpen, setIsOpen] = useState(props.isOpen || false);
  const [tab, setTab] = useState("tab1");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState({});

  const [dataUpdate, setDataUpdate] = useState({});
  const { setIsLoad } = useLoading();

  const [idData, setIdData] = useState(0);
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State u
  useEffect(() => {
    Aos.init({ duration: 700 });
  }, [props.data]);

  // Filter data berdasarkan kata kunci pencarian
  const filteredData = props.data.filter((data) => {
    return data.Judul.toLowerCase().includes(searchTerm.toLowerCase());
  });
  console.log(props.idProduct, "id");

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update kolom pencarian
    setCurrentPage(1); // Reset halaman ke halaman pertama setelah pencarian diterapkan
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemClick = (data) => {
    console.log(data, "data");
    setIsOpen(true);
    props.setOpen(true);
    setSelectedData(data);
    setSelectedId(data.id);
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
            "http://202.157.189.177:8080/api/database/rows/table/632/" +
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

  const handleAdd = async (judul, target, alasan, perspektif, jenis) => {
    try {
      // Validate the data
      if (!judul || !alasan || !jenis.value || !perspektif.value || !target) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);

        const data = {
          Judul: judul,
          Alasan: alasan,
          Jenis: [jenis.value], // Ensure this is an array
          Bobot: target,
          ProductBacklog: [parseInt(props.idProduct)], // Ensure this is an array
          Perspektif: [perspektif.value], // Ensure this is an array
        };

        console.log(data, "Data being sent");

        const response = await axios({
          method: "POST",
          url: "http://202.157.189.177:8080/api/database/rows/table/632/?user_field_names=true",
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

  const handleEdit = async (judul, target, alasan, perspektif, jenis) => {
    try {
      // Validate the data
      if (!judul || !alasan || !jenis.value || !perspektif.value || !target) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);

        const data = {
          Judul: judul, // Ensure bulan.value is a string
          Alasan: alasan, // Ensure judul is a string
          Jenis: [jenis.value], // Ensure goal is a string
          Bobot: target, // Ensure status.value is a string
          // Ensure target is a number
          "Product Backlog": [props.idProduct],
          Perspektif: [perspektif.value], // Ensure tim.value is an ID or array of IDs
        };

        console.log(data, "Data being Update");

        const response = await axios({
          method: "PATCH",
          url: `http://202.157.189.177:8080/api/database/rows/table/632/${idData}/?user_field_names=true`,
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

  const truncateText = (text) => {
    if (!text) return ""; // Menghindari error jika text kosong atau null
    return text.length > 20 ? text.substring(0, 20) + "..." : text;
  };

  return (
    <div className="  w-full rounded-xl  mb-16 mt-10">
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
              <div className="w-auto flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999] w-[12rem]">
                  <DropdownSearch
                    options={props.optionTim}
                    change={(item) => {}}
                    name={"Tim"}
                    isSearch={false}
                  />
                </div>
              </div>
            </div>
            <button
              className="button-insert w-[15rem]"
              onClick={() => {
                setIsAddData(!isAddData);
              }}
            >
              Tambah
            </button>
          </div>
        </>
      )}
      <ModalProduct
        open={isAddData}
        setOpen={() => setIsAddData(false)}
        addData={handleAdd}
        optionTim={props.optionTim}
      />
      <ModalEditProduct
        open={isEditData}
        setOpen={() => setIsEditData(false)}
        editData={handleEdit}
        data={dataUpdate}
        optionTim={props.optionTim}
      />
      {props.isOpen == true && (
        <>
          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="mt-10 flex justify-between w-full flex-col bg-white rounded-xl py-6 px-6 shadow-md"
          >
            <div className=" flex justify-between w-full rounded-xl bg-white">
              <div className="flex flex-col justify-start gap-2 items-start w-[80%]">
                <h3 className="text-xl font-medium text-blue-700">
                  {selectedData.Judul}
                </h3>
                <h6 className="text-sm font-normal">{selectedData.Alasan}</h6>
                <div className="w-full flex justify-start gap-4 items-center mt-4">
                  <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Bobot : {selectedData.Bobot}
                  </div>
                  <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Capaian : {selectedData.Capaian} %
                  </div>
                  <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Perspektif : {selectedData.Perspektif[0].value}
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
            <div className="w-full overflow-x-hidden  mt-7">
              <ProgressBar
                bgcolor="#2563EB"
                progress={parseInt(selectedData.Capaian)}
                height={30}
              />
            </div>
          </div>
        </>
      )}
      {props.isOpen == false && (
        <>
          <motion.div
            initial={{ y: 1000, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1.7 }}
          >
            <AnimatePresence>
              <div className="w-full text-left text-sm font-normal mt-5">
                <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 gap-4 flex justify-between items-center">
                  <div className="font-medium flex justify-center items-center w-[15%]">
                    Judul
                  </div>
                  <div className="font-medium flex justify-center items-center w-[15%]">
                    Alasan
                  </div>
                  <div className="font-medium flex justify-center items-center w-[15%]">
                    Bobot
                  </div>
                  <div className="font-medium flex justify-center items-center w-[15%]">
                    Capaian
                  </div>
                  <div className="font-medium flex justify-center items-center w-[15%]">
                    Perspektif
                  </div>
                  <div className="font-medium flex justify-center items-center w-[40%]">
                    Aksi
                  </div>
                </div>

                <div
                  className={`bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl p-2 mt-5 duration-500 ${
                    isOpen ? "h-[6rem] duration-500 " : "h-auto"
                  }`}
                >
                  {currentData.map((data) => (
                    <div
                      key={data.id}
                      className={`hover:cursor-pointer py-4 px-4 gap-4 w-full text-sm border-b border-blue-blue-300 flex justify-between items-center ${
                        selectedId && selectedId !== data.id ? "hidden" : ""
                      }`}
                    >
                      <div className="font-normal flex justify-start items-center w-[15%] flex-wrap">
                        {truncateText(data.Judul)}
                      </div>
                      <div className="font-normal flex justify-start items-center w-[15%] flex-wrap text-wrap">
                        {truncateText(data.Alasan)}
                      </div>
                      <div className="font-normal flex justify-start items-center w-[15%] flex-wrap">
                        {data.Bobot}
                      </div>{" "}
                      <div className="font-normal flex justify-start items-center w-[15%] flex-wrap">
                        {data.Capaian} %
                      </div>
                      <div className="font-normal flex justify-start items-center w-[15%] flex-wrap">
                        {data.Perspektif[0].value}
                      </div>
                      <div className="font-normal flex justify-end items-center w-[40%] gap-4">
                        {selectedId === data.id ? (
                          <button
                            className="cssbuttons-io-button w-[10rem]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseClick();
                            }}
                          >
                            Tutup
                            <div className="icon">
                              <LuArrowRight className="text-xl text-blue-600" />
                            </div>
                          </button>
                        ) : (
                          <>
                            <button
                              className="button-table border border-teal-500 bg-teal-500 hover:border-teal-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                editData(data);
                              }}
                            >
                              <span>Update</span>
                            </button>
                            <button
                              className="button-table border border-red-500 bg-red-500 hover:border-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(data.id);
                              }}
                            >
                              <span>Hapus</span>
                            </button>
                            <button
                              onClick={() => handleItemClick(data)}
                              className="cssbuttons-io-button w-[10rem]"
                            >
                              Lihat Detail
                              <div className="icon">
                                <LuArrowRight className="text-xl text-blue-600" />
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
        </>
      )}
      {props.isOpen == true && (
        <>
          <DodProduct
            params={{ idProduct: props.idProduct, idPbi: selectedId }}
          />
        </>
      )}
    </div>
  );
}

export default TablePBIProduct;
