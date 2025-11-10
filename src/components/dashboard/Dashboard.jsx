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

import TimeSpentChart from "./Chart/ChartComp";

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

  // ---------------- PDF Download ----------------
  const handleDownloadReport = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    // 1. Capture Table
    const tableCanvas = await html2canvas(reportRef.current, { scale: 2 });
    const tableImg = tableCanvas.toDataURL("image/png");
    pdf.addImage(tableImg, "PNG", 10, 10, 190, 0);

    // 2. Capture Chart (below table)
    const chartCanvas = await html2canvas(chartRef.current, { scale: 2 });
    const chartImg = chartCanvas.toDataURL("image/png");
    pdf.addPage();
    pdf.addImage(chartImg, "PNG", 10, 10, 190, 0);

    pdf.save("Learning_Progress_Report.pdf");
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
            <h1 className="dashboard-welcome">Welcome, {firstName}!</h1>
            <div className="signlang_dashboard-midsection">
              {/* TABLE SECTION */}
              <div className="signlang_sign-table" ref={reportRef}>
                <h2 className="gradient__text">Your Most Practiced Signs</h2>

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

              {/* TIME SPENT CHART */}
              <div
                style={{
                  flex: 2,
                  minWidth: "400px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TimeSpentChart signDataList={signDataList} />
              </div>

              {/* DOWNLOAD BUTTON */}
              <button
                className="download-report-btn"
                onClick={handleDownloadReport}
              >
                Download Report (PDF)
              </button>
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
