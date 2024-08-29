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
import Filter from "../features/filter";
import FormAddCopyPbiSprint from "./formAddCopy";
export default function ModalCopyPbiSprint(props) {
  const setOpen = () => {
    props.setOpen(false);
  };
  const [data, setData] = useState([]);
  const { setIsLoad } = useLoading();

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const handleAdd = async (idSprint) => {
    try {
      // Validate the data
      if (!idSprint) {
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
            Bobot: parseInt(props.data.Bobot),
            Unplan: props.data.Unplan,
            Sprint: [parseInt(idSprint.value)], // Ensure this is an array
            PBIProduct: [props.data.PBIProduct[0].id], // Ensure this is an arrayray
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

          return response.data;
        })(),
      ]);

      // Pastikan handleAddDod dijalankan setelah semua data tersedia
      await Promise.all(
        dataDod.map((dod) =>
          handleAddDod(dod.Target, dod.DodProduct, idSprint, responseData)
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

  const handleAddDod = async (target, dod, idSprint, idPbi) => {
    try {
      const data = {
        Target: target,
        DodProduct: [parseInt(dod[0].id)], // Ensure this is an array
        PBISprint: [parseInt(idPbi.id)], // Ensure this is an array
        Sprint: [parseInt(idSprint.value)], // Ensure this is an array
      };

      console.log(data, "Data dod being sent");

      const response = await axios({
        method: "POST",
        url: "http://202.157.189.177:8080/api/database/rows/table/578/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          "Content-Type": "application/json",
        },
        data: data,
      });

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
          field: "Sprint",
          value: `${props.idSprint}`,
        },
        {
          type: "link_row_has",
          field: "PBISprint",
          value: `${props.data.id}`,
        },
        { type: "lower_than", field: "Persentase", value: "100" },
      ];
      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://202.157.189.177:8080/api/database/rows/table/578/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;
      return allData;
    } catch (error) {
      console.log(error.message);
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
                      Copy PBI Sprint
                    </DialogTitle>
                  </div>
                  <div className=" px-4">
                    <FormAddCopyPbiSprint
                      addData={handleAdd}
                      dataSprint={props.dataSprint}
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
