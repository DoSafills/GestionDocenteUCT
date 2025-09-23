import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Ene", ventas: 4000 },
  { month: "Feb", ventas: 3000 },
  { month: "Mar", ventas: 5000 },
  { month: "Abr", ventas: 2780 },
  { month: "May", ventas: 4890 },
  { month: "Jun", ventas: 6390 },
];

function SalesChart() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4">Ventas Mensuales</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ventas" stroke="#2563eb" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;
