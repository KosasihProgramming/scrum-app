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

const optionStatus = [
  { text: "Berjalan", value: 3306 },
  { text: "Berlalu", value: 3305 },
  { text: "Rencana", value: 3304 },
];

const optionBulan = [
  { text: "Januari", value: 3307 },
  { text: "Februari", value: 3308 },
  { text: "Maret", value: 3309 },
  { text: "April", value: 3310 },
  { text: "Mei", value: 3311 },
  { text: "Juni", value: 3312 },
  { text: "Juli", value: 3313 },
  { text: "Agustus", value: 3314 },
  { text: "September", value: 3315 },
  { text: "Oktober", value: 3316 },
  { text: "November", value: 3317 },
  { text: "Desember", value: 3318 },
];
function FormEditProduct(props) {
  const [open, setOpen] = useState(true);
  const [judul, setJudul] = useState(props.data.Judul || "");
  const [goal, setGoal] = useState(props.data.ProductGoal || "");
  const [target, setTarget] = useState(props.data.TargetBobot || "");
  const [bulan, setBulan] = useState(
    getObjectByValue(optionBulan, props.data.Bulan[0].id) || {}
  );
  const [status, setStatus] = useState(
    getObjectByValue(optionStatus, props.data.Status[0].id) || {}
  );
  const [tim, setTim] = useState(
    getObjectByValue(props.optionTim, props.data.Tim[0]?.id) || {}
  );
  const [tanggalMulai, setTanggalMulai] = useState(
    dayjs(props.data.TanggalMulai, "YYYY-MM-DD")
  );
  const [tanggalBerakhir, setTanggalBerakhir] = useState(
    dayjs(props.data.TanggalBerakhir, "YYYY-MM-DD")
  );

  function getObjectByValue(array, value) {
    return array.find((obj) => obj.value === value);
  }

  const handleChangeDate = (name, date) => {
    if (name === "mulaiTanggal") {
      setTanggalMulai(date);
    } else {
      setTanggalBerakhir(date);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    props.addData(
      judul,
      target,
      goal,
      tim,
      status,
      bulan,
      tanggalMulai.format("YYYY-MM-DD"),
      tanggalBerakhir.format("YYYY-MM-DD")
    );
  };

  return (
    <div>
      <div className="p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md">
        <div className="flex w-full flex-col justify-start items-start rounded-xl mb-2">
          <div className="w-full gap-2 flex justify-between items-center p-2 gap-4">
 
            <div className="w-full gap-2 flex flex-col justify-start items-start p-2 gap-4">
              <h4 className="font-semibold text-sm">Goal</h4>
              <input
                type="text"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full gap-2 flex justify-between items-center p-2 gap-4">
            <div className="w-full gap-2 flex flex-col justify-start items-start p-2 gap-4">
              <h4 className="font-semibold text-sm">Target</h4>
              <input
                type="text"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div className="w-full gap-2 flex flex-col justify-start items-start p-2 gap-4">
              <h4 className="font-semibold text-sm">Tim</h4>
              <div className="w-full flex z-[99999] bg-white justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <DropdownSearch
                  options={props.optionTim}
                  change={(item) => setTim(item)}
                  name={"Tim"}
                  isSearch={true}
                  value={tim}
                />
              </div>
            </div>
          </div>
          <div className="w-full gap-2 flex justify-between items-center p-2 gap-4">
            <div className="w-full gap-2 flex flex-col justify-start items-start p-2 gap-4">
              <h4 className="font-semibold text-sm">Status</h4>
              <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <DropdownSearch
                  options={optionStatus}
                  change={(item) => setStatus(item)}
                  value={status}
                  name={"Status"}
                  isSearch={false}
                />
              </div>
            </div>
            <div className="w-full gap-2 flex flex-col justify-start items-start p-2 gap-4">
              <h4 className="font-semibold text-sm">Bulan</h4>
              <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <DropdownSearch
                  options={optionBulan}
                  change={(item) => setBulan(item)}
                  value={bulan}
                  name={"Bulan"}
                  isSearch={true}
                />
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex  justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Tanggal Mulai</h4>
              <Space direction="vertical" size={12}>
                <DatePicker
                  defaultValue={tanggalMulai}
                  format={dateFormatList}
                  onChange={(date) => handleChangeDate("mulaiTanggal", date)}
                  className="bg-white border w-[19rem] rounded-xl border-blue-500  p-3 hover:text-blue-800 active:text-blue-800"
                />
              </Space>
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Tanggal Akhir</h4>

              <Space direction="vertical" size={12}>
                <DatePicker
                  defaultValue={tanggalBerakhir}
                  format={dateFormatList}
                  onChange={(date) => handleChangeDate("akhirTanggal", date)}
                  className="bg-white border w-[19rem] rounded-xl border-blue-500  p-3 hover:text-blue-800 active:text-blue-800"
                />
              </Space>
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

export default FormEditProduct;
