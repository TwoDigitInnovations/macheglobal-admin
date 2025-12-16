import React, { useState, useEffect } from 'react';
import { Api } from '../services/service';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Coupons = (props) => {
  const router = useRouter();
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    userUsageLimit: 1,
    isActive: true
  });

  useEffect(() => {
    getCoupons();
  }, [statusFilter]);

  const getCoupons = async () => {
    props.loader(true);
    try {
      const res = await Api('get', `coupon/getAllCoupons?status=${statusFilter}`, {}, router);
      props.loader(false);
      if (res?.status) {
        setCoupons(res.data);
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || 'Failed to fetch coupons');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    props.loader(true);
    
    try {
      const url = editingCoupon 
        ? `coupon/updateCoupon/${editingCoupon._id}`
        : 'coupon/createCoupon';
      
      const res = await Api('post', url, formData, router);
      props.loader(false);
      
      if (res?.status) {
        toast.success(res?.data?.message || 'Coupon saved successfully');
        setShowModal(false);
        resetForm();
        getCoupons();
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    props.loader(true);
    try {
      const res = await Api('delete', `coupon/deleteCoupon/${id}`, {}, router);
      props.loader(false);
      if (res?.status) {
        toast.success('Coupon deleted successfully');
        getCoupons();
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || 'Failed to delete coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      startDate: coupon.startDate?.split('T')[0],
      endDate: coupon.endDate?.split('T')[0],
      usageLimit: coupon.usageLimit || '',
      userUsageLimit: coupon.userUsageLimit,
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      userUsageLimit: 1,
      isActive: true
    });
    setEditingCoupon(null);
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Coupon Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-custom-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition">
            <Plus size={20} />
            Create Coupon
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-700" size={20} />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="all">All Coupons</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <div key={coupon._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="bg-custom-orange p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{coupon.code}</h3>
                    <p className="text-sm opacity-90 mt-1">{coupon.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    coupon.isActive && new Date(coupon.endDate) > new Date()
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}>
                    {coupon.isActive && new Date(coupon.endDate) > new Date() ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold text-gray-700">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}%` 
                        : `$${coupon.discountValue}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Order:</span>
                    <span className="font-semibold text-gray-700">${coupon.minOrderAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Used:</span>
                    <span className="font-semibold text-gray-700">
                      {coupon.usageCount} / {coupon.usageLimit || '∞'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until:</span>
                    <span className="font-semibold text-gray-700">
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition">
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No coupons found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl text-gray-800 font-bold mb-6">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="SAVE20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type *
                    </label>
                    <select
                      required
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                      className="w-full px-4 py-2 border text-gray-700  border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                      className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Order Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                      className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                    />
                  </div>

                  {formData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Discount Amount
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                        className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Optional"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Unlimited"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per User Limit *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.userUsageLimit}
                      onChange={(e) => setFormData({...formData, userUsageLimit: e.target.value})}
                      className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Get 20% off on your order"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border text-gray-700 border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-custom-orange hover:bg-orange-600 text-white rounded-lg transition">
                    {editingCoupon ? 'Update' : 'Create'} Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
