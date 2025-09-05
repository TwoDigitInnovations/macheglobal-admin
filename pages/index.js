import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { Api } from '@/services/service';
import { Users, DollarSign, BarChart2, HelpCircle, TrendingUp, Package, ShoppingCart, AlertTriangle, Layers, FastForward, Plus, Boxes, BanknoteArrowDown, Pencil, ChartLine, ArchiveRestore, Warehouse, HandCoins } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Tooltip as RechartsTooltip
} from "recharts";

import isAuth from '@/components/isAuth';
import { userContext } from './_app';
import ModernStatsCard from '@/components/modernstatcard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

function Home(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [AllData, setAllData] = useState({});
  const [productList, setProductList] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [timeRange, setTimeRange] = useState("monthly");
  const [salesData, setSalesData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate years dynamically
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const [topSellingProducts, setTopSellingProducts] = useState([
    {
      name: "",
      sold: "",
      remaining: "",
    },
  ]);

  useEffect(() => {
    dashboarddetails();
  }, []);

  const dashboarddetails = async () => {
    props.loader(true);
    Api("get", "dashboarddetails", "", router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);
        if (res?.status) {
          setAllData(res?.data);
        } else {
          console.log(res?.data?.message);
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  useEffect(() => {
    const getMonthlySales = async () => {
      props.loader(true);
      Api("get", `getMonthlySales?year=${selectedYear}`, "", router).then(
        (res) => {
          console.log("res================>", res);
          props.loader(false);
          if (res?.status) {
            setSalesData(res?.data);
          } else {
            console.log(res?.data?.message);
            props.toaster({ type: "error", message: res?.data?.message });
          }
        },
        (err) => {
          props.loader(false);
          console.log(err);
          props.toaster({ type: "error", message: err?.data?.message });
          props.toaster({ type: "error", message: err?.message });
        }
      );
    };
    getMonthlySales();
  }, [selectedYear]);



  const COLORS = ['#FE4F01', '#127300', '#1a1a1a', '#FFC107'];

  return (
    <section className="min-h-screen bg-gray-50 p-4 md:p-6 h-full overflow-y-scroll scrollbar-hide overflow-scroll md:pb-24 pb-24 ">
      <div className="max-w-7xl mx-auto space-y-4">
        <p className='md:text-[32px] text-2xl text-black font-bold'> Dashboard</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModernStatsCard
            title="Total Sales"
            value={AllData?.totalUsers || "HTG 245,000"}
            icon={<ChartLine size={45} />}
            accentColor="#44DD22E3"
            message="+12% from last month"
            color="linear-gradient(0deg, #FF7000, #FF7000),
linear-gradient(200.56deg, rgba(255, 255, 255, 0.4) 2.27%, rgba(255, 112, 0, 0.48) 36.15%);
"

          />
          <ModernStatsCard
            title="Pending Orders"
            value={AllData?.totalCategories || "18"}
            icon={<ArchiveRestore size={45} />}
            accentColor="#44DD22E3"
            message="5 need shipping today"
            color="linear-gradient(0deg, rgba(0, 153, 255, 0.8), rgba(0, 153, 255, 0.8)),
linear-gradient(201.29deg, rgba(255, 255, 255, 0.48) 9.55%, rgba(0, 153, 255, 0.64) 42.34%);
"

          />
          <ModernStatsCard
            title="Products in Stock"
            value={`${AllData?.totalTransactionAmount || "152"}`}
            icon={<Warehouse size={45} />}
            accentColor="#E84F4F"
            message="5 low-stock alerts"
            color="linear-gradient(0deg, #FF7000, #FF7000),
linear-gradient(200.56deg, rgba(255, 255, 255, 0.4) 2.27%, rgba(255, 112, 0, 0.48) 36.15%);
"

          />
          <ModernStatsCard
            title="Earnings"
            value={AllData?.totalFeedbacks || "HTG 42,800"}
            icon={<BanknoteArrowDown size={45} />}
            accentColor="#44DD22E3"
            message="Next payout: 5th Sept, 2025"
            color="linear-gradient(0deg, rgba(0, 153, 255, 0.8), rgba(0, 153, 255, 0.8)),
linear-gradient(201.29deg, rgba(255, 255, 255, 0.48) 9.55%, rgba(0, 153, 255, 0.64) 42.34%);
"
          />
          <ModernStatsCard
            title="Refund Requests"
            value={AllData?.totalFeedbacks || "3"}
            icon={<HandCoins size={45} />}
            accentColor="#E84F4F"
            message="2 pending review"
            color="linear-gradient(0deg, #FF7000, #FF7000),
linear-gradient(200.56deg, rgba(255, 255, 255, 0.4) 2.27%, rgba(255, 112, 0, 0.48) 36.15%);
"
          />
          <ModernStatsCard
            title="Payouts Completed"
            value={AllData?.totalFeedbacks || "HTG 180,000"}
            icon={<BanknoteArrowDown size={45} />}
            accentColor="#0099FFCC"
            message="Last payout: 25th Aug, 2025"
            color="linear-gradient(0deg, rgba(0, 153, 255, 0.8), rgba(0, 153, 255, 0.8)),
linear-gradient(201.29deg, rgba(255, 255, 255, 0.48) 9.55%, rgba(0, 153, 255, 0.64) 42.34%);
"
          />

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 mt-1">Sales Trend (Last 7 Days)</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FE4F01] focus:border-transparent"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <div className="flex  bg-custom-orange rounded-lg">
                    <button className=" text-black px-4 py-2 text-sm font-medium">
                      Monthly
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FE4F01" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FE4F01" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value}`} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#374151'
                    }}
                    formatter={(value) => [`$${value}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="monthly"
                    stroke="#FE4F01"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 w-full max-w-sm">

            <div className="flex items-center gap-2 mb-5">
              <FastForward className="text-black" />
              <p className="text-lg font-semibold text-black">Quick Actions</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-black font-medium shadow-sm hover:bg-orange-200 transition">
                <Plus className="w-5 h-5" />
                Add New Product
              </button>

              <button className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 text-black font-medium shadow-sm hover:bg-gray-100 transition">
                <Boxes className="w-5 h-5" />
                View Orders
              </button>

              <button className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 text-black font-medium shadow-sm hover:bg-gray-100 transition">
                <BanknoteArrowDown className="w-5 h-5" />
                Withdraw Earnings
              </button>

              <button className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 text-black font-medium shadow-sm hover:bg-gray-100 transition">
                <Pencil className="w-5 h-5" />
                Edit Store Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default isAuth(Home);