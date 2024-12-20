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
import ModalProduct from "./modalProduct";
import FormAddProduct from "./formAddProduct";
import axios from "axios";
import Swal from "sweetalert2";
import { GoArrowRight } from "react-icons/go";
import { LuArrowRight } from "react-icons/lu";
import ModalEditProduct from "./modalEditProduct";
import Loader from "../features/loader";
import { useLoading } from "../features/context/loadContext";
import animationData from "../../styles/blue.json";
import Lottie from "react-lottie";
import LoaderData from "../features/loaderData";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableProduct(props) {
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
    const matchTeam = selectedTeam === "" || data.Tim[0].id === selectedTeam;
    const matchSearch =
      data.Judul[0].value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.Tim[0].value.toLowerCase().includes(searchTerm.toLowerCase());

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

  const optionBulan = [
    { text: "Januari", value: 3307 },
    { text: "Februari", value: 3308 },
    { text: "Maret", value: 3309 },
    { text: "April", value: 3310 },
    { text: "Mei", value: 3311 },
    { text: "Juni", value: 3312 },
    { text: "Juli", value: 3313 },
    { text: "Agustus", value: 3314 },
    { text: "September", value: 3315 },
    { text: "Oktober", value: 3316 },
    { text: "November", value: 3317 },
    { text: "Desember", value: 3318 },
  ];
  const getBulan = () => {
    const bulanIndonesia = [
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

    const now = new Date();
    const currentMonthIndex = now.getMonth(); // Mengambil indeks bulan ini
    const currentYear = now.getFullYear();

    const namaBulanIni = bulanIndonesia[currentMonthIndex];
    console.log(`Bulan ini: ${namaBulanIni} ${currentYear}`);

    let nextMonthIndex = currentMonthIndex + 1;
    let nextYear = currentYear;

    if (nextMonthIndex > 11) {
      nextMonthIndex = 0; // Jika bulan depan adalah Januari (indeks 0)
      nextYear += 1; // Tambahkan tahun
    }

    const namaBulanDepan = bulanIndonesia[nextMonthIndex];
    return { awal: namaBulanIni, akhir: namaBulanDepan };
  };
  const inMonth = getBulan();

  const filterMonth = optionBulan.find((a) => a.text === inMonth.awal);
  const filterMonth2 = optionBulan.find((a) => a.text === inMonth.akhir);
  const combinedArray = [filterMonth, filterMonth2];
  const handleDelete = async (id) => {
    if (peran !== "Scrum Master") {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: `Anda Tidak Memiliki Akses Untuk Fitur Ini`,
      });
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
        const response = await axios({
          method: "DELETE",
          url:
            "http://103.181.182.230:6060/api/database/rows/table/635/" +
            id +
            "/",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
          },
        });

        props.getData(combinedArray);
        setIsLoad(false);
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
    judul,
    target,
    goal,
    tim,
    status,
    bulan,
    tanggalMulai,
    tanggalBerakhir
  ) => {
    setIsLoad(true);
    try {
      // Validate the data
      if (!goal || !tim.value || !status.value || !bulan.value) {
        setIsLoad(false);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        const data = {
          Bulan: [bulan.value], // Ensure bulan.value is a string
          ProductGoal: goal, // Ensure goal is a string
          Status: [status.value], // Ensure status.value is a string
          TanggalMulai: formatDate(tanggalMulai), // Ensure tanggalMulai is a string in YYYY-MM-DD format
          TanggalBerakhir: formatDate(tanggalBerakhir), // Ensure tanggalBerakhir is a string in YYYY-MM-DD format
          Tim: [tim.value], // Ensure tim.value is an ID or array of IDs
        };

        console.log(data, "Data being sent");

        const response = await axios({
          method: "POST",
          url: "http://103.181.182.230:6060/api/database/rows/table/635/?user_field_names=true",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
            "Content-Type": "application/json",
          },
          data: data,
        });

        props.getData(combinedArray);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data successfully saved.",
        });
        setIsLoad(false);

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
    if (peran !== "Scrum Master") {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: `Anda Tidak Memiliki Akses Untuk Fitur Ini`,
      });
      return [];
    }
    setIsEditData(true);
    setIsAddData(false);
    setDataUpdate(data);
    setIdData(data.id);
  };

  const handleEdit = async (
    judul,
    target,
    goal,
    tim,
    status,
    bulan,
    tanggalMulai,
    tanggalBerakhir
  ) => {
    try {
      if (!goal || !tim.value || !status.value || !bulan.value) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        setIsLoad(true);

        const data = {
          Bulan: [bulan.value], // Ensure bulan.value is a string
          ProductGoal: goal, // Ensure goal is a string
          Status: [status.value], // Ensure status.value is a string
          TanggalMulai: tanggalMulai, // Ensure tanggalMulai is a string in YYYY-MM-DD format
          TanggalBerakhir: tanggalBerakhir, // Ensure tanggalBerakhir is a string in YYYY-MM-DD format
          Tim: [tim.value], // Ensure tim.value is an ID or array of IDs
        };

        console.log(data, "Data being Update");

        const response = await axios({
          method: "PATCH",
          url: `http://103.181.182.230:6060/api/database/rows/table/635/${idData}/?user_field_names=true`,
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
            "Content-Type": "application/json",
          },
          data: data,
        });
        setIsLoad(false);
        props.getData(combinedArray);

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

  return (
    <div
      //   data-aos="fade-down"
      //   data-aos-delay="450"
      className="  w-full rounded-xl  mb-16 mt-10 relative"
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
        <div className="flex justify-end gap-6 items-center">
          <button
            className="button-insert w-[15rem]"
            onClick={() => {
              props.setIsSearch();
            }}
          >
            Cari Data
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
      <div
        data-aos="fade-up"
        data-aos-delay="550"
        className="w-full text-left text-sm font-normal mt-5"
      >
        <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 grid grid-cols-[2fr_2fr_1fr_1fr_3fr] gap-4">
          <div className="font-medium">Judul</div>
          <div className="font-medium">Nama Tim</div>
          <div className="font-medium">Bulan</div>
          <div className="font-medium">Status</div>
          <div className="font-medium">Aksi</div>
        </div>

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
                <div className="bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl p-2 mt-5">
                  {currentData.map((data) => (
                    <div
                      key={data.id}
                      className="hover:cursor-pointer py-4 px-4 grid grid-cols-[2fr_2fr_1fr_1fr_3fr] gap-4 w-full items-center border-b border-blue-blue-300"
                    >
                      <div>{data.Judul[0].value}</div>
                      <div>{data.Tim[0].value}</div>
                      <div>{data.Bulan[0].value}</div>
                      <div>{data.Status[0].value}</div>
                      <div className="flex gap-6 ">
                        <button
                          className="button-table border border-teal-500 bg-teal-500 hover:border-teal-700"
                          onClick={() => editData(data)}
                        >
                          <span>Update</span>
                        </button>
                        <button
                          className="button-table border border-red-500 bg-red-500 hover:border-red-700"
                          onClick={() => handleDelete(data.id)}
                        >
                          <span>Hapus</span>
                        </button>

                        <Link
                          to={`/pbi-product/${data.id}`}
                          className="cssbuttons-io-button w-[10rem]"
                        >
                          Lihat Detail
                          <div class="icon">
                            <LuArrowRight className="text-xl text-blue-600" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
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
          </div>{" "}
        </>
      )}
    </div>
  );
}

export default TableProduct;
