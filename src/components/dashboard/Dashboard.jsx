/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { getSignData, getTopUsers } from "../../redux/actions/signdataaction";
import Spinner from "../Spinner/Spinner";
import NoData from "../../assests/No-data.svg";
import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TimeSpentChart from "./ChartComp";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reportRef = useRef(); // table screenshot
  const chartRef = useRef(); // chart screenshot

  const { loading: authLoader, accessToken } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!authLoader && !accessToken) {
      navigate("/login");
    }
    dispatch(getSignData());
    dispatch(getTopUsers());
  }, [accessToken, authLoader, navigate, dispatch]);

  const { signDataList, loading } = useSelector((state) => state.signData);

  // ---------------- Process Sign Counts ----------------
  const list = signDataList
    .map((data) => data.signsPerformed)
    .reduce((acc, val) => acc.concat(val), []);

  const newData = [];
  for (let i = 0; i < list.length; i++) {
    if (!list[i].SignDetected || list[i].SignDetected === "") continue; // skip empty signs
    const foundIndex = newData.findIndex(
      (d) => d.SignDetected === list[i].SignDetected
    );
    if (foundIndex === -1) {
      newData.push({ ...list[i] });
    } else {
      newData[foundIndex].count += list[i].count;
    }
  }

  const TopFiveSignsObject = newData
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ---------------- Process Time Spent Graph Data ----------------
  const timeHistory = signDataList.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    minutes: Math.round((item.timeSpent || 0) / 60),
  }));

  // ---------------- Weekly Progress Data ----------------
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // last 7 days including today

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  const weeklyData = last7Days.map((day) => {
    // Filter sessions for this day
    const daySessions = signDataList.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getFullYear() === day.getFullYear() &&
        itemDate.getMonth() === day.getMonth() &&
        itemDate.getDate() === day.getDate()
      );
    });
    // Sum total signs
    const totalSigns = daySessions.reduce(
      (sum, s) =>
        sum + s.signsPerformed.reduce((acc, sign) => acc + sign.count, 0),
      0
    );
    return totalSigns;
  });

  const chartData = {
    labels: last7Days.map((d) => weekDays[d.getDay()]),
    datasets: [
      {
        label: "Signs Practiced",
        data: weeklyData,
        backgroundColor: "rgba(53, 162, 235, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Weekly Signs Practiced" },
    },
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
      },
    },
  };



  const user = useSelector((state) => state.auth?.user);
  const firstName = user?.username
    ? user.username.split(" ")[0]
    : user?.name
    ? user.name.split(" ")[0]
    : "User";

  return (
    <div className="signlang_dashboard-container">
      {!(loading || authLoader) ? (
        signDataList.length > 0 ? (
          <>
            {/* Top section with welcome message and download button */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <h1 className="dashboard-welcome" style={{ textAlign: "center" }}>
                Welcome, {firstName}!
              </h1>

            </div>

            <div
              className="signlang_dashboard-midsection"
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              {/* ---------------- TABLE SECTION (LEFT) ---------------- */}
              <div
                className="signlang_sign-table"
                ref={reportRef}
                style={{ flex: 1, minWidth: "300px" }}
              >
                <h2 className="text-blue-950 font-extrabold text-lg text-center mb-5">
                  Your Most Practiced Signs
                </h2>
                <table>
                  <thead>
                    <tr>
                      <th className="table-heading">Sr.No</th>
                      <th className="table-heading">Signs</th>
                      <th className="table-heading">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TopFiveSignsObject.map((data, i) => (
                      <tr key={i} className="sign-row">
                        <td>{i + 1}</td>
                        <td>{data.SignDetected}</td>
                        <td>{data.count} times</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ---------------- CHARTS SECTION (RIGHT) ---------------- */}
              <div
                style={{
                  flex: 1,
                  minWidth: "300px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {/* Weekly Progress Chart (Top) */}
                <div
                  className="ml-10"
                  ref={chartRef}
                  style={{ width: "100%", height: "250px" }}
                >
                  <Bar data={chartData} options={chartOptions} />
                </div>

                {/* Time Spent Chart (Bottom) */}
                <div
                  style={{
                    flex: "0 0 auto",
                    height: "200px", // smaller height
                    width: "300px", // optional width limit
                    display: "flex",
                    flexDirection: "column", // stack title and chart
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginLeft: "60px",
                    marginTop: "20px", // add space from above chart
                    paddingTop: "10px", // extra padding for the title
                    background: "#fff", // optional: separate visually
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ marginBottom: "10px" }}>
                  </h3>
                  <TimeSpentChart signDataList={signDataList} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="signlang__nodata-cont">
            <img src={NoData} alt="no-data" />
            <h3 className="gradient__text">
              No Data Yet. Practice Some Signs To Track Progress.
            </h3>
          </div>
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Dashboard;
