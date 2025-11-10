import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeeklyChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: "250px" }}>
      <h2 className="text-blue-950 font-extrabold text-lg text-center mb-4">
        Weekly Progress
      </h2>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
