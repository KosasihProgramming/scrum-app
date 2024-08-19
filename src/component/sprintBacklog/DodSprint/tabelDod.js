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

import ModalAddAnggota from "../anggotaSprint/modalAnggota";
import { useLoading } from "../../features/context/loadContext";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableDodSprint(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [tab, setTab] = useState("tab1");
  const [search, setSearch] = useState("");

  const [dataUpdate, setDataUpdate] = useState({});

  const { setIsLoad } = useLoading();

  const [idData, setIdData] = useState(0);
  const [isAddData, setIsAddData] = useState(false);
  const [isAddAnggota, setIsAddAnggota] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
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
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update kolom pencarian
    setCurrentPage(1); // Reset halaman ke halaman pertama setelah pencarian diterapkan
  };
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
            "http://202.157.189.177:8080/api/database/rows/table/578/" +
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
          url: "http://202.157.189.177:8080/api/database/rows/table/578/?user_field_names=true",
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

  const handleEdit = async (target, dod) => {
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
          url: `http://202.157.189.177:8080/api/database/rows/table/578/${idData}/?user_field_names=true`,
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
                  setIsAddData(!isAddData);
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
      <div
        // data-aos="fade-up"
        className="w-full text-left text-sm font-normal mt-5"
      >
        <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 grid grid-cols-5 gap-4">
          <div className="font-medium">Judul</div>
          <div className="font-medium">Target</div>
          <div className="font-medium">Capaian</div>
          <div className="font-medium">Aksi</div>
        </div>

        <div className=" bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl  p-2 mt-5">
          {isCapaian ? (
            <>
              <div
                data-aos="fade-up"
                className="hover:cursor-pointer py-2 px-4 grid grid-cols-5 gap-4 w-full items-center  border-b border-blue-blue-300 bg-white"
              >
                <div>{dataSelected.Judul[0].value}</div>
                <div>
                  {dataSelected.Target} {dataSelected.Satuan[0].value}
                </div>
                <div>
                  {totalCapaian} {dataSelected.Satuan[0].value}
                </div>
                <div className="flex gap-6 w-[25rem]">
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
                    className="cssbuttons-io-button w-[13rem]"
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
            </>
          ) : (
            <>
              <motion.div
                initial={{ y: 1000, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 2, delay: 0.3 }}
              >
                <AnimatePresence>
                  {currentData.map((data) => (
                    <div
                      // data-aos="fade-up"
                      key={data.id}
                      className="hover:cursor-pointer py-1 px-4 grid grid-cols-5 gap-4 w-full items-center  border-b border-blue-blue-300 bg-white"
                    >
                      <div>{data.Judul[0].value}</div>
                      <div>
                        {data.Target} {data.Satuan[0].value}
                      </div>
                      <div>
                        {data.Capaian} {data.Satuan[0].value}
                      </div>
                      <div className="flex gap-6 w-[25rem]">
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
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </div>
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
