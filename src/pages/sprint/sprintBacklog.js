import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import axios from "axios";
import TableSprint from "../../component/sprintBacklog/Sprint/tabelSprint";

function SprintBacklog() {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [tableLeft, setTableLeft] = useState(0);
  const tableRef = useRef(null);
  const [dataTim, setDataTim] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const tableRef2 = useRef(null);

  const allTabs = [
    {
      id: "tab1",
      name: "Berjalan",
    },
    {
      id: "tab2",
      name: "Rencana",
    },
    {
      id: "tab3",
      name: "Berlalu",
    },
  ];

  const handleTabChange = (index) => {
    setActiveTabIndex(allTabs[index].id);
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
    getDataProduct();
  }, [activeTabIndex]);

  const [dataRencana, setDataRencana] = useState([]);
  const [dataBerjalan, setDataBerjalan] = useState([]);
  const [dataBerlalu, setDataBerlalu] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      
      const response = await axios({
        method: "GET",
        url: "http://202.157.189.177:8080/api/database/rows/table/575/?user_field_names=true",
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
  const getDataProduct = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://202.157.189.177:8080/api/database/rows/table/597/?user_field_names=true",
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      const data = response.data.results;

      const dataOption = data.map((item) => {
        return { value: item.id, text: item.Judul[0].value,tim:item.Tim[0].id };
      });
      console.log(dataOption, "productahdfjsw");

      setDataProduct(dataOption);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div>
      {" "}
      <div className="w-full h-full flex flex-col justify-start items-center pb-25">
        <div className="w-full flex justify-start items-center mt-5  bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-xl">
          <h3 className="text-white text-base font-medium"> SPRINT BACKLOG</h3>
        </div>
        <div className="w-full flex justify-start items-center mt-10 rounded-md">
          <TabBar data={allTabs} width={50} onTabChange={handleTabChange} />
        </div>

        <div className="w-full flex justify-between items-center">
          {activeTabIndex === "tab1" && (
            <div
              ref={tableRef}
              style={{ left: tableLeft }}
              className="w-full transform transition-transform duration-500 ease-in-out"
            >
              <TableSprint
                data={dataBerjalan}
                getData={fetchData}
                optionTim={dataTim}
                optionProduct={dataProduct}
              />
            </div>
          )}
          {activeTabIndex === "tab2" && (
            <div
              ref={tableRef}
              style={{ left: tableLeft }}
              className="w-full transform transition-transform duration-500 ease-in-out"
            >
              <TableSprint
                data={dataRencana}
                getData={fetchData}
                optionProduct={dataProduct}
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
              <TableSprint
                data={dataBerlalu}
                getData={fetchData}
                optionProduct={dataProduct}
                optionTim={dataTim}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SprintBacklog;
