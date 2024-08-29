import { useEffect, useState } from "react";
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
import Filter from "../features/filter";
import { useLoading } from "../features/context/loadContext";

export default function ModalAddCapaian(props) {
  const setOpen = () => {
    props.setOpen(false);
  };
  const { setIsLoad } = useLoading();

  const handleAdd = async (
    capaian,
    keterangan,
    isGambar,
    link,
    files,
    user
  ) => {
    return new Promise(async (resolve, reject) => {
      console.log("data product", props.data);
      try {
        if (parseInt(capaian) > parseInt(user.target)) {
          Swal.fire({
            icon: "warning",
            title: "Gagal",
            text: `Capaian ${user.text} Sebesar ${capaian} Tidak Boleh melebihi Target ${user.target} `,
          });
          resolve(); // Resolve here to exit the function early
        } else {
          // Validasi data
          if (capaian <= 0 || !user) {
            Swal.fire({
              icon: "warning",
              title: "Gagal",
              text: "Capaian Belum Diisi",
            });
            resolve(); // Resolve here to exit the function early
          } else {
            setIsLoad(true);
            let fileNames = [];
            let data = {};

            // Langkah 1: Upload file jika ada
            if (isGambar === true) {
              console.log(files, "fileee");

              // Loop through each file and upload individually
              for (let file of files) {
                const formData = new FormData();
                formData.append("file", file);
                console.log(formData, "form file");

                try {
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
                  console.log(fileUploadResponse, "response");

                  // Adjust this part based on the actual response structure
                  if (fileUploadResponse.data && fileUploadResponse.data.name) {
                    fileNames.push(fileUploadResponse.data.name);
                  }
                } catch (error) {
                  console.error("Error uploading file:", file.name, error);
                  // You can choose to handle the error (e.g., continue uploading the rest, or break out of the loop)
                }
              }
              console.log(fileNames, "filenames");
              data = {
                Capaian: capaian,
                Keterangan: keterangan,
                Link: link,
                Pelaksana: [parseInt(user.value)],
                File: fileNames, // Menggabungkan nama file jika lebih dari satu
                DodSprint: [
                  parseInt(
                    props.data.DodProduct ? props.data.id : props.data.dod.id
                  ),
                ], // Pastikan ini array
                DodProduct: [
                  parseInt(
                    props.data.DodProduct
                      ? props.data.DodProduct[0].id
                      : props.data.dod.DodProduct[0].id
                  ),
                ],
              };
            } else {
              data = {
                Capaian: capaian,
                Pelaksana: [parseInt(user.value)],
                Keterangan: keterangan,
                DodProduct: [
                  parseInt(
                    props.data.DodProduct
                      ? props.data.DodProduct[0].id
                      : props.data.dod.DodProduct[0].id
                  ),
                ],
                Link: link,
                DodSprint: [
                  parseInt(
                    parseInt(
                      props.data.DodProduct ? props.data.id : props.data.dod.id
                    )
                  ),
                ], // Pastikan ini array
              };
            }
            let totalCapaian = parseInt(props.totalCapaian) + parseInt(capaian);

            console.log(data, "Data being sent");
            if (totalCapaian > parseInt(props.data.Target)) {
              setIsLoad(false);

              Swal.fire({
                icon: "warning",
                title: "Gagal",
                text: `Total capaian ${totalCapaian} Melebihi Target Dod Sprint ${parseInt(
                  props.data.Target
                )}`,
              });
              resolve(); // Resolve here to exit the function early
            } else {
              try {
                const response = await axios({
                  method: "POST",
                  url: "http://202.157.189.177:8080/api/database/rows/table/714/?user_field_names=true",
                  headers: {
                    Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
                    "Content-Type": "application/json",
                  },
                  data: data,
                });

                await updatePelaksana(user, capaian)
                  .then(() => {
                    setOpen();
                    props.getData(props.data);
                    Swal.fire({
                      icon: "success",
                      title: "Success",
                      text: "Data successfully saved.",
                    });
                    setIsLoad(false);

                    console.log("Data successfully saved", response);
                    resolve(response); // Resolve the Promise
                  })
                  .catch((error) => {
                    console.error("Error updating pelaksana:", error);
                    reject(error); // Reject the Promise if updatePelaksana fails
                  });

                props.getDataUser(
                  props.data.DodProduct ? props.data.id : props.data.dod.id
                );
              } catch (error) {
                setIsLoad(false);
                Swal.fire({
                  icon: "error",
                  title: "Server Error",
                  text: `Error: ${error.message}`,
                });
                reject(error); // Reject the Promise in case of an error
              }
            }
          }
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
        reject(error); // Reject the Promise in case of an error
      }
    });
  };

  const updatePelaksana = async (user, capaian) => {
    try {
      // Validate the data
      alert(user.capaian);
      setIsLoad(true);

      const data = {
        Capaian:
          parseInt(user.capaian == undefined ? 0 : user.capaian) +
          parseInt(capaian),
      };

      console.log(data, "Data being Update");

      const response = await axios({
        method: "PATCH",
        url: `http://202.157.189.177:8080/api/database/rows/table/718/${user.value}/?user_field_names=true`,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          "Content-Type": "application/json",
        },
        data: data,
      });
      console.log(response, "update pelaksana");
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
                    <FormAddCapaian
                      addData={handleAdd}
                      select={props.select}
                      dataDod={props.data}
                      optionUser={props.optionUser}
                      dataPelaksana={props.dataPelaksana}
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
