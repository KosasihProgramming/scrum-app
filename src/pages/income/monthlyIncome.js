import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import TableProduct from "../../component/productBacklog/tabelProduct";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import Loader from "../../component/features/loader";
import TableMonthly from "../../component/income/monthlyIncome/tabelMonthly";
function MonthlyIncome() {
  const [tableLeft, setTableLeft] = useState(0);
  const [dataTim, setDataTim] = useState([]);
  const tableRef = useRef(null);
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [isLoader, setIsLoader] = useState(false);
  const allTabs = [
    {
      id: "tab1",
      name: "Klinik",
    },
    {
      id: "tab2",
      name: "Lab",
    },
    {
      id: "tab3",
      name: "Gigi",
    },
  ];

  const handleTabChange = (index) => {
    setActiveTabIndex(`tab${index + 1}`);
  };

  useEffect(() => {
    const setTablePosition = () => {
      if (tableRef.current) {
        const tableWidth = tableRef.current.clientWidth;
        const tableOffsetLeft = tableRef.current.offsetLeft;
        setTableLeft(tableOffsetLeft);
      }
    };

    setTablePosition();
    fetchData();
    getDataTim();
  }, [activeTabIndex]);

  const [dataRencana, setDataRencana] = useState([]);
  const [dataBerjalan, setDataBerjalan] = useState([]);
  const [dataBerlalu, setDataBerlalu] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://202.157.189.177:8080/api/database/rows/table/663/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;
      const dataKlinik = allData.filter(
        (a) => a.Judul.includes("Klinik") && !a.Judul.includes("Gigi")
      );

      const dataLab = allData.filter((a) => a.Judul.includes("Lab"));

      const dataGigi = allData.filter((a) => a.Judul.includes("Gigi"));

      setDataRencana(dataLab);
      setDataBerlalu(dataGigi);
      setDataBerjalan(dataKlinik);
    } catch (error) {
      setError(error.message);
    }
  };

  const getDataTim = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://202.157.189.177:8080/api/database/rows/table/273/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results);
      const data = response.data.results;

      const dataOption = data.map((item) => {
        return { value: item.id, text: item.Name };
      });
      setDataTim(dataOption);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="w-full h-full flex flex-col justify-start items-center pb-25 relative">
      <div className="w-full  h-[3rem] rounded-md flex justify-start items-center bg-white px-6">
        <Link
          to={"/product-backlog"}
          className="p-2 flex justify-center items-center text-sm text-blue-700  font-medium"
        >
          Product Backlog
        </Link>
        <IoIosArrowForward className="text-2xl text-blue-700" />
      </div>
      <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium">PRODUCT BACKLOG</h3>
      </div>
      <div className="w-full flex justify-start items-center mt-10 rounded-md">
        <TabBar data={allTabs} onTabChange={handleTabChange} />
      </div>

      <div className="w-full flex justify-between items-center  transition-transform duration-500 ease-in-out transform">
        {activeTabIndex === "tab1" && (
          <div
            ref={tableRef}
            style={{ left: tableLeft }}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TableMonthly
              width={33}
              setLoad1={() => {
                setIsLoader(true);
              }}
              setLoad2={() => {
                setIsLoader(false);
              }}
              data={dataBerjalan}
              getData={fetchData}
              optionTim={dataTim}
            />
          </div>
        )}
        {activeTabIndex === "tab2" && (
          <div
            ref={tableRef}
            style={{ left: tableLeft }}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TableMonthly
              width={33}
              data={dataRencana}
              getData={fetchData}
              setLoad1={() => {
                setIsLoader(true);
              }}
              setLoad2={() => {
                setIsLoader(false);
              }}
              optionTim={dataTim}
            />
          </div>
        )}
        {activeTabIndex === "tab3" && (
          <div
            ref={tableRef}
            style={{ left: tableLeft }}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TableMonthly
              width={33}
              data={dataBerlalu}
              getData={fetchData}
              setLoad1={() => {
                setIsLoader(true);
              }}
              setLoad2={() => {
                setIsLoader(false);
              }}
              optionTim={dataTim}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyIncome;
