import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Icon from "../part/Icon.jsx";
import Button from "./Button.jsx";

function CardPustaka({
    pustakas,
    uploader,
    onStatus,
    onEdit = () => { },
    onDetail = () => { },
    MAX_DESCRIPTION_LENGTH = 80,
}) {

    const [expandDeskripsi, setExpandDeskripsi] = useState({});
    const handleExpandDescription = (bookId) => {
        setExpandDeskripsi((prevState) => ({
            prevState,
            [bookId]: !prevState[bookId]
        }));
    };

    const handleStatusChange = (book) => {
        // Logika untuk mengubah status buku
        // Misalnya, memanggil API untuk mengubah status di database
        console.log(`Status buku ${book.Key} diubah`);
        onStatus(book.Key);
    };

    return (
        <>
            {pustakas.map((book) => {
                // Filter data buku berdasarkan filter KK
                // if (book["Kelompok Keahlian"] !== filter) {
                //     return null;
                // }
                if (book.Key == null) {
                    return null;
                }

                return (

                    <div className="mt-4 col-lg-6" key={book.Key}>
                        <div className="card" style={{ borderColor: "#67ACE9", height: "auto" }}>
                            <div className="card-body d-flex align-items-start position-relative">
                                {/* Gambar */}
                                <img
                                    src={book.Gambar}
                                    alt="gambar"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        minWidth: "120px",
                                        marginRight: "0px",
                                        paddingRight: "15px"
                                    }}
                                />

                                {/* Garis Vertikal */}
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "140px", // Menyesuaikan dengan lebar gambar
                                        top: "15px",
                                        bottom: "15px",
                                        width: "2px",
                                        backgroundColor: "#ccc"
                                    }}
                                ></div>


                                <div style={{ paddingLeft: "25px" }}> {/* paddingLeft disesuaikan dengan lebar garis vertikal + marginRight gambar */}
                                    {/* Judul Buku */}
                                    <button className="btn btn-link p-0 text-decoration-none" onClick={() => onDetail("detail", book)}>
                                        <h5 className="card-title mb-1">{book.Judul}</h5>
                                    </button>
                                    {/* Nama Pengarang */}
                                    <div className="mb-1" style={{
                                        fontSize:"12px"
                                    }}>
                                        <span
                                            className="bg-primary me-2"
                                            style={{ padding: "2px" }}
                                        ></span>
                                        <span>{book["Kelompok Keahlian"]}</span>
                                    </div>
                                    <div className="mb-1">
                                        <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px", color: "gray", fontSize:"14px" }} />
                                        <span style={{ fontSize: "12px" }}>{book.Uploader} • {book.Creadate.slice(0, 10)}</span>
                                    </div>
                                    {/* Deskripsi Buku */}
                                    <div>
                                        <p className="card-text p-0 m-0" style={{ fontSize: "12px" }}>
                                            {book.Keterangan.length > MAX_DESCRIPTION_LENGTH && !expandDeskripsi[book.Key] ? (
                                                <>
                                                    {book.Keterangan.slice(0, MAX_DESCRIPTION_LENGTH) + " ..."}
                                                </>
                                            ) : (
                                                <>
                                                    {book.Keterangan}
                                                </>
                                            )}
                                        </p>
                                        {book.Keterangan.length > MAX_DESCRIPTION_LENGTH && (
                                            <a
                                                className="btn btn-link text-decoration-none p-0"
                                                onClick={() => handleExpandDescription(book.Key)}
                                                style={{ fontSize: "12px" }}
                                            >
                                                {expandDeskripsi[book.Key] ? (
                                                    <>
                                                        Tutup <Icon name={"caret-up"} />
                                                    </>
                                                ) : (
                                                    <>
                                                        Baca Selengkapnya <Icon name={"caret-down"} />
                                                    </>
                                                )}
                                            </a>
                                        )}
                                    </div>
                                    {/* Tambahkan konten lainnya sesuai kebutuhan */}
                                </div>
                            </div>

                            <hr className="m-0 p-0" style={{ color: "#67ACE9" }} />

                            {/* Tampilkan icon edit dan switch hanya jika menu adalah "kelola" */}
                            {uploader === book.Uploader && (
                                <div className="p-1 m-1 d-flex align-items-center justify-content-end">
                                    <Button
                                        iconName={"edit"}
                                        onClick={() => onEdit("edit", book)}
                                    />
                                    <div className="form-check form-switch py-0 ms-2" style={{ width: "fit-content" }}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="flexSwitchCheckDefault"
                                            checked={book.Status === "Aktif"}
                                            onChange={() => handleStatusChange(book)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default CardPustaka;