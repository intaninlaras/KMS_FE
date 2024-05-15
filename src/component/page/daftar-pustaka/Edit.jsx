import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import UploadFile from "../../util/UploadFile";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

const listKataKunci = [
    { Value: "Alat", Text: "Kat Kunci 1" },
    { Value: "Mesin", Text: "Kat Kunci 2" },
    { Value: "Perangkat Lunak", Text: "Kat Kunci 3" },
    { Value: "Lainnya", Text: "Kat Kunci 4" },
];

export default function MasterDaftarPustakaEdit({ onChangePage, withID, withKeahlian }) {
    console.log(withKeahlian);
    console.log(withID);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isError, setIsError] = useState({ error: false, message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const gambarInputRef = useRef(null);

    const [values, setPustaka] = useState({
        pus_file: "",
        pus_keterangan: "",
        pus_kata_kunci: "",
        pus_gambar: "",
        pus_status: 1
    });

    console.log(values.pus_status);

    // useEffect(() => {
    //     setPustaka({
    //         ...values,
    //         pus_file: withID.pus_file,
    //         pus_keterangan: withID.pus_keterangan,
    //         pus_gambar: withID.pus_gambar,
    //         pus_kata_kunci: withID.pus_kata_kunci,
    //     });
    // }, []);
    // console.log(values.pus_keterangan);

    const formDataRef = useRef({
        pus_file: "",
        pus_keterangan: "",
        pus_kata_kunci: "",
        pus_gambar: "",
        pus_status: 1,
    });

    const userSchema = object({
        pus_file: string(),
        pus_kata_kunci: string().required("harus dipilih"),
        pus_keterangan: string(),
        pus_gambar: string(),
        pus_status: string(),
    });

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        const validationError = await validateInput(name, value, userSchema);
        formDataRef.current[name] = value;
        setErrors((prevErrors) => ({
            ...prevErrors,
            [validationError.name]: validationError.error,
        }));
    };

    const handleFileChange = async (ref, extAllowed) => {
        const { name, value } = ref.current;
        const file = ref.current.files[0];
        const fileName = file.name;
        const fileSize = file.size;
        const fileExt = fileName.split(".").pop();
        const validationError = await validateInput(name, value, userSchema);
        let error = "";

        if (fileSize / 1024576 > 10) error = "berkas terlalu besar";
        else if (!extAllowed.split(",").includes(fileExt))
            error = "format berkas tidak valid";

        if (error) ref.current.value = "";

        setErrors((prevErrors) => ({
            ...prevErrors,
            [validationError.name]: error,
        }));
    };

    const handleAdd = async (e) => {
        formDataRef.current.pus_kata_kunci = values.pus_keterangan;
        formDataRef.current.pus_gambar = values.pus_gambar;
        formDataRef.current.pus_kata_kunci = values.pus_kata_kunci;
        formDataRef.current.pus_status = values.pus_status;
        formDataRef.current.pus_keterangan = values.pus_keterangan;
        e.preventDefault();

        const validationErrors = await validateAllInputs(
            formDataRef.current,
            userSchema,
            setErrors
        );

        if (Object.values(validationErrors).every((error) => !error)) {
            setIsLoading(true);
            setIsError((prevError) => {
                return { ...prevError, error: false };
            });
            setErrors({});

            const uploadPromises = [];

            if (fileInputRef.current.files.length > 0) {
                uploadPromises.push(
                    UploadFile(fileInputRef.current).then(
                        (data) => (formDataRef.current["pus_file"] = data.data)
                    )
                );
            }

            if (gambarInputRef.current.files.length > 0) {
                uploadPromises.push(
                    UploadFile(gambarInputRef.current).then(
                        (data) => (formDataRef.current["pus_gambar"] = data.data)
                    )
                );
            }

            console.log(fileInputRef.current);

            Promise.all(uploadPromises).then(() => {
                console.log(formDataRef.current.pus_gambar);
                console.log(formDataRef.current.pus_file);
                UseFetch(
                    API_LINK + "savePustaka",
                    formDataRef.current
                )
                    .then((data) => {
                        if (data === "ERROR") {
                            setIsError((prevError) => {
                                return {
                                    ...prevError,
                                    error: true,
                                    message: "Terjadi kesalahan: Gagal menyimpan data Pustaka.",
                                };
                            });
                        } else {
                            SweetAlert(
                                "Sukses",
                                "Data Pustaka berhasil disimpan",
                                "success"
                            );
                            navigate("/daftar_pustaka");
                        }
                    })
                    .then(() => setIsLoading(false));
            });
        }
    };

    if (isLoading) return <Loading />;

    return (
        <>
            {isError.error && (
                <div className="flex-fill">
                    <Alert type="danger" message={isError.message} />
                </div>
            )}
            <form onSubmit={handleAdd}>
                <div className="card">
                    <div className="card-header bg-primary fw-medium text-white">
                        Tambah Pustaka Baru
                    </div>
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-lg-4">
                                <Input
                                    type="text"
                                    forInput="pus_keterangan"
                                    label="Keterangan Pustaka"
                                    isRequired
                                    value={values.pus_keterangan}
                                    onChange={e => setPustaka({ ...values, pus_keterangan: e.target.value })}
                                    errorMessage={errors.pus_keterangan}
                                />
                            </div>
                            <div className="col-lg-4">
                                <DropDown
                                    forInput="pus_kata_kunci"
                                    label="Kata Kunci"
                                    arrData={listKataKunci}
                                    isRequired
                                    value={values.pus_keterangan}
                                    onChange={e => setPustaka({ ...values, mnu_name: e.target.value })}
                                    errorMessage={errors.pus_kata_kunci}
                                />
                            </div>
                            <div className="col-lg-4">
                                <FileUpload
                                    ref={fileInputRef}
                                    forInput="pus_file"
                                    label="File/Bahan Ajar (.pdf, .mp4)"
                                    formatFile=".pdf,.mp4"
                                    onChange={() =>
                                        handleFileChange(fileInputRef, "pdf,mp4")
                                    }
                                    errorMessage={errors.pus_file}
                                />
                            </div>
                            <div className="col-lg-4">
                                <FileUpload
                                    ref={gambarInputRef}
                                    forInput="pus_gambar"
                                    label="Gambar Cover (.jpg, .png)"
                                    formatFile=".pdf,.jpg,.png"
                                    onChange={() =>
                                        handleFileChange(gambarInputRef, "jpg,png")
                                    }
                                    errorMessage={errors.pus_gambar}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="float-end my-4 mx-1">
                    <Button
                        classType="secondary me-2 px-4 py-2"
                        label="Kembali"
                        onClick={() => onChangePage("list", withKeahlian)}
                    />
                    <Button
                        classType="primary ms-2 px-4 py-2"
                        type="submit"
                        label="SIMPAN"
                    />
                </div>
            </form>
        </>
    );
}