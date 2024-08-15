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
import Swal from "sweetalert2";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
function FormAddDodSprint(props) {
  const [open, setOpen] = useState(true);
  const [target, setTarget] = useState("");
  const [dod, setDod] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();

    if (dod.target < target) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Target Dod Sprint Tidak Boleh Melebihi Target Dod Product`,
      });
    } else {
      props.addData(target, dod);

      const data = {
        target,
        dod,
      };
    }
  };

  function convertDateFormat(dateString) {
    // Memisahkan string tanggal berdasarkan tanda "-"
    const [year, month, day] = dateString.split("-");

    // Menggabungkan kembali dalam format DD/MM/YYYY
    return `${day}/${month}/${year}`;
  }
  console.log(dod);
  return (
    <div>
      <div
        className={`p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md `}
      >
        <div
          className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
        >
          <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
            <h4 className="font-semibold text-sm">Dod Product</h4>

            <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
              <div className="flex items-center justify-center z-[999] w-[100%]">
                <DropdownSearch
                  options={props.optionDod}
                  change={(item) => {
                    setDod(item);
                  }}
                  name={"Dod Product"}
                  isSearch={false}
                />
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex  justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Target</h4>
              <input
                type=""
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={target}
                onChange={(e) => {
                  setTarget(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        {dod !== null && (
          <>
            <div
              className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
            >
              <div className="w-[100%] gap-2 flex flex-col  justify-between items-center p-2 gap-4 ">
                <div className="w-[100%]  flex flex-col justify-start items-start p-2 gap-4 ">
                  <h4 className="font-semibold text-sm">Target Dod Product</h4>
                  <div className="w-[40%] flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm">
                    {dod.target} {dod.satuan.value}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <button class="button-insert ml-5" onClick={handleAdd}>
          Simpan Data
          <MdOutlineSave className="text-white text-xl" />
        </button>
      </div>
    </div>
  );
}

export default FormAddDodSprint;
