import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import TablePBIProduct from "../../component/PbiProductBacklog/tabelProduct";
import axios from "axios";
import withRouter from "../../component/features/withRouter";
import Filter from "../../component/features/filter";

function PbiProductBacklog({ params }) {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [dataTim, setDataTim] = useState([]);
  const tableRef = useRef(null);
  const { id } = params;
  const [idProduct, setIdProduct] = useState(id);
  const [isOpen, setIsOpen] = useState(false);

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
  }, [activeTabIndex]);

  const [dataInnovation, setDataInnovation] = useState([]);
  const [dataStandard, setDataStandard] = useState([]);
  const [error, setError] = useState(null);

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
      setDataInnovation(dataInnovation);
      setDataStandard(dataStandard);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center pb-25">
      <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium">PBI PRODUCT</h3>
      </div>
      {isOpen == false && (
        <>
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
