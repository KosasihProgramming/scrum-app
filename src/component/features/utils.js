import axios from "axios";
import Filter from "./filter";
import Swal from "sweetalert2";

const getDodSprintForPBIDelete = async (id, idPbi) => {
  if (!id || !idPbi) {
    alert("gagal, Data PBI Tidak Ada");
    return [];
  }
  try {
    const filters = [
      {
        type: "link_row_has",
        field: "Sprint",
        value: `${id}`,
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
      url: "http://103.181.182.230:6060/api/database/rows/table/640/?" + param,
      headers: {
        Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
      },
    });
    console.log(response.data.results, "ditemukan data Dod");
    const allData = response.data.results;
    if (allData.length > 0) {
      for (const element of allData) {
        await handleDelete(element);
      }
    }
    return allData;
  } catch (error) {
    console.log(error.message);
  }
};
const getDataCapaian = async (item) => {
  console.log(item);
  if (!item) {
    alert("gagal, Data Dod Tidak Ada");
    return [];
  }
  try {
    const filters = [
      {
        type: "link_row_has",
        field: "DodSprint",
        value: `${item.id}`,
      },
    ];
    const param = await Filter(filters);
    const response = await axios({
      method: "GET",
      url: "http://103.181.182.230:6060/api/database/rows/table/647/?" + param,
      headers: {
        Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
      },
    });
    console.log(response.data.results, "dod");
    const data = response.data.results;
    // Hitung total capaian
    const filterdata = data.filter((a) => a.isCheck == true);
    const totalCapaian = filterdata.reduce((total, item) => {
      return total + parseInt(item.Capaian || 0); // Asumsikan ada properti `capaian`
    }, 0);

    return data;
  } catch (error) {
    console.log(error, "error");
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
      url: "http://103.181.182.230:6060/api/database/rows/table/648/?" + param,
      headers: {
        Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
      },
    });
    console.log(response.data.results, "all data Pelaksana");
    const allData = response.data.results;

    return allData;
  } catch (error) {
    console.log(error);
  }
};

const handleDelete = async (data) => {
  if (!data) {
    alert("gagal, Data Dod Tidak Ada");
    return [];
  }
  try {
    const capaian = await getDataCapaian();
    const pelaksana = await getDataPelaksana();

    if (capaian.length > 0) {
      for (const element of capaian) {
        console.log(element, "Capaian");
        await axios({
          method: "DELETE",
          url:
            "http://103.181.182.230:6060/api/database/rows/table/647/" +
            element.id +
            "/",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
          },
        });
      }
      alert(capaian.length + " Capaian");
    }

    if (pelaksana.length > 0) {
      for (const element of pelaksana) {
        console.log(element, "pelaksana");
        await axios({
          method: "DELETE",
          url:
            "http://103.181.182.230:6060/api/database/rows/table/648/" +
            element.id +
            "/",
          headers: {
            Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
          },
        });
      }
      alert(pelaksana.length + " Pelaksana");
    }
    // await axios({
    //   method: "DELETE",
    //   url:
    //     "http://103.181.182.230:6060/api/database/rows/table/640/" +
    //     data.id +
    //     "/",
    //   headers: {
    //     Authorization: "Token R5XKLhkMz3enZ7nfVvRBJhs4IjbApdVw",
    //   },
    // });
  } catch (error) {
    if (error.response) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: `Error: ${error.response.data.error}`,
      });
      console.error("Server responded with an error:", error.response.data);
    } else if (error.request) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "No response received from the server.",
      });
      console.error("No response received:", error.request);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error setting up request: ${error.message}`,
      });
      console.error("Error setting up request:", error.message);
    }
  }
};

export { getDodSprintForPBIDelete };
