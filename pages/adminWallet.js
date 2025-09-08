import React, { useState } from 'react';
import { Shield, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, DollarSign, CreditCard, History, Users, ShoppingCart, Percent } from 'lucide-react';
import { useRouter } from 'next/router';
const AdminWalletDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const router = useRouter()

    const adminWalletData = {
        balance: 485750,
        totalCommissionEarned: 2456890,
        totalPayoutsMade: 1971140,
        pendingWithdrawals: 12,
        thisMonthCommission: 145680,
        activeSellers: 248
    };

    const recentTransactions = [
        {
            id: 1,
            type: 'credit',
            amount: 100,
            description: 'Commission from Order #ORD1234',
            orderId: 'ORD1234',
            sellerId: 'SELL001',
            sellerName: 'Rajesh Electronics',
            createdAt: '2024-11-15T10:30:00Z'
        },
        {
            id: 2,
            type: 'debit',
            amount: 5000,
            description: 'Seller withdrawal payout',
            sellerId: 'SELL045',
            sellerName: 'Fashion Hub Store',
            createdAt: '2024-11-15T09:15:00Z'
        },
        {
            id: 3,
            type: 'credit',
            amount: 125,
            description: 'Commission from Order #ORD1235',
            orderId: 'ORD1235',
            sellerId: 'SELL002',
            sellerName: 'Home Decor Plus',
            createdAt: '2024-11-14T16:45:00Z'
        },
        {
            id: 4,
            type: 'debit',
            amount: 75,
            description: 'Refund reversal for cancelled order',
            orderId: 'ORD1220',
            sellerId: 'SELL001',
            sellerName: 'Rajesh Electronics',
            createdAt: '2024-11-14T14:20:00Z'
        },
        {
            id: 5,
            type: 'credit',
            amount: 85,
            description: 'Commission from Order #ORD1236',
            orderId: 'ORD1236',
            sellerId: 'SELL003',
            sellerName: 'Tech World',
            createdAt: '2024-11-14T11:30:00Z'
        }
    ];

    const pendingWithdrawals = [
        {
            id: 1,
            sellerId: 'SELL001',
            sellerName: 'Rajesh Electronics',
            amount: 5000,
            requestedAt: '2024-11-15T12:00:00Z',
            status: 'pending'
        },
        {
            id: 2,
            sellerId: 'SELL045',
            sellerName: 'Fashion Hub Store',
            amount: 3200,
            requestedAt: '2024-11-15T10:30:00Z',
            status: 'pending'
        },
        {
            id: 3,
            sellerId: 'SELL002',
            sellerName: 'Home Decor Plus',
            amount: 1800,
            requestedAt: '2024-11-15T08:15:00Z',
            status: 'pending'
        },
        {
            id: 4,
            sellerId: 'SELL067',
            sellerName: 'Sports Zone',
            amount: 2750,
            requestedAt: '2024-11-14T18:45:00Z',
            status: 'pending'
        }
    ];

    const processedWithdrawals = [
        {
            id: 5,
            sellerId: 'SELL034',
            sellerName: 'Book Paradise',
            amount: 4500,
            requestedAt: '2024-11-12T14:20:00Z',
            processedAt: '2024-11-13T10:15:00Z',
            status: 'approved'
        },
        {
            id: 6,
            sellerId: 'SELL012',
            sellerName: 'Gadget Store',
            amount: 2200,
            requestedAt: '2024-11-11T16:30:00Z',
            processedAt: '2024-11-12T11:45:00Z',
            status: 'approved'
        },
        {
            id: 7,
            sellerId: 'SELL089',
            sellerName: 'Beauty Corner',
            amount: 1500,
            requestedAt: '2024-11-10T12:00:00Z',
            processedAt: '2024-11-11T09:30:00Z',
            status: 'rejected',
            remarks: 'Invalid bank details provided'
        }
    ];

    const handleWithdrawalAction = (withdrawalId, action) => {
        console.log(`${action} withdrawal:`, withdrawalId);
        // Add logic to approve/reject withdrawal
    };

    const formatCurrency = (amount) => `HTG ${amount.toLocaleString()}`;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-100" style={{ background: 'linear-gradient(135deg, #FF70009950, #FF700020)' }}>
            <div className="container mx-auto md:px-4 px-2 md:py-8 py-4 max-h-[92vh] h-full overflow-y-scroll  scrollbar-hide overflow-scroll md:pb-10 pb-5 ">

                <div className="bg-white rounded-2xl shadow-xl md:p-8 p-4 md:mb-8 mb-4 border border-purple-100">
                    <div className="flex md:flex-row flex-col md:items-center md:justify-between md:gap-0 gap-2 justify-start">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full" style={{ backgroundColor: '#FF700099' }}>
                                <Shield className="w-8 h-8 text-black" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Admin Wallet</h1>
                                <p className="text-gray-600">Platform earnings and withdrawal management</p>
                            </div>
                        </div>
                        <div className="md:text-right mt-5">
                            <p className="text-sm text-gray-600">Platform Balance</p>
                            <p className="text-3xl font-bold" style={{ color: '#FF700099' }}>
                                {formatCurrency(adminWalletData.balance)}
                            </p>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-4 md:mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Platform Balance</p>
                                <p className="text-xl font-bold text-gray-800">{formatCurrency(adminWalletData.balance)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Commission</p>
                                <p className="text-xl font-bold text-gray-800">{formatCurrency(adminWalletData.totalCommissionEarned)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100">
                                <Percent className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Payouts</p>
                                <p className="text-xl font-bold text-gray-800">{formatCurrency(adminWalletData.totalPayoutsMade)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-red-100">
                                <ArrowUpRight className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Pending Requests</p>
                                <p className="text-xl font-bold text-gray-800">{adminWalletData.pendingWithdrawals}</p>
                            </div>
                            <div className="p-3 rounded-full bg-yellow-100">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">This Month</p>
                                <p className="text-xl font-bold text-gray-800">{formatCurrency(adminWalletData.thisMonthCommission)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Active Sellers</p>
                                <p className="text-xl font-bold text-gray-800">{adminWalletData.activeSellers}</p>
                            </div>
                            <div className="p-3 rounded-full" style={{ backgroundColor: '#FF70001A' }}>
                                <Users className="w-6 h-6" style={{ color: '#FF700099' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl mb-8">
                    <div className="flex flex-col sm:flex-row border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 font-semibold rounded-t-2xl transition-all duration-200 text-[18px] lg:text-base ${activeTab === 'overview'
                                ? 'text-black border-b-2'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            style={{
                                backgroundColor: activeTab === 'overview' ? '#FF700099' : 'transparent',
                                borderColor: activeTab === 'overview' ? '#FF700099' : 'transparent',
                            }}
                        >
                            <History className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                            Transaction History
                        </button>

                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 font-semibold rounded-t-2xl transition-all duration-200 relative text-[18px] lg:text-base ${activeTab === 'pending'
                                ? 'text-black border-b-2'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            style={{
                                backgroundColor: activeTab === 'pending' ? '#FF700099' : 'transparent',
                                borderColor: activeTab === 'pending' ? '#FF700099' : 'transparent',
                            }}
                        >
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                            Pending Withdrawals
                            {pendingWithdrawals.length > 0 && (
                                <span className="absolute top-1 right-1 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1">
                                    {pendingWithdrawals.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('processed')}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 font-semibold rounded-t-2xl transition-all duration-200 text-[18px] lg:text-base ${activeTab === 'processed'
                                ? 'text-black border-b-2'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                            style={{
                                backgroundColor: activeTab === 'processed' ? '#FF700099' : 'transparent',
                                borderColor: activeTab === 'processed' ? '#FF700099' : 'transparent',
                            }}
                        >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                            Processed Withdrawals
                        </button>
                    </div>

                    {/* Tabs Content */}
                    <div className="p-4 sm:p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4">
                                    Recent Platform Transactions
                                </h3>
                                {recentTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 gap-2 sm:gap-0"
                                    >
                                        {/* Left */}
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                            <div
                                                className={`p-2 rounded-full ${transaction.type === 'credit'
                                                    ? 'bg-green-100'
                                                    : 'bg-red-100'
                                                    }`}
                                            >
                                                {transaction.type === 'credit' ? (
                                                    <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                ) : (
                                                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    {formatDate(transaction.createdAt)}
                                                </p>
                                                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                                                    {transaction.orderId && <span>Order: {transaction.orderId}</span>}
                                                    {transaction.sellerId && (
                                                        <span>
                                                            Seller: {transaction.sellerName} ({transaction.sellerId})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Right */}
                                        <div className="text-right">
                                            <p
                                                className={`font-bold text-base sm:text-lg ${transaction.type === 'credit'
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                    }`}
                                            >
                                                {transaction.type === 'credit' ? '+' : '-'}
                                                {formatCurrency(transaction.amount)}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pending Tab */}
                        {activeTab === 'pending' && (
                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4">
                                    Pending Withdrawal Requests
                                </h3>
                                {pendingWithdrawals.map((withdrawal) => (
                                    <div
                                        key={withdrawal.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-yellow-50 rounded-xl border border-yellow-200 gap-3 sm:gap-0"
                                    >
                                        {/* Left */}
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                            <div className="p-2 rounded-full bg-yellow-100">
                                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                                    {withdrawal.sellerName}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Seller ID: {withdrawal.sellerId}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Requested: {formatDate(withdrawal.requestedAt)}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Right */}
                                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-sm sm:text-lg text-gray-800">
                                                    {formatCurrency(withdrawal.amount)}
                                                </p>
                                                <span className="px-2 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleWithdrawalAction(withdrawal.id, 'approve')
                                                    }
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-xs sm:text-sm font-semibold"
                                                >
                                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleWithdrawalAction(withdrawal.id, 'reject')
                                                    }
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-xs sm:text-sm font-semibold"
                                                >
                                                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Processed Tab */}
                        {activeTab === 'processed' && (
                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4">
                                    Recently Processed Withdrawals
                                </h3>
                                {processedWithdrawals.map((withdrawal) => (
                                    <div
                                        key={withdrawal.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl gap-3 sm:gap-0"
                                    >
                                        {/* Left */}
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                            <div
                                                className={`p-2 rounded-full ${withdrawal.status === 'approved'
                                                    ? 'bg-green-100'
                                                    : 'bg-red-100'
                                                    }`}
                                            >
                                                {withdrawal.status === 'approved' ? (
                                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                                    {withdrawal.sellerName}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Seller ID: {withdrawal.sellerId}
                                                </p>
                                                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span>Requested: {formatDate(withdrawal.requestedAt)}</span>
                                                    <span>Processed: {formatDate(withdrawal.processedAt)}</span>
                                                </div>
                                                {withdrawal.remarks && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Remarks: {withdrawal.remarks}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {/* Right */}
                                        <div className="text-right">
                                            <p className="font-bold text-sm sm:text-lg text-gray-800">
                                                {formatCurrency(withdrawal.amount)}
                                            </p>
                                            <span
                                                className={`px-2 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold ${withdrawal.status === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {withdrawal.status.charAt(0).toUpperCase() +
                                                    withdrawal.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>



                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 hover:bg-purple-50 cursor-pointer"
                            onClick={() => router.push("/sellers")}
                        >
                            <div className="p-2 rounded-lg bg-blue-100">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-800">View Sellers</p>
                                <p className="text-sm text-gray-600">Manage seller accounts</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 hover:bg-purple-50 cursor-pointer"
                            onClick={() => router.push("/sellers/seller-orders")}
                        >
                            <div className="p-2 rounded-lg bg-green-100">
                                <ShoppingCart className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-800">Order Management</p>
                                <p className="text-sm text-gray-600">Track all orders</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 hover:bg-purple-50 cursor-pointer"
                            onClick={() => router.push("/")}
                        >
                            <div className="p-2 rounded-lg bg-yellow-100">
                                <TrendingUp className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-800">Analytics</p>
                                <p className="text-sm text-gray-600">View detailed reports</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 hover:bg-purple-50 cursor-pointer">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: '#FF70001A' }}>
                                <CreditCard className="w-5 h-5" style={{ color: '#FF700099' }} />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-800">Payment Settings</p>
                                <p className="text-sm text-gray-600">Configure commission</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminWalletDashboard;