import React from "react";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TimeSpentChart({ signDataList }) {
  // Safety fallback if signDataList is undefined
  const sessions = signDataList || [];

  // Process data: group by date and sum seconds
  const groupedData = {};

  sessions.forEach((session) => {
    const date = dayjs(session.createdAt).format("YYYY-MM-DD");
    const seconds = session.secondsSpent || 0;

    if (groupedData[date]) {
      groupedData[date] += seconds;
    } else {
      groupedData[date] = seconds;
    }
  });

  // Convert grouped data to array and sort by date
  const data = Object.keys(groupedData)
    .map((date) => ({
      date,
      seconds: groupedData[date],
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Fallback for empty data
  if (data.length === 0) {
    data.push({ date: dayjs().format("YYYY-MM-DD"), seconds: 0 });
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
        Time Spent Practicing (Seconds)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => dayjs(value).format("DD MMM")}
          />
          <YAxis allowDecimals={false} domain={[0, "dataMax + 10"]} />
          <Tooltip
            labelFormatter={(value) => dayjs(value).format("DD MMM, YYYY")}
            formatter={(value) => `${value} seconds`}
          />
          <Line
            type="monotone"
            dataKey="seconds"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={{ r: 5, stroke: "#000", strokeWidth: 1.5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
