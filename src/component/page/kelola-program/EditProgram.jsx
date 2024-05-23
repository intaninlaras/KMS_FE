import { useRef, useState, useEffect } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs } from "../../util/ValidateForm";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import SweetAlert from "../../util/SweetAlert";

export default function ProgramEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    idProgram: "",
    idKK: "",
    nama: "",
    deskripsi: "",
    status: "",
  });

  const userSchema = object({
    idProgram: string(),
    idKK: string(),
    nama: string().max(100, "maksimum 100 karakter").required("harus diisi"),
    deskripsi: string()
      .max(500, "maksimum 500 karakter")
      .required("harus diisi"),
    status: string(),
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    try {
      await userSchema.validateAt(name, { [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error.message }));
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(formData);
  });

  useEffect(() => {
    setFormData({
      idProgram: withID.Key,
      idKK: withID.KKiD,
      nama: withID["Nama Program"],
      deskripsi: withID.Deskripsi,
      status: withID.Status,
    });
  }, [withID]);

  const handleAdd = async (e) => {
    e.preventDefault();

    console.log("im here");

    const validationErrors = await validateAllInputs(
      formData,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);

      setIsError((prevError) => {
        return { ...prevError, error: false };
      });

      setErrors({});

      UseFetch(API_LINK + "Program/EditProgram", formData)
        .then((data) => {
          if (data === "ERROR") {
            setIsError((prevError) => {
              return {
                ...prevError,
                error: true,
                message: "Terjadi kesalahan: Gagal mengubah data program.",
              };
            });
          } else {
            SweetAlert("Sukses", "Data program berhasil diubah", "success");
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
              Edit Program <span className="badge text-bg-dark">Draft</span>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-lg-12">
                  <Input
                    type="text"
                    forInput="nama"
                    label="Nama Program"
                    isRequired
                    placeholder="Nama Program"
                    value={formData.nama}
                    onChange={handleInputChange}
                    errorMessage={errors.nama}
                  />
                </div>
                <div className="col-lg-12">
                  <label style={{ paddingBottom: "5px", fontWeight: "bold" }}>
                    Deskripsi/Penjelasan Program{" "}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <textarea
                    className="form-control mb-3"
                    style={{
                      height: "200px",
                    }}
                    id="deskripsi"
                    name="deskripsi"
                    forInput="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Deskripsi/Penjelasan Program"
                    required
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
