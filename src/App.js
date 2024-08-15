import "./App.css";
import "../src/styles/button.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css"; // Ganti tema sesuai kebutuhan Anda
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { BiConversation } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { ImDatabase } from "react-icons/im";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsPersonWorkspace } from "react-icons/bs";
import { GiSprint } from "react-icons/gi";
import { CgDatabase } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "dayjs/locale/id";

import { IoMdExit } from "react-icons/io";

import { BsPersonLinesFill } from "react-icons/bs";
import ProductBacklog from "./pages/product/productBacklog";
import SprintBacklog from "./pages/sprint/sprintBacklog";
import PbiProductBacklog from "./pages/product/pbiProductBacklog";
import DodProduct from "./pages/product/dodProduct";
import PbiSprintBacklog from "./pages/sprint/pbiSprintBacklog";

const App = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const isLamaran = sessionStorage.getItem("isLamaran");
  // const isLoggedIn = true;
  const menus = [
    { name: "Dashboard", link: "", icon: AiOutlineDashboard, main: false },
    // {
    //   name: "Ruang Koordinasi",
    //   link: "ruang-koordinasi",
    //   icon: BiConversation,
    //   main: false,
    // },
    // { name: "Biaya", link: "biaya", icon: GrMoney, main: false },
    {
      name: "Penjualan",
      link: "penjualan",
      icon: FaHandHoldingDollar,
      main: false,
    },
    {
      name: "Product Backlog",
      link: "product-backlog",
      icon: MdOutlineDashboard,
      main: false,
    },
    {
      name: "Sprint Backlog",
      link: "sprint-backlog",
      icon: GiSprint,
      main: false,
    },
    {
      name: "Master Data",
      link: "master-data",
      icon: ImDatabase,
      main: true,
    },
  ];

  const [open, setOpen] = useState(true);
  const [openKaryawan, setOpenKaryawan] = useState(true);
  const [openMasterData, setOpenMasterData] = useState(true);
  const [menu, setMenu] = useState("dashboard");
  const [isSubMenu, setIsSubMenu] = useState(false);
  const [isSubMenuKaryawan, setIsSubMenuKaryawan] = useState(false);
  const [isSubMenuMasterData, setIsSubMenuMasterData] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <>
      {/* {isLoggedIn ? (
        <> */}
      <Router>
        <section className={` flex w-full gap-6 bg-slate-100 h-full p-0`}>
          <div
            className={`bg-blue-700 min-h-screen pl-8 z-[999] ${
              open ? "w-[16rem]" : "w-[6rem]"
            } duration-500 text-gray-100 px-4 text-sm border-r-2 border-r-blue-100 rounded-tr-xl rounded-br-xl shadow-blue-600 shadow-xl`}
          >
            <div className="flex justify-between items-center mt-12 w-full border-b border-b-blue-100 pb-12">
              <div
                className={`flex ${
                  open ? "px-4" : "px-0"
                }items-center justify-center gap-2 py-5.5 lg:py-6.5  w-full `}
              >
                <div
                  className="flex px-1 justify-center gap-5 w-full items-center text-blue-100  "
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  {/* <FaRegUser /> */}
                  {open && (
                    <>
                      <h5
                        style={{
                          transitionDelay: `${4}00ms`,
                        }}
                        className={`text-xl font-semibold text-blue-100 text-center whitespace-pre duration-500 ${
                          !open && "opacity-0 translate-x-28 overflow-hidden"
                        }`}
                      >
                        Scrum App
                      </h5>
                    </>
                  )}
                </div>
              </div>
              <div className=" flex justify-end items-center ">
                <HiMenuAlt3
                  size={26}
                  className="cursor-pointer"
                  onClick={() => setOpen(!open)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 relative text-blue-100 mt-4">
              {/* {isLoggedIn ? (
                <> */}
              {menus.map((menu) => (
                <div
                  className={`flex flex-col justify-start  gap-3 items-center overflow-hidden${
                    open ? "overflow-y-hidden" : ""
                  }`}
                >
                  {menu.main == false ? (
                    <>
                      <Link
                        to={`/${menu.link}`}
                        className={` ${
                          menu?.margin && "mt-5"
                        } z-[9] group flex ${
                          open == true
                            ? "justify-start w-[12rem] px-4 gap-3.5 "
                            : " p-2 justify-center w-[4rem]"
                        } items-center  text-lg button verflow-hidden font-medium rounded-md  transition duration-300 ease-in-out`}
                      >
                        <div className="button-content">
                          {React.createElement(menu.icon, {
                            size: "20",
                          })}
                        </div>
                        <h2
                          style={{
                            transitionDelay: `${1 + 3}00ms`,
                          }}
                          className={`whitespace-pre duration-500 button-content text-sm ${
                            !open && "opacity-0 hidden translate-x-28  "
                          }`}
                        >
                          {menu.name}
                        </h2>
                        <h2
                          className={`${
                            open && "hidden"
                          } absolute z-[99999] text-sm left-48 bg-slate-300 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                        >
                          {menu.name}
                        </h2>
                      </Link>
                    </>
                  ) : (
                    <>
                      {menu.name == "Kandidat" && (
                        <>
                          <button
                            onClick={() => setIsSubMenu(!isSubMenu)}
                            className={` ${
                              menu?.margin && "mt-5"
                            } z-[9] group flex ${
                              open == true
                                ? "justify-start w-[12rem] px-4 gap-3.5"
                                : " p-2 justify-center w-[4rem]"
                            } items-center  text-lg button  font-medium rounded-md  transition duration-300 ease-in-out`}
                          >
                            <div className="button-content">
                              {React.createElement(menu.icon, {
                                size: "20",
                              })}
                            </div>
                            <h2
                              style={{
                                transitionDelay: `${1 + 3}00ms`,
                              }}
                              className={`whitespace-pre duration-500 button-content text-sm ${
                                !open && "opacity-0 hidden translate-x-28  "
                              }`}
                            >
                              {menu.name}
                            </h2>
                            <h2
                              className={`${
                                open && "hidden"
                              } absolute z-[99999] left-48 text-sm bg-slate-300 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                            >
                              {menu.name}
                            </h2>
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {isSubMenu && menu.name == "Kandidat" && open && (
                    <div
                      data-aos="slide-down"
                      className=" top-full left-0 w-48  shadow-md py-2  rounded text-sm overlow-hidden text-sm"
                      onAnimationEnd={() => setIsSubMenu(false)}
                    >
                      <ul>
                        <li className="  py-2 button  text-slate-300 flex items-center justify-start pl-10 ">
                          <Link
                            to="/all-candidate"
                            className=" button-content  text-slate-300 text-sm"
                          >
                            Semua Kandidat
                          </Link>
                        </li>
                        <li className=" mt-4  py-2 button  text-slate-300 flex items-center justify-start pl-10">
                          <Link
                            to="/manage-candidate"
                            className=" button-content text-slate-300 "
                          >
                            Kelola kandidat
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              <div
                className={`flex flex-col justify-start  gap-3 items-center overflow-hidden  ${
                  open ? "overflow-y-hidden" : ""
                }`}
              >
                <button
                  onClick={handleLogout}
                  className={` ${menu?.margin && ""} z-[9] group flex ${
                    open == true
                      ? "justify-start w-[12rem] px-4 gap-3.5"
                      : " p-2 justify-center w-[4rem]"
                  } items-center  text-lg button  font-medium rounded-md  transition duration-300 ease-in-out`}
                >
                  <div className="button-content">
                    <div>{React.createElement(IoMdExit, { size: "20" })}</div>
                  </div>
                  <h2
                    style={{
                      transitionDelay: `${1 + 3}00ms`,
                    }}
                    className={`whitespace-pre duration-500 button-content text-sm ${
                      !open && "opacity-0 hidden translate-x-28  "
                    }`}
                  >
                    Logout
                  </h2>
                  <h2
                    className={`${
                      open && "hidden"
                    } absolute z-[99999] left-48 text-sm bg-slate-300 font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                  >
                    Logout
                  </h2>
                </button>
              </div>
            </div>
          </div>
          <div className=" mt-8 text-gray-900 font-semibold w-full flex flex-col justify-start items-center bg-slate-100 px-6 overflow-y-scroll">
            <div className="h-[100vh] w-[100%]  p-0 m-0">
              <Routes>
                <Route path="/product-backlog" element={<ProductBacklog />} />
                <Route
                  path="/pbi-product/:id"
                  element={<PbiProductBacklog />}
                />
                <Route path="/product-backlog" element={<ProductBacklog />} />
                <Route
                  path="/pbi-sprint/:id/:idProduct"
                  element={<PbiSprintBacklog />}
                />
                <Route path="/dod-product/:id/:pbi" element={<DodProduct />} />
                <Route path="/sprint-backlog" element={<SprintBacklog />} />
              </Routes>
            </div>
          </div>
        </section>
      </Router>
      {/* </>
      ) : (
        <> */}
      <div>
        <Router>
          <Routes>{/* <Route path="/" element={<Dashboard />} /> */}</Routes>
        </Router>
      </div>
      {/* </>
      )} */}
    </>
  );
};

export default App;
