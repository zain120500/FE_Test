'use client';
import { useState, useEffect } from 'react';
import unitService from "@/services/unit";

const UnitStore = () => {
    const [dataUnit, setData] = useState<any>([]);

    const fetchUnit = async () => {
        try {
            const response = await unitService.FETCH();
            setData(response.data);
        } catch (e: any) {
            console.log(e);
            return e.response.data.errors;
        }
    };

    return {
        fetchUnit,
        dataUnit
    };
};

export default UnitStore;
