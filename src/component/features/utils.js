import axios from "axios";
import Filter from "./filter";
import Swal from "sweetalert2";

const getDodSprintForPBIDelete = async (id, idPbi) => {
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
      url: "http://202.157.189.177:8080/api/database/rows/table/578/?" + param,
      headers: {
        Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
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
      url: "http://202.157.189.177:8080/api/database/rows/table/714/?" + param,
      headers: {
        Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
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
      url: "http://202.157.189.177:8080/api/database/rows/table/718/?" + param,
      headers: {
        Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
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
  try {
    const capaian = await getDataCapaian(data);
    const pelaksana = await getDataPelaksana(data.id);

    if (capaian.length > 0) {
      for (const element of capaian) {
        console.log(element, "Capaian");
        await axios({
          method: "DELETE",
          url:
            "http://202.157.189.177:8080/api/database/rows/table/714/" +
            element.id +
            "/",
          headers: {
            Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          },
        });
      }
    }

    if (pelaksana.length > 0) {
      for (const element of pelaksana) {
        console.log(element, "pelaksana");
        await axios({
          method: "DELETE",
          url:
            "http://202.157.189.177:8080/api/database/rows/table/718/" +
            element.id +
            "/",
          headers: {
            Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
          },
        });
      }
    }
    await axios({
      method: "DELETE",
      url:
        "http://202.157.189.177:8080/api/database/rows/table/578/" +
        data.id +
        "/",
      headers: {
        Authorization: "Token wFcCXiNy1euYho73dBGwkPhjjTdODzv6",
      },
    });
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
