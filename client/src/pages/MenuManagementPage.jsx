import React, { useState, useEffect } from 'react';
import { getCategories, getProducts, createProduct, updateProduct, deleteProduct } from '../services/api.js';
import { Plus, Pencil, Trash2, X, Check, Search, Package } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon.jsx';

const ProductModal = ({ product, categories, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    categoryId: product?.categoryId?._id || product?.categoryId || categories[0]?._id || '',
    image: product?.image || '',
    description: product?.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price || !form.categoryId) return;
    setSaving(true);
    try { await onSave({ ...form, price: Number(form.price) }); onClose(); }
    catch (e) { alert('Failed to save. Check server connection.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-warm-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-froozo-sand sticky top-0 bg-white rounded-t-2xl">
          <h2 className="font-black text-froozo-brown text-lg">{product ? 'Edit Item' : 'Add Menu Item'}</h2>
          <button onClick={onClose} className="text-froozo-mocha hover:text-froozo-brown transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-froozo-mocha uppercase tracking-wider mb-1.5">Item Name *</label>
            <input className="input-field" placeholder="e.g. Cappuccino" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-froozo-mocha uppercase tracking-wider mb-1.5">Price (₹) *</label>
              <input className="input-field" type="number" min="0" placeholder="180" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-froozo-mocha uppercase tracking-wider mb-1.5">Category *</label>
              <select className="input-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-froozo-mocha uppercase tracking-wider mb-1.5">Image URL (optional)</label>
            <input className="input-field" placeholder="https://..." value={form.image}
              onChange={(e) => { setForm({ ...form, image: e.target.value }); setImgError(false); }} />
          </div>
          <div>
            <label className="block text-xs font-bold text-froozo-mocha uppercase tracking-wider mb-1.5">Description (optional)</label>
            <textarea className="input-field resize-none" rows={2} placeholder="Brief description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {form.image && !imgError && (
            <div className="h-32 rounded-xl overflow-hidden border border-froozo-sand bg-froozo-beige">
              <img src={form.image} alt="preview" className="w-full h-full object-cover"
                onError={() => setImgError(true)} />
            </div>
          )}
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || !form.name.trim() || !form.price}
            className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? '⏳ Saving...' : <><Check className="w-4 h-4" /> {product ? 'Save Changes' : 'Add Item'}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) setSelectedCat(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (!selectedCat) return;
    setLoading(true);
    getProducts(selectedCat._id).then((res) => setProducts(res.data)).finally(() => setLoading(false));
  }, [selectedCat]);

  const refreshProducts = async () => {
    if (!selectedCat) return;
    const res = await getProducts(selectedCat._id);
    setProducts(res.data);
  };

  const handleSave = async (form) => {
    if (editProduct) await updateProduct(editProduct._id, form);
    else await createProduct(form);
    await refreshProducts();
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item from the menu?')) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const selectedCatObj = categories.find((c) => c._id === selectedCat?._id);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-header">Menu Manager</h1>
          <p className="text-froozo-mocha text-sm">{products.length} items in {selectedCatObj?.name || '...'}</p>
        </div>
        <button onClick={() => { setEditProduct(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 flex-wrap">
        {categories.map((cat) => (
          <button key={cat._id} onClick={() => { setSelectedCat(cat); setSearch(''); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all ${
              selectedCat?._id === cat._id
                ? 'bg-froozo-coffee text-white border-froozo-coffee shadow-sm'
                : 'bg-white text-froozo-mocha border-froozo-sand hover:border-froozo-coffee hover:text-froozo-coffee'
            }`}>
            <CategoryIcon name={cat.name} className="w-4 h-4" /> {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-froozo-mocha/50" />
        <input className="input-field pl-9" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><p className="text-froozo-mocha animate-pulse">Loading menu...</p></div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-10 h-10 text-froozo-sand mx-auto mb-3" />
          <p className="text-froozo-brown font-bold mb-1">No items found</p>
          <p className="text-froozo-mocha text-sm mb-4">{search ? 'Try a different search term' : 'Add your first item to this category'}</p>
          {!search && (
            <button onClick={() => { setEditProduct(null); setShowModal(true); }} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product._id} className="card overflow-hidden group">
              {product.image ? (
                <div className="h-36 overflow-hidden relative bg-froozo-beige">
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.parentElement.classList.add('hidden'); }} />
                </div>
              ) : (
                <div className="h-36 bg-froozo-beige flex items-center justify-center text-froozo-mocha/40">
                  <CategoryIcon name={selectedCatObj?.name} className="w-10 h-10" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-froozo-brown truncate">{product.name}</p>
                    {product.description && <p className="text-froozo-mocha text-xs mt-0.5 line-clamp-1">{product.description}</p>}
                  </div>
                  <p className="font-black text-froozo-caramel text-lg flex-shrink-0">₹{product.price}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setEditProduct(product); setShowModal(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold border border-froozo-sand text-froozo-mocha hover:border-froozo-coffee hover:text-froozo-coffee bg-white transition-all">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)}
                    className="flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-bold border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 bg-white transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
        />
      )}
    </div>
  );
};

export default MenuManagementPage;
