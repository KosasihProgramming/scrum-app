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
import Swal from "sweetalert2";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
function FormAddUser(props) {
  const [open, setOpen] = useState(true);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [peran, setPeran] = useState({});
  const [product, setProduct] = useState({});
  const [files, setFiles] = useState([]);
  const [tim, setTim] = useState({});

  const optionPeran = [
    { text: "Scrum Master", value: 3439 },
    { text: "Developer", value: 3440 },
  ];

  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (password !== password2) {
      Swal.fire({
        icon: "error",
        title: "Password Tidak Sama",
        text: "Konfirmasi Password Harus Sama Dengan Password!",
      });

      return [];
    }
    props.addData(nama, email, peran, files, password, tim);

    const data = {
      nama,
      email,
      peran,
      files,
      password,
      tim,
    };
    console.log(data);
  };

  function convertDateFormat(dateString) {
    // Memisahkan string tanggal berdasarkan tanda "-"
    const [year, month, day] = dateString.split("-");

    // Menggabungkan kembali dalam format DD/MM/YYYY
    return `${day}/${month}/${year}`;
  }
  console.log(props.optionTim, "data Tim");
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
              <h4 className="font-semibold text-sm">Password</h4>
              <input
                type="password"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="w-[100%]  flex flex-col justify-start items-start p-2">
              <h4 className="font-semibold text-sm">
                Konfirmasi Password{"  "}
                <span
                  className={`${
                    password == password2 ? "text-teal-600" : "text-red-500"
                  }`}
                >
                  {password == password2 ? "*Sama" : "*Tidak Sama"}
                </span>
              </h4>
              <input
                type="password"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value);
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

        <button class="button-insert ml-5" onClick={handleAdd}>
          Simpan Data
          <MdOutlineSave className="text-white text-xl" />
        </button>
      </div>
    </div>
  );
}

export default FormAddUser;
