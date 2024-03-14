'use client';
import { useEffect, useState, useRef } from 'react';
import jobService from "@/services/job"

const JobStore = () => {
    const [data, setData] = useState<any>([]); // Menggunakan any untuk data
    const [totalPage, setTotalPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [desc, setDesc] = useState('')
    const [location, setLocation] = useState('')
    const [fulltime, setFulltime] = useState(false)
    const previousPageRef = useRef(currentPage);
    const [valueToWatch, setValueToWatch] = useState(0);
    const [detailJob, setDetailJob] = useState(null);

    const fetch = async () => {
        try {
            const response = await jobService.FETCH()
            setTotalPage(Math.ceil(response.data.data.length / 10))
            get(1)
        } catch (e: any) {
            console.log(e);
            return e.response.data.errors
        }
    };

    const get = async (page: any = 1, desc?: any, location?: any, fulltime?: any) => {
        try {
            setLoading(true)
            const response = await jobService.GET(page, desc, location, fulltime)
            let data = []
            for (var item of response.data.data) {
                if (item!=null) {
                    data.push(item)
                }
            }
            setData(data)
            setTotalPage(Math.ceil(response.data.data.length / 10))
            setCurrentPage(page)
            setLoading(false)
        } catch (e: any) {
            console.log(e);
            setLoading(false)
            return e.response.data.errors
        }
    };

    useEffect(() => {
        // Membandingkan nilai currentPage dengan nilai sebelumnya
        if (currentPage !== previousPageRef.current) {
            console.log("Nilai currentPage berubah:", currentPage);
            // Memanggil fungsi get jika nilai currentPage berubah
            get(currentPage);
            // Mengupdate nilai previousPageRef.current menjadi nilai currentPage yang baru
            previousPageRef.current = currentPage;
        }
    }, [currentPage]);

    const search = async (page: any = 1, desc?: any, location?: any, fulltime?: any) => {
        try {
            fetch()
        } catch (e: any) {
            console.log(e);
            setLoading(false)
            return e.response.data.errors
        }
    };

    const detail = async (id:any) => {
        try {
            setLoading(true)
            const response = await jobService.DETAIL(id)
            console.log(response.data.data);
            // response.data.data.description = response.data.data.description.split('\n').filter((para:any) => para.trim() !== '')
            setDetailJob(response.data.data)
            setLoading(false)
        } catch (e: any) {
            console.log(e);
            setLoading(false)
            return e.response.data.errors
        }
    };

    useEffect(() => {
        fetch()
        // Efek ini akan dipanggil setiap kali valueToWatch berubah
        console.log("Nilai valueToWatch berubah:", valueToWatch);
    }, [valueToWatch]);

    return {
        fetch,
        get,
        data,
        totalPage,
        currentPage,
        setCurrentPage,
        loading,
        desc,
        setDesc,
        location,
        setLocation,
        fulltime,
        setFulltime,
        search,
        setValueToWatch,
        valueToWatch,
        detail,
        setDetailJob,
        detailJob,
    };
};

export default JobStore;