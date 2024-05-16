import { useState, useEffect } from "react";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Filter from "../../part/Filter";
import Icon from "../../part/Icon";
import { ListKelompokKeahlian, ListProdi } from "../../util/Dummy";

export default function BerandaIndex({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const data = ListKelompokKeahlian.find((item) => item.data.id === withID);

  const [formData, setFormData] = useState({
    key: "",
    nama: "",
    programStudi: "",
    personInCharge: "",
    deskripsi: "",
    status: "",
  });

  useEffect(() => {
    if (withID) {
      setFormData({
        key: withID.id,
        nama: withID.title,
        programStudi: withID.prodi.nama,
        personInCharge: withID.pic.nama,
        deskripsi: withID.desc,
        status: withID.status,
      });
    }
  }, [withID]);

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <div className="d-flex flex-column">
        <div className="flex-fill">
          <div className="container">
            <div className="row pt-2">
              <div className="col-lg-7 px-4">
                <div className="card">
                  <div className="card-header bg-primary fw-medium text-white">
                    Anggota Kelompok Keahlian
                  </div>
                  <div className="card-body">
                    <h3 className="mb-2 fw-semibold">{formData.nama}</h3>
                    <h6 className="fw-semibold">
                      <span
                        className="bg-primary me-2"
                        style={{ padding: "2px" }}
                      ></span>
                      {formData.programStudi}
                    </h6>
                    <div className="pt-2 ps-2">
                      <Icon
                        name="user"
                        cssClass="p-0 ps-1 text-dark"
                        title="PIC Kelompok Keahlian"
                      />{" "}
                      <span>PIC : {formData.personInCharge}</span>
                    </div>
                    <hr className="mb-0" style={{ opacity: "0.2" }} />
                    <p className="pt-2">{formData.deskripsi}</p>
                    <hr style={{ opacity: "0.2" }} />
                    <h6 className="fw-semibold mt-4">Daftar Anggota</h6>
                    <div className="input-group mb-3">
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
                    </div>
                    {data?.data.members.map((pr, index) => (
                      <div className="card-profile mb-3 d-flex justify-content-between shadow-sm">
                        <div className="d-flex w-100">
                          <p className="mb-0 px-1 py-2 mt-2 me-2 fw-bold text-primary">
                            {index + 1}
                          </p>
                          <div
                            className="bg-primary"
                            style={{ width: "1.5%" }}
                          ></div>
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
                        <div className="d-flex align-items-center">
                          <Icon
                            name="square-minus"
                            type="Bold"
                            cssClass="btn px-2 py-0 text-primary"
                            title="Hapus Anggota"
                            onClick={() => onChangePage("edit", data.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    classType="secondary me-2 px-4 py-2"
                    label="Kembali"
                    onClick={() => onChangePage("index")}
                  />
                </div>
              </div>
              <div className="col-lg-5">
                <div className="card">
                  <div className="card-header bg-primary fw-medium text-white">
                    Tambah Anggota
                  </div>
                  <div className="card-body">
                    <div className="input-group mb-3">
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
                          // ref={searchFilterJenis}
                          forInput="ddProdi"
                          label="Program Studi"
                          type="semua"
                          arrData={ListProdi}
                          defaultValue=""
                        />
                      </Filter>
                    </div>
                    {ListProdi.map((value) => (
                      <div>
                        <h6 className="fw-semibold mb-3">{value.Text}</h6>
                        <div className="card-profile mb-3 d-flex justify-content-between shadow-sm">
                          <div className="d-flex w-100">
                            <div
                              className="bg-primary"
                              style={{ width: "1.5%" }}
                            ></div>
                            <div className="p-1 ps-2 d-flex">
                              <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-4.webp"
                                alt="Revalina"
                                className="img-fluid rounded-circle"
                                width="45"
                              />
                              <div className="ps-3">
                                <p className="mb-0">Revalina</p>
                                <p
                                  className="mb-0"
                                  style={{ fontSize: "13px" }}
                                >
                                  UPT Manajemen Informatika
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <Icon
                              name="plus"
                              type="Bold"
                              cssClass="btn px-2 py-0 text-primary"
                              title="Tambah Menjadi Anggota"
                              onClick={() => onChangePage("edit", data.id)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
