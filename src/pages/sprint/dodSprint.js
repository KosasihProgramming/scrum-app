import React, { useState, useRef, useEffect } from "react";
import { TabBar } from "../../component/features/tabBar";
import TablePBIProduct from "../../component/PbiProductBacklog/tabelProduct";
import axios from "axios";
import withRouter from "../../component/features/withRouter";
import Filter from "../../component/features/filter";
import TableDodProduct from "../../component/DodProductBacklog/tabelProduct";
import TableDodSprint from "../../component/sprintBacklog/DodSprint/tabelDod";
import ModalAddAnggota from "../../component/sprintBacklog/anggotaSprint/modalAnggota";
import ModalAddPelaksana from "../../component/sprintBacklog/PelaksanaSprint/modalPelaksana";
import { AnimatePresence, motion } from "framer-motion";

function DodSprint({ params }) {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [data, setData] = useState([]);
  const [dataAnggota, setDataAnggota] = useState([]);
  const [dataPelaksana, setDataPelaksana] = useState([]);
  const tableRef = useRef(null);
  const { id, pbi, pbiProduct } = params;
  const [isLoadData, setIsLoadData] = useState(true);
  const [idSprint, setIdSprint] = useState(params.id);
  const [idPbi, setIdPbi] = useState(params.idPbi);
  const [dataSprint, setDataSprint] = useState(params.dataSprint);
  const [idPbiProduct, setIdPbiProduct] = useState(params.idPbiProduct);
  const [isAddAnggota, setIsAddAnggota] = useState(params.openAnggota);
  const [isgetdata, setIsgetdata] = useState(false);
  const [isAddPelaksana, setIsAddPelaksana] = useState(false);
  const [dataDodProduct, setDataDodProduct] = useState([]);
  const [selectedDod, setSelectedDod] = useState({});
  useEffect(() => {
    fetchData();
    // getDataAnggota();
  }, [activeTabIndex]);

  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "Sprint",
          value: `${idSprint}`,
        },
        {
          type: "link_row_has",
          field: "PBISprint",
          value: `${idPbi}`,
        },
      ];
      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/640/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log(response.data.results, "all data Dod");
      const allData = response.data.results;

      setData(allData);
      getDataDodProduct();
      return allData;
    } catch (error) {
      setError(error.message);
    }
  };

  const getDataDodProduct = async () => {
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "PBIProduct",
          value: `${idPbiProduct}`,
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
      console.log(response.data.results, "dod");
      const data = response.data.results;

      const dataOption = data.map((item) => {
        return {
          value: item.id,
          text: item.Judul,
          target: item.Target,
          satuan: item.Satuan[0],
        };
      });
      setIsLoadData(false);
      setDataDodProduct(dataOption);
    } catch (error) {
      setError(error.message);
    }
  };

  const getDataPelaksana = async (id) => {
    if (!id) {
      alert("gagal, Data Dod Tidak Ada");
      return [];
    }
    try {
      const filters = [
        {
          type: "link_row_has",
          field: "DodSprint",
          value: `${id}`,
        },
      ];
      const param = await Filter(filters);
      const response = await axios({
        method: "GET",
        url:
          "http://103.181.182.230:6060/api/database/rows/table/648/?" + param,
        headers: {
          Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
        },
      });
      console.log(response.data.results, "all data Pelaksana");
      const allData = response.data.results;
      setDataPelaksana(allData);
      return allData;
    } catch (error) {
      console.log(error);
    }
  };
  const openPelaksana = (data) => {
    console.log("data Dod Pelaksana", data);
    setIsAddPelaksana(true);
    setSelectedDod(data);
    getDataPelaksana(data.id);
  };

  return (
    <motion.div
      initial={{ y: 1000, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 1.5, delay: 0.3 }}
    >
      <AnimatePresence>
        <div className="w-full h-full flex flex-col justify-start items-center pb-25">
          <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
            <h3 className="text-white text-base font-medium">DOD SPRINT</h3>
          </div>

          <div className="w-full flex justify-between items-center transition-transform duration-500 ease-in-out transform">
            <div className="w-full transform transition-transform duration-500 ease-in-out">
              <ModalAddPelaksana
                id={selectedDod.id}
                isGet={isgetdata}
                setGet={() => {
                  setIsgetdata(false);
                }}
                idSprint={idSprint}
                open={isAddPelaksana}
                setOpen={() => setIsAddPelaksana(false)}
                dataDod={selectedDod}
                data={dataPelaksana}
                getData={getDataPelaksana}
              />

              <TableDodSprint
                idSprint={idSprint}
                idPbi={idPbi}
                width={50}
                isLoadData={isLoadData}
                setDod={(a) => {
                  openPelaksana(a);
                }}
                data={data}
                dataSprint={dataSprint}
                getData={fetchData}
                getDataPBI={() => {
                  params.getDataPBI();
                }}
                dataUser={dataPelaksana}
                getDataPelaksana={getDataPelaksana}
                getDataUser={getDataPelaksana}
                optionDod={dataDodProduct}
              />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

export default DodSprint;
