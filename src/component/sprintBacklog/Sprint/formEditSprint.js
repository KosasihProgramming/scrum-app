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
import DropdownSearch from "../../features/dropdown";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

const optionStatus = [
  { text: "Berjalan", value: 3394 },
  { text: "Berlalu", value: 3392 },
  { text: "Rencana", value: 3393 },
];

const optionUrutan = [
  { text: "Ke-1", value: 1 },
  { text: "Ke-2", value: 2 },
  { text: "Ke-3", value: 3 },
  { text: "Ke-4", value: 4 },
];

function FormEditSprint(props) {
  const [open, setOpen] = useState(true);
  const [urutan, setUrutan] = useState(
    getObjectByValue(optionUrutan, parseInt(props.data.UrutanSprint)) || {}
  );
  const [status, setStatus] = useState(
    getObjectByValue(optionStatus, props.data.Status[0].id) || {}
  );
  const [tim, setTim] = useState(
    getObjectByValue(props.optionTim, props.data.Teams[0].id) || {}
  );
  const [product, setProduct] = useState(
    getObjectByValue(props.optionProduct, props.data.ProductBacklog[0].id) ||
      {}
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
      console.log(date)
      setTanggalMulai(date);
    } else {
      setTanggalBerakhir(date);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    props.addData(tim, status, urutan, product, tanggalMulai, tanggalBerakhir);
  };

  return (
    <div>
      <div className="p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md">
        <div className="flex w-full flex-col justify-start items-start rounded-xl mb-2">
          <div className="w-[100%] gap-2 flex  justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Sprint Backlog</h4>

              <div className="w-[100%] flex z-[99999] bg-white justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999999] w-[100%]">
                  <DropdownSearch
                    options={props.optionProduct}
                    change={(item) => {
                      setProduct(item);
                    }}
                    name={"Product Backlog"}
                    isSearch={true}
                    value={product}
                  />
                </div>
              </div>
            </div>
            {/* <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Tim</h4>

              <div className="w-[100%] flex z-[99999] bg-white justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999999] w-[100%]">
                  <DropdownSearch
                    options={props.optionTim}
                    change={(item) => {
                      setTim(item);
                    }}
                    name={"Tim"}
                    isSearch={true}
                    value={tim}
                  />
                </div>
              </div>
            </div> */}
          </div>

          <div className="w-[100%] gap-2 flex  justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Sprint Ke</h4>

              <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999] w-[100%]">
                  <DropdownSearch
                    options={optionUrutan}
                    change={(item) => {
                      setUrutan(item);
                    }}
                    name={"Urutan Sprint"}
                    value={urutan}
                    isSearch={true}
                  />
                </div>
              </div>
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Status</h4>

              <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999] w-[100%]">
                  <DropdownSearch
                    options={optionStatus}
                    change={(item) => {
                      setStatus(item);
                    }}
                    name={"Status"}
                    value={status}
                    isSearch={false}
                  />
                </div>
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

export default FormEditSprint;
