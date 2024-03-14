'use client'
import JobStore from '@/stores/job';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';


interface DetailProps {
  params: {
    id: string; // Misalnya, jika id adalah string
    // Definisikan tipe data properti lainnya jika ada
  };
}

const Detail: React.FC<DetailProps> = ({ params }) => {
  const { detail, detailJob } = JobStore();

  useEffect(() => {
    async function fetchData() {
      await detail(params.id);

    }
    console.log(detailJob);

    fetchData();
  }, []);

  const descriptionContainer = document.getElementById("descriptionContainer");
  if (descriptionContainer) {
    descriptionContainer.innerHTML = detailJob?.description;
  }
  const apply = document.getElementById("apply");
  if (apply) {
    apply.innerHTML = detailJob?.how_to_apply;
  }
  console.log(detailJob);
  const router = useRouter();
  return (
    <div>
      {/* Tombol Back */}
      <div>
        <button onClick={() => router.back()} ><span><Icon icon="ep:back" /></span> Back</button>
      </div>
      <br />
      <div className='bg-white rounded-xl p-5 '>
        <div className='text-slate-500'>{detailJob?.type} / {detailJob?.location}</div>
        <div className='text-xl font-bold'>{detailJob?.title}</div>
        <br />
        <hr />
        <br />
        <div className='flex justify-between shadow-lg grid-cols-2'>
          <div>

            <div id='descriptionContainer'>
            </div>
          </div>
          <div className='bordered w-1/3'>
            <div>
              <div className='flex justify-between'>
                <div>{detailJob?.company}</div>
                <hr />
              </div>
              <img src={detailJob?.company_logo} alt={detailJob?.company} />
              <a href={detailJob?.url}>{detailJob?.url}</a>
            </div>
            <div>
              How To Apply
              <hr />
              <div id='apply'>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail