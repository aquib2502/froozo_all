const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const totalRevenue = todayOrders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const cashRevenue = todayOrders
      .filter((o) => o.paymentMethod === 'Cash')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const upiRevenue = todayOrders
      .filter((o) => o.paymentMethod === 'UPI')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingPayments = todayOrders
      .filter((o) => o.paymentStatus === 'Pending')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Top selling items
    const itemMap = {};
    todayOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemMap[item.name]) itemMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
        itemMap[item.name].qty += item.quantity;
        itemMap[item.name].revenue += item.quantity * item.price;
      });
    });
    const topItems = Object.values(itemMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // All-time stats
    const allOrders = await Order.find();
    const allTimePaid = allOrders.filter((o) => o.paymentStatus === 'Paid');
    const allTimeRevenue = allTimePaid.reduce((sum, o) => sum + o.totalAmount, 0);

    // 1. Daily (Hourly) - last 8 hours
    const dailyRevenue = [];
    for (let i = 7; i >= 0; i--) {
      const hourStart = new Date();
      hourStart.setHours(hourStart.getHours() - i, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourStart.getHours() + 1);
      const hourOrders = allOrders.filter(
        (o) => new Date(o.createdAt) >= hourStart && new Date(o.createdAt) < hourEnd && o.paymentStatus === 'Paid'
      );
      const total = hourOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      dailyRevenue.push({
        label: hourStart.getHours() + ':00',
        revenue: total,
      });
    }

    // 2. Weekly (Daily) - last 7 days
    const weeklyRevenue = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const dayOrders = allOrders.filter(
        (o) => new Date(o.createdAt) >= dayStart && new Date(o.createdAt) < dayEnd && o.paymentStatus === 'Paid'
      );
      const total = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      weeklyRevenue.push({
        label: dayNames[dayStart.getDay()],
        revenue: total,
      });
    }

    // 3. Monthly (Weekly) - last 4 weeks
    const monthlyRevenue = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekOrders = allOrders.filter(
        (o) => new Date(o.createdAt) >= weekStart && new Date(o.createdAt) < weekEnd && o.paymentStatus === 'Paid'
      );
      const total = weekOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      monthlyRevenue.push({
        label: i === 0 ? 'This Week' : `${i}w ago`,
        revenue: total,
      });
    }

    // 4. Yearly (Monthly) - last 12 months
    const yearlyRevenue = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthStart.getMonth() + 1);

      const monthOrders = allOrders.filter(
        (o) => new Date(o.createdAt) >= monthStart && new Date(o.createdAt) < monthEnd && o.paymentStatus === 'Paid'
      );
      const total = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      yearlyRevenue.push({
        label: monthNames[monthStart.getMonth()],
        revenue: total,
      });
    }

    res.json({
      today: {
        ordersCount: todayOrders.length,
        revenue: totalRevenue,
        cashRevenue,
        upiRevenue,
        pendingPayments,
        topItems,
        hourlyRevenue: dailyRevenue,
      },
      allTime: {
        ordersCount: allOrders.length,
        revenue: allTimeRevenue,
      },
      charts: {
        daily: dailyRevenue,
        weekly: weeklyRevenue,
        monthly: monthlyRevenue,
        yearly: yearlyRevenue,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
