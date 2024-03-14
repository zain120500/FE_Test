'use client'
import { dateToTimeAgo } from "@/utils/helpers";

interface Job {
    id: number;
    title: string;
    company: string;
    type: string;
    location: string;
    created_at: string;
    // tambahkan properti lain sesuai kebutuhan
}

interface JobListProps {
    data: Job[]; // Gunakan tipe Job sebagai tipe data
}

const JobList: React.FC<JobListProps> = ({ data }) => {
    const handleDetailClick = (id:any) => {
        // Navigasi ke halaman detail dengan ID data
        window.location.href = `/detail/${id}`;
    };
    return (
        <div>
            {data.map((job) => (
                <div key={job.id}>
                    <div className='flex grid-cols-2 justify-between py-2'>
                        <div className=''>
                            <p className='text-xl font-semibold'>{job.title}</p>
                            <span className='text-slate-500'>{job.company}</span> - <span className='text-success'>{job.type}</span>
                            <br></br>
                            <button className="btn btn-primary mt-3 btn-sm" onClick={() => handleDetailClick(job.id)} >
                                Detail
                            </button>
                        </div>
                        <div className='w-28'>
                            <p>{job.location}</p>
                            <p className='text-slate-500'>{dateToTimeAgo(job.created_at)}</p>
                        </div>
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default JobList;