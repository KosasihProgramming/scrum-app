import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Filter from "../features/filter";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdDeleteOutline } from "react-icons/md";
import { TbEyeSearch } from "react-icons/tb";
import { ImFileText2 } from "react-icons/im";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdDoubleArrow } from "react-icons/md";
import animationData from "../../styles/blue.json";
import Lottie from "react-lottie";
import { useLoading } from "../features/context/loadContext";
import dayjs from "dayjs";
import LoaderData from "../features/loaderData";
function TableCapaian(props) {
  const peran = sessionStorage.getItem("peran");
  const [tanggal, setTanggal] = useState(
    dayjs().locale("id").format("YYYY/MM/DD")
  );
  const { setIsLoad } = useLoading();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  const getDataCapaian = async (item) => {
    console.log(item);
    try {
      let filters = [];
      if (!props.isPersonal) {
        filters = [
          {
            type: "link_row_has",
            field: "DodSprint",
            value: `${item.DodSprint[0].id}`,
          },
        ];
      } else {
        filters = [
          {
            type: "link_row_has",
            field: "DodSprint",
            value: `${item.DodSprint[0].id}`,
          },
          {
            type: "link_row_has",
            field: "Pelaksana",
            value: `${item.Pelaksana[0].id}`,
          },
        ];
      }

      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/647/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log(response.data.results, "dod");
      const data = response.data.results;

      props.setDataCapaian(data);

      // Hitung total capaian
      const totalCapaian = data.reduce((total, item) => {
        return total + parseInt(item.Capaian || 0); // Asumsikan ada properti `capaian`
      }, 0);
      props.setTotalCapaian(totalCapaian);
      console.log("Total Capaian: ", totalCapaian);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleDeleteCapaian = async (data) => {
    if (checkDate(props.dataSprint.TanggalBerakhir) == true) {
      return [];
    }
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        setIsLoad(true);
        const response = await axios({
          method: "DELETE",
          url:
            "http://103.181.182.230:6060/api/database/rows/table/647/" +
            data.id +
            "/",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
          },
        });
        console.log(props.dataCapaian);
        console.log(data);
        let dataUpdate = props.dataCapaian.filter((a) => a.id != data.id);
        console.log(dataUpdate);
        props.dataUpdate(dataUpdate);
        if (!props.isPersonal) {
          props.setCek();
          props.setDisplay();
        }

        setIsLoad(false);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data successfully deleted.",
        }).then((result) => {
          if (result.isConfirmed) {
            if (!props.isPersonal) {
              getDataCapaian(props.dataSelected);
            } else {
              props.getData(props.dataSelected);
            }
          }
        });
      }
    } catch (error) {
      setIsLoad(false);

      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: `Error: ${error.response.data.error}`,
        });
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        // The request was made, but no response was received
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "No response received from the server.",
        });
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Error setting up request: ${error.message}`,
        });
        console.error("Error setting up request:", error.message);
      }
    }
  };
  function checkDate(date) {
    const today = new Date(tanggal); // Mendapatkan tanggal hari ini
    const targetDate = new Date(date); // Tanggal target

    // Mengecek apakah tanggal hari ini lebih dari tanggal target
    if (today <= targetDate) {
      return false;
    } else {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Waktu Pengerjaan Sprint Telah Berakhir",
      });
      return true;
    }
  }
  console.log(props.dataCapaian, "hahahzahahahahaahahahaahahah");
  return (
    <div className="w-full px-6">
      <motion.div
        initial={{ y: 1000, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 1.5, delay: 0.1 }}
      >
        <AnimatePresence>
          <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
            <h3 className="text-white text-base font-medium">Capaian DOD</h3>
          </div>
        </AnimatePresence>
      </motion.div>
      {props.isLoadData == true && (
        <>
          <LoaderData />
        </>
      )}
      {props.isLoadData == false && (
        <>
          {props.dataCapaian.length == 0 && (
            <>
              <motion.div
                initial={{ y: 1000, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 1.5, delay: 0.1 }}
              >
                <AnimatePresence>
                  <div className="w-full flex justify-center items-center mt-5 rounded-xl bg-white">
                    <div className="w-[100%]  h-[20rem] pb-5 bg-transparent px-2 flex rounded-xl justify-center flex-col items-center">
                      <Lottie
                        options={defaultOptions}
                        height={250}
                        width={250}
                      />
                      <h3 className="text-base text-blue-500 font-medium text-center">
                        Belum Ada Data Cuyy..
                      </h3>
                    </div>
                  </div>
                </AnimatePresence>
              </motion.div>
            </>
          )}

          {props.dataCapaian.length > 0 && (
            <>
              <motion.div
                initial={{ y: 1000, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  duration: 1,
                  x: { duration: 0.5 },
                  delay: 0.3,
                }}
              >
                <AnimatePresence>
                  <div className=" bg-white shadow-md flex flex-col justify-start items-center w-full rounded-xl mt-5">
                    {props.dataCapaian.map((data) => (
                      <div
                        key={data.id}
                        className="hover:cursor-pointer py-1 px-4  gap-4 w-full flex justify-between  items-center  border-b border-blue-blue-300"
                      >
                        <div className="flex justify-start gap-4 items-center w-[76%] p-2">
                          <div className="flex flex-col justify-between gap-2 items-start">
                            <h3 className="text-lg font-medium">
                              {data.Capaian}{" "}
                              {props.dataSelected.Satuan[0].value}
                            </h3>
                            <h5 className="text-sm font normal text-blue-500">
                              {data.Pelaksana[0]
                                ? data.Pelaksana[0].value
                                : "Nama Pelaksana"}
                            </h5>
                          </div>
                          <div className="flex justify-start gap-4 items-center p-2 ">
                            <div
                              className={`p-2 rounded-md ${
                                data.isCheck
                                  ? " text-teal-700 bg-teal-100 border border-teal-700 font-semibold"
                                  : " text-yellow-700 font-semibold bg-yellow-100 border border-yellow-700"
                              }  font-normal text-sm px-6`}
                            >
                              {data.isCheck
                                ? " Sudah Diperiksa"
                                : " Belum Diperiksa"}
                            </div>

                            {data.isCheck && (
                              <>
                                <div
                                  className={`p-2 rounded-md ${
                                    !data.Revisi
                                      ? " text-teal-700 bg-teal-100 border border-teal-700 font-semibold"
                                      : " text-yellow-700 font-semibold bg-yellow-100 border border-yellow-700"
                                  }  font-normal text-sm px-6`}
                                >
                                  {data.Revisi
                                    ? "Perlu Revisi"
                                    : "Sudah Sesuai"}
                                </div>
                              </>
                            )}

                            <div className="flex border border-blue-600 rounded-md flex-wrap justify-start items-center p-2 capitalize text-xs font-normal w-[13rem] overflow-wrap break-words word-break break-all">
                              {data.Keterangan}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-6  w-[35rem]">
                          {data.Link !== "" && (
                            <>
                              <div class="group relative">
                                <a
                                  target="_blank"
                                  rel="noreferrer"
                                  href={data.Link}
                                  className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-blue-600 hover:scale-125 bg-blue-100 "
                                >
                                  <MdDoubleArrow class="text-lg  duration-200 text-blue-700" />
                                </a>
                                <span
                                  class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border w-[6rem]
  border-gray-300 bg-blue-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                                >
                                  <span>Periksa Link</span>
                                </span>
                              </div>
                            </>
                          )}

                          <div class="group relative">
                            <button
                              onClick={() => props.handleCekGambar(data)}
                              className={`w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border  ${
                                data.Link === ""
                                  ? "hover:border-blue-600 bg-blue-100 "
                                  : "hover:border-purple-600 bg-purple-100 "
                              }   hover:scale-125 `}
                            >
                              {data.Link == "" ? (
                                <>
                                  <TbEyeSearch class="text-lg  duration-200 text-blue-700" />
                                </>
                              ) : (
                                <>
                                  <TbEyeSearch class="text-lg  duration-200 text-purple-700" />
                                </>
                              )}
                            </button>
                            <span
                              class={`absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border w-[6.5rem]
  border-gray-300 ${
    data.Link === "" ? "bg-blue-600" : "bg-purple-600"
  }  text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100`}
                            >
                              <span>
                                {" "}
                                {data.Link === ""
                                  ? "Periksa Bukti"
                                  : "Periksa Detail"}
                              </span>
                            </span>
                          </div>
                          {data.isCheck == false && (
                            <>
                              {/* {!props.isPersonal && (
                            <> */}
                              <div class="group relative">
                                <button
                                  onClick={() => props.handleEdit(data)}
                                  className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-teal-600 hover:scale-125 bg-teal-100 "
                                >
                                  <HiOutlinePencilSquare class="text-lg  duration-200 text-teal-700" />
                                </button>
                                <span
                                  class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-teal-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                                >
                                  Update<span></span>
                                </span>
                              </div>
                              <div class="group relative">
                                <button
                                  onClick={() => handleDeleteCapaian(data)}
                                  className="w-[2.5rem] h-[2.5rem] duration-300 transition-all flex justify-center items-center rounded-full border hover:border-red-600 hover:scale-125 bg-red-100 "
                                >
                                  <MdDeleteOutline class="text-lg  duration-200 text-red-700" />
                                </button>
                                <span
                                  class="absolute -top-10 left-[50%] -translate-x-[50%] 
  z-20 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-red-600 text-white py-2 text-xs font-semibold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
                                >
                                  Hapus<span></span>
                                </span>
                              </div>
                            </>
                            //   )}
                            // </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default TableCapaian;
