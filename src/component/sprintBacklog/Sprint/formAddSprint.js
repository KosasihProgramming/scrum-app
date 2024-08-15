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
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
function FormAddSprint(props) {
  const [open, setOpen] = useState(true);
  const [judul, setJudul] = useState("");
  const [goal, setGoal] = useState("");
  const [target, setTarget] = useState("");
  const [urutan, setUrutan] = useState({});
  const [status, setStatus] = useState({});
  const [product, setProduct] = useState({});
  const [tim, setTim] = useState({});
  const [tanggalMulai, setTanggalMulai] = useState(
    dayjs().locale("id").format("DD/MM/YYYY")
  );
  const [tanggalBerakhir, setTanggalBerakhir] = useState(
    dayjs().locale("id").format("DD/MM/YYYY")
  );

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

  const handleChangeDate = (name, date) => {
    const dayjsDate = dayjs(date);

    if (!dayjsDate.isValid()) {
      return;
    }
    if (name == "mulaiTanggal") {
      const formattedDate = dayjsDate.format("YYYY-MM-DD");
      setTanggalMulai(formattedDate);
    } else {
      const formattedDate = dayjsDate.format("YYYY-MM-DD");
      setTanggalBerakhir(formattedDate);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    props.addData(tim, status, urutan, product, tanggalMulai, tanggalBerakhir);

    const data = {
      tim,
      status,
      urutan,
      product,
      tanggalMulai,
      tanggalBerakhir,
    };
    console.log(data);
  };

  function convertDateFormat(dateString) {
    // Memisahkan string tanggal berdasarkan tanda "-"
    const [year, month, day] = dateString.split("-");

    // Menggabungkan kembali dalam format DD/MM/YYYY
    return `${day}/${month}/${year}`;
  }
  return (
    <div>
      <div
        className={`p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md `}
      >
        <div
          className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
        >
          <div className="w-[100%] gap-2 flex  justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Product Backlog</h4>

              <div className="w-[100%] flex z-[99999] bg-white justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999999] w-[100%]">
                  <DropdownSearch
                    options={props.optionProduct}
                    change={(item) => {
                      setProduct(item);
                    }}
                    name={"Product Backlog"}
                    isSearch={true}
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
                  defaultValue={dayjs(
                    convertDateFormat(tanggalMulai),
                    dateFormatList[0]
                  )}
                  format={dateFormatList}
                  onChange={(date) => {
                    handleChangeDate("mulaiTanggal", date);
                  }}
                  className="bg-white border w-[19rem] rounded-xl border-blue-500  p-3 hover:text-blue-800 active:text-blue-800"
                />
              </Space>
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Tanggal Akhir</h4>

              <Space direction="vertical" size={12}>
                <DatePicker
                  defaultValue={dayjs(
                    convertDateFormat(tanggalBerakhir),
                    dateFormatList[0]
                  )}
                  format={dateFormatList}
                  onChange={(date) => {
                    handleChangeDate("akhirTanggal", date);
                  }}
                  className="bg-white border w-[19rem] rounded-xl border-blue-500  p-3 hover:text-blue-800 active:text-blue-800"
                />
              </Space>
            </div>
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

export default FormAddSprint;
