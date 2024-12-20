import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import TablePBIProduct from "../../component/PbiProductBacklog/tabelProduct";
import axios from "axios";
import withRouter from "../../component/features/withRouter";
import Filter from "../../component/features/filter";
import TableDodProduct from "../../component/DodProductBacklog/tabelProduct";
import { AnimatePresence, motion } from "framer-motion";

function DodProduct({ params }) {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [data, setData] = useState([]);
  const tableRef = useRef(null);
  const { id, pbi } = params;
  const [idProduct, setIdProduct] = useState(params.idProduct);
  const [idPbi, setIdPbi] = useState(params.idPbi);
  const [dataSatuan, setDataSatuan] = useState([]);

  const handleTabChange = (index) => {
    setActiveTabIndex(`tab${index + 1}`);
  };

  useEffect(() => {
    fetchData();
  }, [activeTabIndex]);

  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "ProductBacklog",
          value: `${idProduct}`,
        },
        {
          type: "link_row_has",
          field: "PBIProduct",
          value: `${idPbi}`,
        },
      ];
      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/637/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log(response.data.results, "all data");
      const allData = response.data.results;

      setData(allData);
      getDataSatuan();
    } catch (error) {
      setError(error.message);
    }
  };

  const getDataSatuan = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "http://103.181.182.230:6060/api/database/rows/table/638/?user_field_names=true",
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log(response.data.results, "satuan");
      const data = response.data.results;

      const dataOption = data.map((item) => {
        return { value: item.id, text: item.Name };
      });
      setDataSatuan(dataOption);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <motion.div
      initial={{ y: 1000, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
    >
      <AnimatePresence>
        <div
          // data-aos="fade-down"
          // data-aos-delay="550"
          className="w-full h-full flex flex-col justify-start items-center pb-25"
        >
          {/* <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium">DOD PRODUCT</h3>
      </div> */}

          <div className="w-full flex justify-between items-center transition-transform duration-500 ease-in-out transform">
            <div className="w-full transform transition-transform duration-500 ease-in-out">
              <TableDodProduct
                idProduct={idProduct}
                idPbi={idPbi}
                width={50}
                data={data}
                getData={fetchData}
                optionSatuan={dataSatuan}
              />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

export default DodProduct;
