import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Icon from "../part/Icon.jsx";

function CardPustaka({
    pustakas,
    uploader,
    onDetail = () => {},
    MAX_DESCRIPTION_LENGTH = 280,
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
            {pustakas.map((book) => (
                <div className="mt-4" key={book.pus_id}>
                    <div className="card" style={{ borderColor: "#67ACE9", height:"150px" }}>
                        <div className="card-body d-flex align-items-center">
                            {/* Gambar */}
                            <img
                                src={book.pus_gambar}
                                alt="gambar"
                                style={{ maxWidth: "100px",maxHeight:"80px", marginRight: "20px", borderRight: "2px solid #ccc", paddingRight: "10px" }}
                            />
                            <div>
                                {/* Judul Buku */}
                                <button className="btn btn-link p-0 text-decoration-none" onClick={() => onDetail("detail", book)}>
                                    <h5 className="card-title mb-1">{book.pus_file}</h5>
                                </button>
                                {/* Nama Pengarang */}
                                <div className="mb-1">
                                    {/* <Icon name="user" type="Bold"/> */}
                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: "10px", color: "gray" }} />
                                    <span>  {uploader}</span>
                                </div>
                                {/* Deskripsi Buku */}
                                <div>
                                    <p className="card-text">
                                        {book.pus_keterangan.length > MAX_DESCRIPTION_LENGTH && !expandDeskripsi[book.pus_id] ? (
                                            <>
                                                {book.pus_keterangan.slice(0, MAX_DESCRIPTION_LENGTH) + " ..."}
                                            </>
                                        ) : (
                                            <>
                                                {book.pus_keterangan}
                                            </>
                                        )}
                                    </p>
                                    {book.pus_keterangan.length > MAX_DESCRIPTION_LENGTH && (
                                        <a
                                            className="btn btn-link text-decoration-none p-0"
                                            onClick={() => handleExpandDescription(book.pus_id)}
                                        >
                                            {expandDeskripsi[book.pus_id] ? (
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
                    </div>
                </div>
            ))}
        </>
    );
}

export default CardPustaka;
