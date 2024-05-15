import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Icon from "../part/Icon.jsx";
import Button from "./Button.jsx";

function CardPustaka({
    pustakas,
    uploader,
    filter,
    keahlian,
    menu,
    onEdit = () => {},
    onDetail = () => { },
    MAX_DESCRIPTION_LENGTH = 250,
}) {

    const [expandDeskripsi, setExpandDeskripsi] = useState({});
    const handleExpandDescription = (bookId) => {
        setExpandDeskripsi((prevState) => ({
            prevState,
            [bookId]: !prevState[bookId]
        }));
    };

    return (
        <>
            {pustakas.map((book) => {
                // Filter data buku berdasarkan filter KK
                // if (book["Kelompok Keahlian"] !== filter) {
                //     return null;
                // }
                if(book.Key == null){
                    return null;
                }

                return (
                    <div className="mt-4" key={book.Key}>
                        <div className="card" style={{ borderColor: "#67ACE9", height: "auto" }}>
                            <div className="card-body d-flex align-items-center">
                                {/* Gambar */}
                                <img
                                    src={book.Gambar}
                                    alt="gambar"
                                    style={{ width: "120px", height: "120px", borderRight: "2px solid #ccc", paddingRight: "15px", minWidth: "120px", marginRight: "20px" }}
                                />

                                <div>
                                    {/* Judul Buku */}
                                    <button className="btn btn-link p-0 text-decoration-none" onClick={() => onDetail("detail", book, keahlian)}>
                                        <h5 className="card-title mb-1">{book.Judul}</h5>
                                    </button>
                                    {/* Nama Pengarang */}
                                    <div className="mb-1">
                                        <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px", color: "gray" }} />
                                        <span>  {uploader}</span>
                                    </div>
                                    {/* Deskripsi Buku */}
                                    <div>
                                        <p className="card-text p-0 m-0">
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
                                            >
                                                {expandDeskripsi[book.Key] ? (
                                                    <>
                                                        Read Less <Icon name={"caret-up"} />
                                                    </>
                                                ) : (
                                                    <>
                                                        Read More <Icon name={"caret-down"} />
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
                            {menu === "kelola" && (
                                <div className="p-1 m-1 d-flex align-items-center justify-content-end">
                                    <Button
                                        iconName={"edit"}
                                        onClick={() => onEdit("edit")}
                                    />
                                    <div className="form-check form-switch py-0 ms-2" style={{ width: "fit-content" }}>
                                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
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
