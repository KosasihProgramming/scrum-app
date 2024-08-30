const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <p>{`${payload[0].payload.month}`}</p>
        <p>{`Penjualan: ${payload[0].value}`}</p>
        <p>{`Target: ${payload[1]?.value}`}</p>{" "}
        {/* Menampilkan target jika tersedia */}
        <p>{payload[0].payload.details}</p>
      </div>
    );
  }

  return null;
};
