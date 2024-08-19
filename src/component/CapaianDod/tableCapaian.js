import axios from "axios";
import React from "react";
import Swal from "sweetalert2";
import Filter from "../features/filter";

function TableCapaian(props) {
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

      props.setDataCapaian(data);

      // Hitung total capaian
      const totalCapaian = data.reduce((total, item) => {
        return total + parseInt(item.Capaian || 0); // Asumsikan ada properti `capaian`
      }, 0);
      props.setTotalCapaian(totalCapaian);
      console.log("Total Capaian: ", totalCapaian);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleDeleteCapaian = async (data) => {
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
            "http://202.157.189.177:8080/api/database/rows/table/714/" +
            data.id +
            "/",
          headers: {
            Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          },
        });
        console.log(props.dataCapaian);
        console.log(data);
        let dataUpdate = props.dataCapaian.filter((a) => a.id != data.id);
        console.log(dataUpdate);
        props.dataUpdate(dataUpdate);
        props.setCek();
        props.setDisplay();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data successfully deleted.",
        }).then((result) => {
          if (result.isConfirmed) {
            getDataCapaian(props.dataSelected);
          }
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
  return (
    <div>
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className=" bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl mt-5"
      >
        {props.dataCapaian.map((data) => (
          <div
            key={data.id}
            className="hover:cursor-pointer py-1 px-4  gap-4 w-full flex justify-between  items-center  border-b border-blue-blue-300"
          >
            <div className="flex justify-start gap-4 items-center w-[76%] p-2">
              <div className="flex flex-col justify-between gap-2 items-start">
                <h3 className="text-lg font-medium">
                  {data.Capaian} {props.dataSelected.Satuan[0].value}
                </h3>
                <h5 className="text-sm font normal text-blue-500">
                  Nama pelaksana
                </h5>
              </div>
              <div className="flex justify-start gap-4 items-center p-2 ">
                <div
                  className={`p-2 rounded-md ${
                    data.isCheck
                      ? " text-teal-700 bg-teal-100 border border-teal-700 font-semibold"
                      : " text-yellow-700 font-semibold bg-yellow-100 border border-yellow-700"
                  }  font-normal text-sm px-6`}
                >
                  {data.isCheck ? " Sudah Diperiksa" : " Belum Diperiksa"}
                </div>

                {data.isCheck && (
                  <>
                    <div
                      className={`p-2 rounded-md ${
                        !data.Revisi
                          ? " text-teal-700 bg-teal-100 border border-teal-700 font-semibold"
                          : " text-yellow-700 font-semibold bg-yellow-100 border border-yellow-700"
                      }  font-normal text-sm px-6`}
                    >
                      {data.Revisi ? "Perlu Revisi" : "Sudah Sesuai"}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-6 w-[45rem]">
              <button
                className="button-table  border border-blue-500 bg-blue-500  hover:border-blue-700"
                onClick={() => props.handleCekGambar(data)}
              >
                <span>Periksa Bukti</span>
              </button>
              {data.isCheck == false && (
                <>
                  <button
                    className="button-table border border-teal-500 bg-teal-500  hover:border-teal-700"
                    onClick={() => props.handleEdit(data)}
                  >
                    <span>Update</span>
                  </button>
                  <button
                    className="button-table  border border-red-500 bg-red-500  hover:border-red-700"
                    onClick={() => handleDeleteCapaian(data)}
                  >
                    <span>Hapus</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableCapaian;
