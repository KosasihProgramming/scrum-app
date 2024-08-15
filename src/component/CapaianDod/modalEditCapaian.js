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
import FormEditCapaian from "./formEditCapaian";

export default function ModalEditCapaian(props) {
  const setOpen = () => {
    props.setOpen(false);
  };

  const handleAdd = async (capaian, keterangan, link, files, user) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (parseInt(capaian) > parseInt(user.target)) {
          Swal.fire({
            icon: "warning",
            title: "Gagal",
            text: `Capaian ${user.text} Sebesar ${capaian} Tidak Boleh melebihi Target ${user.target} `,
          });
        } else {
          if (capaian <= 0) {
            Swal.fire({
              icon: "warning",
              title: "Gagal",
              text: "Capaian Belum Diisi",
            });
            return reject(new Error("All fields are required."));
          }
          let fileNames = [];
          let data = {};
          // Langkah 1: Upload file jika ada
          if (files.length > 0) {
            const formData = new FormData();
            for (let file of files) {
              formData.append("file", file);
            }

            const fileUploadResponse = await axios.post(
              "http://202.157.189.177:8080/api/user-files/upload-file/",
              formData,
              {
                headers: {
                  Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            fileNames = fileUploadResponse.data.map((file) => file.name); // Mengambil nama file dari response
            data = {
              Capaian: capaian,
              Pelaksana: [parseInt(user.value)],
              Keterangan: keterangan,
              Link: link,
              File: fileNames, // Menggabungkan nama file jika lebih dari satu
              DodSprint: [parseInt(props.dataSprint.id)], // Pastikan ini array
            };
          } else {
            data = {
              Capaian: capaian,
              Keterangan: keterangan,
              Pelaksana: [parseInt(user.value)],
              Link: link,
              DodSprint: [parseInt(props.dataSprint.id)], // Pastikan ini array
            };
          }
          let totalCapaian = parseInt(props.totalCapaian) + parseInt(capaian);

          console.log(data, "Data being sent");
          if (totalCapaian > parseInt(props.dataSprint.Target)) {
            Swal.fire({
              icon: "warning",
              title: "Gagal",
              text: "Total capaian Melebihi Target Dod Sprint",
            });
          } else {
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
            props.getData(props.dataSprint);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Data successfully saved.",
            });
            console.log("Data successfully saved", response);
            resolve(response); // Resolve the Promise
          }
        }
      } catch (error) {
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
        reject(error); // Reject the Promise in case of an error
      }
    });
  };

  return (
    <Dialog open={props.open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-full overflow-y-auto  flex justify-center items-center pl-48">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg h-[95vh] overflow-y-scroll w-[45rem]  text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-slate-100  pb-8  w-[45rem]">
              <div className="flex items-start">
                <div className=" text-center w-full  ">
                  <div className=" w-full flex justify-center">
                    <DialogTitle
                      as="h3"
                      className="text-xl font-semibold leading-6 text-white w-[95%]  py-3 mt-8 rounded-xl bg-blue-600 "
                    >
                      Tambah Capaian
                    </DialogTitle>
                  </div>
                  <div className=" px-4">
                    <FormEditCapaian
                      addData={handleAdd}
                      dataDod={props.dataSprint}
                      optionUser={props.optionUser}
                      data={props.data}
                      totalCapaian={props.totalCapaian}
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
                className="mt-3 justify-center rounded-md bg-blue-100 border border-blue-600 text-blue-700 hover:border-white px-3 py-2 text-sm font-semibold w-[8rem] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
