import React, { useState, useEffect } from 'react';
import { getCategories, getProducts, createOrder } from '../services/api.js';
import { 
  Plus, Minus, Trash2, ShoppingBag, Check, ChevronLeft, Coffee, 
  AlertCircle, ShoppingCart, Loader2, AlertTriangle, Info, Search, X
} from 'lucide-react';
import FroozoLogo from '../components/FroozoLogo.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';
import { useNavigate } from 'react-router-dom';

const TABLES = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Takeaway'];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Fetch categories and all products at once
  useEffect(() => {
    Promise.all([getCategories(), getProducts()])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data);
        setAllProducts(prodRes.data);
        if (catRes.data.length > 0) {
          setSelectedCat(catRes.data[0]);
        }
      })
      .catch(() => setServerError(true))
      .finally(() => setDataLoading(false));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.productId === product._id);
      if (ex) return prev.map((i) => i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (productId) => setCart((prev) => prev.filter((i) => i.productId !== productId));
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleCreateOrder = async () => {
    if (!selectedTable || cart.length === 0) return;
    setLoading(true);
    try {
      await createOrder({ tableNumber: selectedTable, items: cart, totalAmount: total });
      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => setOrderSuccess(false), 2500);
    } catch {
      alert('Failed to create order. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on category search input
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Filter products based on selected category AND product search input
  const displayedProducts = allProducts.filter((product) => {
    const prodCatId = typeof product.categoryId === 'object' ? product.categoryId?._id : product.categoryId;
    const matchesCategory = selectedCat ? prodCatId === selectedCat._id : true;
    
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // If staff is searching, search globally (across all categories) to save time,
    // otherwise filter by the active category tab.
    return searchQuery ? matchesSearch : matchesCategory;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-froozo-cream font-sans text-froozo-brown">
      
      {/* 1. LEFT SIDEBAR: Categories */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-froozo-sand flex flex-col shadow-sm">
        <div className="p-4 border-b border-froozo-sand bg-froozo-cream/30 flex items-center justify-between">
          <FroozoLogo size="xs" />
          <span className="text-[10px] bg-froozo-beige px-2 py-0.5 rounded font-black text-froozo-mocha">POS V1</span>
        </div>

        {/* Category Search */}
        <div className="p-3 border-b border-froozo-sand bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-froozo-mocha/50" />
            <input 
              type="text" 
              placeholder="Search category..." 
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full text-xs border border-froozo-sand rounded-lg pl-8 pr-7 py-2 bg-froozo-cream/30 focus:outline-none focus:ring-1 focus:ring-froozo-caramel focus:bg-white transition-all"
            />
            {categorySearch && (
              <button onClick={() => setCategorySearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-froozo-mocha/50 hover:text-froozo-brown">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#FCF9F5]">
          {filteredCategories.map((cat) => {
            const isSelected = selectedCat?._id === cat._id && !searchQuery;
            return (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCat(cat);
                  setSearchQuery(''); // Clear product search when clicking category
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-froozo-coffee text-white shadow-sm'
                    : 'text-froozo-mocha hover:text-froozo-coffee hover:bg-froozo-beige/60'
                }`}
              >
                <CategoryIcon name={cat.name} className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-froozo-caramel'}`} />
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
          {filteredCategories.length === 0 && (
            <p className="text-xs text-froozo-mocha/50 text-center py-8">No categories match</p>
          )}
        </div>
      </aside>

      {/* 2. CENTER AREA: Product Grid */}
      <section className="flex-1 flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <header className="bg-white border-b border-froozo-sand px-5 py-3 flex items-center justify-between flex-shrink-0 gap-4">
          
          {/* Search Products */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-froozo-mocha/50" />
            <input 
              type="text" 
              placeholder={selectedCat ? `Search items in ${selectedCat.name}...` : 'Search all products...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-froozo-sand rounded-xl pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-froozo-caramel/40 focus:border-froozo-caramel"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-froozo-mocha/50 hover:text-froozo-brown">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/admin/orders')}
              className="text-froozo-coffee hover:bg-froozo-beige px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-froozo-sand/60">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders Panel</span>
            </button>
            <button onClick={() => navigate('/')}
              className="text-froozo-mocha hover:bg-froozo-cream px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span>Home</span>
            </button>
          </div>
        </header>

        {/* Server Error / Notification Banner */}
        {serverError && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-2 flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-xs font-medium">Server offline. Check local server connection.</p>
          </div>
        )}

        {/* Table Selection - Compact Row */}
        <div className="bg-white px-5 py-2.5 border-b border-froozo-sand flex items-center justify-between flex-shrink-0 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-froozo-mocha uppercase tracking-wider">Active Table:</span>
            <div className="flex gap-1.5 flex-wrap">
              {TABLES.map((t) => (
                <button key={t} onClick={() => setSelectedTable(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedTable === t
                      ? 'bg-froozo-caramel text-white border-froozo-caramel shadow-sm'
                      : 'bg-froozo-cream/50 text-froozo-brown border-froozo-sand/70 hover:border-froozo-coffee'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {searchQuery && (
            <span className="text-xs text-froozo-mocha bg-froozo-beige px-2.5 py-1 rounded-lg font-semibold">
              Showing search results globally
            </span>
          )}
        </div>

        {/* Products Listing Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {!selectedTable && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2 shadow-sm text-amber-800 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Please click on a table above to assign items to an order ticket.</span>
            </div>
          )}

          {dataLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 text-froozo-caramel animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {displayedProducts.map((product) => {
                const cartItem = cart.find((i) => i.productId === product._id);
                return (
                  <div key={product._id}
                    className={`card overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                      cartItem ? 'ring-2 ring-froozo-caramel shadow-warm bg-white' : 'hover:shadow-card bg-white'
                    }`}>
                    <div>
                      {product.image && (
                        <div className="h-24 overflow-hidden bg-froozo-beige">
                          <img src={product.image} alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.parentElement.style.display = 'none'; }} />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-bold text-froozo-brown text-sm leading-tight line-clamp-2" title={product.name}>
                          {product.name}
                        </p>
                        <p className="text-froozo-caramel font-black text-sm mt-1">₹{product.price}</p>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      {cartItem ? (
                        <div className="flex items-center justify-between bg-froozo-beige rounded-lg p-0.5">
                          <button onClick={() => updateQty(product._id, -1)}
                            className="w-6 h-6 rounded bg-white flex items-center justify-center text-froozo-coffee hover:bg-froozo-sand shadow-sm">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-black text-froozo-brown text-xs">{cartItem.quantity}</span>
                          <button onClick={() => updateQty(product._id, 1)}
                            className="w-6 h-6 rounded bg-froozo-coffee flex items-center justify-center text-white hover:bg-froozo-brown shadow-sm">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { if (!selectedTable) return; addToCart(product); }}
                          className={`w-full py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-0.5 transition-all ${
                            selectedTable
                              ? 'bg-froozo-coffee text-white hover:bg-froozo-brown'
                              : 'bg-froozo-sand text-froozo-mocha/60 cursor-not-allowed'
                          }`}>
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {displayedProducts.length === 0 && (
                <div className="col-span-full text-center py-16 bg-white border border-froozo-sand/30 rounded-2xl p-8">
                  <Coffee className="w-10 h-10 text-froozo-mocha/20 mx-auto mb-2" />
                  <p className="text-froozo-mocha text-sm font-semibold">No items match criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. RIGHT PANEL: Ticket Details */}
      <section className="w-80 flex-shrink-0 flex flex-col bg-white border-l border-froozo-sand shadow-warm">
        <div className="p-4 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4A2C17, #8B5E3C)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Ticket Info</p>
              <p className="text-white font-black text-base">{selectedTable || 'Select Table'}</p>
            </div>
            {cartCount > 0 && (
              <div className="bg-froozo-caramel rounded-full w-7 h-7 flex items-center justify-center shadow">
                <span className="text-white text-xs font-black">{cartCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-froozo-cream/10">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-froozo-mocha/50 p-6 text-center">
              <ShoppingCart className="w-10 h-10 text-froozo-sand mb-2" />
              <p className="text-xs font-bold text-froozo-brown">Ticket is Empty</p>
              <p className="text-[10px] text-froozo-mocha mt-0.5">Select a table and add menu items.</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {cart.map((item) => (
                <div key={item.productId} className="bg-white rounded-xl p-3 border border-froozo-sand/40 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-froozo-brown text-xs leading-tight truncate">{item.name}</p>
                      <p className="text-froozo-mocha text-[10px] font-semibold">₹{item.price} each</p>
                    </div>
                    <button onClick={() => removeItem(item.productId)}
                      className="text-froozo-mocha/40 hover:text-red-500 transition-colors flex-shrink-0 p-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.productId, -1)}
                        className="w-6 h-6 rounded border border-froozo-sand bg-white flex items-center justify-center hover:bg-froozo-sand active:scale-90">
                        <Minus className="w-3 h-3 text-froozo-coffee" />
                      </button>
                      <span className="font-black text-froozo-brown text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)}
                        className="w-6 h-6 rounded bg-froozo-coffee flex items-center justify-center hover:bg-froozo-brown active:scale-90">
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <p className="font-black text-froozo-coffee text-sm">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-froozo-sand p-4 space-y-3 bg-white">
          {cart.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-froozo-mocha text-xs font-semibold">
                <span>Subtotal ({cartCount} items)</span><span>₹{total}</span>
              </div>
              <div className="flex justify-between font-black text-froozo-brown text-base border-t border-froozo-sand pt-2">
                <span>Total Due</span>
                <span className="text-froozo-caramel">₹{total}</span>
              </div>
            </div>
          )}

          {orderSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-green-700 font-bold text-xs">Sent to Kitchen!</p>
            </div>
          ) : (
            <button
              onClick={handleCreateOrder}
              disabled={!selectedTable || cart.length === 0 || loading}
              className={`w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                selectedTable && cart.length > 0
                  ? 'bg-froozo-coffee text-white hover:bg-froozo-brown active:scale-95'
                  : 'bg-froozo-sand text-froozo-mocha/60 cursor-not-allowed'
              }`}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Send Order</>
              )}
            </button>
          )}

          {cart.length > 0 && (
            <button onClick={() => setCart([])}
              className="w-full py-1.5 text-xs text-froozo-mocha hover:text-red-500 font-bold border border-transparent rounded-lg">
              Clear Current Ticket
            </button>
          )}
        </div>
      </section>

    </div>
  );
};

export default StaffDashboard;
