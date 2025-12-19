import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import RevenueLineChart from "./RevenueLineChart";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);

  const [tab, setTab] = useState("general");
  const [venue, setVenue] = useState("all");
  const [days, setDays] = useState("all");

  useEffect(() => {
    // KPIs
    axios.get(`${process.env.REACT_APP_API}/stats`, {
      params: { tab, venue, days }
    }).then(res => setStats(res.data));

    // Chart
    axios.get(`${process.env.REACT_APP_API}/revenue`, {
      params: { tab, venue, days }
    }).then(res => setChartData(res.data));

  }, [tab, venue, days]);

  return (
    <div className="dashboard">

      {/* Tabs */}
      <div className="tabs">
        {["general", "booking", "coaching"].map(t => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="cards">
        <Card title="Active Members" value={stats.active} />
        <Card title="Inactive Members" value={stats.inactive} />
        <Card title="Bookings" value={stats.bookings} />
        <Card title="Cancelled" value={stats.cancelled} />
        <Card title="Total Revenue" value={`₹${stats.revenue || 0}`} />
      </div>

      {/* Filters */}
      <div className="filters">
        <select onChange={e => setVenue(e.target.value)}>
          <option value="all">All Venues</option>
          <option value="1">Grand Slam Arena</option>
          <option value="2">City Kickers Turf</option>
        </select>

        <select onChange={e => setDays(e.target.value)}>
          <option value="all">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      {/* Chart */}
      <div className="chart">
        <h4>Revenue – Venues</h4>
        <RevenueLineChart chartData={chartData} />
      </div>
    </div>
  );
}
