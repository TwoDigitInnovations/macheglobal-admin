import React, { useMemo, useState, useEffect } from 'react';
import { Api } from '@/services/service';
import { useRouter } from 'next/router';
import moment from 'moment';
import isAuth from '@/components/isAuth';
import Table from '@/components/table';
import { BanknoteArrowDown } from 'lucide-react';

function wallet(props) {
    const router = useRouter();
    const [queries, setQueries] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState({
        name: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
    });

    const primaryColor = '#FF700099'; 

    useEffect(() => {
        fetchQueries(selectedDate, currentPage);
    }, [currentPage, selectedDate]);

    const fetchQueries = async (selectedDate, page = 1, limit = 10) => {
        const data = {};

        if (selectedDate) {
            data.curDate = moment(new Date(selectedDate)).format();
        }

        if (searchParams.name) {
            data.name = searchParams.name;
        }

        if (searchParams.email) {
            data.Email = searchParams.email;
        }

        setIsLoading(true);
        props.loader(true);

        try {
            const res = await Api("post", `getContactUs?page=${page}&limit=${limit}`, data, router);

            props.loader(false);
            setIsLoading(false);

            if (res?.status) {
                setQueries(res?.data);
                setPagination(res?.pagination);
                setCurrentPage(res?.pagination?.currentPage);
            } else {
                props.toaster({ type: "error", message: res?.data?.message || "Failed to fetch queries" });
            }
        } catch (err) {
            props.loader(false);
            setIsLoading(false);
            props.toaster({ type: "error", message: err?.data?.message || err?.message || "An error occurred" });
        }
    };

    return (
        <section className="w-full h-full bg-gray-50 p-6 overflow-y-scroll   scrollbar-hide overflow-scroll pb-28">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-gray-900 font-bold md:text-[32px] text-2xl">Wallet</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor }}></div>
                    </div>
                ) : queries.length === 0 ? (
                    <div className="flex flex-col justify-center items-center p-20 text-center">
                        <BanknoteArrowDown size={98} className="text-[#FF700099] mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-1">No Transaction History found</h3>

                    </div>
                ) : (
                    <div className="overflow-x-auto px-5">
                        <p>Transaction History</p>
                    </div>
                )}
            </div>


        </section>
    );
}

export default isAuth(wallet);