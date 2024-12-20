import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "../../styles/button.css";
import "../../styles/input.css";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import animationData from "../../styles/blue.json";
import Lottie from "react-lottie";
import { Link } from "react-router-dom";
import DropdownSearch from "../features/dropdown";
import ModalProduct from "./modalProduct";
import FormAddProduct from "./formAddProduct";
import axios from "axios";
import Swal from "sweetalert2";
import ModalEditProduct from "./modalEditProduct";
import ModalAddDodProduct from "./modalProduct";
import ModalEditDodProduct from "./modalEditProduct";
import Aos from "aos";
import { useLoading } from "../features/context/loadContext";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function TableDodProduct(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [tab, setTab] = useState("tab1");
  const [search, setSearch] = useState("");
  const { setIsLoad } = useLoading();

  const [dataUpdate, setDataUpdate] = useState({});

  const [idData, setIdData] = useState(0);
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setIsEditData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const peran = sessionStorage.getItem("peran");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  }; // State u
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
            "http://103.181.182.230:6060/api/database/rows/table/637/" +
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
  const handleAdd = async (judul, target, satuan) => {
    try {
      // Validate the data
      if (!judul || !satuan.value || !target) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      } else {
        // setIsLoad(true)

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
          url: "http://103.181.182.230:6060/api/database/rows/table/637/?user_field_names=true",
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
    setIsEditData(true);
    setIsAddData(false);
    setDataUpdate(data);
    setIdData(data.id);
  };

  const handleEdit = async (judul, target, satuan) => {
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
      if (!judul || !satuan.value || !target) {
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
          Satuan: [satuan.value], // Ensure this is an array
          Target: target,
        };

        console.log(data, "Data being Update");

        const response = await axios({
          method: "PATCH",
          url: `http://103.181.182.230:6060/api/database/rows/table/637/${idData}/?user_field_names=true`,
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

  return (
    <div
      //   data-aos="fade-down"
      //   data-aos-delay="450"
      className="  w-full rounded-xl  mb-16 mt-10"
    >
      <div className="w-full flex justify-between items-center rounded-xl bg-white py-2 px-5 shadow-md gap-6">
        <div className="flex justify-start items-center gap-10 w-[25rem]">
          <div className="input-wrapper ">
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
            // data-aos="fade-up"
            // data-aos-delay="550"
            className="w-full text-left text-sm font-normal mt-5"
          >
            <div className="bg-blue-600 text-white rounded-xl font-normal py-4 px-6 gap-4 flex justify-between items-center">
              <div className="font-medium flex justify-center items-center w-[40%]">
                Judul
              </div>
              <div className="font-medium flex justify-center items-center w-[8%]">
                Target
              </div>
              <div className="font-medium flex justify-center items-center w-[8%]">
                Capaian
              </div>
              <div className="font-medium flex justify-center items-center w-[15%]">
                Persentase
              </div>
              <div className="font-medium flex justify-center items-center w-[30%]">
                Aksi
              </div>
            </div>
            <div className=" bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl  p-2 mt-5">
              {currentData.map((data) => (
                <div
                  key={data.id}
                  className={`hover:cursor-pointer py-4 px-4 gap-4 w-full text-sm border-b border-blue-blue-300 flex justify-between items-center`}
                >
                  <div className="font-normal flex justify-start items-center w-[40%] overflow-wrap break-words word-break break-all">
                    {data.Judul}
                  </div>
                  <div className="font-normal flex justify-start items-center w-[8%] flex-wrap">
                    {data.Target} {data.Satuan[0].value}
                  </div>

                  <div className="font-normal flex justify-start items-center w-[8%] flex-wrap">
                    {data.Capaian} {data.Satuan[0].value}
                  </div>
                  <div className="font-normal flex justify-start items-center w-[15%] flex-wrap">
                    {data.PersentaseCapaian} %
                  </div>
                  <div className="font-normal flex gap-6 justify-end items-center w-[30%] flex-wrap">
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
        </>
      )}
    </div>
  );
}

export default TableDodProduct;
