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
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import DropdownSearch from "../features/dropdown";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Swal from "sweetalert2";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
function FormPeriksaGambar(props) {
  const [open, setOpen] = useState(true);
  const [judul, setJudul] = useState("");
  const [alasan, setAlasan] = useState("");
  const [capaian, setcapaian] = useState(0);
  const [bukti, setBukti] = useState({});
  const [link, setLink] = useState("");
  const [komentar, setKomentar] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePeriksa = (status) => {
    props.handleUpdate(komentar, status);
  };

  const showAlert = (url) => {
    Swal.fire({
      title: "Bukti Gambar",
      imageUrl: url,
      imageWidth: 600,
      imageHeight: 750,
      imageAlt: "Bukti",
      customClass: {
        popup: "bg-white text-blue-500",
        title: "text-2xl font-medium mb-4",
        image: "object-cover rounded-xl",
        confirmButton: "bg-blue-500 text-white hover:bg-blue-500",
      },
    });
  };

  const handleNextImage = () => {
    if (currentImageIndex < props.data.File.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div>
      <div
        className={`p-2 duration-500 flex w-full flex-col justify-between items-start px-2 mt-5 bg-white rounded-xl shadow-md `}
      >
        <div
          className={`flex w-full flex-col justify-start items-start rounded-xl mb-2  `}
        >
          {props.data.File.length > 0 && (
            <>
              <div className="w-[100%] flex flex-col justify-center items-center cursor-pointer">
                <img
                  src={props.data.File[currentImageIndex].url}
                  className="w-[15rem] h-[25rem] flex bg-cover object-cover  font-normal border-blue-500 border rounded-xl justify-start items-center  text-sm"
                  onClick={() => {
                    showAlert(props.data.File[currentImageIndex].url);
                  }}
                />
                {props.data.File.length > 1 && (
                  <>
                    <div className="flex mt-6 justify-center gap-24">
                      <div class="group relative flex justify-center gap-4 items-center">
                        <button
                          onClick={handlePrevImage}
                          disabled={currentImageIndex === 0}
                          className="min-w-[2rem] flex justify-center items-center cursor-pointer border border-blue-600 p-2 rounded-md shadow-md"
                        >
                          <FaArrowLeft class="text-base hover:scale-125 duration-200 hover:text-blue-500" />
                        </button>
                        <span
                          class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-blue-600 bg-blue-600 py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out text-white
  group-hover:scale-100"
                        >
                          Sebelumnya<span></span>
                        </span>
                      </div>
                      <div class="group relative flex justify-center gap-4 items-center">
                        <button
                          className="min-w-[2rem] flex justify-center items-center cursor-pointer border border-blue-600 p-2 rounded-md shadow-md"
                          onClick={handleNextImage}
                          disabled={
                            currentImageIndex === props.data.File.length - 1
                          }
                        >
                          <FaArrowRight class="text-base hover:scale-125 duration-200 hover:text-blue-500" />
                        </button>
                        <span
                          class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-blue-600 bg-blue-600 py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out text-white
  group-hover:scale-100"
                        >
                          Selanjutnya<span></span>
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {props.data.Link !== "" && (
            <>
              <div className="w-[100%] gap-2 flex  justify-between items-center  px-4 mt-5 mb-5 ">
                <a
                  class="bukti-link"
                  target="_blank"
                  rel="noreferrer"
                  href={props.data.Link}
                >
                  <p>Lihat Bukti Link</p>
                </a>
              </div>
            </>
          )}
          <div className="w-[100%] gap-2 flex  justify-between items-center  px-2 ">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2  ">
              <h4 className="font-semibold text-sm">Keterangan</h4>
              <div className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[2rem] text-sm">
                {props.data.Keterangan}
              </div>
            </div>
          </div>
          <div className="w-[100%] gap-2 flex  justify-between items-center  px-2">
            <div className="w-[100%] gap-2 flex flex-col justify-start items-start p-2  ">
              <h4 className="font-semibold text-sm"> Berikan Komentar</h4>
              <input
                type="text"
                className="w-full flex p-2 bg-white font-normal border-blue-500 border rounded-xl justify-start items-center h-[2rem] text-sm"
                value={komentar}
                onChange={(e) => {
                  setKomentar(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="w-[100%] gap-2 flex  justify-between items-center p-2  ">
      
                <button
                  class="button-insert ml-5"
                  onClick={() => handlePeriksa(false)}
                >
                  Sesuai
                  <MdOutlineSave className="text-white text-xl" />
                </button>
                <button
                  class="button-insert ml-5 text-xs"
                  onClick={() => handlePeriksa(true)}
                >
                  Perlu Revisi
                  <MdOutlineSave className="text-white text-xl" />
                </button>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPeriksaGambar;
