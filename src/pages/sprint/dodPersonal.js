// import React, { useState, useRef, useEffect } from "react";
// import { TabBar } from "../../component/features/tabBar";
// import axios from "axios";
// import withRouter from "../../component/features/withRouter";
// import Filter from "../../component/features/filter";
// import TablePBISprint from "../../component/sprintBacklog/PBISprint/tabelPbiSprint";
// import { Link } from "react-router-dom";
// import { RiDeleteBack2Fill } from "react-icons/ri";
// import { IoIosArrowForward } from "react-icons/io";
// import ProgressBar from "../../component/features/progressBar";
// import TableTodo from "../../component/sprintBacklog/TodoList/tableTodo";

// function DodPersonal({ params }) {
//   const [activeTabIndex, setActiveTabIndex] = useState("tab1");
//   const [dataTim, setDataTim] = useState([]);
//   const tableRef = useRef(null);
//   const [dataDod, setDataDod] = useState([]);

//   const [dataSprint, setdataSprint] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [dataAnggota, setDataAnggota] = useState([]);
//   const { id, idUser } = params;
//   const [dataUser, setDataUser] = useState([]);
//   const [dataTodo, setDataTodo] = useState([]);
//   const [idSprint, setIdSprint] = useState(id);
//   const [totalPbi, setTotalPbi] = useState(0);
//   console.log(params, "param page");

//   const handleTabChange = (index) => {
//     setActiveTabIndex(`tab${index + 1}`);
//   };

//   useEffect(() => {
//     fetchData();
//     getSingleDataSprint(idSprint);
//   }, [activeTabIndex]);

//   const getSingleDataSprint = async (id) => {
//     try {
//       const response = await axios({
//         method: "GET",
//         url: `http://202.157.189.177:8080/api/database/rows/table/575/${id}/?user_field_names=true`,
//         headers: {
//           Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
//         },
//       });

//       console.log(response.data, "data Sprint");
//       const data = response.data;

//       setdataSprint(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const fetchData = async () => {
//     try {
//       const filters = [
//         {
//           type: "link_row_has",
//           field: "UserId",
//           value: `${idUser}`,
//         },
//       ];

//       const param = await Filter(filters);
//       console.log("objek param", filters);
//       console.log(param, "params");
//       const response = await axios({
//         method: "GET",
//         url:
//           "http://202.157.189.177:8080/api/database/rows/table/718/?" + param,
//         headers: {
//           Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
//         },
//       });
//       console.log(response.data.results, "all data");
//       const allData = response.data.results;

//       await getSingleDataSprint(idSprint);
//       setTotalPbi(allData.length);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const getDataUser = async (datas) => {
//     try {
//       const filters = [
//         {
//           type: "link_row_has",
//           field: "Tim",
//           value: `${tim.id}`,
//         },
//       ];
//       const param = await Filter(filters);
//       const response = await axios({
//         method: "GET",
//         url:
//           "http://202.157.189.177:8080/api/database/rows/table/717/?" + param,
//         headers: {
//           Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
//         },
//       });
//       console.log(response.data.results, "user Anggota");
//       const data = response.data.results;

//       const dataOption = data.map((item) => {
//         return {
//           value: item.id,
//           text: item.Nama,
//         };
//       });
//       setDataUser(dataOption);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const getSingleDataTim = async (datas) => {
//     try {
//       const filters = [
//         {
//           type: "equal",
//           field: "Name",
//           value: `${datas.Teams[0].value}`,
//         },
//       ];
//       const param = await Filter(filters);
//       const response = await axios({
//         method: "GET",
//         url:
//           "http://202.157.189.177:8080/api/database/rows/table/273/?" + param,
//         headers: {
//           Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
//         },
//       });
//       console.log(response.data.results, "Timmmmm");
//       const data = response.data.results;

