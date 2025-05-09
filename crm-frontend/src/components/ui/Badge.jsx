const badgeColors = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-400 text-black",
  Low: "bg-green-500 text-white",
};

const Badge = ({ label }) => {
  const color = badgeColors[label] || "bg-gray-300 text-black";
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
      {label}
    </span>
  );
};

export default Badge;
