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
function FormAddPBISprint(props) {
  const [open, setOpen] = useState(true);
  const [judul, setJudul] = useState("");
  const [alasan, setAlasan] = useState("");
  const [target, setTarget] = useState("");
  const [product, setProduct] = useState({});

  const [plan, setPlan] = useState(false);
  const optionPerspektif = [
    { text: "Customer", value: 3319 },
    { text: "Proses", value: 3320 },
    { text: "Learn & Growth", value: 3321 },
  ];
  const handleToggle = () => {
    setPlan(!plan);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    props.addData(target, plan, product);

    const data = {
      target,
      plan,
      product,
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
          <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
            <h4 className="font-semibold text-sm">PBI Product</h4>

            <div className="w-[100%] flex z-[999999] bg-white justify-start gap-3 items-center p-1 border border-blue-600 rounded-xl">
              <div className="flex items-center justify-center z-[999999] w-[100%]">
                <DropdownSearch
                  options={props.optionProduct}
                  change={(item) => {
                    setProduct(item);
                  }}
                  name={"PBI Product"}
                  isSearch={true}
                />
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex  justify-between items-center p-2 gap-4 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">Target</h4>
              <input
                type="number"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[3rem] text-sm"
                value={target}
                onChange={(e) => {
                  setTarget(e.target.value);
                }}
              />
            </div>
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2 gap-4 ">
              <h4 className="font-semibold text-sm">PBI Unplan ?</h4>
              <div className="w-[30%] flex z-[99999] bg-white justify-center gap-3 items-center p-3 border border-blue-600 rounded-xl">
                <div className="checkbox-wrapper-44">
                  <label className="toggleButton">
                    <input
                      type="checkbox"
                      checked={plan}
                      onChange={handleToggle}
                    />
                    <div>
                      <svg viewBox="0 0 44 44">
                        <path
                          transform="translate(-2.000000, -2.000000)"
                          d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758"
                        ></path>
                      </svg>
                    </div>
                  </label>
                </div>
              </div>
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

export default FormAddPBISprint;
