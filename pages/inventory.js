import React, { useMemo, useState, useEffect, useContext } from "react";
import Table from "@/components/table";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaCopy } from "react-icons/fa";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { userContext } from "./_app";
import isAuth from "@/components/isAuth";
import { Search, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

function Inventory(props) {
  const router = useRouter();
  const [productsList, setProductsList] = useState([]);
  const [user, setUser] = useContext(userContext);

  const [selectedNewSeller, setSelectedNewSeller] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [themeData, setThemeData] = useState([]);

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 4,
  });

  useEffect(() => {
    if (user?._id) {
      getProduct(currentPage);
    }
  }, [user, currentPage, searchTerm]); // 👈 searchTerm added

  const getProduct = async (page = 1, limit = 10) => {
    props.loader(true);
    let url = `product/getProduct?page=${page}&limit=${limit}&SellerId=${user._id}`;

    if (searchTerm) {
      url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }

    Api("get", url, {}, router).then(
      (res) => {
        props.loader(false);
        setProductsList(res.data);
        setPagination(res.pagination);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.data?.message || err?.message)
      }
    );
  };



  const image = ({ value, row }) => {
    return (
      <div className="flex flex-col items-center justify-center">
        {row.original &&
          row.original.varients &&
          row.original.varients.length > 0 && (
            <img
              className="md:h-[116px] md:w-[126px] h-20 w-40 object-contain  rounded-md"
              src={row.original.varients[0].image[0]}
              alt="Product"
              onError={(e) => {
                e.target.src = "/placeholder-image.png"; // Add fallback image
              }}
            />
          )}
      </div>
    );
  };

  const productName = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value || "N/A"}</p>
      </div>
    );
  };

  const category = ({ row, value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">
          {row.original?.categoryName?.toString() || "N/A"}
        </p>
      </div>
    );
  };

  const price = ({ row }) => {
    const value = row.original?.varients?.[0]?.selected?.[0]?.offerprice;
    const formattedPrice =
      !isNaN(value) && value !== null && value !== undefined
        ? parseFloat(value).toFixed(2)
        : "0.00";

    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">${formattedPrice}</p>
      </div>
    );
  };

  const piece = ({ row }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{row.original.pieces}</p>
      </div>
    );
  };

  const availableColor = ({ value }) => {
    if (!value || !Array.isArray(value)) {
      return (
        <div className="p-4 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No colors</p>
        </div>
      );
    }

    return (
      <div className="p-4 flex items-center justify-center gap-2 max-w-80 flex-wrap">
        {value.map((item, i) => (
          <div
            key={i}
            className="text-base font-normal rounded-full h-5 w-5 border border-black"
            style={{ background: item?.color || "#ccc" }}
            title={item?.colorName || "Color"}
          ></div>
        ))}
      </div>
    );
  };

  const handleEditProduct = (product) => {
    router.push(`/add-product?id=${product._id}`);
  };

  const actionHandler = ({ value, row }) => {
    return (
      <div className="bg-custom-offWhiteColor flex items-center justify-evenly border border-custom-offWhite rounded-[10px] mr-[10px]">
        <div
          className="py-[10px] w-[50%] items-center flex justify-center border-l-[1px] border-custom-offWhite cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleEditProduct(row.original)}
          title="Edit Product"
        >
          <FiEdit className="text-[22px] text-green-600" />
        </div>
        <div
          className="py-[10px] border-l-[1px] border-custom-offWhite w-[50%] items-center flex justify-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => deleteProduct(row.original._id)}
          title="Delete Product"
        >
          <RiDeleteBinLine className="text-[red] text-[24px]" />
        </div>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "Image",
        accessor: "username",
        Cell: image,
      },
      {
        Header: "Product Name",
        accessor: "name",
        Cell: productName,
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: category,
      },
      {
        Header: "Price",
        // accessor: "price",
        Cell: price,
      },
      {
        Header: "Unit",
        // accessor: "pieces",
        Cell: piece,
      },
      {
        Header: "Available Color",
        accessor: "varients",
        Cell: availableColor,
      },
      {
        Header: "ACTION",
        Cell: actionHandler,
      },
    ],
    [themeData]
  );

  const deleteProduct = (_id) => {
    Swal.fire({
      text: "Are you sure? You want to proceed with the delete?",
      showCancelButton: true,
      cancelButtonColor: "#127300",
      confirmButtonText: "Delete",
      confirmButtonColor: "#127300",
      width: "380px",
    }).then(function (result) {
      if (result.isConfirmed) {
        const data = {
          _id,
        };

        props.loader(true);
        Api("delete", `product/deleteProduct/${_id}`, data, router).then(
          (res) => {
            console.log("res================>", res.data?.message);
            props.loader(false);

            if (res?.status) {
              getProduct(currentPage);
              toast.success(res?.data?.message || "Product deleted successfully")
            } else {
              toast.error(res?.data?.message || "Failed to delete product")
            }
          },
          (err) => {
            props.loader(false);
            console.log(err);
            toast.error(err?.data?.message || err?.message)
          }
        );
      }
    });
  };

  return (
    <div className="bg-gray-100 w-full h-full py-5 px-5">
      <div className="md:pt-[0px] pt-[0px] h-full">
        <p className="text-black font-bold md:text-[32px] text-2xl">
          <span className="w-2 h-8 bg-[#F38529] rounded "></span>
          Inventory
        </p>
        <div className=" md:pb-32 h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-28 mt-5">
          <div className="">
            <div className="bg-white py-4 px-4 rounded-md flex md:flex-row flex-col md:justify-between md:items-end gap-3 relative">
              <Search size={18} className="absolute left-7 top-7 text-gray-700" />
              <input
                className="  border border-gray-400 outline-none py-2 md:w-[435px] w-full pl-9 rounded-[30px] text-gray-700 font-semibold md:text-base text-sm"
                type="text"
                placeholder="Search Products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button
                className="text-black bg-custom-orange px-5 py-2 md:text-[16px] text-[14px] rounded-md cursor-pointer transition-colors"
                onClick={() => router.push("/add-product")}
              >
                Add Product
              </button>
            </div>

            <div className="mt-5 px-3 bg-white min-h-[500px] rounded-md ">
              {productsList && productsList.length > 0 ? (
                <Table
                  columns={columns}
                  data={productsList}
                  pagination={pagination}
                  onPageChange={(page) => setCurrentPage(page)}
                  currentPage={currentPage}
                  itemsPerPage={pagination?.itemsPerPage}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 py-20">
                  <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-sm text-gray-400">Please try searching again.</p>
                  <button
                    className="text-black bg-custom-orange px-10 py-2 md:text-[16px] text-[14px] rounded-md cursor-pointer transition-colors mt-5"
                    onClick={() => router.push("/add-product")}
                  >
                    Add Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default isAuth(Inventory);
