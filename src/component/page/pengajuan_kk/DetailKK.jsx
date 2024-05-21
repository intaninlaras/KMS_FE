import { useRef, useState } from "react";
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
import Filter from "../../part/Filter";
import { ListKelompokKeahlian } from "../../util/Dummy";

export default function KKDetailPublish({ onChangePage, withID }) {
    console.log(withID);
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const data = ListKelompokKeahlian.find((item) => item.data.id === withID);

  const formDataRef = useRef({
    namaProduk: "",
    jenisProduk: "",
    gambarProduk: "",
    spesifikasi: "",
  });

  const userSchema = object({
    namaProduk: string()
      .max(100, "maksimum 100 karakter")
      .required("harus diisi"),
    jenisProduk: string().required("harus dipilih"),
    gambarProduk: string(),
    spesifikasi: string(),
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

  const handleAdd = async (e) => {};

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <div className="card">
        <div className="card-header bg-primary fw-medium text-white">
          Detail Kelompok Keahlian
        </div>
        <div className="card-body">
          <div className="row pt-2">
            <div className="col-lg-7 px-4">
              <h3 className="mb-3 fw-semibold">{withID.Nama || ""}</h3>
              <h6 className="fw-semibold">
                <span
                  className="bg-primary me-2"
                  style={{ padding: "2px" }}
                ></span>
                {withID.NamaProdi || ""}
              </h6>
              <p className="py-3">{withID.Desc || ""}</p>
            </div>
            {/* <div className="col-lg-5">
              <p>3 orang baru saja bergabung!</p>
              {data?.data.members.map((pr) => (
                <div className="card-profile mb-2 d-flex shadow-sm">
                  <div className="bg-primary" style={{ width: "1.5%" }}></div>
                  <div className="p-1 ps-2 d-flex">
                    <img
                      src={pr.imgSource}
                      alt={pr.name}
                      className="img-fluid rounded-circle"
                      width="45"
                    />
                    <div className="ps-3">
                      <p className="mb-0">{pr.name}</p>
                      <p className="mb-0" style={{ fontSize: "13px" }}>
                        UPT Manajemen Informatika
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-end">
                <Button
                  classType="light btn-sm text-primary text-decoration-underline px-3 mt-2"
                  type="submit"
                  label="Lihat Semua"
                  data-bs-toggle="modal"
                  data-bs-target="#modalAnggota"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="float-end my-4 mx-1">
        <Button
          classType="secondary me-2 px-4 py-2"
          label="Kembali"
          onClick={() => onChangePage("index")}
        />
      </div>

      <div
        className="modal fade"
        id="modalAnggota"
        tabIndex="-1"
        aria-labelledby="Anggota Kelompok Keahlian"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalAnggotaKK">
                Anggota Kelompok Keahlian
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-4">
                <Input
                  //   ref={searchQuery}
                  forInput="pencarianProduk"
                  placeholder="Cari"
                />
                <Button
                  iconName="search"
                  classType="primary px-4"
                  title="Cari"
                  //   onClick={handleSearch}
                />
                <Filter>
                  <DropDown
                    // ref={searchFilterSort}
                    forInput="ddUrut"
                    label="Urut Berdasarkan"
                    type="none"
                    // arrData={dataFilterSort}
                    defaultValue="[Kode Produk] asc"
                  />
                  <DropDown
                    // ref={searchFilterJenis}
                    forInput="ddJenis"
                    label="Jenis Produk"
                    type="semua"
                    // arrData={dataFilterJenis}
                    defaultValue=""
                  />
                  <DropDown
                    // ref={searchFilterStatus}
                    forInput="ddStatus"
                    label="Status"
                    type="none"
                    // arrData={dataFilterStatus}
                    defaultValue="Aktif"
                  />
                </Filter>
              </div>
              {data?.data.members.map((pr, index) => (
                <div className="card-profile mb-3 d-flex shadow-sm">
                  <p className="mb-0 px-1 py-2 mt-2 me-2 fw-bold text-primary">
                    {index + 1}
                  </p>
                  <div className="bg-primary" style={{ width: "1.5%" }}></div>
                  <div className="p-1 ps-2 d-flex">
                    <img
                      src={pr.imgSource}
                      alt={pr.name}
                      className="img-fluid rounded-circle"
                      width="45"
                    />
                    <div className="ps-3">
                      <p className="mb-0">{pr.name}</p>
                      <p className="mb-0" style={{ fontSize: "13px" }}>
                        UPT Manajemen Informatika
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <Button
                classType="secondary btn-sm px-3 mt-2"
                type="submit"
                label="Kelola"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}