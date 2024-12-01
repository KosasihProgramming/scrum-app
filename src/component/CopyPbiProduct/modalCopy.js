import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import axios from "axios";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLoading } from "../features/context/loadContext";
import FormAddCopyPbiProduct from "./formAddCopy";
import Filter from "../features/filter";
export default function ModalCopyPbiProduct(props) {
  const setOpen = () => {
    props.setOpen(false);
  };
  const [data, setData] = useState([]);
  const { setIsLoad } = useLoading();

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const handleAdd = async (idProduct) => {
    try {
      // Validate the data
      if (!idProduct) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      }

      setIsLoad(true);

      // Proses asinkron menggunakan Promise.all
      const [dataDod, responseData] = await Promise.all([
        getDod().then((dataDod) => {
          console.log(dataDod, "Dod Copy");
          return dataDod;
        }),
        (async () => {
          const data = {
            Judul: props.data.Judul,
            Alasan: props.data.Alasan,
            Jenis: [parseInt(props.data.Jenis[0].id)], // Ensure this is an array
            Bobot: parseInt(props.data.Bobot),
            ProductBacklog: [parseInt(idProduct.value)], // Ensure this is an array
            Perspektif: [parseInt(props.data.Perspektif[0].id)], // Ensure this is an array
          };

          console.log(data, "Data being sent");

          const response = await axios({
            method: "POST",
            url: "http://103.181.182.230:6060/api/database/rows/table/636/?user_field_names=true",
            headers: {
              Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
              "Content-Type": "application/json",
            },
            data: data,
          });

          return response.data;
        })(),
      ]);

      // Pastikan handleAddDod dijalankan setelah semua data tersedia
      await Promise.all(
        dataDod.map((dod) =>
          handleAddDod(
            dod.Judul,
            dod.Target,
            dod.Satuan,
            idProduct,
            responseData
          )
        )
      );

      setIsLoad(false);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data successfully Copied.",
      });
      console.log("Data successfully saved");
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

  const handleAddDod = async (judul, target, satuan, idProduct, pbi) => {
    try {
      // Validate the data
      if (!judul || !satuan || !target) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi!",
        });
        return;
      }

      const data = {
        Judul: judul,
        Satuan: [parseInt(satuan[0].id)], // Ensure this is an array
        Target: target,
        ProductBacklog: [parseInt(idProduct.value)], // Ensure this is an array
        PBIProduct: [parseInt(pbi.id)], // Ensure this is an array
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

      alert("Data DOD successfully saved!");

      console.log("Data Dod successfully saved", response);
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

  const getDod = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "ProductBacklog",
          value: `${props.idProduct}`,
        },
        {
          type: "link_row_has",
          field: "PBIProduct",
          value: `${props.data.id}`,
        },
      ];
      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/637/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;
      return allData;
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(props.dataUser, "option User Anggota");

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
            className="relative transform overflow-hidden rounded-lg h-[95vh] overflow-y-auto text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-slate-100  h-[95vh] pb-8   w-[45rem]">
              <div className="flex items-start">
                <div className=" text-center w-full  ">
                  <div className=" w-full flex justify-center">
                    <DialogTitle
                      as="h3"
                      className="text-xl font-semibold leading-6 text-white w-[95%]  py-3 mt-8 rounded-xl bg-blue-600 "
                    >
                      Copy PBI Product
                    </DialogTitle>
                  </div>
                  <div className=" px-4">
                    <FormAddCopyPbiProduct
                      addData={handleAdd}
                      dataProduct={props.dataProduct}
                      data={props.data}
                      open={props.open}
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
