import React, { useState } from 'react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, DollarSign, CreditCard, History } from 'lucide-react';

const SellerWalletDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  // Sample data based on the wallet logic
  const walletData = {
    balance: 25450,
    totalEarnings: 156780,
    pendingWithdrawals: 5000,
    thisMonthEarnings: 12340
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'credit',
      amount: 900,
      description: 'Order #ORD1234 payout',
      orderId: 'ORD1234',
      createdAt: '2024-11-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      amount: 2000,
      description: 'Withdrawal to Bank Account',
      createdAt: '2024-11-14T15:45:00Z',
      status: 'completed'
    },
    {
      id: 3,
      type: 'credit',
      amount: 1250,
      description: 'Order #ORD1235 payout',
      orderId: 'ORD1235',
      createdAt: '2024-11-14T09:20:00Z',
      status: 'completed'
    },
    {
      id: 4,
      type: 'credit',
      amount: 750,
      description: 'Order #ORD1236 payout',
      orderId: 'ORD1236',
      createdAt: '2024-11-13T14:10:00Z',
      status: 'completed'
    }
  ];

  const withdrawalHistory = [
    {
      id: 1,
      amount: 5000,
      status: 'pending',
      requestedAt: '2024-11-15T12:00:00Z',
      remarks: 'Processing...'
    },
    {
      id: 2,
      amount: 3000,
      status: 'approved',
      requestedAt: '2024-11-10T10:00:00Z',
      processedAt: '2024-11-11T14:30:00Z',
      remarks: 'Successfully transferred'
    },
    {
      id: 3,
      amount: 1500,
      status: 'rejected',
      requestedAt: '2024-11-08T16:00:00Z',
      processedAt: '2024-11-09T11:00:00Z',
      remarks: 'Invalid bank details'
    }
  ];

  const handleWithdrawal = () => {
    if (withdrawalAmount && parseFloat(withdrawalAmount) <= walletData.balance) {
      // Add withdrawal request logic here
      console.log('Withdrawal requested:', withdrawalAmount);
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
    }
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
    <div
      className="min-h-screen bg-gray-100"
      style={{ background: "linear-gradient(135deg, #FF70009950, #FF700020)" }}
    >
      <div className="container mx-auto px-4 py-6 max-h-[92vh] h-full overflow-y-auto scrollbar-hide pb-10">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-purple-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full" style={{ backgroundColor: "#FF700099" }}>
                <Wallet className="w-8 h-8 text-black" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Seller Wallet
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Manage your earnings and withdrawals
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="w-full md:w-auto px-6 py-3 rounded-xl text-black font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: "#FF700099" }}
            >
              <ArrowUpRight className="w-5 h-5 inline mr-2" />
              Withdraw Money
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-purple-100 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Current Balance</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {formatCurrency(walletData.balance)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-purple-100 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {formatCurrency(walletData.totalEarnings)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-purple-100 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Pending Withdrawals</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {formatCurrency(walletData.pendingWithdrawals)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-purple-100 flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {formatCurrency(walletData.thisMonthEarnings)}
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: "#FF70001A" }}>
              <CreditCard className="w-6 h-6" style={{ color: "#FF700099" }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-t-2xl transition-all duration-200 ${activeTab === "overview"
                  ? "text-black border-b-2"
                  : "text-gray-600 hover:text-gray-800"
                }`}
              style={{
                backgroundColor:
                  activeTab === "overview" ? "#FF700099" : "transparent",
                borderColor: activeTab === "overview" ? "#FF700099" : "transparent",
              }}
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
              Transaction History
            </button>

            <button
              onClick={() => setActiveTab("withdrawals")}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-t-2xl transition-all duration-200 ${activeTab === "withdrawals"
                  ? "text-black border-b-2"
                  : "text-gray-600 hover:text-gray-800"
                }`}
              style={{
                backgroundColor:
                  activeTab === "withdrawals" ? "#FF700099" : "transparent",
                borderColor: activeTab === "withdrawals" ? "#FF700099" : "transparent",
              }}
            >
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
              Withdrawal History
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Transaction History Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{formatDate(transaction.createdAt)}</p>
                        {transaction.orderId && (
                          <p className="text-xs text-gray-500">Order: {transaction.orderId}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Withdrawal History Tab */}
            {activeTab === 'withdrawals' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Withdrawal Requests</h3>
                {withdrawalHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${withdrawal.status === 'approved' ? 'bg-green-100' :
                          withdrawal.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                        {withdrawal.status === 'approved' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : withdrawal.status === 'pending' ? (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Withdrawal Request</p>
                        <p className="text-sm text-gray-600">Requested: {formatDate(withdrawal.requestedAt)}</p>
                        {withdrawal.processedAt && (
                          <p className="text-sm text-gray-600">Processed: {formatDate(withdrawal.processedAt)}</p>
                        )}
                        <p className="text-xs text-gray-500">{withdrawal.remarks}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">{formatCurrency(withdrawal.amount)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' :
                          withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {showWithdrawalModal && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 ">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 md:w-[40vw] w-[85vw]">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full" style={{ backgroundColor: '#FF700099' }}>
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Withdraw Money</h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-2">Available Balance: {formatCurrency(walletData.balance)}</p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none duration-200"
                  style={{ focusRingColor: '#FF700099' }}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawal}
                  disabled={!withdrawalAmount || parseFloat(withdrawalAmount) > walletData.balance}
                  className="flex-1 px-4 py-3 text-black rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: '#FF700099' }}
                >
                  Request Withdrawal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default SellerWalletDashboard;