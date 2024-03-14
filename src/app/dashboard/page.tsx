'use client'
import JobList from '../component/jobList';
import JobStore from '@/stores/job';
import { useEffect } from 'react';
import { Pagination } from "@nextui-org/pagination";

export default function dashboard() {

    const { data, loading, fetch, currentPage, desc, setDesc, location, setLocation, fulltime, setFulltime, get, totalPage, setCurrentPage } = JobStore();

    const handleGetData = () => {
        get(1, desc, location, fulltime);
    };
    useEffect(() => {
        async function fetchData() {
            await fetch();
        }
        fetchData();
    }, []); 

    return (
        <div>
            <div className="grid grid-rows-1">
                <div className="grid grid-cols-4 gap-3">
                    <div>
                        {desc}
                        <label htmlFor="">Job Description</label>
                        <input type="text" value={desc}
                            onChange={(e) => setDesc(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    </div>
                    <div>
                        <label htmlFor="">Location</label>
                        <input type="text" value={location}
                            onChange={(e) => setLocation(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    </div>
                    <div className="flex items-center pt-5">
                        <input type="checkbox"
                            onChange={(e) => setFulltime(e.target.checked)} defaultChecked={fulltime} className="checkbox mr-3" />
                        <label htmlFor="">Fulltime Only</label>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleGetData}>
                        Search
                    </button>

                </div>
            </div>
    
            <div className="bg-white shadow-xl mt-10 p-3 rounded-lg">
                <label className="text-2xl font-bold text-primary py-10">Job List</label>
                <hr />
                {loading ? (
                    <div className='text-center'>
                        <span className="loading loading-spinner text-primary loading-lg"></span>
                        <p className='text-primary'>Loading...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className='mt-5'>Tidak Ada Data</div>
                ) : (
                    <JobList data={data} />
                )}
                <div className='flex justify-end pt-3'>
                    <Pagination loop showControls color="primary" total={totalPage} initialPage={1} page={currentPage} onChange={setCurrentPage} />
                </div>
            </div>

        </div>
    )
}