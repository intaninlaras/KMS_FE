import React from "react";

const FilePreview = ({ file, orginalFileName }) => {
    const fileExtension = orginalFileName.split('.').pop().toLowerCase();

    const renderFilePreview = () => {
        if (["docx", "xlsx", "pptx"].includes(fileExtension)) {
            return (
                <div>
                    <p>Pratinjau untuk file {fileExtension} tidak didukung. Silakan <a href={file} download>unduh file</a> untuk melihatnya.</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p>Tipe file tidak didukung untuk pratinjau. Silakan <a href={file} download>unduh file</a> untuk melihatnya.</p>
                </div>
            );
        }
    };

    return (
        renderFilePreview()
    );
};

export default FilePreview;
