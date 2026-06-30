import React, { useState, useEffect, useCallback } from 'react';
import { getDashboard, getOrders } from '../services/api.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Banknote, Smartphone, Clock, Star, 
  RefreshCw, AlertCircle, Loader2, BarChart3, CheckCircle2, Coffee, AlertTriangle 
} from 'lucide-react';

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const StatCard = ({ icon: Icon, label, value, sub, iconBg }) => (
  <div className="card p-5">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mb-3" style={{ background: iconBg }}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-froozo-mocha text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-black text-froozo-brown">{value}</p>
    {sub && <p className="text-froozo-mocha text-xs mt-1">{sub}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-froozo-sand rounded-xl p-3 shadow-warm text-sm">
        <p className="font-semibold text-froozo-brown">{label}</p>
        <p className="text-froozo-coffee">{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#4A2C17', '#C4843A'];

const STATUS_STYLES = {
  Pending: 'status-pending',
  Preparing: 'status-preparing',
  Ready: 'status-ready',
  Completed: 'status-completed',
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartFilter, setChartFilter] = useState('daily');

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [dashRes, ordersRes] = await Promise.all([getDashboard(), getOrders()]);
      setData(dashRes.data);
      setLiveOrders(ordersRes.data.filter((o) => o.orderStatus !== 'Completed').slice(0, 6));
    } catch (e) {
      setError('Could not connect to server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-froozo-caramel animate-spin mx-auto mb-3" />
          <p className="text-froozo-mocha font-medium">Brewing your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="font-bold text-froozo-brown text-lg mb-2">Connection Error</p>
        <p className="text-froozo-mocha text-sm mb-4">{error}</p>
        <button onClick={loadData} className="btn-primary">Try Again</button>
      </div>
    );
  }

  const today = data?.today || {};
  const pieData = [
    { name: 'Cash', value: today.cashRevenue || 0 },
    { name: 'UPI', value: today.upiRevenue || 0 },
  ];
  const topItems = today.topItems || [];
  const activeChartData = data?.charts?.[chartFilter] || [];

  const chartTitles = {
    daily: "Revenue Today (by hour)",
    weekly: "Revenue This Week (by day)",
    monthly: "Revenue This Month (by week)",
    yearly: "Revenue This Year (by month)"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-header flex items-center gap-2">Welcome back to Froozo <Coffee className="w-6 h-6 text-froozo-caramel" /></h1>
          <p className="text-froozo-mocha text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={loadData} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Today's Orders" value={today.ordersCount || 0}
          sub={`${data?.allTime?.ordersCount || 0} all-time`} iconBg="linear-gradient(135deg,#4A2C17,#8B5E3C)" />
        <StatCard icon={TrendingUp} label="Today's Revenue" value={formatINR(today.revenue)}
          sub="From paid orders" iconBg="linear-gradient(135deg,#2D7D4A,#4CAF70)" />
        <StatCard icon={Banknote} label="Cash Collected" value={formatINR(today.cashRevenue)}
          iconBg="linear-gradient(135deg,#6B3F1F,#C4843A)" />
        <StatCard icon={Smartphone} label="UPI Collected" value={formatINR(today.upiRevenue)}
          iconBg="linear-gradient(135deg,#E8722A,#F5A056)" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="card p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-bold text-froozo-brown">{chartTitles[chartFilter]}</h3>
            <select 
              value={chartFilter}
              onChange={(e) => setChartFilter(e.target.value)}
              className="text-xs border border-froozo-sand rounded-xl px-3 py-1.5 bg-white text-froozo-brown font-semibold focus:outline-none focus:ring-2 focus:ring-froozo-caramel/40"
            >
              <option value="daily">Daily (Hours)</option>
              <option value="weekly">Weekly (Days)</option>
              <option value="monthly">Monthly (Weeks)</option>
              <option value="yearly">Yearly (Months)</option>
            </select>
          </div>
          {activeChartData.some((h) => h.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activeChartData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5ECD7" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8B5E3C' }} />
                <YAxis tick={{ fontSize: 11, fill: '#8B5E3C' }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#C4843A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-froozo-mocha/50 border border-dashed border-froozo-sand rounded-xl bg-froozo-cream/30">
              <div className="text-center"><BarChart3 className="w-8 h-8 mx-auto mb-2 text-froozo-mocha/40" /><p className="text-sm">No revenue data yet</p></div>
            </div>
          )}
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold text-froozo-brown mb-4">Payment Split</h3>
          {(today.cashRevenue > 0 || today.upiRevenue > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatINR(v)} />
                <Legend formatter={(v) => <span style={{ color: '#4A2C17', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-froozo-mocha/50 border border-dashed border-froozo-sand rounded-xl bg-froozo-cream/30">
              <div className="text-center"><Banknote className="w-8 h-8 mx-auto mb-2 text-froozo-mocha/40" /><p className="text-sm">No payments yet</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Sellers */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-froozo-caramel fill-froozo-caramel" />
            <h3 className="font-bold text-froozo-brown">Top Selling Items</h3>
          </div>
          {topItems.length > 0 ? (
            <div className="space-y-3">
              {topItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: i === 0 ? '#C4843A' : i === 1 ? '#8B5E3C' : '#6B3F1F' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-froozo-brown truncate">{item.name}</span>
                      <span className="text-sm text-froozo-mocha ml-2">{item.qty} sold</span>
                    </div>
                    <div className="h-1.5 bg-froozo-sand rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(item.qty / topItems[0].qty) * 100}%`, background: 'linear-gradient(90deg,#4A2C17,#C4843A)' }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-froozo-coffee">{formatINR(item.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-froozo-mocha/50 border border-dashed border-froozo-sand rounded-xl bg-froozo-cream/30">
              <div className="text-center"><Coffee className="w-8 h-8 mx-auto mb-2 text-froozo-mocha/40" /><p className="text-sm">No sales data yet</p></div>
            </div>
          )}
        </div>

        {/* Live Orders */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-froozo-caramel" />
            <h3 className="font-bold text-froozo-brown">Active Orders</h3>
          </div>
          {liveOrders.length > 0 ? (
            <div className="space-y-2">
              {liveOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-froozo-cream rounded-xl border border-froozo-sand/40">
                  <div>
                    <p className="font-bold text-froozo-brown text-sm">#{order.orderNumber}</p>
                    <p className="text-froozo-mocha text-xs">{order.tableNumber} · {order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-froozo-coffee text-sm">₹{order.totalAmount}</p>
                    <span className={`text-xs border rounded-full px-2 py-0.5 font-medium ${STATUS_STYLES[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-froozo-mocha/50 border border-dashed border-froozo-sand rounded-xl bg-froozo-cream/30">
              <div className="text-center"><CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500/60" /><p className="text-sm">All caught up!</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Alert */}
      {today.pendingPayments > 0 && (
        <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-orange-800">Pending Payments</p>
            <p className="text-orange-700 text-sm">{formatINR(today.pendingPayments)} still awaiting collection</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
