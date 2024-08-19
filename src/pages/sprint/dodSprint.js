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

function DodSprint({ params }) {
  const [activeTabIndex, setActiveTabIndex] = useState("tab1");
  const [data, setData] = useState([]);
  const [dataAnggota, setDataAnggota] = useState([]);
  const [dataPelaksana, setDataPelaksana] = useState([]);
  const tableRef = useRef(null);
  const { id, pbi, pbiProduct } = params;
  console.log(params, "paraaaaam");
  const [idSprint, setIdSprint] = useState(params.id);
  const [idPbi, setIdPbi] = useState(params.idPbi);
  const [dataPbi, setDataPbi] = useState(params.dataPbi);
  const [idPbiProduct, setIdPbiProduct] = useState(params.idPbiProduct);
  const [isAddAnggota, setIsAddAnggota] = useState(false);
  const [isgetdata, setIsgetdata] = useState(false);
  const [isAddPelaksana, setIsAddPelaksana] = useState(false);
  const [dataDodProduct, setDataDodProduct] = useState([]);
  const [selectedDod, setSelectedDod] = useState({});
  useEffect(() => {
    fetchData();
    getDataAnggota();
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
          "http://202.157.189.177:8080/api/database/rows/table/578/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
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
          "http://202.157.189.177:8080/api/database/rows/table/651/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
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
      setDataDodProduct(dataOption);
    } catch (error) {
      setError(error.message);
    }
  };
  const getDataAnggota = async () => {
    setIsgetdata(true);
    try {
      const response = await axios({
        method: "GET",
        url: `http://202.157.189.177:8080/api/database/rows/table/577/${idPbi}/?user_field_names=true`,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });
      console.log(
        `http://202.157.189.177:8080/api/database/rows/table/577/${idPbi}/?user_field_names=true`
      );
      console.log(response.data, "all data Angota");
      const allData = response.data;

      // Mengambil array AnggotaSprint
      const anggotaSprint = allData.AnggotaSprint;

      // Memetakan AnggotaSprint untuk mendapatkan data user masing-masing
      const anggotaDetailsPromises = anggotaSprint.map((anggota) =>
        getSingleDataUser(anggota.id)
      );

      // Menunggu semua promise selesai dan mengumpulkan hasilnya
      const anggotaDetails = await Promise.all(anggotaDetailsPromises);

      // Menambahkan informasi tambahan dari getSingleDataUser ke anggotaSprint
      const combinedData = anggotaSprint.map((anggota, index) => ({
        ...anggota,
        userDetails: anggotaDetails[index],
      }));

      console.log(combinedData, "combined data AnggotaSprint dengan details");
      setDataAnggota(combinedData);
      return combinedData;
    } catch (error) {
      console.log(error);
    }
  };
  const getSingleDataUser = async (id) => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://202.157.189.177:8080/api/database/rows/table/717/${id}/?user_field_names=true`,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
        },
      });

      console.log(response.data, "data Anggota Sprint");
      const userData = response.data;

      return userData;
    } catch (error) {
      console.log(error);
    }
  };
  const getDataPelaksana = async (id) => {
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
          "http://202.157.189.177:8080/api/database/rows/table/718/?" + param,
        headers: {
          Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
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

  const openAnggota = () => {
    setIsAddAnggota(true);
  };
  const openPelaksana = (data) => {
    setIsAddPelaksana(true);
    setSelectedDod(data);
    getDataPelaksana(data.id);
  };
  console.log({ idSprint, idPbi, idPbiProduct });
  return (
    <div
      data-aos="fade-down"
      data-aos-delay="550"
      className="w-full h-full flex flex-col justify-start items-center pb-25"
    >
      {/* <div className="w-full flex justify-start items-center mt-5 bg-gradient-to-r from-[#1D4ED8] to-[#a2bbff] p-4 rounded-md">
        <h3 className="text-white text-base font-medium">DOD PRODUCT</h3>
      </div> */}

      <div className="w-full flex justify-between items-center transition-transform duration-500 ease-in-out transform">
        <div className="w-full transform transition-transform duration-500 ease-in-out">
          <ModalAddAnggota
            open={isAddAnggota}
            setOpen={() => setIsAddAnggota(false)}
            idPbi={idPbi}
            dataPbi={dataPbi}
            data={dataAnggota}
            getData={getDataAnggota}
          />
          <ModalAddPelaksana
            id={selectedDod.id}
            isGet={isgetdata}
            setGet={() => {
              setIsgetdata(false);
            }}
            idPbi={idPbi}
            open={isAddPelaksana}
            setOpen={() => setIsAddPelaksana(false)}
            dataDod={selectedDod}
            data={dataPelaksana}
            getData={getDataPelaksana}
          />

          <TableDodSprint
            idSprint={idSprint}
            openAnggota={openAnggota}
            idPbi={idPbi}
            width={50}
            setDod={(a) => {
              openPelaksana(a);
            }}
            data={data}
            getData={fetchData}
            dataUser={dataPelaksana}
            getDataUser={getDataPelaksana}
            optionDod={dataDodProduct}
          />
        </div>
      </div>
    </div>
  );
}

export default DodSprint;
