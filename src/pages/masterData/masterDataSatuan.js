import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import TableProduct from "../../component/productBacklog/tabelProduct";
import axios from "axios";

function MasterDataSatuan() {
  const [tableLeft, setTableLeft] = useState(0);
  const [dataTim, setDataTim] = useState([]);
  const tableRef = useRef(null);
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");

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
        url: "http://202.157.189.177:8080/api/database/rows/table/597/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;
      const dataBerjalan = allData.filter(
        (a) => a.Status[0].value == "Berjalan"
      );
      const dataBerlalu = allData.filter((a) => a.Status[0].value == "Berlalu");
      const dataRencana = allData.filter((a) => a.Status[0].value == "Rencana");
      setDataRencana(dataRencana);
      setDataBerlalu(dataBerlalu);
      setDataBerjalan(dataBerjalan);
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
    <div className="w-full h-full flex flex-col justify-start items-center pb-25">
      <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium">PRODUCT BACKLOG</h3>
      </div>

      <div className="w-full flex justify-between items-center  transition-transform duration-500 ease-in-out transform">
        {activeTabIndex === "tab1" && (
          <div
            ref={tableRef}
            style={{ left: tableLeft }}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TableProduct
              width={33}
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
            <TableProduct
              width={33}
              data={dataRencana}
              getData={fetchData}
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
            <TableProduct
              width={33}
              data={dataBerlalu}
              getData={fetchData}
              optionTim={dataTim}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MasterDataSatuan;
