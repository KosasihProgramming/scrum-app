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
import { AnimatePresence, motion } from "framer-motion";

import { MdDeleteOutline } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import axios from "axios";
import Swal from "sweetalert2";
import { GoArrowRight } from "react-icons/go";
import { LuArrowRight } from "react-icons/lu";
import animationData from "../../styles/blue.json";
import Lottie from "react-lottie";
import { useLoading } from "../features/context/loadContext";
import ModalAddUser from "./modalAdd";
import ModalEditUser from "./modalEdit";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableUsers(props) {
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
  const [idData, setIdData] = useState(0);
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(""); // State untuk filter tim
  const { setIsLoad } = useLoading();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  // Filter data berdasarkan NamaTim[0].id dan juga pencarian
  const filteredData = props.data.filter((data) => {
    const matchTeam =
      selectedTeam === "" ||
      (data.Tim.length > 0 && data.Tim[0].id === selectedTeam);
    const matchSearch = data.Nama.toLowerCase().includes(
      searchTerm.toLowerCase()
    );

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
            "http://103.181.182.230:6060/api/database/rows/table/633/" +
            id +
            "/",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
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

  const handleAdd = async (nama, email, peran, foto, password, tim) => {
    try {
      // Validate the data
      if (!foto || !peran || !email || !tim || !password || !nama) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);
        let fileNames = [];
        // Langkah 1: Upload file jika ada

        const formData = new FormData();
        for (let file of foto) {
          formData.append("file", file);
        }

        const fileUploadResponse = await axios.post(
          "http://103.181.182.230:6060/api/user-files/upload-file/",
          formData,
          {
            headers: {
              Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(fileUploadResponse.data, "File upload response");

        // Assuming the response data contains an array of files
        if (Array.isArray(fileUploadResponse.data)) {
          fileNames = fileUploadResponse.data.map((file) => file.name);
        } else if (fileUploadResponse.data.name) {
          // In case it's a single file
          fileNames.push(fileUploadResponse.data.name);
        } else {
          // Handle unexpected response structure
          throw new Error("Unexpected response structure from file upload");
        }

        const data = {
          Tim: [parseInt(tim.value)],
          Nama: nama,
          Email: email,
          Peran: [peran.value],
          Password: password,
          Foto: fileNames,
        };

        console.log(data, "Data being sent");

        const response = await axios({
          method: "POST",
          url: "http://103.181.182.230:6060/api/database/rows/table/633/?user_field_names=true",
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

  const handleEdit = async (nama, email, peran, foto, password, tim) => {
    try {
      // Validate the data
      if (!peran || !email || !tim || !nama) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);
        let fileNames = [];
        let data = {};

        if (foto.length > 0) {
          const formData = new FormData();
          for (let file of foto) {
            formData.append("file", file);
          }

          const fileUploadResponse = await axios.post(
            "http://103.181.182.230:6060/api/user-files/upload-file/",
            formData,
            {
              headers: {
                Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Assuming the response data contains an array of files
          if (Array.isArray(fileUploadResponse.data)) {
            fileNames = fileUploadResponse.data.map((file) => file.name);
          } else if (fileUploadResponse.data.name) {
            // In case it's a single file
            fileNames.push(fileUploadResponse.data.name);
          } else {
            // Handle unexpected response structure
            throw new Error("Unexpected response structure from file upload");
          }

          data = {
            Tim: [parseInt(tim.value)], // Ensure tim.value is a string
            Nama: nama, // Ensure tanggalMulai is a string in YYYY-MM-DD format
            Email: email, // Ensure tanggalBerakhir is a string in YYYY-MM-DD format
            Peran: [peran.value], // Ensure product.value is a string
            Password: password, // Ensure status.value is a string
            Foto: fileNames, // Ensure urutan.value is a number
          };
        } else {
          data = {
            Tim: [parseInt(tim.value)], // Ensure tim.value is a string
            Nama: nama, // Ensure tanggalMulai is a string in YYYY-MM-DD format
            Email: email, // Ensure tanggalBerakhir is a string in YYYY-MM-DD format
            Peran: [peran.value], // Ensure product.value is a string
            Password: password, // Ensure status.value is a string
          };
        }
        console.log(data, "data send");
        const response = await axios({
          method: "PATCH",
          url: `http://103.181.182.230:6060/api/database/rows/table/633/${dataUpdate.id}/?user_field_names=true`,
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
  const showAlert = (url, name) => {
    Swal.fire({
      title: "Foto " + name,
      imageUrl: url,
      imageWidth: 600,
      imageHeight: 450,
      imageAlt: "Bukti",
      customClass: {
        popup: "bg-white text-blue-500 p-4",
        title: "text-2xl font-medium mb-4",
        image: "object-cover rounded-xl",
        confirmButton: "bg-blue-500 text-white hover:bg-blue-500",
      },
    });
  };
  return (
    <div
      //   data-aos="fade-down"
      //   data-aos-delay="450"
      className="  w-full rounded-xl  mb-16 mt-10"
    >
      <div className="w-full flex justify-between items-center rounded-xl bg-white py-2 px-5 shadow-md gap-6">
        <div className="flex justify-start items-center gap-10 w-[25rem]">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Cari..."
              name="text"
              className="input border p-2 rounded-lg"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-auto flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
            <div className="flex items-center justify-center z-[999] w-[12rem]">
              <DropdownSearch
                options={props.optionTim}
                change={handleTeamChange}
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
      <ModalAddUser
        open={isAddData}
        setOpen={() => setIsAddData(false)}
        addData={handleAdd}
        optionTim={props.optionTim}
      />

      <ModalEditUser
        open={isEditData}
        setOpen={() => setIsEditData(false)}
        editData={handleEdit}
        data={dataUpdate}
        optionTim={props.optionTim}
      />

      <motion.div
        initial={{ y: 1000, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 1.7 }}
      >
        <AnimatePresence>
          <div className="w-full text-left text-sm font-normal mt-5">
            <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 gap-4 flex justify-between items-center">
              <div className="font-medium flex justify-center items-center w-[8%]">
                Foto
              </div>
              <div className="font-medium flex justify-center items-center w-[30%]">
                Nama
              </div>
              <div className="font-medium flex justify-center items-center w-[25%]">
                Email
              </div>
              <div className="font-medium flex justify-center items-center w-[15%]">
                Tim
              </div>
              <div className="font-medium flex justify-center items-center w-[10%]">
                Peran
              </div>
              <div className="font-medium flex justify-center items-center w-[10%]">
                Aksi
              </div>
            </div>
            {currentData.length == 0 && (
              <>
                <div className="w-full flex justify-center items-center mt-5 rounded-xl bg-white">
                  <div className="w-[100%]  h-[20rem] pb-5 bg-transparent px-2 flex rounded-xl justify-center flex-col items-center">
                    <Lottie options={defaultOptions} height={250} width={250} />
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
                      <div
                        onClick={() =>
                          showAlert(
                            data.Foto.length > 0
                              ? data.Foto[0].url
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcsfuYy-W3XTybiWt3ggO_lkKgjWgt6ZqaSQ&s",
                            data.Nama
                          )
                        }
                        className="font-normal flex justify-center items-center w-[8%] overflow-wrap break-words word-break break-all"
                      >
                        <img
                          className="w-[2.5rem] h-[2.5rem] bg-cover object-cover shadow-md flex justify-center items-center rounded-xl"
                          src={`${
                            data.Foto.length > 0
                              ? data.Foto[0].url
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcsfuYy-W3XTybiWt3ggO_lkKgjWgt6ZqaSQ&s"
                          }`}
                        />
                      </div>
                      <div className="font-normal flex justify-start items-center w-[30%] flex-wrap text-wrap">
                        {data.Nama}
                      </div>
                      <div className="font-normal flex justify-start items-center w-[25%] flex-wrap">
                        {data.Email}
                      </div>{" "}
                      <div className="font-normal flex justify-start items-center w-[15%] flex-wrap">
                        {data.Tim.length > 0 ? data.Tim[0].value : ""}
                      </div>
                      <div className="font-normal flex justify-start items-center w-[10%] flex-wrap">
                        {data.Peran.length > 0 ? data.Peran[0].value : ""}
                      </div>
                      <div className="font-normal flex justify-end items-center w-[10%] gap-4">
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
  );
}

export default TableUsers;
