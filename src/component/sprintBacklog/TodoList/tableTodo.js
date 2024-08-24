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
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import DropdownSearch from "../../features/dropdown";

import axios from "axios";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa";
import Aos from "aos";
import { useLoading } from "../../features/context/loadContext";
import ModalAddTodo from "./modalAdd";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableTodo(props) {
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
  const [isEditData, setIsEditData] = useState(false);
  const { setIsLoad } = useLoading();
  const [selectedUser, setSelectedUser] = useState(""); // State untuk filter tim
  const [selectedDate, setSelectedDate] = useState(
    dayjs().locale("id").format("YYYY-MM-DD")
  ); // State untuk menyimpan tanggal yang dipilih

  const [searchTerm, setSearchTerm] = useState(""); // State u
  useEffect(() => {
    Aos.init({ duration: 700 });
  }, [props.data]);

  const dataOption = props.dataAnggota.map((item) => {
    return {
      value: item.id,
      text: item.value,
      tim: item.userDetails.Tim[0].id,
    };
  });

  const filteredData = props.data.filter((data) => {
    const matchTeam =
      selectedUser === "" || data.Pelaksana[0].value === selectedUser;
    const matchSearch =
      data.Task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.Jam.toString().includes(searchTerm) ||
      data.Pelaksana[0].value.toString().includes(searchTerm);

    // Format tanggal ke "YYYY-MM-DD" untuk filter
    const dataTanggal = new Date(data.Tanggal).toISOString().split("T")[0];
    const matchDate = selectedDate === "" || dataTanggal === selectedDate;

    return matchTeam && matchSearch && matchDate;
  });

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleTeamChange = (item) => {
    setSelectedUser(item.text); // Simpan id tim yang dipilih
    setCurrentPage(1); // Reset halaman ke halaman pertama setelah filter diterapkan
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update kolom pencarian
    setCurrentPage(1); // Reset halaman ke halaman pertama setelah pencarian diterapkan
  };
  // Filter data berdasarkan kata kunci pencarian

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
            "http://202.157.189.177:8080/api/database/rows/table/726/" +
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

  const handleAdd = async (
    tanggal,
    jamMulai,
    jamStop,
    task,
    plan,
    pelaksana
  ) => {
    try {
      // Validate the data
      if (
        tanggal == "" ||
        jamMulai == "" ||
        jamStop == "" ||
        task == "" ||
        !pelaksana
      ) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);
        console.log(pelaksana);
        const data = {
          Tanggal: tanggal,
          Jam: `${jamMulai} - ${jamStop}`,
          Task: task, // Ensure this is an array
          Pelaksana: [parseInt(pelaksana.value)], // Ensure this is an array,
          IsPriorithize: plan,
          Sprint: [parseInt(props.id)],
        };

        console.log(data, "Data being sent");

        const response = await axios({
          method: "POST",
          url: "http://202.157.189.177:8080/api/database/rows/table/726/?user_field_names=true",
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
  const handleCheck = async (item) => {
    try {
      setIsLoad(true);

      const data = {
        IsCheck: true,
      };

      console.log(data, "Data being Update");

      const response = await axios({
        method: "PATCH",
        url: `http://202.157.189.177:8080/api/database/rows/table/726/${item.id}/?user_field_names=true`,
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
  const sendmessage = async () => {
    console.log("datasend", currentData);
    const result = filteredData
      .map(
        (item, i) =>
          `${i + 1}. ${item.Task} | ${item.Jam} | ${item.IsCheck ? "✅" : ""}`
      )
      .join("\n");
    console.log(result);
    const text = `<b>Tanggal : ${formatTanggal(
      selectedDate
    )}</b>\n<b>Nama :${selectedUser}</b>\n<b>To Do List :</b>\n${result}`;
    console.log(text);

    if (selectedUser == "") {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: `Pilih Pelaksana Terlebih Dahulu`,
      });
    }
    try {
      const botToken = "bot7140283752:AAEUOiJb7eO3c_UyLWCyn5-HWb7IeTgSKeY";
      const chatId = "-1001812360373";
      const thread = "16775";
      const response = await fetch(
        `https://api.telegram.org/${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: "html",
            message_thread_id: thread,
          }),
        }
      );

      if (response.ok) {
        console.log("Berhasil Dikirmkan");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data successfully Sended.",
        });
      } else {
        console.log("Gagal mengirim pesan");
        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim",
          text: `Gagal mengirim pesan`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim",
        text: `Gagal mengirim pesan, ${error}`,
      });
    }
  };
  function convertDateFormat(dateString) {
    // Memisahkan string tanggal berdasarkan tanda "-"
    const [year, month, day] = dateString.split("-");

    // Menggabungkan kembali dalam format DD/MM/YYYY
    return `${day}/${month}/${year}`;
  }
  const handleChangeDate = (date) => {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) {
      return;
    }
    const formattedDate = dayjsDate.format("YYYY-MM-DD");
    setCurrentPage(1);
    setSelectedDate(formattedDate);
  };
  console.log("anggota todo", props.dataAnggota);
  return (
    <motion.div
      initial={{ y: 1000, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
    >
      <AnimatePresence>
        <div className="  w-full rounded-xl  mb-16 mt-5">
          <div className="w-full flex justify-between items-center rounded-xl bg-white py-2 px-5 shadow-md gap-6">
            <div className="flex justify-start items-center gap-10 w-[35rem]">
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

              <Space direction="vertical" size={12}>
                <DatePicker
                  defaultValue={dayjs(
                    convertDateFormat(selectedDate),
                    dateFormatList[0]
                  )}
                  format={dateFormatList}
                  onChange={(date) => {
                    handleChangeDate(date);
                  }}
                  className="bg-white border w-[8rem] rounded-xl border-blue-500 font-normal p-3 hover:text-blue-800 active:text-blue-800"
                />
              </Space>
              <div className="w-auto flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999] w-[12rem]">
                  <DropdownSearch
                    options={dataOption}
                    change={handleTeamChange}
                    name={"Pelaksana"}
                    isSearch={false}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-6 items-center">
              {selectedUser !== "" && (
                <>
                  <button
                    className="button-insert w-[8rem]"
                    onClick={() => {
                      sendmessage();
                    }}
                  >
                    Kirim
                  </button>
                </>
              )}
              <button
                className="button-insert w-[8rem]"
                onClick={() => {
                  setIsAddData(!isAddData);
                }}
              >
                Tambah
              </button>
            </div>
          </div>

          <ModalAddTodo
            dataUser={dataOption}
            open={isAddData}
            setOpen={() => setIsAddData(false)}
            addData={handleAdd}
          />

          {/* 
                <ModalEditPBISprint
            open={isEditData}
            editData={handleEdit}
            data={dataUpdate}
            optionProduct={props.optionProduct}
          /> */}

          <div className="w-full text-left text-sm font-normal mt-5">
            <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 gap-4 flex justify-between items-center">
              <div className="font-medium flex justify-center items-center w-[12%]">
                Tanggal
              </div>
              <div className="font-medium flex justify-center items-center w-[8%]">
                Jam
              </div>
              <div className="font-medium flex justify-center items-center w-[30%]">
                Task
              </div>
              <div className="font-medium flex justify-center items-center w-[15%]">
                Pelaksana
              </div>
              <div className="font-medium flex justify-center items-center w-[8%]">
                Prioritas
              </div>
              <div className="font-medium flex justify-center items-center w-[30%]">
                Aksi
              </div>
            </div>
            <motion.div
              initial={{ y: 1000, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
            >
              <AnimatePresence>
                <div className="flex flex-col gap-2 justify-start items-center w-full rounded-xl  p-2 mt-5">
                  {currentData.map((data) => (
                    <div
                      key={data.id}
                      className={`${
                        data.IsCheck ? " bg-blue-100 text-blue-700" : "bg-white"
                      } shadow-md rounded-md hover:cursor-pointer py-4 px-4  gap-4 w-full text-sm  border-b border-blue-blue-300 flex justify-between items-center`}
                    >
                      <div className="font-normal flex justify-start items-center w-[12%]  overflow-wrap break-words word-break break-all">
                        {formatTanggal(data.Tanggal)}
                      </div>
                      <div className="font-normal flex justify-start items-center w-[8%]">
                        {data.Jam}
                      </div>
                      <div className=" flex justify-start items-center w-[30%] font-medium">
                        {data.Task}
                      </div>
                      <div className="font-normal flex justify-start items-center w-[15%]">
                        {data.Pelaksana[0].value}
                      </div>
                      <div className="font-normal flex justify-center items-center w-[8%]">
                        {data.IsPriorithize ? (
                          <>
                            <div className="p-2 w-[4rem] bg-teal-100 border border-teal-600 text-teal-700 rounded-md flex justify-center items-center">
                              Ya
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-2 w-[4rem] bg-yellow-100 border border-yellow-600 text-yellow-700 rounded-md flex justify-center items-center">
                              Tidak
                            </div>
                          </>
                        )}
                      </div>
                      <div className="font-normal flex justify-center items-center w-[30%] gap-4">
                        {data.IsCheck ? (
                          <>
                            <div className="p-2 w-[100%] bg-blue-600  text-white rounded-md flex justify-center items-center">
                              Selesai
                            </div>
                          </>
                        ) : (
                          <>
                            <div class="group relative">
                              <button
                                onClick={() => handleCheck(data)}
                                className={`w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border  hover:border-blue-600 bg-blue-100   hover:scale-125 `}
                              >
                                <FaCheck class="text-lg  duration-200 text-blue-700" />
                              </button>
                              <span
                                class={`absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border w-[5rem]
  border-gray-300 bg-blue-600  text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100`}
                              >
                                <span> Selesaikan</span>
                              </span>
                            </div>
                            {/* <div class="group relative">
                              <button
                                onClick={() => props.handleEdit(data)}
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
                            </div> */}
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
                          </>
                        )}
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
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

export default TableTodo;
