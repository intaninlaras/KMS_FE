import { useState, useEffect } from "react";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Filter from "../../part/Filter";
import Icon from "../../part/Icon";

export default function KKDetailPublish({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    key: "",
    nama: "",
    programStudi: "",
    personInCharge: "",
    deskripsi: "",
    status: "",
    members: [],
    memberCount: "",
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
        members: withID.members,
        memberCount: withID.memberCount,
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
      <div className="card">
        <div className="card-header bg-primary fw-medium text-white">
          Detail Kelompok Keahlian
        </div>
        <div className="card-body">
          <div className="row pt-2">
            <div className="col-lg-7 px-4">
              <h3 className="mb-3 fw-semibold">{formData.nama}</h3>
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
              <p className="py-3">{formData.deskripsi}</p>
            </div>
            <div className="col-lg-5">
              {/* <p>3 orang baru saja bergabung!</p> */}
              {formData.members?.map((pr) => (
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
              {/* <div className="text-end">
                <Button
                  classType="light btn-sm text-primary text-decoration-underline px-3 mt-2"
                  type="submit"
                  label="Lihat Semua"
                  data-bs-toggle="modal"
                  data-bs-target="#modalAnggota"
                />
              </div> */}
            </div>
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
        class="modal fade"
        id="modalAnggota"
        tabindex="-1"
        aria-labelledby="Anggota Kelompok Keahlian"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalAnggotaKK">
                Anggota Kelompok Keahlian
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
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
              {formData.members?.map((pr, index) => (
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
