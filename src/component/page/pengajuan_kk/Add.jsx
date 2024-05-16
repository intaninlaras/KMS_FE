import React, { useState } from "react";
import Button from "../../part/Button";
import FileUpload from "../../part/FileUpload";
import Label from "../../part/Label";
import { ListKelompokKeahlian } from "../../util/Dummy";

export default function PengajuanAdd({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [lampiranCount, setLampiranCount] = useState(1); // State untuk melacak jumlah lampiran yang ditambahkan
  const data = ListKelompokKeahlian.find((item) => item.data.id === withID);

  if (isLoading) return <Loading />;

  const handleTambahLampiran = () => {
    setLampiranCount((prevCount) => prevCount + 1);
  };

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <form>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Pengajuan Kelompok Keahlian
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-6">
                <Label title="Nama" data="Nicholas Saputra" />
              </div>
              <div className="col-lg-6">
                <Label title="Jabatan" data="UPT Manajemen Informatika" />
              </div>
              <div className="col-lg-12 my-3">
                <Label title="Kelompok Keahlian" data={data?.data.title} />
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
                      onClick={handleTambahLampiran} // Menambahkan handle klik untuk tombol 'Tambah Lampiran'
                    />
                    {/* Menambahkan input FileUpload sebanyak lampiranCount */}
                    {[...Array(lampiranCount)].map((_, index) => (
                      <FileUpload
                        key={index}
                        forInput={`lampiran_${index}`} // Gunakan key unik untuk setiap input
                        label={`Lampiran ${index + 1}`} // Label dinamis sesuai dengan nomor lampiran
                        formatFile=".pdf"
                      />
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
  );
}
