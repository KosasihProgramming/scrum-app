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
import animationData from "../../../styles/blue.json";
import Lottie from "react-lottie";
import ModalAddAnggota from "../anggotaSprint/modalAnggota";
import { useLoading } from "../../features/context/loadContext";
import LoaderData from "../../features/loaderData";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableDodSprint(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [tab, setTab] = useState("tab1");
  const [search, setSearch] = useState("");

  const [dataUpdate, setDataUpdate] = useState({});
  const [isLoadData, setIsLoadData] = useState(true);

  const { setIsLoad } = useLoading();
  const peran = sessionStorage.getItem("peran");
  const [tanggal, setTanggal] = useState(
    dayjs().locale("id").format("YYYY-MM-DD")
  );
  const [idData, setIdData] = useState(0);
  const [isAddData, setIsAddData] = useState(false);
  const [isAddAnggota, setIsAddAnggota] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
  const [isCapaian, setIsCapaian] = useState(false);
  const [isCekGambar, setIsCekGambar] = useState(false);
  const [isCek, setIsCek] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
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
  const getSingleDataDod = async () => {
    alert("data Dod");
    try {
      const response = await axios({
        method: "GET",
        url: `http://103.181.182.230:6060/api/database/rows/table/640/${dataSelected.id}/?user_field_names=true`,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
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
          "http://103.181.182.230:6060/api/database/rows/table/647/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log(response.data.results, "dod");
      const data = response.data.results;
      // Hitung total capaian
      const filterdata = data.filter((a) => a.isCheck == true);
      const totalCapaian = filterdata.reduce((total, item) => {
        return total + parseInt(item.Capaian || 0); // Asumsikan ada properti `capaian`
      }, 0);
      setIsLoadData(false);

      setTotalCapaian(totalCapaian);
      console.log("total", totalCapaian);
      await props.getDataPBI();
      await props.getData();
      if (isCek) {
        setDataCapaian(data);
      } else {
        setDataCapaian(data);
        setDataCapaianUpdate(data);
      }
      return data;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleDelete = async (data) => {
    if (peran !== "Scrum Master") {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: `Anda Tidak Memiliki Akses Untuk Fitur Ini`,
      });
      return [];
    }

    // Cek jika props.dataSprint.TanggalBerakhir ada nilainya
    if (
      !props.dataSprint?.TanggalBerakhir ||
      checkDate(props.dataSprint.TanggalBerakhir)
    ) {
      return [];
    }

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
        setIsDelete(true);

        const capaian = await getDataCapaian(data);
        const pelaksana = await props.getDataPelaksana();
        console.log(capaian, "Capaian");
        console.log(pelaksana, "Pelaksana");
        if (capaian.length > 0) {
          for (const element of capaian) {
            const response = await axios({
              method: "DELETE",
              url:
                "http://103.181.182.230:6060/api/database/rows/table/647/" +
                element.id +
                "/",
              headers: {
                Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
              },
            });
            console.log(response, "capaian res");
          }
          alert(capaian.length + " capaian");
        }

        if (pelaksana.length > 0) {
          for (const element of pelaksana) {
            const response = await axios({
              method: "DELETE",
              url:
                "http://103.181.182.230:6060/api/database/rows/table/648/" +
                element.id +
                "/",
              headers: {
                Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
              },
            });
            console.log(response, "pelaksana res");
          }
          alert(pelaksana.length + " Pelaksana");
        }

        await axios({
          method: "DELETE",
          url:
            "http://103.181.182.230:6060/api/database/rows/table/640/" +
            data.id +
            "/",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
          },
        });

        setIsLoad(false);
        setIsDelete(false);
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

  const handleAdd = async (target, dod) => {
    try {
      // Validate the data
      if (!dod.value || !target) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);

        const data = {
          Target: target,
          DodProduct: [parseInt(dod.value)], // Ensure this is an array
          PBISprint: [parseInt(props.idPbi)], // Ensure this is an array
          Sprint: [parseInt(props.idSprint)], // Ensure this is an array
        };

        console.log(data, "Data being sent");

        const response = await axios({
          method: "POST",
          url: "http://103.181.182.230:6060/api/database/rows/table/640/?user_field_names=true",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
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
    if (checkDate(props.dataSprint.TanggalBerakhir) == true) {
      return [];
    }
    setIsEditData(true);
    setIsAddData(false);
    setDataUpdate(data);
    setIdData(data.id);
  };

  const handleEdit = async (target, dod) => {
    if (peran !== "Scrum Master") {
      if (parseInt(target) < parseInt(dataUpdate.Target)) {
        Swal.fire({
          icon: "warning",
          title: "Perhatian",
          text: `Target Tidak Boleh Kurang Dari Target Sebelumnya`,
        });
        return [];
      }
    }
    try {
      // Validate the data
      if (!dod.value || !target) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);

        const data = {
          Target: target,
          DodProduct: [parseInt(dod.value)], // Ensure this is an array
          PBISprint: [parseInt(props.idPbi)], // Ensure this is an array
          Sprint: [parseInt(props.idSprint)], // Ensure this is an array
        };

        console.log(data, "Data being Update");

        const response = await axios({
          method: "PATCH",
          url: `http://103.181.182.230:6060/api/database/rows/table/640/${idData}/?user_field_names=true`,
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
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

  const handleCapaian = (data) => {
    console.log(data, "dod Sprint");
    props.getDataUser(data.id);
    setDataSelected(data);
    setIsCapaian(true);
    getDataCapaian(data);
    setIsdisplay(true);
  };

  const handleCekGambar = (data) => {
    console.log(data);
    setIsCekGambar(true);
    setIsCek(false);
    setIsdisplay(true);
    setCapaianSelected(data);
  };
  const handleUpdateCapaian = (data) => {
    if (checkDate(props.dataSprint.TanggalBerakhir) == true) {
      return [];
    }
    console.log(data);
    setCapaianSelected(data);
    setIsEditCapaian(true);
  };
  function checkDate(date) {
    const today = new Date(tanggal); // Mendapatkan tanggal hari ini
    const targetDate = new Date(date); // Tanggal target

    // Mengecek apakah tanggal hari ini lebih dari tanggal target
    if (today <= targetDate) {
      return false;
    } else {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Waktu Pengerjaan Sprint Telah Berakhir",
      });
      return true;
    }
  }
  console.log(dataCapaian, "capaian data");
  return (
    <div className="  w-full rounded-xl  mb-16 mt-5">
      {isCapaian == false && (
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
              {/* <button
                className="button-insert w-[15rem]"
                onClick={() => {
                  setIsAddData(!isAddData);
                }}
              >
                Dod Pribadi
              </button> */}

              <button
                className="button-insert w-[15rem]"
                onClick={() => {
                  if (checkDate(props.dataSprint.TanggalBerakhir) == true) {
                  } else {
                    setIsAddData(!isAddData);
                  }
                }}
              >
                Tambah Dod
              </button>
            </div>
          </div>
        </>
      )}

      <ModalAddDodSprint
        open={isAddData}
        setOpen={() => setIsAddData(false)}
        addData={handleAdd}
        optionDod={props.optionDod}
      />

      <ModalAddCapaian
        open={isAddCapaian}
        setOpen={() => setIsAddCapaian(false)}
        totalCapaian={totalCapaian}
        data={dataSelected}
        getData={getDataCapaian}
        getDataUser={props.getDataUser}
        dataSprint={props.dataSprint}
        optionUser={props.dataUser}
      />
      <ModalEditCapaian
        open={isEditCapaian}
        setOpen={() => setIsEditCapaian(false)}
        totalCapaian={totalCapaian}
        data={capaianSelected}
        dataSprint={dataSelected}
        optionUser={props.dataUser}
        getData={getDataCapaian}
        getDataUser={props.getDataUser}
      />
      <ModalEditDodSprint
        open={isEditData}
        setOpen={() => setIsEditData(false)}
        editData={handleEdit}
        data={dataUpdate}
        optionDod={props.optionDod}
      />

      <ModalPeriksaGambar
        data={capaianSelected}
        open={isCekGambar}
        dataDodSprint={dataSelected}
        getData={getDataCapaian}
        getDataPBI={() => {
          props.getDataPBI();
        }}
        fetchDod={() => {
          props.getData();
        }}
        getDataDod={getSingleDataDod}
        setOpen={() => setIsCekGambar(false)}
        setCek={() => setIsCek(true)}
        setIsDisplay={() => {
          setIsdisplay(false);
        }}
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
                          if (
                            checkDate(props.dataSprint.TanggalBerakhir) == true
                          ) {
                            return [];
                          }
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
                  {props.isLoadData == true && (
                    <>
                      <LoaderData />
                    </>
                  )}
                  {props.isLoadData == false && (
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
                              <div className="font-normal flex justify-start items-center w-[30%] gap-6">
                                <div class="group relative">
                                  <button
                                    onClick={() => props.setDod(data)}
                                    className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-blue-600 hover:scale-125 bg-blue-100 "
                                  >
                                    <FaUserGroup class="text-lg  duration-200 text-blue-700" />
                                  </button>
                                  <span
                                    class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-blue-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                                  >
                                    Pelaksana<span></span>
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
                                    onClick={() => handleDelete(data)}
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

                                <div class="group relative">
                                  <button
                                    onClick={() => handleCapaian(data)}
                                    className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-blue-600 hover:scale-125 bg-blue-100 "
                                  >
                                    <FaArrowUpRightDots class="text-lg  duration-200 text-blue-700" />
                                  </button>
                                  <span
                                    class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-blue-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                                  >
                                    Capaian<span></span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </AnimatePresence>
      </motion.div>
      {isCapaian == false && (
        <>
          {currentData.length > 0 && (
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
        </>
      )}
      {isCek == true && isCapaian == true && (
        <>
          <TableCapaian
            dataCapaian={dataCapaianUpdate}
            dataSelected={dataSelected}
            handleCekGambar={handleCekGambar}
            handleDelete={handleDelete}
            getData={getDataCapaian}
            dataUpdate={(data) => {
              setDataCapaianUpdate(data);
            }}
            setDataCapaian={(data) => {
              setDataCapaian(data);
            }}
            dataSprint={props.dataSprint}
            setCek={() => setIsCek(true)}
            setTotalCapaian={(value) => {
              setTotalCapaian(value);
            }}
            setDisplay={() => setIsdisplay(false)}
            handleEdit={handleUpdateCapaian}
            editData={editData}
          />
        </>
      )}
      {isCekDisplay == true && isCapaian == true && (
        <>
          <TableCapaian
            dataCapaian={dataCapaian}
            dataSelected={dataSelected}
            handleCekGambar={handleCekGambar}
            handleDelete={handleDelete}
            getData={getDataCapaian}
            isLoadData={isLoadData}
            dataSprint={props.dataSprint}
            editData={editData}
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

export default TableDodSprint;
