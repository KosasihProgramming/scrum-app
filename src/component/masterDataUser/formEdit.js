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
import Swal from "sweetalert2";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

const optionPeran = [
  { text: "Scrum Master", value: 3439 },
  { text: "Developer", value: 3440 },
];

function FormEditUser(props) {
  const [open, setOpen] = useState(true);

  const [nama, setNama] = useState(props.data.Nama || "");
  const [email, setEmail] = useState(props.data.Email || "");
  const [password, setPassword] = useState(props.data.Password || "");
  const [password2, setPassword2] = useState("");
  const [peran, setPeran] = useState(
    props.data.Peran.length > 0
      ? getObjectByValue(optionPeran, parseInt(props.data.Peran[0].id)) || {}
      : null
  );

  const [files, setFiles] = useState([]);
  const [tim, setTim] = useState(
    props.data.Tim.length > 0
      ? getObjectByValue(props.optionTim, parseInt(props.data.Tim[0].id)) || {}
      : null
  );

  function getObjectByValue(array, value) {
    return array.find((obj) => obj.value === value);
  }

  const handleAdd = (e) => {
    e.preventDefault();

    let pass = "";
    if (password2 !== "") {
      pass = password2;
    } else {
      pass = password;
    }

    props.addData(nama, email, peran, files, pass, tim);
  };
  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  return (
    <div>
      <div className="p-6 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md">
        <div
          className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
        >
          <div className="w-[100%] gap-2 flex justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Nama</h4>
              <input
                type="text"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={nama}
                onChange={(e) => {
                  setNama(e.target.value);
                }}
              />
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Email</h4>
              <input
                type="text"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>{" "}
          </div>
          <div className="w-[100%] gap-2 flex justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Password Lama</h4>
              <input
                type="password"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Password Baru</h4>
              <input
                type="password"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={password2}
                onChange={(e) => {
                  if (password !== props.data.Password) {
                    Swal.fire({
                      icon: "error",
                      title: "Password Tidak Sama",
                      text: "Password Lama Tidak Sesuai, Perhatikan Kembali!",
                    });
                  } else {
                    setPassword2(e.target.value);
                  }
                }}
              />
            </div>{" "}
          </div>
          <div className="w-[100%] gap-2 flex  justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Tim</h4>

              <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999] w-[100%]">
                  <DropdownSearch
                    options={props.optionTim}
                    change={(item) => {
                      setTim(item);
                    }}
                    name={"Tim"}
                    value={tim}
                    isSearch={true}
                  />
                </div>
              </div>
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Peran</h4>

              <div className="w-full flex z-[999] justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
                <div className="flex items-center justify-center z-[999] w-[100%]">
                  <DropdownSearch
                    options={optionPeran}
                    change={(item) => {
                      setPeran(item);
                    }}
                    name={"Peran"}
                    value={peran}
                    isSearch={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Foto</h4>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
              />
            </div>
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

export default FormEditUser;
