import axios from "axios";
function Send() {
  const sendMessage = async () => {
    try {
      const response = await axios.post(
        "https://api.watzap.id/v1/send_message",
        {
          api_key: "C6E5LRGZKQIWLTQP", // Ganti dengan API key Anda
          number_key: "veECpkJBvMQ0GFDE", // Ganti dengan number key Anda
          phone_no: "6281278965100", // Ganti dengan nomor tujuan
          message: "Lawak bro", // Ganti dengan pesan yang ingin dikirim
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Pesan berhasil dikirim:", response.data);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  };

  return (
    <div>
      <button
        className="p-2 w-[10rem] flex justify-center items-center"
        onClick={sendMessage}
      >
        Kirim
      </button>
    </div>
  );
}

export default Send;
