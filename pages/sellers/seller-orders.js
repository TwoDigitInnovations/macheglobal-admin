import React, { useMemo, useState, useEffect } from 'react';
import Table from '@/components/table';
import { Api } from '@/services/service';
import { indexID } from '@/components/reported/customTableAct';
import { useRouter } from 'next/router';
import moment from 'moment';
import isAuth from '@/components/isAuth';
import {
    Search,
    Calendar,
    Filter,
    X,
    Eye,
    Phone,
    Mail,
    User,
    XCircle,
    ListRestart,
    EyeClosed
} from 'lucide-react';
import { toast } from 'react-toastify';
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import { IoCloseCircleOutline } from 'react-icons/io5';

function SellerOrders(props) {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [viewPopup, setViewPopup] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
    });
    
    // Define primary color for consistent styling
    const primaryColor = '#FF7000'; // Orange color used in the UI

    useEffect(() => {
        fetchOrders(currentPage, selectedDate, searchQuery);
    }, [currentPage]);

    const fetchOrders = async (page = 1, date = '', search = '', limit = 10) => {
        const data = {};

        if (date && date.trim()) {
            data.curentDate = moment(new Date(date)).format('YYYY-MM-DD');
        }

        if (search && search.trim()) {
            data.search = search.trim();
        }

        setIsLoading(true);
        props.loader(true);

        try {
            const res = await Api("post", `product/getOrderBySeller?page=${page}&limit=${limit}`, data, router);
            
            props.loader(false);
            setIsLoading(false);

            if (res?.status) {
                // Transform the data to include required fields
                const transformedData = res.data.map((order) => ({
                    ...order,
                    status: order.status || 'pending',
                    user: {
                        name: order.user?.name || 'N/A',
                        email: order.user?.email || 'N/A',
                        phone: order.user?.phone || 'N/A',
                        ...order.user
                    }
                }));
                
                setOrders(transformedData);
                setPagination({
                    totalPages: res.pagination?.totalPages || 1,
                    currentPage: res.pagination?.currentPage || page,
                    itemsPerPage: res.pagination?.itemsPerPage || limit,
                    totalItems: res.pagination?.totalItems || res.data.length
                });
            } else {
                console.error('Error in API response:', res);
                toast.error(res?.data?.message || "Failed to fetch orders");
                setOrders([]);
                setPagination({
                    totalPages: 1,
                    currentPage: 1,
                    itemsPerPage: limit,
                    totalItems: 0
                });
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            props.loader(false);
            setIsLoading(false);
            toast.error(err?.data?.message || err?.message || "An error occurred while fetching orders");
            setOrders([]);
            setPagination({
                totalPages: 1,
                currentPage: 1,
                itemsPerPage: limit,
                totalItems: 0
            });
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchOrders(1, selectedDate, searchQuery);
    };

    const handleReset = () => {
        setSelectedDate('');
        setSearchQuery('');
        setCurrentPage(1);
        fetchOrders(1, '', '');
    };

    const updateStatusAPI = (id, status) => {
        props.loader(true);
        const data = {
            id,
            status
        };
        Api("post", "orders/updateStatus", data, router)
            .then((res) => {
                props.loader(false);
                if (res?.status === true) {
                    toast.success("Status updated successfully");
                    setShowStatusDialog(false);
                    setViewPopup(false);
                    fetchOrders(currentPage, selectedDate, searchQuery);
                } else {
                    toast.error(res?.message || "Failed to update status");
                }
            })
            .catch((err) => {
                props.loader(false);
                console.error("API Error:", err);
                toast.error(err?.message || "Something went wrong");
            });
    };

    const handleStatusUpdate = () => {
        if (!selectedStatus) {
            toast.error("Please select a status");
            return;
        }
        updateStatusAPI(popupData._id, selectedStatus);
    };


    const renderName = ({ value }) => (
        <div className=" flex  justify-center items-center">
            <p className="text-gray-800 text-[16px] font-medium">{value}</p>
        </div>
    );

    const renderEmail = ({ value }) => (
        <div className=" flex justify-center items-center">
            <p className="text-gray-800 text-[16px] ">{value}</p>
        </div>
    );

    const renderDate = ({ value }) => (
        <div className="flex items-center justify-center">
            <p className="text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-[15px] ">
                {moment(value).format('DD MMM YYYY')}
            </p>
        </div>
    );

    const renderStatus = ({ value }) => {
        let colorClass = '';
        let displayText = value || 'pending';

        // Map status to display text and color
        switch ((value || '').toLowerCase()) {
            case 'pending':
                colorClass = 'bg-yellow-100 text-yellow-800';
                displayText = 'Pending';
                break;
            case 'processing':
                colorClass = 'bg-blue-100 text-blue-800';
                displayText = 'Processing';
                break;
            case 'shipped':
                colorClass = 'bg-indigo-100 text-indigo-800';
                displayText = 'Shipped';
                break;
            case 'delivered':
                colorClass = 'bg-green-100 text-green-800';
                displayText = 'Delivered';
                break;
            case 'cancelled':
                colorClass = 'bg-red-100 text-red-800';
                displayText = 'Cancelled';
                break;
            case 'completed':
                colorClass = 'bg-green-100 text-green-800';
                displayText = 'Completed';
                break;
            default:
                colorClass = 'bg-gray-100 text-gray-800';
                displayText = value || 'Pending';
        }

        return (
            <div className="flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                    {displayText}
                </span>
            </div>
        );
    };


    const renderActions = ({ row }) => (
        <div className="flex items-center justify-center">
            <button
                className="flex gap-2 items-center px-4 py-2 bg-opacity-10 bg-custom-lightgold rounded-lg hover:bg-opacity-20 transition-all"
                style={{ backgroundColor: `${primaryColor}20` }}
                onClick={() => {
                    setViewPopup(true);
                    setPopupData(row.original);
                }}
            >
                <span className="text-black font-medium cursor-pointer">View </span>
                <Eye size={18} className="" />
            </button>
        </div>
    );

    const columns = useMemo(
        () => [
            {
                Header: "ORDER ID",
                accessor: 'orderId',
                Cell: ({ value }) => (
                    <div className="flex justify-center">
                        <p className="text-gray-800 font-medium">{value || 'N/A'}</p>
                    </div>
                ),
                width: 120
            },
            {
                Header: "CUSTOMER NAME",
                accessor: 'user.name',
                Cell: ({ value, row }) => (
                    <div className="flex justify-center">
                        <p className="text-gray-800 font-medium">{value || row.original?.user?.name || 'N/A'}</p>
                    </div>
                ),
            },
            {
                Header: "SELLER NAME",
                id: 'sellerName',
                Cell: ({ row }) => {
                    // Get the first order item with seller info
                    const firstItem = row.original.orderItems?.[0];
                    
                    // Get seller name from the populated seller field
                    const sellerName = firstItem?.seller?.name || 'N/A';
                    
                    return (
                        <div className="flex justify-center">
                            <p className="text-gray-800 font-medium">
                                {sellerName}
                            </p>
                        </div>
                    );
                }
            },
            {
                Header: "ORDER DATE",
                accessor: 'createdAt',
                Cell: renderDate,

            },
            {
                Header: "ORDER STATUS",
                accessor: 'status',
                Cell: renderStatus
            },

            {
                Header: "ACTIONS",
                Cell: renderActions,
                width: 120
            },
        ],
        [pagination]
    );

    return (
        <section className="w-full h-full bg-gray-50 p-6 overflow-y-scroll   scrollbar-hide overflow-scroll pb-28">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-gray-900 font-bold md:text-[32px] text-2xl">Sellers Orders</h1>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
                <div className="p-6">
                    <div className="flex md:flex-row flex-col justify-between gap-4">
                        <div className="flex md:flex-row flex-col gap-4 flex-1">
                            <div className="relative flex-1">
                                <label className="block text-[16px] font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by Name, Email, Order ID"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 text-[14px] rounded-[30px] focus:outline-none text-black"
                                        style={{ focusRing: `${primaryColor}40` }}
                                    />
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label className="block text-[16px] font-medium text-gray-700 mb-1">Order Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 text-[12px] rounded-[30px] focus:outline-none text-black"
                                        style={{ focusRing: `${primaryColor}40` }}
                                    />
                                    <Calendar
                                        size={18}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end space-x-3">
                            <button
                                onClick={handleSearch}
                                disabled={!searchQuery && !selectedDate}
                                className="flex items-center justify-center px-5 py-2 rounded-lg text-black text-[14px] font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Search
                                <Search size={18} className="ml-2" />
                            </button>

                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center text-[14px] px-5 py-2 border border-black bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                            >
                                Reset
                                <ListRestart size={18} className="mr-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor }}></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col justify-center items-center p-20 text-center md:min-h-[500px]">
                        <img src="/empty-box.png" alt="No data" className="md:w-32 w-20 md:h-32 h-20 mb-4 opacity-60" />
                        <h3 className="md:text-xl text-md font-medium text-gray-700 mb-1">No orders found</h3>
                        <p className="text-gray-500 md:text-md text-sm">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto px-5">
                        <Table
                            columns={columns}
                            data={orders}
                            pagination={pagination}
                            onPageChange={(page) => setCurrentPage(page)}
                            currentPage={currentPage}
                            itemsPerPage={pagination.itemsPerPage}
                        />
                    </div>
                )}
            </div>


            {viewPopup && (
                <Drawer
                    className="custom-drawer"
                    open={viewPopup}
                    onClose={() => setViewPopup(false)}
                    anchor={"right"}
                >
                    <div className="md:w-[43vw] w-[380px] relative">
                        <div className="w-full h-full overflow-y-scroll scrollbar-hide overflow-scroll md:pb-44 pb-32">
                            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center">
                                    <h2 className="text-[#127300] text-xl font-semibold">
                                        Order Details
                                    </h2>
                                </div>
                                <IoCloseCircleOutline
                                    className="text-[#127300] w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setViewPopup(false)}
                                />
                            </div>

                            {popupData?.status === "Cancel" && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700 font-medium">
                                                Order has been cancelled
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="px-5 pt-4">
                                {popupData?.orderItems?.map((item, i) => {
                                    const product = item.product || {};
                                    // Handle different possible image formats
                                    let imageUrl = '';
                                    if (item.image) {
                                        // If image is directly on the order item
                                        imageUrl = item.image;
                                    } else if (product.image) {
                                        // If image is on the product object
                                        imageUrl = Array.isArray(product.image) 
                                            ? product.image[0] 
                                            : product.image;
                                    }
                                    
                                    return (
                                        <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200">
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {imageUrl ? (
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={imageUrl}
                                                            alt={product.name || 'Product'}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/placeholder-product.png';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-gray-900 font-medium">{product.name || 'Product Name N/A'}</p>
                                                    <p className="text-gray-500 text-sm">Qty: {item.qty || 1}</p>
                                                    <p className="text-gray-500 text-sm">${item.price || '0.00'} x {item.qty || 1}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-900 font-medium">${(item.price * (item.qty || 1)).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Summary */}
                            <div className="px-5 pt-6">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-gray-500 text-sm">Order ID</p>
                                            <p className="font-medium">{popupData?.orderId || 'N/A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-500 text-sm">Date</p>
                                            <p className="font-medium">
                                                {popupData?.createdAt ? new Date(popupData.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">${popupData?.itemsPrice?.toFixed(2) || '0.00'}</span>
                                        </div>
                                        {popupData?.shippingPrice > 0 && (
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600">Shipping</span>
                                                <span className="font-medium">${popupData.shippingPrice.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {popupData?.taxPrice > 0 && (
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600">Tax</span>
                                                <span className="font-medium">${popupData.taxPrice.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-200 my-3"></div>
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span>${popupData?.totalPrice?.toFixed(2) || '0.00'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Status Section */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                    <h4 className="font-medium text-gray-800 mb-3">Order Status</h4>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-gray-600">Current Status:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            popupData?.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            popupData?.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            popupData?.status === 'returned' ? 'bg-orange-100 text-orange-800' :
                                            popupData?.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                            popupData?.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {popupData?.status ? popupData.status.charAt(0).toUpperCase() + popupData.status.slice(1) : 'Pending'}
                                        </span>
                                    </div>
                                    
                                    {popupData?.refundedToCredit && (
                                        <div className="bg-green-50 border border-green-200 rounded p-3">
                                            <p className="text-sm text-green-700">
                                                ✓ Refunded ${popupData?.refundAmount?.toFixed(2) || '0.00'} to customer credit balance
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Customer Information */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                                    <h4 className="font-medium text-gray-800 mb-3">Customer Information</h4>
                                    {popupData?.shippingAddress && (
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center">
                                                <User size={16} className="text-gray-500 mr-2" />
                                                <span>{popupData.shippingAddress.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone size={16} className="text-gray-500 mr-2" />
                                                <span>{popupData.shippingAddress.phone || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-start">
                                                <svg className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>
                                                    {[
                                                        popupData.shippingAddress.address,
                                                        popupData.shippingAddress.city,
                                                        popupData.shippingAddress.postalCode,
                                                        popupData.shippingAddress.country
                                                    ].filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons - Fixed at Bottom */}
                        <div className="fixed bottom-0 right-0 bg-white px-4 py-4 border-t border-gray-200 md:w-[43vw] w-[380px] shadow-md">
                            <div className="space-y-3">
                                {/* Total Amount */}
                                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="text-lg font-bold">${popupData?.totalPrice?.toFixed(2) || '0.00'}</p>
                                    </div>
                                    {popupData?.refundedToCredit && (
                                        <div className="bg-green-50 px-3 py-1 rounded-full">
                                            <p className="text-xs text-green-700 font-medium">✓ Refunded</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button 
                                        className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                        onClick={() => setViewPopup(false)}
                                    >
                                        Close
                                    </button>
                                    {popupData?.status !== 'cancelled' && popupData?.status !== 'returned' && popupData?.status !== 'delivered' && (
                                        <button 
                                            className="flex-1 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: primaryColor }}
                                            onClick={() => {
                                                setSelectedStatus(popupData?.status || 'pending');
                                                setShowStatusDialog(true);
                                            }}
                                        >
                                            Update Status
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Drawer>
            )}

            {/* Status Update Dialog */}
            <Dialog
                open={showStatusDialog}
                onClose={() => setShowStatusDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <div className="p-6 bg-white">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Update Order Status</h3>
                        <IoCloseCircleOutline
                            className="text-gray-500 w-6 h-6 cursor-pointer hover:text-gray-700"
                            onClick={() => setShowStatusDialog(false)}
                        />
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-4">Current Status: <span className="font-semibold">{popupData?.status || 'Pending'}</span></p>
                        
                        <div className="space-y-2">
                            <button 
                                className="w-full py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity text-left px-4"
                                style={{ backgroundColor: '#FF700099' }}
                                onClick={() => {
                                    updateStatusAPI(popupData._id, 'processing');
                                }}
                            >
                                Processing
                            </button>
                            <button 
                                className="w-full py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity text-left px-4"
                                style={{ backgroundColor: '#FF700099' }}
                                onClick={() => {
                                    updateStatusAPI(popupData._id, 'shipped');
                                }}
                            >
                                Shipped
                            </button>
                            <button 
                                className="w-full py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity text-left px-4"
                                style={{ backgroundColor: '#FF700099' }}
                                onClick={() => {
                                    updateStatusAPI(popupData._id, 'delivered');
                                }}
                            >
                                Delivered
                            </button>
                            <button 
                                className="w-full py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity text-left px-4"
                                style={{ backgroundColor: '#FF700099' }}
                                onClick={() => {
                                    if (window.confirm('Mark this order as returned? Amount will be refunded to customer credit balance.')) {
                                        updateStatusAPI(popupData._id, 'returned');
                                    }
                                }}
                            >
                                Returned
                            </button>
                            <button 
                                className="w-full py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity text-left px-4"
                                style={{ backgroundColor: '#FF700099' }}
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to cancel this order? Amount will be refunded to customer credit balance.')) {
                                        updateStatusAPI(popupData._id, 'cancelled');
                                    }
                                }}
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>

                    <button 
                        className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => setShowStatusDialog(false)}
                    >
                        Close
                    </button>
                </div>
            </Dialog>

        </section>
    );
}

export default isAuth(SellerOrders);