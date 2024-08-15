import React, { useState, useEffect } from "react";
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
import DropdownSearch from "../features/dropdown";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
const optionPerspektif = [
  { text: "Customer", value: 3319 },
  { text: "Proses", value: 3320 },
  { text: "Learn & Growth", value: 3321 },
];

const optionJenis = [
  { text: "Standard", value: 3302 },
  { text: "Innovation", value: 3303 },
];
function FormEditPBIProduct(props) {
  const [open, setOpen] = useState(true);
  const [judul, setJudul] = useState(props.data.Judul || "");
  const [alasan, setAlasan] = useState(props.data.Alasan || "");
  const [target, setTarget] = useState(props.data.Bobot || "");
  const [jenis, setJenis] = useState(
    getObjectByValue(optionJenis, props.data.Jenis[0].id) || {}
  );
  const [perspektif, setPerspektif] = useState(
    getObjectByValue(optionPerspektif, props.data.Perspektif[0].id) || {}
  );

  function getObjectByValue(array, value) {
    return array.find((obj) => obj.value === value);
  }

  const handleAdd = (e) => {
    e.preventDefault();
    props.addData(judul, target, alasan, perspektif, jenis);
  };

  console.log(getObjectByValue(optionJenis, props.data.Jenis[0].id), "jenis");
  console.log(
    getObjectByValue(optionPerspektif, props.data.Perspektif[0].id),
    "pers"
  );

  return (
    <div>
      <div className="p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md">
        <div
          className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
        >
          <div className="w-[100%] gap-2 flex  justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Judul</h4>
              <input
                type="text"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={judul}
                onChange={(e) => {
                  setJudul(e.target.value);
                }}
              />
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Alasan</h4>
              <input
                type=""
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={alasan}
                onChange={(e) => {
                  setAlasan(e.target.value);
                }}
              />
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
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Perspektif</h4>

              <div className="w-[100%] flex z-[99999] bg-white justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999999] w-[100%]">
                  <DropdownSearch
                    options={optionPerspektif}
                    change={(item) => {
                      setPerspektif(item);
                    }}
                    name={"Perspektif"}
                    value={perspektif}
                    isSearch={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-[100%] gap-2 flex  justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Jenis PBI</h4>

              <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999] w-[100%]">
                  <DropdownSearch
                    options={optionJenis}
                    change={(item) => {
                      setJenis(item);
                    }}
                    name={"Jenis PBI"}
                    value={jenis}
                    isSearch={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="button-insert ml-5" onClick={handleAdd}>
          Simpan Data
          <MdOutlineSave className="text-white text-xl" />
        </button>
      </div>
    </div>
  );
}

export default FormEditPBIProduct;