//       return data[0];
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const getSingleDataUser = async (id) => {
//     try {
//       const response = await axios({
//         method: "GET",
//         url: `http://202.157.189.177:8080/api/database/rows/table/717/${id}/?user_field_names=true`,
//         headers: {
//           Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
//         },
//       });

//       console.log(response.data, "data Anggota Sprint");
//       const userData = response.data;

//       return userData;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   function formatTanggal(tanggal) {
//     const bulanIndo = [
//       "Januari",
//       "Februari",
//       "Maret",
//       "April",
//       "Mei",
//       "Juni",
//       "Juli",
//       "Agustus",
//       "September",
//       "Oktober",
//       "November",
//       "Desember",
//     ];

//     const [tahun, bulan, hari] = tanggal.split("-");

//     const namaBulan = bulanIndo[parseInt(bulan) - 1];

//     return `${parseInt(hari)} ${namaBulan} ${tahun}`;
//   }
//   const persentase = Math.floor(
//     parseInt(dataSprint == null ? 0 : dataSprint.CapaianPBI)
//   );
//   return (
//     <div className="w-full h-full flex flex-col justify-start items-center pb-25">
//       <div className="w-full  h-[3rem] rounded-md flex justify-start items-center bg-white px-6">
//         <Link
//           to={"/sprint-backlog"}
//           className="p-2 flex justify-center items-center text-sm text-slate-500  font-medium"
//         >
//           Sprint Backlog
//         </Link>
//         <IoIosArrowForward className="text-2xl text-slate-500" />
//         <button
//           onClick={() => {
//             setIsOpen(false);
//           }}
//           className={`p-2 flex justify-center items-center text-sm ${
//             isOpen ? "text-slate-500 " : "text-blue-700 "
//           } font-medium`}
//         >
//           PBI Sprint
//         </button>
//         <IoIosArrowForward
//           className={`text-2xl ${
//             isOpen ? "text-slate-500 " : "text-blue-700 "
//           } `}
//         />
//         {isOpen == true && (
//           <>
//             <div className="p-2 flex justify-center items-center text-sm text-blue-700  font-medium">
//               Dod Sprint
//             </div>
//             <IoIosArrowForward className="text-2xl text-blue-700" />
//           </>
//         )}
//       </div>
//       <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
//         <h3 className="text-white text-base font-medium">PBI SPRINT</h3>
//       </div>
//       {isOpen == false && (
//         <>
//           <div
//             data-aos="fade-up"
//             data-aos-delay="150"
//             className="mt-10 flex flex-col justify-between w-full bg-white rounded-xl shadow-md"
//           >
//             <div
//               data-aos="fade-up"
//               data-aos-delay="150"
//               className=" flex justify-between w-full bg-white rounded-xl py-6 px-6"
//             >
//               <div className="flex flex-col justify-start gap-2 items-start w-[80%]">
//                 <h3 className="text-xl font-medium text-blue-700">
//                   {dataSprint == null ? "" : dataSprint.Judul[0].value}
//                 </h3>
//                 <h3 className="text-sm font-normal ">
//                   {dataSprint == null ? "" : dataSprint.Goal[0].value}
//                 </h3>
//                 <h6 className="text-sm font-normal">
//                   {dataSprint == null
//                     ? "2020-12-10"
//                     : formatTanggal(dataSprint.TanggalMulai)}{" "}
//                   -{" "}
//                   {dataSprint == null
//                     ? "2020-12-10"
//                     : formatTanggal(dataSprint.TanggalBerakhir)}
//                 </h6>
//                 <div className="w-full flex justify-start gap-4 items-center mt-4">
//                   <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
//                     Total PBI : {totalPbi}
//                   </div>

//                   <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
//                     Capaian : {dataSprint == null ? "" : persentase + "%"}
//                   </div>

//                   <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
//                     Status:{" "}
//                     {dataSprint == null ? "" : dataSprint.Status[0].value}
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-center items-center">
//                 <Link
//                   to="/sprint-backlog"
//                   className="cssbuttons-io-button w-[10rem]"
//                 >
//                   Tutup
//                   <div className="icon">
//                     <RiDeleteBack2Fill className="text-xl text-blue-600" />
//                   </div>
//                 </Link>
//               </div>
//             </div>
//             <div className="w-full overflow-x-hidden pb-6 px-6">
//               <ProgressBar
//                 bgcolor="#2563EB"
//                 progress={persentase}
//                 height={30}
//               />
//             </div>
//           </div>
//         </>
//       )}
//       <div className="w-full flex justify-between items-center transition-transform duration-500 ease-in-out transform">
//         <div
//           ref={tableRef}
//           className="w-full transform transition-transform duration-500 ease-in-out"
//         >
//           <TableTodo
//             data={dataTodo}
//             dataAnggota={dataAnggota}
//             id={idSprint}
//             // idSprint={idSprint}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default withRouter(DodPersonal);
