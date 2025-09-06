import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Filter,
  X,
  Eye,
  Star,
  StarHalf,
  User,
  Clock,
  Package,
  Delete,
  ListRestart,
} from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { toast } from "react-toastify";


function Queries(props) {
  const [queries, setQueries] = useState([]);
  const [viewPopup, setViewPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sampleReviews, setSampleReviews] = useState([]);
  const router = useRouter();

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });

  const primaryColor = "#FF700099";

  const getAllQuries = async (page = 1, limit = 10) => {
    const data = {
      selectedDate: selectedDate,
    };

    props.loader(true);
    Api("post", `getReview`, data, router).then(
      (res) => {
        props.loader(false);
        console.log(res);
        setSampleReviews(res.data);
        // setPagination({
        //   totalPages: 1,
        //   currentPage: 1,
        //   itemsPerPage: 10,
        // });
        if (res?.status) {
        } else {
          console.log(res?.data?.message);
          toast.error(res?.data?.message || "An error occurred")
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        toast.error(err?.data?.message || err?.message)
      }
    );
  };

  useEffect(() => {
    getAllQuries();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
        ))}

        {hasHalfStar && (
          <StarHalf size={16} className="fill-yellow-400 text-yellow-400" />
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} size={16} className="text-gray-300" />
        ))}

        <span className="text-sm text-gray-600 ml-2">({rating})</span>
      </div>
    );
  };

  const handleViewDetails = (review) => {
    setPopupData(review);
    setViewPopup(true);
  };

  const handleSearch = () => {
    getAllQuries();
  };

  const handleReset = () => {
    setSelectedDate("");
    getAllQuries();
  };

  const ReviewCard = ({ review }) => (
    <div className="w-full h-auto bg-white border border-gray-200 rounded-lg md:p-4 p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500 flex items-center">
              <Clock size={14} className="mr-1" />
              {formatDate(review.updatedAt)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Package size={16} className="text-gray-400 md:block hidden" />
          <span className="md:block hidden text-xs text-gray-500">
            Product Name: {review.product?.name}
          </span>
        </div>
      </div>


      <div className="mb-3">{renderStars(review.rating)}</div>
      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {review.description}
        </p>
      </div>

      <div className="flex md:flex-row flex-col justify-between items-start gap-2 pt-3 border-t border-gray-100">
        <div className="md:block hidden text-xs text-gray-500">
          Posted by: {review.posted_by.name}
        </div>
        <div className="block md:hidden text-xs text-gray-500">
          Posted by: {review.posted_by.name}
        </div>
        <div className="flex gap-2 w-full md:w-[300px]">
          <button
            onClick={() => handleViewDetails(review)}
            className="flex w-1/2  items-center space-x-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
          <button
            onClick={() => deleteProduct(review._id)}
            className="flex w-1/2  items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg transition-all duration-200 hover:bg-red-600 hover:shadow-md transform hover:scale-103 "
          >
            <Delete size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );

  const deleteProduct = (_id) => {
    Swal.fire({
      title: "",
      text: "Are you sure? You want to delete this Review?",
      showCancelButton: true,
      cancelButtonColor: "#F38529",
      confirmButtonColor: "#F38529",
      confirmButtonText: "Delete",
      width: "350px",
    }).then(function (result) {
      if (result.isConfirmed) {
        const data = {
          _id,
        };
        props.loader(true);
        Api("delete", `deleteReview/${_id}`, data, router).then(
          (res) => {
            console.log("res================>", res.data?.meaasge);
            props.loader(false);
            toast.success("Review deleted successfully")
            if (res?.status) {
              getAllQuries();
            } else {
              console.log(res?.data?.message);
              toast.error(res?.data?.meaasge)
            }
          },
          (err) => {
            props.loader(false);
            console.log(err);
            toast.error(err?.data?.meaasge || err?.message)
          }
        );
      } else if (result.isDenied) {
      }
    });
  };

  return (
    <section className="w-full h-full bg-gray-50 p-6 overflow-y-scroll scrollbar-hide overflow-scroll pb-28">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-gray-900 font-bold md:text-[32px] text-2xl">Reviews</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-[14px] font-medium text-gray-700 mb-1.5 pl-3">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-1 border border-gray-300 rounded-[30px] focus:ring-2 focus:outline-none text-black"
                  style={{ focusRing: `${primaryColor}40` }}
                />
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end space-x-3">
              <button
                onClick={handleSearch}
                className="flex items-center justify-center px-2 py-1 rounded-lg text-black text-[16px] font-medium transition-all cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                Search
                <Search size={18} className="ml-2" />
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center px-2 py-1 bg-gray-100 text-gray-700 cursor-pointer rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                Reset
                <ListRestart size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 md:p-6 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center p-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: primaryColor }}
            ></div>
          </div>
        ) :
          sampleReviews.length == 0 ? (
            <div className="flex flex-col justify-center items-center p-20 text-center">
              <div className="w-32 h-32 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Package size={48} className="text-[#FF700099]" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-1">
                No reviews found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) :
            (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:gap-6 gap-4">
                {sampleReviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            )}
      </div>

      {/* View Details Popup */}
      {viewPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-12">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Review Details
                </h2>
                <button
                  onClick={() => setViewPopup(false)}
                  className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-4 shadow">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Customer Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Name: {popupData.posted_by.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {popupData.posted_by.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {popupData.posted_by.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Review Date:{" "}
                    {new Date(popupData.createdAt).toLocaleString()}
                  </p>
                  {popupData.updatedAt !== popupData.createdAt && (
                    <p className="text-sm text-gray-600">
                      Last Updated:{" "}
                      {new Date(popupData.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>


                <div className="bg-gray-50 rounded-lg p-4 shadow">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Product Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Product Name: {popupData.product?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Brand: {popupData.product?.brandName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {popupData.product?.categoryName}
                  </p>
                  <p className="text-sm text-gray-600">
                    SubCategory: {popupData.product?.subCategoryName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ${popupData.product?.varients[0]?.selected[0]?.price} (Offer
                    Price: ${popupData.product?.varients[0]?.selected[0]?.offerprice})
                  </p>
                </div>


                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Rating</h3>
                  {renderStars(popupData.rating)}
                </div>


                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Review</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                    {popupData.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setViewPopup(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Queries;
