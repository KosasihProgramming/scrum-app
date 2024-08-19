import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "../../../styles/button.css";
import "../../../styles/input.css";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import { LuArrowRight } from "react-icons/lu";
import { RiDeleteBack2Fill } from "react-icons/ri";

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
  const [isEditData, setIsEditData] = useState(false);

  const [filteredData, setFilteredData] = useState(props.data);
  console.log(props.idProduct, "id");
  useEffect(() => {
    setFilteredData(props.data);
  }, [props.data]);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = props.data.slice(indexOfFirstData, indexOfLastData);

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
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const results = props.data.filter((item) =>
      item.Judul.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(results);
    setCurrentPage(1); // Reset halaman ke 1 setelah pencarian
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

  const handleAdd = async (target, plan, product) => {
    try {
      // Validate the data
      if (!product || !target) {
        console.error("Invalid data: All fields are required.");
        return;
      }

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
      if (!product || !target) {
        console.error("Invalid data: All fields are required.");
        return;
      }

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
  const openAnggota = () => {
    setIsAddAnggota(true);
  };
  return (
    <div
      //   data-aos="fade-down"
      //   data-aos-delay="450"
      className="  w-full rounded-xl  mb-16 mt-10"
    >
      {isOpen == false && (
        <>
          <div className="w-full flex justify-between items-center rounded-xl bg-white py-2 px-5 shadow-md gap-6">
            <div className="flex justify-start items-center gap-10">
              <div class="input-wrapper">
                <input
                  type="text"
                  placeholder="Cari..."
                  name="text"
                  class="input"
                />
              </div>
              <div className="w-auto flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999] w-[12rem]">
                  {/* <DropdownSearch
                options={props.optionTim}
                change={(item) => {}}
                name={"Tim"}
                isSearch={false}
              /> */}
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

      {isOpen == true && (
        <>
          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="mt-10 flex justify-between w-full bg-white rounded-xl py-6 px-4 shadow-md"
          >
            <div className="flex flex-col justify-start gap-2 items-start w-[80%]">
              <h3 className="text-xl font-medium text-blue-700">
                {selectedData.Judul[0].value}
              </h3>
              <h6 className="text-sm font-normal">{selectedData.Bobot}</h6>
              <div className="w-full flex justify-start gap-4 items-center mt-4">
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
        </>
      )}
      {isOpen == false && (
        <>
          {" "}
          <div
            data-aos="fade-up"
            data-aos-delay="550"
            className="w-full text-left text-sm font-normal mt-5"
          >
            <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 gap-4 flex justify-between items-center">
              <div className="font-medium flex justify-center items-center w-[15%]">
                Judul
              </div>
              <div className="font-medium flex justify-center items-center w-[15%]">
                Bobot
              </div>
              <div className="font-medium flex justify-center items-center w-[15%]">
                Capaian
              </div>
              <div className="font-medium flex justify-center items-center w-[15%]">
                Persentase
              </div>
              <div className="font-medium flex justify-center items-center w-[40%]">
                Aksi
              </div>
            </div>
            <div className=" bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl  p-2 mt-5">
              {currentData.map((data) => (
                <div
                  key={data.id}
                  className="hover:cursor-pointer py-4 px-4  gap-4 w-full text-sm  border-b border-blue-blue-300 flex justify-between items-center"
                >
                  <div className="font-normal flex justify-start items-center w-[15%]">
                    {data.Judul[0].value}
                  </div>
                  <div className="font-normal flex justify-start items-center w-[15%]">
                    {data.Bobot}
                  </div>
                  <div className="font-normal flex justify-start items-center w-[15%]">
                    {data.Capaian}
                  </div>
                  <div className="font-normal flex justify-start items-center w-[15%]">
                    {data.PersentaseCapaian}%
                  </div>
                  <div className="font-normal flex justify-end items-center w-[40%] gap-4">
                    <button
                      className="button-table border border-teal-500 bg-teal-500  hover:border-teal-700"
                      onClick={() => editData(data)}
                    >
                      <span>Update</span>
                    </button>
                    <button
                      className="button-table  border border-red-500 bg-red-500  hover:border-red-700"
                      onClick={() => handleDelete(data.id)}
                    >
                      <span>Hapus</span>
                    </button>
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
      {isOpen === true && (
        <>
          <DodSprint
            params={{
              id: props.idSprint,
              idPbi: selectedId,
              idPbiProduct: selectedData.PBIProduct[0].id,
              openAnggota: openAnggota,
              dataPbi: selectedData,
            }}
          />
        </>
      )}
    </div>
  );
}

export default TablePBISprint;
