import { useEffect, useRef, useState } from "react";
import Button from "../../part/Button";
import Label from "../../part/Label";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

// Data Materi (sama dengan data statis sebelumnya)
const sampleData = [
  {
    Key: 1,
    "Nama Materi": "Pemrograman 5",
    "Kelompok Keahlian": "Pemrograman",
    "Deskripsi Materi": "Pengenalan Bahasa Pemrograman PHP dan Framework Laravel",
    "Status Materi": "Aktif",
  },
  {
    Key: 2,
    "Nama Materi": "DDL & DML",
    "Kelompok Keahlian": "Basis Data",
    "Deskripsi Materi": "Pengenalan Query DDL dan DML pada DBMS SQL Server",
    "Status Materi": "Tidak Aktif",
  },
  {
    Key: 3,
    "Nama Materi": "Pengantar Informatika",
    "Kelompok Keahlian": "Informatika",
    "Deskripsi Materi": "Pengenalan Fitur dan Formula Dasar Pada Microsoft Excel",
    "Status Materi": "Aktif",
  },
  {
    Key: 4,
    "Nama Materi": "Router",
    "Kelompok Keahlian": "Jaringan Komputer",
    "Deskripsi Materi": "Dasar Pengenalan Router dan Cara Konfigurasi Router",
    "Status Materi": "Tidak Aktif",
  },
];

export default function MasterProsesDetail({ onChangePage, withID }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    "Nama Materi": "",
    "Kelompok Keahlian": "",
    "Deskripsi Materi": "",
    "Status Materi": "",
  });

  useEffect(() => {
    console.log("withID:", withID); // Tampilkan nilai withID
    setIsError({ error: false, message: "" }); // Reset error state
    setIsLoading(true); // Set loading state

    // Gunakan nilai default jika withID tidak diberikan
    const idToUse = withID !== undefined ? withID : 1;

    // Cari data materi dengan Key yang sesuai dengan withID
    const selectedMateri = sampleData.find((materi) => materi.Key === idToUse);

    console.log("selectedMateri:", selectedMateri); // Tampilkan nilai selectedMateri

    if (!selectedMateri) {
      setIsError({
        error: true,
        message: "Terjadi kesalahan: Gagal mengambil data materi.",
      });
    } else {
      formDataRef.current = { ...selectedMateri };
    }

    setIsLoading(false); // Unset loading state
  }, [withID]); // Membuat useEffect dipanggil ulang ketika withID berubah

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
          Detail Data Materi
        </div>
        <div className="card-body p-4">
          <div className="row">
            <div className="col-lg-3">
              <Label
                forLabel="kelompokKeahlian"
                title="Kelompok Keahlian"
                data={formDataRef.current["Kelompok Keahlian"]}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="statusMateri"
                title="Kategori"
                data="Lorem Ipsum"
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="namaMateri"
                title="Nama Materi"
                data={formDataRef.current["Nama Materi"]}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="statusMateri"
                title="Pengenalan Materi"
                data="Berisi Materi Pemrograman"
              />
            </div>
            <div className="col-lg-6">
              <Label
                forLabel="deskripsiMateri"
                title="Deskripsi"
                data={formDataRef.current["Deskripsi Materi"]}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="statusMateri"
                title="Materi (PDF)"
                data={<a href="#">Unduh Berkas</a>}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="statusMateri"
                title="Materi (Video)"
                data={<a href="#">Unduh Berkas</a>}
              />
            </div>
            <div className="col-lg-3">
              <Label
                forLabel="statusMateri"
                title="Sharing Expert"
                data={<a href="#">Unduh Berkas</a>}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="float my-4 mx-1">
        <Button
          classType="outline-secondary me-2 px-4 py-2"
          label="Kembali"
          onClick={() => onChangePage("index")}
        />
      </div>
    </>
  );
}
