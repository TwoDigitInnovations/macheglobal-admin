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
import { IoCloseCircleOutline } from 'react-icons/io5';

function SellerOrders(props) {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [viewPopup, setViewPopup] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState({
        name: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(popupData.status || 'pending');
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
    });

    const primaryColor = '#FF700099'; // The specified orange color code

    useEffect(() => {
        fetchOrders(selectedDate, currentPage);
    }, [currentPage, selectedDate]);

    const fetchOrders = async (selectedDate, page = 1, limit = 10) => {
        const data = {};

        if (selectedDate) {
            data.curDate = moment(new Date(selectedDate)).format();
        }

        setIsLoading(true);
        props.loader(true);

        try {
            const res = await Api("post", `product/getOrderBySeller?page=${page}&limit=${limit}`, data, router);

            props.loader(false);
            setIsLoading(false);

            if (res?.status) {
                setOrders(res?.data);
                setPagination(res?.pagination);
                setCurrentPage(res?.pagination?.currentPage);
            } else {
                toast.error(res?.data?.message || "Failed to fetch orders")
            }
        } catch (err) {
            props.loader(false);
            setIsLoading(false);
            toast.error(err?.data?.message || err?.message || "An error occurred")
        }
    };

    const handleSearch = () => {
        fetchOrders(selectedDate, 1);
    };

    const handleReset = () => {
        setSelectedDate('');
        setSearchParams({ name: '', email: '' });
        setCurrentPage(1)
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateStatusAPI = (id, status) => {
        props.loader(true);
        const data = {
            id,
            status
        };
        Api("post", "user/updateStatus", data, router)
            .then((res) => {
                props.loader(false);
                if (res?.status === true) {
                    toast.success("Status updated successfully")
                    fetchOrders(null, currentPage);
                } else {
                    toast.error(res?.message || "Failed to update status")
                }
            })
            .catch((err) => {
                props.loader(false);
                console.error("API Error:", err);
                toast.error(err?.message || "Something went wrong")
            });
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

        switch (value) {
            case 'pending':
                colorClass = 'text-yellow-500';
                break;
            case 'resolved':
                colorClass = 'text-green-600';
                break;
            case 'closed':
                colorClass = 'text-red-600';
                break;
            default:
                colorClass = 'text-gray-600';
        }

        return (
            <div className="flex items-center justify-center">
                <p className={`text-[16px] font-semibold capitalize ${colorClass}`}>
                    {value}
                </p>
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
                Cell: indexID,
                width: 60
            },
            {
                Header: "CUSTOMER NAME",
                accessor: 'name',
                Cell: renderName,

            },
            {
                Header: "SELLER NAME",
                accessor: 'sellerName',
                Cell: renderEmail
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
                        <div className="relative">
                            <label className="block text-[16px]  font-medium text-gray-700 mb-1">Order Date</label>
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

                        <div className="flex items-end space-x-3">
                            <button
                                onClick={handleSearch}
                                className="flex items-center justify-center px-5 py-2 rounded-lg text-black text-[14px]  font-medium transition-all cursor-pointer"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Search
                                <Search size={18} className="ml-2" />
                            </button>

                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center text-[14px] px-5 py-2 border border-black  bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
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
                                <h3 className="text-gray-800 font-medium mb-3">Order Items</h3>
                                {popupData?.productDetail?.map((item, i) => (
                                    <div
                                        key={i}
                                        className="border-b border-gray-100 py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                                        onClick={() => {
                                            router.push(
                                                `/orders-details/${popupData?._id}?product_id=${item?._id}`
                                            );
                                        }}
                                    >
                                        <div className="flex items-center justify-center p-1 bg-white shadow-md rounded-lg">
                                            <div className=" bg-gray-50 rounded-lg ">
                                                <img
                                                    className="w-[80px] h-[140px] object-contain"
                                                    src={item?.image[0]}
                                                    alt={item?.product?.name}
                                                />
                                            </div>

                                            <div className="ml-4 flex-grow">
                                                <p className="text-gray-800 font-semibold text-[16px]">
                                                    {item?.product?.name}
                                                </p>
                                                <div className="flex flex-wrap ">
                                                    <div className="flex flex-col items-start mt-1">
                                                        <div className="flex mt-1">
                                                            <span className="text-gray-700 text-sm mr-1 font-medium">
                                                                Qty:
                                                            </span>
                                                            <span className="text-gray-700 text-sm">
                                                                {item?.qty}
                                                            </span>
                                                        </div>

                                                        {item?.color && (
                                                            <div className="flex mt-1">
                                                                <span className="text-gray-700 text-sm mr-1 font-medium">
                                                                    Color:
                                                                </span>
                                                                <span className="text-gray-700 text-sm">
                                                                    {item?.color || "N/A"}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {item?.attribute && (
                                                            Object.entries(item.attribute)
                                                                .filter(([key]) => key.toLowerCase() !== "color")
                                                                .map(([label, value], index) => (
                                                                    <div key={index} className="text-gray-700 text-sm mb-1 font-medium">
                                                                        {label}: <span className="text-gray-700 text-sm">{value || "Not found"}</span>
                                                                    </div>
                                                                ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ml-auto">
                                                <p className="text-[#127300] font-semibold text-lg">
                                                    ${item?.price}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Delivery Information */}
                            <div className="px-5 pt-6">
                                {/* Order Status */}
                                {popupData?.status === "Completed" && (
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-5 w-5 text-green-500"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-green-700 font-medium">
                                                    Order has been delivered successfully
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {popupData?.status === "Return" && (
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-5 w-5 text-green-500"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-green-700 font-medium">
                                                    Order has been Return successfully
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Total Section - Fixed at Bottom */}
                        <div className="fixed bottom-0  right-0 bg-white px-2 py-2 border-t border-gray-200 md:w-[43vw] w-[380px]">
                            <button className="bg-[#127300] w-full py-4 rounded-lg text-white text-lg font-bold flex justify-center items-center">
                                Total: ${popupData?.total}
                            </button>
                        </div>
                    </div>
                </Drawer>
            )}

        </section>
    );
}

export default isAuth(SellerOrders);