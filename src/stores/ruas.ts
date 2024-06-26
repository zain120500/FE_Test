'use client';
import { useState, useEffect } from 'react';
import ruasService from "@/services/ruas";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import responseUtil from '@/utils/response';

const UnitStore = () => {
    const [dataRuas, setDataRuas] = useState<any>([]);
    const [size, setSize] = useState<any>(10)
    const [page, setPage] = useState<number>(1)
    const [lastPage, setTotalPage] = useState<any>(10)
    const [showActive, setShowAcshowActive] = useState<boolean>(false)

    const [input, setInput] = useState<any>({
        unit_id: 0,
        ruas_name: '',
        long: '',
        km_awal: '',
        km_akhir: '',
        status: 1,
        photo: '',
        file: '',
    });

    const [loading, setLoading] = useState<boolean>(false);

    const fetchRuas = async (size: number = 10, page: number = 1, showActive: any = false) => {
        try {
            setLoading(true)
            const response: any = await ruasService.FETCH(size, page, showActive);
            setDataRuas(response.data);
            setTotalPage(response.data.last_page)
            // if (page > lastPage) {
            //     setPage(response.data.last_page)
            // }
            setLoading(false)
            return responseUtil.succ()
        } catch (e: any) {
            console.log(e);
            setLoading(false)
            return responseUtil.err(e.response.status, e.response.data.message[0]);
        }
    };

    const onSubmitAddServ = async () => {
        try {
            setLoading(true)
            let payload = new FormData()
            payload.append("unit_id", input.unit_id)
            payload.append("ruas_name", input.ruas_name)
            payload.append("long", input.long)
            payload.append("km_awal", input.km_awal)
            payload.append("km_akhir", input.km_akhir)
            payload.append("status", input.status)
            payload.append("photo", input.photo)
            payload.append("file", input.file)
            const response = await ruasService.POST_RUAS(payload)
            await fetchRuas()
            setLoading(false)
            return responseUtil.succ()
        } catch (e: any) {
            console.log(e);
            setLoading(false)
            return responseUtil.err(e.response.status, e.response.data.message[0]);
        }
    }
    const onSubmitEditServ = async (id: string) => {
        try {
            setLoading(true)
            let payload = new FormData()
            payload.append('_method', 'PUT');
            payload.append("unit_id", input.unit_id)
            payload.append("ruas_name", input.ruas_name)
            payload.append("long", input.long)
            payload.append("km_awal", input.km_awal)
            payload.append("km_akhir", input.km_akhir)
            payload.append("status", input.status)
            payload.append("photo", input.photo)
            payload.append("file", input.file)
            const response = await ruasService.PUT_RUAS(id, payload)
            await fetchRuas()
            setLoading(false)
            return responseUtil.succ()
        } catch (e: any) {
            setLoading(false)
            return responseUtil.err(e.response.status, e.response.data.message[0]);
        }
    }
    const onSubmitDeleteServ = async (id: string) => {
        try {
            setLoading(true)
            const response = await ruasService.DELETE_RUAS(id)
            await fetchRuas()
            setLoading(false)
            return responseUtil.succ()
        } catch (e: any) {
            setLoading(false)
            return responseUtil.err(e.response.status, e.response.data.message[0]);
        }
    }

    return {
        fetchRuas,
        dataRuas,
        input,
        setInput,
        onSubmitEditServ,
        onSubmitAddServ,
        loading,
        size,
        setSize,
        page,
        setPage,
        lastPage,
        onSubmitDeleteServ
    };
};

export default UnitStore;
