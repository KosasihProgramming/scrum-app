import React, { useState } from "react";
import "dayjs/locale/id";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import { MdOutlineSave } from "react-icons/md";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import DropdownSearch from "../../features/dropdown";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
function FormAddPelaksana(props) {
  const [open, setOpen] = useState(true);
  const [target, setTarget] = useState("");
  const [waktu, setWaktu] = useState("");
  const [user, setUser] = useState(null);
  const [satuan, setSatuan] = useState(props.dataDod.Satuan[0]);
  const handleAdd = (e) => {
    e.preventDefault();

    props.addData(user, target, waktu);

    const data = {
      target,
      user,
    };
  };

  function convertDateFormat(dateString) {
    // Memisahkan string tanggal berdasarkan tanda "-"
    const [year, month, day] = dateString.split("-");

    // Menggabungkan kembali dalam format DD/MM/YYYY
    return `${day}/${month}/${year}`;
  }
  console.log(props.data, "data Pelaksana bro");
  return (
    <div>
      <div
        className={`p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md `}
      >
        <div
          className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
        >
          <div className="w-[100%] gap-2 flex flex-col justify-start items-start px-2 px-4 gap-4 ">
            <h4 className="font-semibold text-sm">User</h4>

            <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
              <div className="flex items-center justify-center z-[999] w-[100%]">
                <DropdownSearch
                  options={props.optionUser}
                  change={(item) => {
                    setUser(item);
                  }}
                  name={"User"}
                  isSearch={false}
                />
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex  justify-between items-center px-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Target</h4>
              <div className="w-full flex gap-4 justify-start items-center">
                <input
                  type="number"
                  className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                  value={target}
                  onChange={(e) => {
                    setTarget(e.target.value);
                  }}
                />
                <div className="w-[10rem] flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm">
                  {satuan.value}
                </div>
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex  justify-between items-center px-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Durasi</h4>
              <div className="w-full flex gap-4 justify-start items-center">
                <input
                  type="number"
                  className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                  value={waktu}
                  onChange={(e) => {
                    setWaktu(e.target.value);
                  }}
                />
                <div className="w-[10rem] flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm">
                  Menit
                </div>
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex  justify-between items-center py-2 px-4 gap-4  ">
            <h4 className="text-base font-medium text-blue-600 ">
              List Pelaksana
            </h4>
          </div>

          <div className="w-[100%] gap-2 flex  justify-start flex-col items-center py-2 px-4 gap-4 ">
            {props.data.map((data) => (
              <>
                <div className="w-full py-2 px-4 flex justify-start rounded-xl shadow-md border border-blue-600 gap-6">
                  <img
                    className="w-[3rem] h-[3rem] rounded-full flex justify-center items-center object-cover "
                    src="https://www.exabytes.co.id/blog/wp-content/uploads/2021/11/Mystery-1024x514.png"
                  />
                  <div className="flex w-full justify-between  items-center gap-2 ">
                    <div className="flex justify-between flex-col items-start gap-2 ">
                      <h4 className="font-semibold text-sm">
                        {/* {data.Nama[0].value} */}
                      </h4>
                      <div className="flex justify-start items-center gap-6">
                        <div className="text-xs font-normal flex justify-center items-center p-1 px-4 bg-blue-50 text-blue-700 rounded-md border  border-blue-700">
                          {data.Target} {satuan.value}
                        </div>
                        <div className="text-xs font-normal flex justify-center items-center p-1 px-4 bg-blue-50 text-blue-700 rounded-md border  border-blue-700">
                          {data.Durasi} Menit
                        </div>
                      </div>
                    </div>
                    <div class="group relative">
                      <button
                        onClick={() => props.delete(data.id)}
                        className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-red-600 hover:scale-125 bg-red-100 "
                      >
                        <MdDeleteOutline class="text-lg  duration-200 text-red-700" />
                      </button>
                      <span
                        class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-red-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                      >
                        Hapus<span></span>
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>

        <button class="button-insert ml-5" onClick={handleAdd}>
          Simpan Data
          <MdOutlineSave className="text-white text-xl" />
        </button>
      </div>
    </div>
  );
}

export default FormAddPelaksana;
