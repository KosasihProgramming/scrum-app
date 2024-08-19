import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import TablePBIProduct from "../../component/PbiProductBacklog/tabelProduct";
import axios from "axios";
import withRouter from "../../component/features/withRouter";
import Filter from "../../component/features/filter";
import { Link } from "react-router-dom";
import ProgressBar from "../../component/features/progressBar";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";

function PbiProductBacklog({ params }) {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [dataTim, setDataTim] = useState([]);
  const tableRef = useRef(null);
  const { id } = params;
  const [idProduct, setIdProduct] = useState(id);
  const [isOpen, setIsOpen] = useState(false);
  const [dataProduct, setdataProduct] = useState(null);
  const [totalPbi, setTotalPbi] = useState(0);
  const [totalCapaian, setTotalCapaian] = useState(0);
  const allTabs = [
    {
      id: "tab1",
      name: "Innovation",
    },
    {
      id: "tab2",
      name: "Standard",
    },
  ];

  const handleTabChange = (index) => {
    setActiveTabIndex(`tab${index + 1}`);
  };

  useEffect(() => {
    fetchData();
    getSingleDataProduct(idProduct);
  }, [activeTabIndex]);

  const [dataInnovation, setDataInnovation] = useState([]);
  const [dataStandard, setDataStandard] = useState([]);
  const [error, setError] = useState(null);

  const getSingleDataProduct = async (id) => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://202.157.189.177:8080/api/database/rows/table/597/${id}/?user_field_names=true`,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });

      console.log(response.data, "data product");
      const data = response.data;

      setdataProduct(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "ProductBacklog",
          value: `${idProduct}`,
        },
      ];
      const param = await Filter(filters);

      const response = await axios({
        method: "GET",
        url:
          "http://202.157.189.177:8080/api/database/rows/table/632/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;
      const dataInnovation = allData.filter(
        (a) => a.Jenis[0].value === "Innovation"
      );
      const dataStandard = allData.filter(
        (a) => a.Jenis[0].value === "Standard"
      );
      const totalCapaian = allData.reduce((total, item) => {
        return total + parseInt(item.Capaian || 0); // Asumsikan ada properti `capaian`
      }, 0);

      setTotalCapaian(
        (parseFloat(totalCapaian) / (parseFloat(allData.length) * 100)) * 100
      );
      setTotalPbi(allData.length);
      setDataInnovation(dataInnovation);
      setDataStandard(dataStandard);
    } catch (error) {
      setError(error.message);
    }
  };
  function formatTanggal(tanggal) {
    const bulanIndo = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const [tahun, bulan, hari] = tanggal.split("-");

    const namaBulan = bulanIndo[parseInt(bulan) - 1];

    return `${parseInt(hari)} ${namaBulan} ${tahun}`;
  }
  return (
    <div className="w-full h-full flex flex-col justify-start items-center pb-25">
      <div className="w-full  h-[3rem] rounded-md flex justify-start items-center bg-white px-6">
        <Link
          to={"/product-backlog"}
          className="p-2 flex justify-center items-center text-sm text-slate-500  font-medium"
        >
          Product Backlog
        </Link>
        <IoIosArrowForward className="text-2xl text-slate-500" />
        <button
          onClick={() => {
            setIsOpen(false);
          }}
          className={`p-2 flex justify-center items-center text-sm ${
            isOpen ? "text-slate-500 " : "text-blue-700 "
          } font-medium`}
        >
          PBI Product
        </button>
        <IoIosArrowForward
          className={`text-2xl ${
            isOpen ? "text-slate-500 " : "text-blue-700 "
          } `}
        />
        {isOpen == true && (
          <>
            <div className="p-2 flex justify-center items-center text-sm text-blue-700  font-medium">
              Dod Product
            </div>
            <IoIosArrowForward className="text-2xl text-blue-700" />
          </>
        )}
      </div>
      <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium">PBI PRODUCT</h3>
      </div>
      {isOpen == false && (
        <>
          <div
            data-aos="fade-up"
            data-aos-delay="150"
            className="mt-10 flex flex-col justify-between w-full bg-white rounded-xl shadow-md"
          >
            <div
              data-aos="fade-up"
              data-aos-delay="150"
              className=" flex justify-between w-full bg-white rounded-xl py-6 px-6"
            >
              <div className="flex flex-col justify-start gap-2 items-start w-[80%]">
                <h3 className="text-xl font-medium text-blue-700">
                  {dataProduct == null ? "" : dataProduct.Judul[0].value}
                </h3>
                <h6 className="text-sm font-normal">
                  {dataProduct == null
                    ? "2020-12-10"
                    : formatTanggal(dataProduct.TanggalMulai)}
                  -{" "}
                  {dataProduct == null
                    ? "2020-12-10"
                    : formatTanggal(dataProduct.TanggalBerakhir)}
                </h6>
                <div className="w-full flex justify-start gap-4 items-center mt-4">
                  <div className="bg-teal-50 rounded-md border border-teal-700 text-teal-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Total PBI : {totalPbi}
                  </div>
                  <div className="bg-teal-50 rounded-md border border-teal-700 text-teal-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Target Bobot :{" "}
                    {dataProduct == null ? "" : dataProduct.TargetBobot}
                  </div>
                  <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Capaian :{" "}
                    {dataProduct == null ? "" : parseInt(totalCapaian) + "%"}
                  </div>

                  <div className="bg-blue-50 rounded-md border border-blue-700 text-blue-700 flex justify-center items-center p-2 text-xs font-medium min-w-[8rem]">
                    Status:{" "}
                    {dataProduct == null ? "" : dataProduct.Status[0].value}
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Link
                  to="/product-backlog"
                  className="cssbuttons-io-button w-[10rem]"
                >
                  Tutup
                  <div className="icon">
                    <RiDeleteBack2Fill className="text-xl text-blue-600" />
                  </div>
                </Link>
              </div>
            </div>
            <div className="w-full overflow-x-hidden pb-6 px-6">
              <ProgressBar
                bgcolor="#2563EB"
                progress={parseInt(totalCapaian)}
                height={30}
              />
            </div>
          </div>
          <div className="w-full flex justify-start items-center mt-10 rounded-md">
            <TabBar data={allTabs} onTabChange={handleTabChange} />
          </div>
        </>
      )}
      <div className="w-full flex justify-between items-center transition-transform duration-500 ease-in-out transform">
        {activeTabIndex === "tab1" && (
          <div
            ref={tableRef}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TablePBIProduct
              idProduct={idProduct}
              width={50}
              data={dataInnovation}
              setOpen={(value) => setIsOpen(value)}
              isOpen={isOpen}
              getData={fetchData}
              optionTim={dataTim}
            />
          </div>
        )}
        {activeTabIndex === "tab2" && (
          <div
            ref={tableRef}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TablePBIProduct
              width={50}
              isOpen={isOpen}
              idProduct={idProduct}
              data={dataStandard}
              getData={fetchData}
              setOpen={(value) => setIsOpen(value)}
              optionTim={dataTim}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(PbiProductBacklog);
