import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import axios from "axios";
import withRouter from "../../component/features/withRouter";
import Filter from "../../component/features/filter";
import TablePBISprint from "../../component/sprintBacklog/PBISprint/tabelPbiSprint";

function PbiSprintBacklog({ params }) {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [dataTim, setDataTim] = useState([]);
  const tableRef = useRef(null);
  const [dataPbiPlan, setDataPbiPlan] = useState([]);
  const [dataPbiUnPlan, setDataPbiUnPlan] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { id, idProduct } = params;
  const [idSprint, setIdSprint] = useState(id);
  const [idProductBacklog, setIdProduct] = useState(idProduct);
  console.log(params, "param page");
  const allTabs = [
    {
      id: "tab1",
      name: "Plan",
    },
    {
      id: "tab2",
      name: "Unplan",
    },
  ];

  const handleTabChange = (index) => {
    setActiveTabIndex(`tab${index + 1}`);
  };

  useEffect(() => {
    fetchData();
    getDataPbiProduct();
  }, [activeTabIndex]);

  const [dataInnovation, setDataInnovation] = useState([]);
  const [dataStandard, setDataStandard] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "Sprint",
          value: `${idSprint}`,
        },
      ];

      const param = await Filter(filters);
      console.log("objek param", filters);
      console.log(param, "params");
      const response = await axios({
        method: "GET",
        url:
          "http://202.157.189.177:8080/api/database/rows/table/577/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;
      const dataPlan = allData.filter((a) => a.Unplan === false);
      const dataUnplan = allData.filter((a) => a.Unplan === true);
      setDataPbiPlan(dataPlan);
      setDataPbiUnPlan(dataUnplan);
    } catch (error) {
      setError(error.message);
    }
  };
  const getDataPbiProduct = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "ProductBacklog",
          value: `${idProductBacklog}`,
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
      const data = response.data.results;
      console.log("skdhkjsdh", param, "param Product");
      console.log(data, "data Product");
      const dataOption = data.map((item) => {
        return { value: item.id, text: item.Judul, bobot: item.Bobot };
      });
      console.log(dataOption, "productahdfjsw");

      setDataProduct(dataOption);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="w-full h-full flex flex-col justify-start items-center pb-25">
      <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium">PBI SPRINT</h3>
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
            <TablePBISprint
              idSprint={idSprint}
              width={50}
              data={dataPbiPlan}
              setOpen={(value) => setIsOpen(value)}
              getData={fetchData}
              optionProduct={dataProduct}
            />
          </div>
        )}
        {activeTabIndex === "tab2" && (
          <div
            ref={tableRef}
            className="w-full transform transition-transform duration-500 ease-in-out"
          >
            <TablePBISprint
              width={50}
              idSprint={idSprint}
              setOpen={(value) => setIsOpen(value)}
              data={dataPbiUnPlan}
              getData={fetchData}
              optionProduct={dataProduct}
              optionTim={dataTim}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(PbiSprintBacklog);
