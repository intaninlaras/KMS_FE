import React, { useEffect, useRef, useState } from "react";
import Button from "../../part/Button";
import FileUpload from "../../part/FileUpload";
import Label from "../../part/Label";
import Loading from "../../part/Loading";
import Cookies from "js-cookie";
import { decryptId } from "../../util/Encryptor";
import { array, object, string } from "yup";
import UseFetch from "../../util/UseFetch";
import uploadFile from "../../util/UploadFile";
import SweetAlert from "../../util/SweetAlert";
import Alert from "../../part/Alert";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";

export default function PengajuanAdd({ onChangePage, withID }) {
  let activeUser = "";
  const cookie = Cookies.get("activeUser");
  if (cookie) activeUser = JSON.parse(decryptId(cookie)).username;

  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [lampiranCount, setLampiranCount] = useState(1);
  const [userData, setUserData] = useState({
    Role: "",
    Nama: "",
    kry_id: "",
  });

  const [fileInfos, setFileInfos] = useState([]);

  const lampiranRefs = useRef([]);

  const handleTambahLampiran = () => {
    setLampiranCount((prevCount) => {
      lampiranRefs.current[prevCount] = React.createRef();
      return prevCount + 1;
    });
  };

  const formDataRef = useRef({
    kke_id: withID.IDAkk,
    kry_id: userData.kry_id,
    pus_status: "Menunggu Acc",
    creaby: activeUser,
    lampirans: [],
  });

  const userSchema = object({
    kke_id: string(),
    kry_id: string(),
    pus_status: string(),
    creaby: string(),
    lampirans: array().of(string()),
  });

  useEffect(() => {
    const fetchDataUser = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "Utilities/GetUserLogin", {
          param: activeUser,
        });

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal mengambil daftar prodi.");
        } else {
          setUserData(data[0]);
          formDataRef.current.kry_id = data[0].kry_id;
        }
      } catch (error) {
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setUserData(null);
      }
    };

    fetchDataUser();
  }, [activeUser]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  useEffect(() => {
    console.log("Lampiran Refs:", lampiranRefs.current);
  }, [fileInfos]);

  const handleFileChange = async (ref, extAllowed, index) => {
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

    if (!error) {
      setFileInfos((prevInfos) => {
        const newInfos = [...prevInfos];
        newInfos[index] = {
          fileName,
          fileSize: (fileSize / 1024 / 1024).toFixed(2) + " MB",
          fileExt,
        };
        return newInfos;
      });
    }
  };

  const handleAdd = async (e) => {
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

      formDataRef.current.lampirans = [];

      lampiranRefs.current.forEach((ref) => {
        if (ref && ref.current && ref.current.files.length > 0) {
          uploadPromises.push(
            uploadFile(ref.current).then((data) => {
              formDataRef.current.lampirans.push({ pus_file: data.newFileName });
            })
          );
        }
      });

      Promise.all(uploadPromises).then(() => {
        UseFetch(API_LINK + "Pengajuans/SaveAnggotaKK", formDataRef.current)
          .then((data) => {
            if (data === "ERROR") {
              setIsError((prevError) => {
                return {
                  ...prevError,
                  error: true,
                  message: "Terjadi kesalahan: Gagal menyimpan data Pengajuan KK.",
                };
              });
            } else {
              SweetAlert("Sukses", "Data Pustaka berhasil disimpan", "success");
            }
          })
          .finally(() => setIsLoading(false));
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isError.error && (
            <div className="flex-fill">
              <Alert type="danger" message={isError.message} />
            </div>
          )}
          <form onSubmit={handleAdd}>
            <div className="card">
              <div className="card-header bg-primary fw-medium text-white">
                Pengajuan Kelompok Keahlian
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-lg-6">
                    <Label title="Nama" data={userData.Nama} />
                  </div>
                  <div className="col-lg-6">
                    <Label title="Jabatan" data={userData.Role} />
                  </div>
                  <div className="col-lg-12 my-3">
                    <Label title="Kelompok Keahlian" data={withID.Nama} />
                  </div>
                  <div className="col-lg-12">
                    <div className="card">
                      <div className="card-header fw-medium">
                        Lampiran Pendukung
                      </div>
                      <div className="card-body p-4">
                        <Button
                          iconName="add"
                          classType="primary btn-sm mb-3"
                          label="Tambah Lampiran"
                          onClick={handleTambahLampiran}
                        />
                        {[...Array(lampiranCount)].map((_, index) => (
                          <div key={index}>
                            <FileUpload
                              forInput={`lampiran_${index}`}
                              label={`Lampiran ${index + 1}`}
                              onChange={() => handleFileChange(lampiranRefs.current[index], "pdf", index)}
                              formatFile=".pdf"
                              ref={lampiranRefs.current[index] || (lampiranRefs.current[index] = React.createRef())}
                            />
                            {fileInfos[index] && (
                              <div className="mt-2">
                                <strong>File Info:</strong>
                                <ul>
                                  <li>Nama: {fileInfos[index].fileName}</li>
                                  <li>Ukuran: {fileInfos[index].fileSize}</li>
                                  <li>Ekstensi: {fileInfos[index].fileExt}</li>
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="float-end my-4 mx-1">
              <Button
                classType="secondary me-2 px-4 py-2"
                label="Batal"
                onClick={() => onChangePage("index")}
              />
              <Button
                classType="primary ms-2 px-4 py-2"
                type="submit"
                label="Simpan"
              />
            </div>
          </form>
        </>
      )}
    </>
  );
}
