import React, { useMemo, useState, useEffect } from "react";
import Table from "@/components/table";
import { Api, ApiBlobData, ApiFormData } from "@/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import { IoCloseCircleOutline } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Navigation } from "swiper/modules";
import isAuth from "@/components/isAuth";
import MultiSelect from "@/components/MultiSelect";
import PopupTable from "@/components/PopupTable";
import { Eye, ListRestart, Search } from "lucide-react";
import { indexID } from "@/components/reported/customTableAct";

function Sellers(props) {
    const router = useRouter();
    const [sellersData, setSellersData] = useState([]);
    const [viewPopup, setviewPopup] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [driverdata, setdriverdata] = useState([]);
    const [currentIndex, setCuurentIndex] = useState(0);
    const [newPopupData, setNewPopupData] = useState({});
    const [newPopup, setNewPopup] = useState(false);
    const [selctDate, setSelctDate] = useState(new Date());
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // default limit
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: pageSize,
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [selectedId, setSelectedId] = useState("");
    const open = Boolean(anchorEl);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const options = ["Products", "Orders", "Employees", "Returns", "Refunds"];
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClosePopup = () => {
        setNewPopup(false);
        setNewPopupData({});
    };

    useEffect(() => {
        getuserlist(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handleClose = () => {
        setviewPopup(false);
        setPopupData({});
        setdriverdata([]);
        setSelectedId("");
        setSelectedOptions([]);
        setAnchorEl(null);
    };

    const getuserlist = async (page = 1, limit = 10, search) => {

        let url = `user/getUserList?page=${page}&limit=${limit}&type=Seller`;
        if (search) {
            url += `&search=${search}`;
        }


        props.loader(true);
        Api("get", url, "", router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setSellersData(res.data);
                setPagination({
                    ...res?.pagination,
                    itemsPerPage: pageSize,
                });
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const updateStatus = async (id, status) => {
        setviewPopup(false);
        props.loader(true);
        Api("post", `updateStore`, { id, status }, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                getuserlist();
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const exportData = async () => {
        props.loader(true);
        setviewPopup(false);
        const data = {
            reportTypes: selectedOptions,
            id: selectedId,
        };
        ApiBlobData("post", `export/detailed-seller-report`, data, router).then(
            (res) => {
                props.loader(false);

                const blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "detailed-seller-report.xlsx";
                a.click();
                window.URL.revokeObjectURL(url);
                props.toaster({
                    type: "success",
                    message: "Exported successfully",
                });
                setAnchorEl(null);
                setSelectedOptions([]);
                setSelectedId("");
                setdriverdata([]);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({
                    type: "error",
                    message: err?.message || "Export failed",
                });
            }
        );
    };


    function name({ value }) {
        return (
            <div>
                <p className="text-custom-black text-base font-normal text-center">
                    {value}
                </p>
            </div>
        );
    }

    function email({ value }) {
        return (
            <div>
                <p className="text-custom-black text-base font-normal text-center">
                    {value}
                </p>
            </div>
        );
    }

    function date({ value }) {
        return (
            <div>
                <p className="text-custom-black text-base font-normal text-center">
                    {moment(value).format("DD MMM YYYY")}
                </p>
            </div>
        );
    }

    function mobile({ value }) {
        return (
            <div>
                <p className="text-custom-black text-base font-normal text-center">
                    {value}
                </p>
            </div>
        );
    }

    function status({ row }) {
        const value = row.original?.status;

        return (
            <div>
                <p
                    className={`text-custom-black text-base font-normal text-center
          ${value === "verified" ? "text-green-500" : ""}
          ${value === "suspend" ? "text-red-500" : ""}
          ${value === "pending" ? "text-yellow-500" : ""}
        `}
                >
                    {value === "pending" && "Pending"}
                    {value === "suspend" && "Suspend"}
                    {value === "verified" && "Verified"}
                </p>
            </div>
        );
    }


    const info = ({ value, row }) => {
        return (
            <div className="flex items-center  justify-center">
                <button
                    className="h-[38px] w-[93px] flex justify-center items-center gap-1 bg-[#FE3E0020] text-black text-base cursor-pointer font-normal rounded-[8px]"
                    onClick={() => {
                        setviewPopup(true);
                        setPopupData(row.original);
                        // getSellerStats(row.original?._id);
                        setSelectedId(row.original?._id);
                        setdriverdata([
                            {
                                img: row.original?.store?.identity,
                            },
                            {
                                img: row.original?.store?.kbis,
                            },
                        ]);
                    }}
                >
                    view <Eye size={15} />
                </button>
            </div>
        );
    };

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                // accessor: "_id",
                // accessor: "indexNo",
                Cell: indexID,
            },
            {
                Header: "NAME",
                accessor: "name",
                Cell: name,
            },
            {
                Header: "E-mail",
                accessor: "email",
                Cell: email,
            },

            {
                Header: "Mobile",
                accessor: "phone",
                Cell: mobile,
            },
            {
                Header: "DATE",
                accessor: "createdAt",
                Cell: date,
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: status,
            },
            {
                Header: "Info",
                // accessor: "view",
                Cell: info,
            },
        ],
        []
    );

    return (
        <section className=" w-full h-full bg-transparent px-4 py-6">
            <p className="text-black font-bold  md:text-[32px] text-2xl">
                Sellers List
            </p>
            <section className="px-1 pt-1 md:pb-32 pb-28 bg-white h-full rounded-[12px] overflow-auto mt-3">

                <div className="bg-white border border-gray-200 w-full rounded-[10px] py-5 px-5 md:py-0 md:px-0">
                    <div className="flex flex-col md:flex-row md:justify-between justify-start items-start md:items-center w-full h-full py-3.5 md:px-4 ">

                        {/* Search Input */}
                        <div className="flex md:items-center w-full ">
                            <div className="flex flex-col gap-1  md:pl-3 w-full">
                                <p className="text-black text-[14px] font-normal">Search</p>
                                <input
                                    className="md:w-[300px] w-[280px] focus:ring ring-gray-700 border border-gray-200 bg-white  rounded-[30px] py-2.5 px-4 text-[13px] font-normal text-black outline-none"
                                    type="text"
                                    placeholder="Search by Name, Email, Mobile"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2 mt-5 md:mt-0">
                            <button
                                className="flex items-center gap-1 py-2 px-4 rounded-[8px] bg-custom-orange text-black md:text-[16px] text-[14px] font-normal disabled:bg-custom-darkGrayColor/50"
                                disabled={search.length < 1}
                                onClick={() => {
                                    getuserlist(currentPage, 10, search);
                                    setSelctDate("");
                                    setSelectedOptions([]);
                                }}
                            >
                                Search
                                <Search size={18} className="ml-2" />
                            </button>

                            <button
                                className="flex items-center gap-1 py-2 px-4 rounded-[8px] bg-[#00000020] border border-black text-black md:text-[16px] text-[14px] font-normal"
                                onClick={() => {
                                    setSearch("");
                                    getuserlist(currentPage, 10, "");
                                    setSelctDate("");
                                }}
                            >
                                Reset
                                <ListRestart size={18} className="mr-2" />
                            </button>
                        </div>
                    </div>
                </div>


                {viewPopup && (
                    <Dialog
                        open={viewPopup}
                        onClose={handleClose}
                        maxWidth="500px"
                    // fullScreen
                    >
                        <div className="p-5 bg-white relative overflow-hidden">
                            <IoCloseCircleOutline
                                className="text-black h-8 w-8 absolute right-2 top-2 cursor-pointer"
                                onClick={handleClose}
                            />
                            <div className="grid grid-cols-12 justify-between border-b-2 border-b-gray-300 py-2">
                                <div className="col-span-6">
                                    <div className="md:flex flex-row justify-start items-start">
                                        <Avatar
                                            // alt={singleData.username}
                                            // src={singleData.profile}
                                            sx={{ width: 60, height: 60 }}
                                        />
                                        <div className="flex flex-col justify-start items-start md:pl-5">
                                            <p className="text-base font-bold text-custom-black">
                                                {popupData?.username}
                                            </p>
                                            <p className="text-base font-semibold text-custom-newBlack">
                                                {popupData?.email}
                                            </p>
                                            <p className="text-sm font-semibold text-custom-black">
                                                {popupData?.number}
                                            </p>

                                            <button
                                                className="text-white bg-custom-darkpurple rounded w-36 h-[30px] mt-2"
                                                id="lock-button"
                                                aria-haspopup="listbox"
                                                aria-controls="lock-menu"
                                                aria-label="when device is locked"
                                                aria-expanded={open ? "true" : undefined}
                                                onClick={handleClickListItem}
                                            >
                                                Export Seller
                                            </button>
                                            <MultiSelect
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                handleCloseMenu={handleCloseMenu}
                                                options={options}
                                                selectedOptions={selectedOptions}
                                                setSelectedOptions={setSelectedOptions}
                                                onClick={() => exportData()}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-6 flex md:justify-center justify-start items-center min-w-[400px] md:border-l-2 md:border-l-gray-300 ">
                                    <div className="grid grid-cols-4 w-full justify-between items-center md:pl-5">
                                        <div
                                            onClick={() => {
                                                setNewPopup(true);
                                                setNewPopupData({
                                                    id: popupData?._id,
                                                    name: popupData?.username,
                                                    type: "Orders",
                                                });
                                            }}
                                            className="cursor-pointer col-span-2 flex gap-2 justify-start items-center w-full"
                                        >
                                            <p className="text-sm font-semibold text-gray-600">
                                                Total Order:
                                            </p>
                                            <p className="text-sm font-normal text-custom-black">
                                                {popupData?.stats?.totalOrders}
                                            </p>
                                        </div>
                                        <div onClick={() => {
                                            setNewPopup(true);
                                            setNewPopupData({
                                                id: popupData?._id,
                                                name: popupData?.username,
                                                type: "Products",
                                            });
                                        }} className="cursor-pointer col-span-2 flex gap-2 justify-start items-center w-full">
                                            <p className="text-sm font-semibold text-gray-600">
                                                Total Products:
                                            </p>
                                            <p className="text-sm font-normal text-custom-black">
                                                {popupData?.stats?.totalProducts}
                                            </p>
                                        </div>
                                        <div onClick={() => {
                                            setNewPopup(true);
                                            setNewPopupData({
                                                id: popupData?._id,
                                                name: popupData?.username,
                                                type: "Employees",
                                            });
                                        }} className="cursor-pointer col-span-2 flex gap-2 justify-start items-center w-full">
                                            <p className="text-sm font-semibold text-gray-600">
                                                Total Employees:
                                            </p>
                                            <p className="text-sm font-normal text-custom-black">
                                                {popupData?.stats?.totalEmployees}
                                            </p>
                                        </div>
                                        <div onClick={() => {
                                            setNewPopup(true);
                                            setNewPopupData({
                                                id: popupData?._id,
                                                name: popupData?.username,
                                                type: "Returns",
                                            });
                                        }} className="cursor-pointer col-span-2 flex gap-2 justify-start items-center w-full">
                                            <p className="text-sm font-semibold text-gray-600">
                                                Total Returned Items:
                                            </p>
                                            <p className="text-sm font-normal text-custom-black">
                                                {popupData?.stats?.returnedItems}
                                            </p>
                                        </div>
                                        <div className="cursor-pointer col-span-2 flex gap-2 justify-start items-center w-full">
                                            <p className="text-sm font-semibold text-gray-600">
                                                Total Refunded Items:
                                            </p>
                                            <p className="text-sm font-normal text-custom-black">
                                                {popupData?.stats?.refundedItems}
                                            </p>
                                        </div>
                                        <div className="cursor-pointer col-span-2 flex gap-2 justify-start items-center w-full">
                                            <p className="text-sm font-semibold text-gray-600">
                                                Total Refund Amount:
                                            </p>
                                            <p className="text-sm font-normal text-custom-black">
                                                {(popupData?.stats?.totalRefundAmount)}
                                            </p>
                                        </div>
                                        <div className="cursor-pointer col-span-2 flex gap-2 justify-start items-center w-full">
                                            <p className="text-sm font-semibold text-gray-600">
                                                Total Income:
                                            </p>
                                            <p className="text-sm font-normal text-custom-black">
                                                {(popupData?.stats?.totalIncome)}
                                            </p>
                                        </div>
                                        <div className="cursor-pointer col-span-2 flex gap-2 justify-start items-center w-full">
                                            <p className="text-sm font-semibold text-gray-600">
                                                Total Tax:
                                            </p>
                                            <p className="text-sm font-normal text-custom-black">
                                                {(popupData?.stats?.totalTax)}
                                            </p>
                                        </div>
                                        {/* <button
                      className="text-white bg-custom-darkpurple rounded w-36 h-[30px] mt-2"
                      onClick={() =>
                        router.push(
                          `/sellers-product?seller_id=${popupData?._id}`
                        )
                      }
                    >
                      Seller Products
                    </button> */}
                                    </div>
                                </div>
                            </div>
                            <p className="text-custom-black text-base font-bold pt-2">
                                Uploaded Document
                            </p>

                            <Swiper
                                navigation={true}
                                modules={[Navigation]}
                                className="mySwiper mt-5 md:w-[880px] w-68"
                                onRealIndexChange={(newindex) =>
                                    setCuurentIndex(newindex.activeIndex)
                                }
                                onSlideChange={() => console.log("slide change")}
                                onSwiper={(swiper) => console.log(swiper)}
                            >
                                {driverdata?.map((item, i) => (
                                    <SwiperSlide onKeyUpCapture={i}>
                                        <div className="w-full flex justify-center">
                                            <div className="md:w-80 md:h-64 w-60 h-48 relative rounded-lg">
                                                <img
                                                    src={item?.img}
                                                    alt="icon"
                                                    layout="responsive"
                                                    className="rounded-sm md:w-80 md:h-64 w-60 h-48 object-contain"
                                                />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <div className="md:h-12">
                                <div className="flex  mt-5  justify-center  gap-5">
                                    {popupData?.status != "Verified" && (
                                        <button
                                            className="text-white text-lg font-bold w-[274px] h-[50px] rounded-[12px] bg-custom-darkpurple"
                                            onClick={() => {
                                                updateStatus(popupData?._id, "Verified");
                                            }}
                                        >
                                            Verify
                                        </button>
                                    )}
                                    {popupData?.status != "Suspend" && (
                                        <button
                                            className="text-white text-lg font-bold w-[274px] h-[50px] rounded-[12px] bg-custom-darkRed"
                                            onClick={() => {
                                                updateStatus(popupData?._id, "Suspend");
                                            }}
                                        >
                                            Suspend
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Dialog>
                )}
                <Dialog
                    open={newPopup}
                    onClose={handleClosePopup}
                    fullScreen
                >
                    <PopupTable
                        {...props}
                        goBack={handleClosePopup}
                        data={newPopupData}
                        loader={props?.loader}
                        toaster={props?.toaster}
                    />
                </Dialog>

                <div className="">
                    <Table
                        columns={columns}
                        data={sellersData}
                        pagination={pagination}
                        onPageChange={(page) => setCurrentPage(page)}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                    />
                </div>
            </section>
        </section>
    );
}

export default isAuth(Sellers);
