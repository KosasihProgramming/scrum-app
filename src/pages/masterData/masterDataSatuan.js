import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import axios from "axios";
import TableSprint from "../../component/sprintBacklog/Sprint/tabelSprint";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import TableUsers from "../../component/masterDataUser/tabelUsers";
import TableSatuan from "../../component/masterDataSatuan/tabelSatuan";

function MasterDataSatuan() {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [tableLeft, setTableLeft] = useState(0);
  const tableRef = useRef(null);
  const [dataTim, setDataTim] = useState([]);
  const [dataSatuan, setDataSatuan] = useState([]);

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
  }, [activeTabIndex]);

  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://103.181.182.230:6060/api/database/rows/table/638/?user_field_names=true",
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;

      setDataSatuan(allData);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {" "}
      <div className="w-full h-full flex flex-col justify-start items-center pb-25">
        <div className="w-full  h-[3rem] rounded-md flex justify-start items-center bg-white px-6">
          <Link
            to={"/sprint-backlog"}
            className="p-2 flex justify-center items-center text-sm text-blue-700  font-medium"
          >
            Data Satuan
          </Link>
          <IoIosArrowForward className="text-2xl text-blue-700" />
        </div>
        <div className="w-full flex justify-start items-center mt-5  bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-xl">
          <h3 className="text-white text-base font-medium"> Data Satuan </h3>
        </div>

        <div className="w-full flex justify-between items-center">
          <div
            ref={tableRef}
            style={{ left: tableLeft }}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TableSatuan data={dataSatuan} getData={fetchData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MasterDataSatuan;
