import React, { useState, useEffect, useCallback } from 'react';
import { getOrders, updateOrderStatus, updateOrderPayment } from '../services/api.js';
import { io } from 'socket.io-client';
import { 
  RefreshCw, Clock, ChevronDown, ChevronUp, Banknote, Smartphone, 
  CheckCircle2, AlertCircle, ChefHat, Sparkles, HelpCircle, Coffee, Info
} from 'lucide-react';

const STATUS_FLOW = ['Pending', 'Preparing', 'Ready', 'Completed'];
const STATUS_STYLES = {
  Pending: 'status-pending', Preparing: 'status-preparing',
  Ready: 'status-ready', Completed: 'status-completed',
};

const STATUS_ICONS = {
  Pending: Clock,
  Preparing: ChefHat,
  Ready: CheckCircle2,
  Completed: Sparkles,
};

const OrderCard = ({ order, onStatusChange, onPayment }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const isCompleted = order.orderStatus === 'Completed';
  const isPaid = order.paymentStatus === 'Paid';

  const handleStatus = async (status) => {
    setUpdating(true);
    try { await onStatusChange(order._id, status); } finally { setUpdating(false); }
  };
  const handlePay = async (method) => {
    setUpdating(true);
    try { await onPayment(order._id, method); } finally { setUpdating(false); }
  };

  const StatusIcon = STATUS_ICONS[order.orderStatus] || Clock;

  return (
    <div className={`card overflow-hidden transition-all duration-200 ${isCompleted ? 'opacity-60' : 'hover:scale-[1.01] hover:shadow-warm'}`}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-black text-froozo-brown text-lg">#{order.orderNumber}</span>
              <span className={`text-xs border rounded-full px-2.5 py-1 font-bold flex items-center gap-1 ${STATUS_STYLES[order.orderStatus]}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {order.orderStatus}
              </span>
            </div>
            <p className="text-froozo-mocha text-sm font-semibold">{order.tableNumber} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-black text-froozo-caramel text-xl">₹{order.totalAmount}</p>
            <span className={`text-xs border rounded-full px-2.5 py-1 font-bold inline-block mt-1 ${isPaid ? 'payment-paid' : 'payment-pending'}`}>
              {isPaid ? `✓ Paid via ${order.paymentMethod}` : 'Payment Pending'}
            </span>
          </div>
        </div>
        <p className="text-froozo-mocha text-xs flex items-center gap-1.5 font-medium mt-3 bg-froozo-beige/40 p-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-froozo-mocha" />
          Received: {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <button onClick={() => setExpanded(!expanded)}
        className="w-full border-t border-froozo-sand/50 px-4 py-3 flex items-center justify-center gap-1.5 text-froozo-mocha hover:text-froozo-coffee hover:bg-froozo-cream transition-all text-sm font-semibold">
        {expanded ? <><ChevronUp className="w-4 h-4" /> Close Order Details</> : <><ChevronDown className="w-4 h-4" /> View Details & Actions</>}
      </button>

      {expanded && (
        <div className="border-t border-froozo-sand/50 p-5 bg-froozo-cream/50 space-y-5">
          {/* Items */}
          <div>
            <p className="text-xs font-bold text-froozo-mocha uppercase tracking-wider mb-2.5">Order Items</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-base">
                  <span className="text-froozo-brown font-medium">{item.name} <span className="text-froozo-mocha font-bold">×{item.quantity}</span></span>
                  <span className="font-bold text-froozo-coffee">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-froozo-sand font-black text-froozo-brown text-lg">
                <span>Total Amount</span><span className="text-froozo-caramel">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          {!isCompleted && (
            <div>
              <p className="text-xs font-bold text-froozo-mocha uppercase tracking-wider mb-2.5">Update Order Progress</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_FLOW.map((status) => {
                  const Icon = STATUS_ICONS[status] || Clock;
                  return (
                    <button key={status} onClick={() => handleStatus(status)} disabled={updating}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                        order.orderStatus === status
                          ? 'bg-froozo-coffee text-white border-froozo-coffee'
                          : 'bg-white text-froozo-mocha border-froozo-sand hover:border-froozo-coffee hover:text-froozo-coffee'
                      }`}>
                      <Icon className="w-3.5 h-3.5" />
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment */}
          {!isPaid && (
            <div>
              <p className="text-xs font-bold text-froozo-mocha uppercase tracking-wider mb-2.5">Collect Payment (₹{order.totalAmount})</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handlePay('Cash')} disabled={updating}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-base bg-froozo-green text-white hover:bg-green-700 transition-all active:scale-95 shadow-sm">
                  <Banknote className="w-5 h-5" /> Cash Payment
                </button>
                <button onClick={() => handlePay('UPI')} disabled={updating}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-base bg-froozo-coffee text-white hover:bg-froozo-brown transition-all active:scale-95 shadow-sm">
                  <Smartphone className="w-5 h-5" /> UPI Payment
                </button>
              </div>
            </div>
          )}

          {isPaid && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3.5">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-700 text-sm font-bold">Successfully Paid via {order.paymentMethod}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setError(null);
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      setError('Could not load orders. Make sure the backend is running.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Real-time socket events connection
  useEffect(() => {
    const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('🔌 Connected to real-time orders socket');
    });

    socket.on('orderCreated', (newOrder) => {
      setOrders((prev) => {
        // Prevent duplicate addition
        if (prev.some((o) => o._id === newOrder._id)) return prev;
        return [newOrder, ...prev];
      });
    });

    socket.on('orderUpdated', (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleStatusChange = async (id, status) => { 
    try {
      await updateOrderStatus(id, status); 
    } catch (e) {
      alert('Could not update order status.');
    }
  };
  
  const handlePayment = async (id, method) => { 
    try {
      await updateOrderPayment(id, method); 
    } catch (e) {
      alert('Could not record payment.');
    }
  };

  const counts = {
    active: orders.filter((o) => o.orderStatus !== 'Completed').length,
    unpaid: orders.filter((o) => o.paymentStatus === 'Pending').length,
    completed: orders.filter((o) => o.orderStatus === 'Completed').length,
    all: orders.length,
  };

  const filtered = orders.filter((o) => {
    if (filter === 'active') return o.orderStatus !== 'Completed';
    if (filter === 'completed') return o.orderStatus === 'Completed';
    if (filter === 'unpaid') return o.paymentStatus === 'Pending';
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <RefreshCw className="w-10 h-10 mb-3 animate-spin text-froozo-caramel mx-auto" />
        <p className="text-froozo-mocha font-medium">Loading orders...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-header text-3xl font-black">Orders Dashboard</h1>
          <p className="text-froozo-mocha text-sm font-semibold mt-1">Real-time incoming client orders</p>
        </div>
        <button onClick={loadOrders} className="btn-secondary flex items-center gap-2 text-sm font-bold py-2.5">
          <RefreshCw className="w-4 h-4" /> Refresh List
        </button>
      </div>

      {/* Helpful Instructions Banner for Older/Non-Technical Users */}
      <div className="bg-[#FFF9F2] border border-froozo-sand rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <Info className="w-6 h-6 text-froozo-caramel flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-froozo-brown text-sm">💡 Easy Guide for Cafe Staff</h4>
          <p className="text-froozo-mocha text-xs mt-1 leading-relaxed">
            New orders appear here <strong>automatically</strong> as they are created. 
            Tap the <strong className="text-froozo-coffee">"View Details & Actions"</strong> button on any card to see details, change its progress (Pending → Preparing → Ready → Completed), or collect cash/UPI payment.
          </p>
        </div>
      </div>

      {error && (
        <div className="card p-4 flex items-center gap-3 border-red-200 bg-red-50">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap bg-white p-1.5 rounded-2xl border border-froozo-sand/40 shadow-sm">
        {[
          { key: 'active', label: 'Active Orders', count: counts.active },
          { key: 'unpaid', label: 'Unpaid Bills', count: counts.unpaid },
          { key: 'completed', label: 'Completed', count: counts.completed },
          { key: 'all', label: 'All Orders', count: counts.all },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
              filter === key ? 'bg-froozo-coffee text-white border-froozo-coffee shadow-sm' : 'bg-transparent text-froozo-mocha border-transparent hover:bg-froozo-cream hover:text-froozo-coffee'
            }`}>
            {label}
            <span className={`text-xs rounded-full px-2 py-0.5 font-black ${filter === key ? 'bg-white/20 text-white' : 'bg-froozo-sand text-froozo-coffee'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-16 text-center bg-white border border-froozo-sand/30">
          <Coffee className="w-16 h-16 text-froozo-sand mx-auto mb-4" />
          <p className="text-froozo-brown font-black text-xl mb-1">No orders found</p>
          <p className="text-froozo-mocha text-sm">New orders will show up here automatically when placed from the POS</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((order) => (
            <OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} onPayment={handlePayment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
