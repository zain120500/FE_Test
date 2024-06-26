"use client";

import { useEffect, useState } from 'react';
import UnitStore from '@/stores/unit';
import RuasStore from '@/stores/ruas';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner, useDisclosure } from "@nextui-org/react";
import BaseModal from './baseModal';

import { FaEye, FaTrash, FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import * as Yup from 'yup'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Pagination } from "@nextui-org/react";

export default function RuasTable({ edit }: any = false) {

    const { dataUnit, fetchUnit } = UnitStore();
    const { dataRuas, fetchRuas, setInput, input, onSubmitAddServ, onSubmitEditServ, onSubmitDeleteServ, loading, size, setSize, page, setPage, lastPage } = RuasStore();

    const [dataTable, setDataTable] = useState([])
    const [activeItem, setActiveItem] = useState<any>([])

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [modal, setModal] = useState('');

    const [errors, setErrors] = useState<any>({})


    const BASE_URL = process.env.BASE_URL

    const header = [
        {
            key: "ruas_name",
            label: "Ruas",
        },
        {
            key: "lokasi",
            label: "Lokasi",
        },
        {
            key: "foto",
            label: "Foto",
        },
        {
            key: "doc",
            label: "Document",
        },
        {
            key: "unit_name",
            label: "Unit Kerja",
        },
        {
            key: "isActive",
            label: "Status",
        },
    ];

    const schema = Yup.object().shape({
        unit_id: Yup.number().required('unit_id is required'),
        ruas_name: Yup.string().required('ruas_name is required'),
        long: Yup.string().required('long is required'),
        km_awal: Yup.string().required('km_awal is required'),
        km_akhir: Yup.string().required('km_akhir is required'),
        status: Yup.number().required('status is required'),
        photo: Yup.string().when('id', {
            is: undefined,
            then: () =>
                Yup.string().required('photo is required'),
            otherwise: () =>
                Yup.string()
        }),
        file: Yup.string().when('id', {
            is: undefined,
            then: () =>
                Yup.string().required('photo is required'),
            otherwise: () =>
                Yup.string()
        }),
    })

    if (edit) {
        header.push({
            key: "aksi",
            label: "Aksi",
        })
    }

    const notifyError = (text: string) => toast.error(text);
    const notifySuccess = (text: string) => toast.success(text);

    useEffect(() => {
        fetchUnit()
        fetchRuas()
    }, []);

    useEffect(() => {
        if (Array.isArray(dataRuas.data) && dataRuas.length !== 0) {
            for (var item of dataRuas.data) {
                let idx = dataUnit.data.find((unit: any) => unit.id == item.unit_id)
                item.unit_name = idx.unit
                item.status = (item.status == '1') ? 'Aktif' : 'Non-Aktif'
                item.lokasi = `${item.km_awal} s/d ${item.km_akhir}`
            }
        }

        setDataTable(dataRuas.data)
    }, [dataRuas])

    const [isLoading, setIsLoading] = useState(true);

    const viewFoto = (item: any) => {
        setActiveItem(item)
        setModal('mFoto')
        onOpen()
    }

    const openAdd = () => {
        resetInput()
        setModal('mAdd')
        onOpen()
    }


    const openView = (item: any) => {
        setActiveItem(item)
        setInput({
            id: item.id,
            unit_id: item.unit_id,
            ruas_name: item.ruas_name,
            long: item.long,
            km_awal: item.km_awal,
            km_akhir: item.km_akhir,
            status: (item.status == "Aktif") ? 1 : 0,
            photo: '',
            file: '',
        })
        setModal('mView')
        onOpen()
    }
    const openEdit = (item: any) => {
        setActiveItem(item)
        setErrors({})
        setInput({
            id: item.id,
            unit_id: item.unit_id,
            ruas_name: item.ruas_name,
            long: item.long,
            km_awal: item.km_awal,
            km_akhir: item.km_akhir,
            status: (item.status == "Aktif") ? 1 : 0,
            photo: '',
            file: '',
        })
        setModal('mEdit')
        onOpen()
    }
    const confirmDelete = (item: any) => {
        setActiveItem(item)
        setModal('mConfirmDelete')
        onOpen()
    }

    const validateForm = async () => {
        setErrors({})

        return schema.validate(input, { abortEarly: false })
            .then(() => {
                return true
            })
            .catch(validationErrors => {
                setErrors(validationErrors.inner.reduce((acc: any, error: any) => {
                    acc[error.path] = error.message;
                    return acc;
                }, {}))
                return false
            });
    }
    const onSubmitAdd = async () => {
        if (await validateForm() === false) {
            return notifyError('Mohon Lengkapi Data')
        }

        const response: any = await onSubmitAddServ()
        if (response.status != 200) {
            return notifyError(response.message)
        } else {
            onClose()
            return notifySuccess('Data Berhasil Ditambahkan!')
        }
    }

    const onSubmitEdit = async () => {
        if (await validateForm() === false) {
            return notifyError('Mohon Lengkapi Data')
        }

        const response: any = await onSubmitEditServ(activeItem.id)
        if (response.status != 200) {
            return notifyError(response.message)
        } else {
            onClose()
            return notifySuccess('Data Berhasil Diubah!')
        }
    }
    const onDelete = async () => {
        const response: any = await onSubmitDeleteServ(activeItem.id)
        if (response.status != 200) {
            return notifyError(response.message)
        } else {
            onClose()
            return notifySuccess('Data Berhasil Dihapus!')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setInput((prevInput: any) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;

        if (name === 'inputPhoto') {
            setInput((prevInput: any) => ({
                ...prevInput,
                photo: (files && files.length > 0) ? files[0] : '', // store the File object in state
            }));
        } else if (name === 'inputFile') {
            setInput((prevInput: any) => ({
                ...prevInput,
                file: (files && files.length > 0) ? files[0] : '', // store the File object in state
            }));
        }

    }

    useEffect(() => {
        fetchRuas(size, page)
    }, [size, page])

    const resetInput = () => {
        setErrors({})
        setInput({
            unit_id: null,
            ruas_name: '',
            long: '',
            km_awal: '',
            km_akhir: '',
            status: 1,
            photo: '',
            file: '',
        })
    }

    return (
        <>
            {(edit) && (
                <div className='flex justify-end my-2'>
                    <button className='mii-btn-blue btn-sm' disabled={loading} onClick={() => openAdd()}>
                        {(loading) ?
                            <>Loading...</>
                            :
                            <>
                                <FaPlus />
                                Tambah Ruas
                            </>
                        }
                    </button>
                </div>
            )}
            <Table
                isHeaderSticky
                aria-label="Example table with client side sorting"
            >
                <TableHeader columns={header}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                {dataTable ?
                    <TableBody items={dataTable} isLoading={loading}
                        loadingContent={<Spinner label="Loading..." />}>
                        {(item: any) => (
                            <TableRow key={item.key}>
                                {(columnKey) => (
                                    <TableCell>
                                        {columnKey === "foto" && <button className='mii-btn-blue btn-sm' onClick={() => viewFoto(item)}>Lihat Foto</button>}
                                        {columnKey === "doc" && <>
                                            <a href={item.doc_url} download>
                                                <button className='mii-btn-blue btn-sm'>Download</button>
                                            </a>
                                        </>
                                        }
                                        {columnKey === "isActive" && <div className={`badge text-white ${item.status == 'Aktif' ? 'badge-success' : 'badge-error'}`}>{item.status}</div>}
                                        {columnKey === "aksi" && edit && (
                                            <>
                                                <button className='mii-btn-blue btn-sm mr-2' onClick={() => openEdit(item)}><MdEdit /></button>
                                                <button className='mii-btn-blue btn-sm mr-2'><FaEye onClick={() => openView(item)} /></button>
                                                <button className='mii-btn-red btn-sm'><FaTrash onClick={() => confirmDelete(item)} /></button>
                                            </>
                                        )}
                                        {getKeyValue(item, columnKey)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}

                    </TableBody>
                    : <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
                }
            </Table>
            <div className='flex justify-end my-3 items-end gap-2'>
                <label htmlFor="size">Show</label>

                <select
                    className='select select-sm select-bordered w-20'
                    name="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={40}>40</option>
                    <option value={50}>50</option>
                </select>
                <Pagination total={lastPage} initialPage={page} onChange={(page: number) => setPage(page)} />
            </div>

            {(modal == 'mFoto') &&
                <>
                    <BaseModal mdl={{ isOpen, onOpen, onClose }} size='md' title={`Foto ${activeItem.ruas_name}`} >
                        <img src={activeItem.photo_url} ></img>
                        <button className='mii-btn-red' onClick={onClose}>
                            Tutup
                        </button>
                    </BaseModal>
                </>
            }
            {(modal == 'mAdd') &&
                <>
                    <BaseModal mdl={{ isOpen, onOpen, onClose, loading }} size='xl' title='Tambah Ruas' >
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <div className='my-2'>
                                    <label>Ruas<span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="ruas_name"
                                        value={input.ruas_name}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.ruas_name ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Unit Kerja<span className='text-red-500'>*</span></label>
                                    <select
                                        className={`select select-sm select-bordered w-full max-w-xs ${errors.unit_id ? 'select-error' : ''}`}
                                        name="unit_id"
                                        value={input.unit_id}
                                        onChange={handleChange}
                                    >
                                        <option value={0} disabled selected>-- Pilih Unit --</option>
                                        {dataUnit.data.map((item: any) => (
                                            <option value={item.id}>{item.unit}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='my-2'>
                                    <label>Foto<span className='text-red-500'>*</span></label>
                                    <input
                                        type="file"
                                        name="inputPhoto"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={`file-input file-input-bordered w-full max-w-xs file-input-sm ${errors.photo && 'file-input-error'}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Dokumen<span className='text-red-500'>*</span></label>
                                    <input
                                        type="file"
                                        name="inputFile"
                                        accept='.pdf,.doc,.docx,.txt'
                                        onChange={handleFileChange}
                                        className={`file-input file-input-bordered w-full max-w-xs file-input-sm ${errors.file && 'file-input-error'}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className='my-2'>
                                    <label>Panjang {'(Km)'}<span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="long"
                                        value={input.long}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.long ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Km Awal<span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="km_awal"
                                        value={input.km_awal}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.km_awal ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Km Akhir<span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="km_akhir"
                                        value={input.km_akhir}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.km_akhir ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Status<span className='text-red-500'>*</span></label>
                                    <select
                                        name="status"
                                        value={input.status}
                                        onChange={handleChange}
                                        className={`select select-sm select-bordered w-full max-w-xs ${errors.status ? 'select-error' : ''}`}
                                    >
                                        <option value={0}>Non-Aktif</option>
                                        <option value={1} selected>Aktif</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end'>
                            <button className='mii-btn-red mr-2' disabled={loading} onClick={onClose}>
                                {(loading) ?
                                    <>Loading...</>
                                    :
                                    <>
                                        Batal
                                    </>
                                }
                            </button>
                            <button className='mii-btn-blue' disabled={loading} onClick={onSubmitAdd}>
                                {(loading) ?
                                    <>Loading...</>
                                    :
                                    <>
                                        Simpan
                                    </>
                                }
                            </button>

                        </div>
                    </BaseModal>
                </>
            }
            {(modal == 'mEdit') &&
                <>
                    <BaseModal mdl={{ isOpen, onOpen, onClose }} size='xl' title='Edit Ruas' >
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <div className='my-2'>
                                    <label>Ruas<span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="ruas_name"
                                        value={input.ruas_name}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.ruas_name ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Unit Kerja<span className='text-red-500'>*</span></label>
                                    <select
                                        className={`select select-sm select-bordered w-full max-w-xs ${errors.unit_id ? 'select-error' : ''}`}
                                        name="unit_id"
                                        value={input.unit_id}
                                        onChange={handleChange}
                                    >
                                        <option value={0} disabled selected>-- Pilih Unit --</option>
                                        {dataUnit.data.map((item: any) => (
                                            <option value={item.id}>{item.unit}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='my-2'>
                                    <label>Foto<span className='text-red-500'>*</span></label>
                                    <input
                                        type="file"
                                        name="inputPhoto"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={`file-input file-input-bordered w-full max-w-xs file-input-sm ${errors.photo && 'file-input-error'}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Dokumen<span className='text-red-500'>*</span></label>
                                    <input
                                        type="file"
                                        name="inputFile"
                                        accept='.pdf,.doc,.docx,.txt'
                                        onChange={handleFileChange}
                                        className={`file-input file-input-bordered w-full max-w-xs file-input-sm ${errors.file && 'file-input-error'}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className='my-2'>
                                    <label>Panjang {'(Km)'}<span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="long"
                                        value={input.long}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.long ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Km Awal<span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="km_awal"
                                        value={input.km_awal}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.km_awal ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Km Akhir<span className='text-red-500'>*</span></label>
                                    <input
                                        type="text"
                                        name="km_akhir"
                                        value={input.km_akhir}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.km_akhir ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Status<span className='text-red-500'>*</span></label>
                                    <select
                                        name="status"
                                        value={input.status}
                                        onChange={handleChange}
                                        className={`select select-sm select-bordered w-full max-w-xs ${errors.status ? 'select-error' : ''}`}
                                    >
                                        <option value={0}>Non-Aktif</option>
                                        <option value={1} selected>Aktif</option>
                                    </select>
                                </div>
                            </div>
                        </div>



                        <div className='flex justify-end'>
                            <button className='mii-btn-red mr-2' disabled={loading} onClick={onClose}>
                                {(loading) ?
                                    <>Loading...</>
                                    :
                                    <>
                                        Batal
                                    </>
                                }
                            </button>
                            <button className='mii-btn-blue' disabled={loading} onClick={onSubmitEdit}>
                                {(loading) ?
                                    <>Loading...</>
                                    :
                                    <>
                                        Simpan
                                    </>
                                }
                            </button>
                        </div>
                    </BaseModal>
                </>
            }
            {(modal == 'mView') &&
                <>
                    <BaseModal mdl={{ isOpen, onOpen, onClose }} size='xl' title='Detail Ruas' >
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <div className='my-2'>
                                    <label>Ruas<span className='text-red-500'>*</span></label>
                                    <input
                                        disabled
                                        type="text"
                                        name="ruas_name"
                                        value={input.ruas_name}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.ruas_name ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Unit Kerja<span className='text-red-500'>*</span></label>
                                    <select
                                        disabled
                                        className={`select select-sm select-bordered w-full max-w-xs ${errors.unit_id ? 'select-error' : ''}`}
                                        name="unit_id"
                                        value={input.unit_id}
                                        onChange={handleChange}
                                    >
                                        <option value={0} disabled selected>-- Pilih Unit --</option>
                                        {dataUnit.data.map((item: any) => (
                                            <option value={item.id}>{item.unit}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='my-2'>
                                    <label>Foto<span className='text-red-500'>*</span></label>
                                    <input
                                        disabled
                                        type="file"
                                        name="inputPhoto"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={`file-input file-input-bordered w-full max-w-xs file-input-sm ${errors.photo && 'file-input-error'}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Dokumen<span className='text-red-500'>*</span></label>
                                    <input
                                        disabled
                                        type="file"
                                        name="inputFile"
                                        accept='.pdf,.doc,.docx,.txt'
                                        onChange={handleFileChange}
                                        className={`file-input file-input-bordered w-full max-w-xs file-input-sm ${errors.file && 'file-input-error'}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className='my-2'>
                                    <label>Panjang {'(Km)'}<span className='text-red-500'>*</span></label>
                                    <input
                                        disabled
                                        type="text"
                                        name="long"
                                        value={input.long}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.long ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Km Awal<span className='text-red-500'>*</span></label>
                                    <input
                                        disabled
                                        type="text"
                                        name="km_awal"
                                        value={input.km_awal}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.km_awal ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Km Akhir<span className='text-red-500'>*</span></label>
                                    <input
                                        disabled
                                        type="text"
                                        name="km_akhir"
                                        value={input.km_akhir}
                                        onChange={handleChange}
                                        placeholder="Type here"
                                        className={`input input-bordered w-full max-w-xs input-sm ${errors.km_akhir ? 'input-error' : ''}`}
                                    />
                                </div>
                                <div className='my-2'>
                                    <label>Status<span className='text-red-500'>*</span></label>
                                    <select
                                        disabled
                                        name="status"
                                        value={input.status}
                                        onChange={handleChange}
                                        className={`select select-sm select-bordered w-full max-w-xs ${errors.status ? 'select-error' : ''}`}
                                    >
                                        <option value={0}>Non-Aktif</option>
                                        <option value={1} selected>Aktif</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end'>
                            <button className='mii-btn-red mr-2' disabled={loading} onClick={onClose}>
                                {(loading) ?
                                    <>Loading...</>
                                    :
                                    <>
                                        Batal
                                    </>
                                }
                            </button>
                        </div>
                    </BaseModal>
                </>
            }
            {(modal == 'mConfirmDelete') &&
                <>
                    <BaseModal mdl={{ isOpen, onOpen, onClose }} size='xl' title='Konfirmasi Hapus' >
                        <p>Apakah Anda yakin ingin menghapus Data ini ?</p>
                        <div className='flex justify-end'>
                            <button className='mii-btn-red mr-2' disabled={loading} onClick={onClose}>
                                {(loading) ?
                                    <>Loading...</>
                                    :
                                    <>
                                        Batal
                                    </>
                                }
                            </button>
                            <button className='mii-btn-blue mr-2' disabled={loading} onClick={onDelete}>
                                {(loading) ?
                                    <>Loading...</>
                                    :
                                    <>
                                        YA
                                    </>
                                }
                            </button>
                        </div>
                    </BaseModal>
                </>
            }

            <div>
                <ToastContainer />
            </div>
        </>
    );
}
