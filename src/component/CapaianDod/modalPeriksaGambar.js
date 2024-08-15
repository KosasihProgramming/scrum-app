import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import FormAddProduct from "./formAddCapaian";
import FormAddPBIProduct from "./formAddCapaian";
import FormAddDodProduct from "./formAddCapaian";
import FormAddCapaian from "./formAddCapaian";
import axios from "axios";
import Swal from "sweetalert2";
import FormPeriksaGambar from "./formPeriksaGambar";
import Filter from "../features/filter";

export default function ModalPeriksaGambar(props) {
  const setOpen = () => {
    props.setOpen(false);
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
      const totalCapaian = data.reduce((total, item) => {
        return total + parseInt(item.Capaian || 0); // Asumsikan ada properti `capaian`
      }, 0);
      props.setDataCapaian(data);
      props.setTotalCapaian(totalCapaian);
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleAdd = async (komentar, revisi) => {
    try {
      // Validate the data

      const data = {
        Komentar: komentar,
        Revisi: revisi, // Ensure this is an array
        isCheck: true,
      };

      console.log(data, "Data being sent");

      const response = await axios({
        method: "PATCH",
        url: `http://202.157.189.177:8080/api/database/rows/table/714/${props.data.id}/?user_field_names=true`,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          "Content-Type": "application/json",
        },
        data: data,
      });

      setOpen();
      let updatedData = props.dataAll.map((s) => {
        if (s.id === props.data.id) {
          return { ...s, isCheck: true, Komentar: komentar, Revisi: revisi }; // Mengupdate nama siswa dengan id 123
        }
        return s; // Mengembalikan objek siswa yang lain tanpa perubahan
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data successfully saved.",
      }).then((result) => {
        if (result.isConfirmed) {
          props.setCek();
          getDataCapaian(props.data);
          props.dataUpdate(updatedData);
        }
      });

      console.log("Data successfully saved", response);
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
    <Dialog
      open={props.open}
      onClose={setOpen}
      className="relative z-10 overflow-y-scroll"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-full overflow-y-auto  flex justify-center items-center pl-48">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative bg-slate-100 transform overflow-hidden rounded-lg h-[95vh] overflow-y-scroll w-[45rem]  text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-slate-100  pb-4  w-[45rem]">
              <div className="flex items-start">
                <div className=" text-center w-full  ">
                  <div className=" w-full flex justify-center">
                    <DialogTitle
                      as="h3"
                      className="text-xl font-semibold leading-6 text-white w-[95%]  py-3 mt-2 rounded-xl bg-blue-600 "
                    >
                      Modal Periksa Bukti
                    </DialogTitle>
                  </div>
                  <div className=" px-4">
                    <FormPeriksaGambar
                      handleUpdate={handleAdd}
                      data={props.data}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-end w-full sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className=" justify-center rounded-md bg-blue-100 border border-blue-600 text-blue-700 hover:border-white px-3 py-2 text-sm font-semibold w-[8rem] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
