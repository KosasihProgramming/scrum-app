import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import axios from "axios";
import Swal from "sweetalert2";
import Filter from "../../features/filter";
import AOS from "aos";
import "aos/dist/aos.css";
import FormAddPelaksana from "./formAddPelaksana";
import { useLoading } from "../../features/context/loadContext";
export default function ModalAddPelaksana(props) {
  const setOpen = () => {
    props.setOpen(false);
  };
  const [data, setData] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const { setIsLoad } = useLoading();

  useEffect(() => {
    getDataAnggota();

    AOS.init({ duration: 700 });
  }, []);
  const getDataAnggota = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://103.181.182.230:6060/api/database/rows/table/634/${props.idSprint}/?user_field_names=true`,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });

      console.log(response.data, "all data Angota");
      const allData = response.data;

      // Mengambil array AnggotaSprint
      const anggotaSprint = allData.AnggotaSprint;

      // Memetakan AnggotaSprint untuk mendapatkan data user masing-masing
      const anggotaDetailsPromises = anggotaSprint.map((anggota) =>
        getSingleDataUser(anggota.id)
      );

      // Menunggu semua promise selesai dan mengumpulkan hasilnya
      const anggotaDetails = await Promise.all(anggotaDetailsPromises);

      // Menambahkan informasi tambahan dari getSingleDataUser ke anggotaSprint
      const combinedData = anggotaSprint.map((anggota, index) => ({
        ...anggota,
        userDetails: anggotaDetails[index],
      }));

      console.log(combinedData, "combined data AnggotaSprint dengan details");
      const dataOption = combinedData.map((a) => {
        return { value: a.id, text: a.value };
      });
      setDataUser(dataOption);
      props.setGet();
      return combinedData;
    } catch (error) {
      console.log(error);
    }
  };
  const getSingleDataUser = async (id) => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://103.181.182.230:6060/api/database/rows/table/633/${id}/?user_field_names=true`,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });

      console.log(response.data, "data Anggota Sprint");
      const userData = response.data;

      return userData;
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdd = async (user, target, waktu) => {
    try {
      // Validate the data
      if (!user || target == 0) {
        Swal.fire({
          icon: "error",
          title: "Data Tidak Valid",
          text: "Semua field wajib diisi dan target tidak boleh 0!",
        });
        return;
      } else {
        setIsLoad(true);
        const data = {
          Target: parseInt(target),
          Durasi: waktu,
          DodSprint: [parseInt(props.id)], // Ensure this is an array
          UserId: [parseInt(user.value)], // Ensure this is an array
          Sprint: [parseInt(props.idSprint)],
        };

        console.log(data, "Data being sent");

        const response = await axios({
          method: "POST",
          url: "http://103.181.182.230:6060/api/database/rows/table/648/?user_field_names=true",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
            "Content-Type": "application/json",
          },
          data: data,
        });
        setIsLoad(false);

        props.getData(props.id);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data successfully saved.",
        });
        console.log("Data successfully saved", response);
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
            "http://103.181.182.230:6060/api/database/rows/table/648/" +
            id +
            "/",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
          },
        });
        setIsLoad(false);

        props.getData(props.id);
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
            className="relative transform overflow-hidden rounded-lg w-[45rem]  h-[95vh] overflow-y-auto text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-slate-100  pb-8  w-[45rem]">
              <div className="flex items-start">
                <div className=" text-center w-full  ">
                  <div className=" w-full flex justify-center">
                    <DialogTitle
                      as="h3"
                      className="text-xl font-semibold leading-6 text-white w-[95%]  py-3 mt-8 rounded-xl bg-blue-600 "
                    >
                      Tambah Pelaksana Dodt
                    </DialogTitle>
                  </div>
                  <div className=" px-4">
                    <FormAddPelaksana
                      addData={handleAdd}
                      optionUser={dataUser}
                      data={props.data}
                      dataDod={props.dataDod}
                      delete={handleDelete}
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
