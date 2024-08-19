import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "../../styles/button.css";
import "../../styles/input.css";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";

import { Link } from "react-router-dom";
import DropdownSearch from "../features/dropdown";
import ModalProduct from "./modalProduct";
import FormAddProduct from "./formAddProduct";
import axios from "axios";
import Swal from "sweetalert2";
import ModalEditProduct from "./modalEditProduct";
import ModalAddDodProduct from "./modalProduct";
import ModalEditDodProduct from "./modalEditProduct";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableDodProduct(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [tab, setTab] = useState("tab1");
  const [search, setSearch] = useState("");

  const [dataUpdate, setDataUpdate] = useState({});

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

  const handleTab = (key) => {
    setTab(key);
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
            "http://202.157.189.177:8080/api/database/rows/table/651/" +
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
  const handleAdd = async (judul, target, satuan) => {
    try {
      // Validate the data
      if (!judul || !judul || !satuan.value || !target) {
        console.error("Invalid data: All fields are required.");
        return;
      }

      const data = {
        Judul: judul,
        Satuan: [satuan.value], // Ensure this is an array
        Target: target,
        ProductBacklog: [parseInt(props.idProduct)], // Ensure this is an array
        PBIProduct: [parseInt(props.idPbi)], // Ensure this is an array
      };

      console.log(data, "Data being sent");

      const response = await axios({
        method: "POST",
        url: "http://202.157.189.177:8080/api/database/rows/table/651/?user_field_names=true",
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

  const handleEdit = async (judul, target, satuan) => {
    try {
      if (!judul || !judul || !satuan.value || !target) {
        console.error("Invalid data: All fields are required.");
        return;
      }

      const data = {
        Judul: judul,
        Satuan: [satuan.value], // Ensure this is an array
        Target: target,
      };

      console.log(data, "Data being Update");

      const response = await axios({
        method: "PATCH",
        url: `http://202.157.189.177:8080/api/database/rows/table/651/${idData}/?user_field_names=true`,
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

  return (
    <div
      //   data-aos="fade-down"
      //   data-aos-delay="450"
      className="  w-full rounded-xl  mb-16 mt-10"
    >
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
              <DropdownSearch
                options={props.optionSatuan}
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
          Tambah Dod
        </button>
      </div>

      <ModalAddDodProduct
        open={isAddData}
        setOpen={() => setIsAddData(false)}
        addData={handleAdd}
        optionSatuan={props.optionSatuan}
      />
      <ModalEditDodProduct
        open={isEditData}
        setOpen={() => setIsEditData(false)}
        editData={handleEdit}
        data={dataUpdate}
        optionSatuan={props.optionSatuan}
      />

      <div
        // data-aos="fade-up"
        // data-aos-delay="550"
        className="w-full text-left text-sm font-normal mt-5"
      >
        <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 grid grid-cols-5 gap-4">
          <div className="font-medium">Judul</div>
          <div className="font-medium">Target</div>
          <div className="font-medium">Satuan</div>
          <div className="font-medium">Capaian</div>
          <div className="font-medium">Aksi</div>
        </div>
        <div className=" bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl  p-2 mt-5">
          {currentData.map((data) => (
            <div
              key={data.id}
              className="hover:cursor-pointer py-2 px-4 grid grid-cols-5 gap-4 w-full items-center  border-b border-blue-blue-300"
            >
              <div>{data.Judul}</div>
              <div>{data.Target}</div>

              <div>{data.Satuan[0].value}</div>
              <div>{data.Capaian} %</div>
              <div className="flex gap-6">
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
    </div>
  );
}

export default TableDodProduct;
