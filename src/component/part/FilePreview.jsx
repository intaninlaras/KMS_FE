import React from "react";
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

const FilePreview = ({ file, orginalFileName }) => {
    const fileExtension = orginalFileName.split('.').pop().toLowerCase();

    const renderFilePreview = () => {
        if (fileExtension === "pdf" || fileExtension === "mp4") {
            return (
                <object
                    data={file}
                    type="application/pdf"
                    width="100%"
                    height="500"
                >
                    {/* <p>Maaf, browser Anda tidak mendukung pratinjau PDF. Silakan <a href={file}>unduh file</a> untuk melihatnya.</p> */}
                </object>
            );
        } else if (["docx", "xlsx", "pptx"].includes(fileExtension)) {
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
        <div className="mt-0 col-lg-9 mb-2">
            {renderFilePreview()}
        </div>
    );
};

export default FilePreview;
