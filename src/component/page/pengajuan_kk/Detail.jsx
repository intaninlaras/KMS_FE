import React from "react";
import { useEffect, useRef, useState } from "react";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";
import Label from "../../part/Label";
import FileUpload from "../../part/FileUpload";
import Icon from "../../part/Icon";

export default function PengajuanDetail({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [lampiranCount, setLampiranCount] = useState(1);

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
                <Label title="Kelompok Keahlian" data="Data Scientist" />
              </div>
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header fw-medium">
                    Lampiran Pendukung
                  </div>
                  <div className="card-body p-4">
                    <Label title="Lampiran 1" data="FILE_Bukti_Penunjang" />
                  </div>
                </div>
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
      </form>
    </>
  );
}
