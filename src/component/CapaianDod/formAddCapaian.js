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
import DropdownSearch from "../features/dropdown";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function FormAddCapaian(props) {
  const [open, setOpen] = useState(true);
  const [judul, setJudul] = useState("");
  const [alasan, setAlasan] = useState("");
  const [capaian, setCapaian] = useState(0);
  const [bukti, setBukti] = useState({});
  const [link, setLink] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState({});
  const [isGambar, setIsGambar] = useState(false);

  const dataOption = props.optionUser.map((item) => {
    return {
      value: item.id,
      text: item.Nama[0].value,
      target: item.Target,
    };
  });
  const handleAdd = (e) => {
    e.preventDefault();
    props.addData(capaian, keterangan, isGambar, link, files, user);

    const data = {
      capaian,
      keterangan,
      bukti,
      link,
      files,
      user,
    };
    console.log(data);
  };

  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    setIsGambar(true);
  };

  return (
    <div>
      <div
        className={`p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md `}
      >
        <div
          className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
        >
          <div className="w-[100%] gap-2 flex justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Judul</h4>
              <div className="w-full flex p-2 bg-white font-normal border-emerald-500 border rounded-xl justify-start items-center h-[3rem] text-sm">
                {props.dataDod.Judul[0].value}
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Target Capaian</h4>
              <div className="w-full flex p-2 bg-white font-normal border-emerald-500 border rounded-xl justify-start items-center h-[3rem] text-sm">
                {props.dataDod.Target} {props.dataDod.Satuan[0].value}
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Capaian Saat Ini</h4>
              <div className="w-full flex p-2 bg-white font-normal border-emerald-500 border rounded-xl justify-start items-center h-[3rem] text-sm">
                {props.totalCapaian} {props.dataDod.Satuan[0].value}
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex justify-between items-center p-2 px-4 gap-4 ">
            <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
              <div className="flex items-center justify-center z-[999] w-[100%]">
                <DropdownSearch
                  options={dataOption}
                  change={(item) => {
                    setUser(item);
                  }}
                  name={"Pelaksana"}
                  isSearch={false}
                />
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Capaian</h4>
              <input
                type="number"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={capaian}
                onChange={(e) => {
                  setCapaian(e.target.value);
                }}
              />
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Keterangan</h4>
              <input
                type="text"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={keterangan}
                onChange={(e) => {
                  setKeterangan(e.target.value);
                }}
              />
            </div>{" "}
          </div>
          <div className="w-[100%] gap-2 flex justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Bukti Gambar</h4>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
              />
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Link Bukti</h4>
              <input
                type="text"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
              />
            </div>{" "}
          </div>
          {/* Image Preview Section */}
          <div className="w-[100%] gap-2 flex flex-wrap justify-start items-start p-2 gap-4 ">
            {files.map((file, index) => (
              <div key={index} className="w-[150px] h-[150px] p-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`file-preview-${index}`}
                  className="w-full h-full object-cover rounded-xl border border-gray-300"
                />
              </div>
            ))}
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

export default FormAddCapaian;
