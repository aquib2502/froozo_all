import React, { useState, useEffect } from 'react';
import { getCategories, getProducts } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Coffee, Smartphone, ChevronLeft, QrCode, Inbox } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon.jsx';

const MenuPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getProducts()])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data);
        setAllProducts(prodRes.data);
        if (catRes.data.length > 0) setSelectedCat(catRes.data[0]._id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayedProducts = selectedCat
    ? allProducts.filter((p) => {
        const catId = typeof p.categoryId === 'object' ? p.categoryId._id : p.categoryId;
        return catId === selectedCat;
      })
    : allProducts;

  const selectedCatObj = categories.find((c) => c._id === selectedCat);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDF6EC' }}>
      <div className="text-center">
        <Coffee className="w-12 h-12 mb-4 mx-auto animate-bounce text-froozo-caramel" />
        <p className="text-froozo-brown font-bold text-lg">Loading Froozo Menu...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#FDF6EC' }}>
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4A2C17 0%, #6B3F1F 50%, #8B5E3C 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C4843A 0%, transparent 60%), radial-gradient(circle at 80% 20%, #E8722A 0%, transparent 50%)' }} />
        <div className="relative px-4 py-10 text-center max-w-2xl mx-auto">
          <button onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1 font-semibold">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 mx-auto"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Coffee className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl font-black text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Froozo</h1>
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#F5A056' }}>Digital Menu</p>
          <p className="text-white/60 text-sm max-w-sm mx-auto">
            Fresh flavours, live preparations, and a whole lot of love — crafted just for you.
          </p>

          <button onClick={() => setShowQR(!showQR)}
            className="mt-5 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2 text-sm transition-all border border-white/20 font-medium">
            <QrCode className="w-4 h-4" /> {showQR ? 'Hide QR Code' : 'QR Code for customers'}
          </button>

          {showQR && (
            <div className="mt-4 inline-block bg-white rounded-2xl p-5 shadow-warm-lg">
              <QRCodeSVG value="https://cafe-demo.com/menu" size={140} fgColor="#4A2C17" bgColor="#ffffff" level="M" />
              <p className="text-froozo-mocha text-xs mt-2 font-medium">cafe-demo.com/menu</p>
              <p className="text-froozo-mocha/50 text-[10px]">Scan to view this menu</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-froozo-sand shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            <button onClick={() => setSelectedCat(null)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                !selectedCat ? 'bg-froozo-coffee text-white' : 'bg-froozo-beige text-froozo-coffee hover:bg-froozo-sand'
              }`}>
              <CategoryIcon name="all" className="w-4 h-4" /> All Items
            </button>
            {categories.map((cat) => (
              <button key={cat._id} onClick={() => setSelectedCat(cat._id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCat === cat._id ? 'bg-froozo-coffee text-white' : 'bg-froozo-beige text-froozo-coffee hover:bg-froozo-sand'
                }`}>
                <CategoryIcon name={cat.name} className="w-4 h-4" /> {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {selectedCatObj && (
          <div className="flex items-center gap-2 mb-4">
            <CategoryIcon name={selectedCatObj.name} className="w-6 h-6 text-froozo-caramel" />
            <h2 className="text-xl font-black text-froozo-brown">{selectedCatObj.name}</h2>
            <span className="text-froozo-mocha text-sm">({displayedProducts.length} items)</span>
          </div>
        )}

        {displayedProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-froozo-sand/40 p-8 shadow-card">
            <Inbox className="w-12 h-12 mb-3 mx-auto text-froozo-mocha/40" />
            <p className="text-froozo-mocha font-semibold text-base">No items in this category yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedProducts.map((product) => {
              const catName = typeof product.categoryId === 'object' ? product.categoryId?.name : '';
              return (
                <div key={product._id} className="card overflow-hidden flex group hover:shadow-warm transition-shadow duration-200">
                  {product.image && (
                    <div className="w-28 flex-shrink-0 overflow-hidden bg-froozo-beige">
                      <img src={product.image} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.parentElement.style.display = 'none'; }} />
                    </div>
                  )}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="font-bold text-froozo-brown text-base leading-tight">{product.name}</p>
                      {product.description && (
                        <p className="text-froozo-mocha text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-black text-froozo-caramel text-xl">₹{product.price}</span>
                      {catName && (
                        <span className="text-xs bg-froozo-beige text-froozo-mocha border border-froozo-sand rounded-full px-2.5 py-1 font-medium truncate max-w-[80px]">
                          {catName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-8 pt-4 text-center border-t border-froozo-sand mt-4">
        <p className="text-froozo-mocha/60 text-sm">☕ Froozo Cafe · Mumbai, Maharashtra</p>
        <p className="text-froozo-mocha/40 text-xs mt-1">Ask our staff to place your order at the counter</p>
      </div>
    </div>
  );
};

export default MenuPage;
