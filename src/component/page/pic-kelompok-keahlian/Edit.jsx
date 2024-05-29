import { useRef, useState, useEffect } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs } from "../../util/ValidateForm";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import SweetAlert from "../../util/SweetAlert";
import Label from "../../part/Label";

export default function PICEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listKaryawan, setListKaryawan] = useState([]);

  const formDataRef = useRef({
    key: "",
    nama: "",
    programStudi: { id: "", nama: "" },
    personInCharge: "",
    deskripsi: "",
    status: "",
  });

  const userSchema = object({
    key: string(),
    nama: string(),
    programStudi: object({
      id: string(),
      nama: string(),
    }),
    personInCharge: string().required("harus dipilih"),
    deskripsi: string(),
    status: string(),
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "personInCharge") {
      try {
        if (value === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "harus dipilih",
          }));
        } else {
          await userSchema.validateAt(name, { [name]: value });
          setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
      } catch (error) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
      }

      formDataRef.current[name] = value;
    }
  };

  const getListKaryawan = async () => {
    setIsLoading(true);

    try {
      while (true) {
        let data = await UseFetch(API_LINK + "KKs/GetListKaryawan", {
          idProdi: formDataRef.current.programStudi.key,
        });

        if (data === "ERROR") {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil daftar karyawan."
          );
        } else if (data.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          setListKaryawan(data);
          setIsLoading(false);
          break;
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: e.message,
      }));
    }
  };

  useEffect(() => {
    formDataRef.current = {
      key: withID.id,
      nama: withID.title,
      programStudi: withID.prodi,
      personInCharge: withID.pic.key ? withID.pic.key : "",
      deskripsi: withID.desc,
      status: withID.status,
    };
  }, []);

  useEffect(() => {
    if (formDataRef.current.programStudi) {
      getListKaryawan();
    }
  }, [formDataRef.current.programStudi]);

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    console.log("im here");

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);

      setIsError((prevError) => {
        return { ...prevError, error: false };
      });

      setErrors({});

      const dataToSend = { ...formDataRef.current };
      if (dataToSend.status === "Menunggu" && dataToSend.personInCharge)
        dataToSend.status = "Aktif";
      dataToSend.programStudi = dataToSend.programStudi.key;

      UseFetch(API_LINK + "KKs/EditKK", dataToSend)
        .then((data) => {
          if (data === "ERROR") {
            setIsError((prevError) => {
              return {
                ...prevError,
                error: true,
                message:
                  "Terjadi kesalahan: Gagal menambah PIC kelompok keahlian.",
              };
            });
          } else {
            SweetAlert("Sukses", "PIC berhasil ditambahkan.", "success");
            onChangePage("index");
          }
        })
        .then(() => setIsLoading(false));
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
      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleAdd}>
          <div className="card">
            <div className="card-header bg-primary fw-medium text-white">
              Edit Kelompok Keahlian
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-lg-12">
                  <Label
                    title="Nama Kelompok Keahlian"
                    data={formDataRef.current.nama}
                  />
                </div>
                <div className="col-lg-12">
                  <Label
                    title="Deskripsi/Ringkasan Mengenai Kelompok Keahlian"
                    data={formDataRef.current.deskripsi}
                  />
                </div>
                <div className="col-lg-6">
                  <Label
                    title="Program Studi"
                    data={formDataRef.current.programStudi.nama}
                  />
                </div>
                <div className="col-lg-6">
                  <DropDown
                    forInput="personInCharge"
                    label="PIC Kelompok Keahlian"
                    arrData={listKaryawan}
                    value={formDataRef.current.personInCharge || ""}
                    onChange={handleInputChange}
                    errorMessage={errors.personInCharge}
                    isRequired
                  />
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
      )}
    </>
  );
}
