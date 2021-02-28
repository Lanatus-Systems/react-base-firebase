/** @jsxImportSource @emotion/react  */
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface IrouteState {
  pdfUrl: string;
}

const PdfView = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  const location = useLocation<IrouteState>();

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const prevPage = () => {
    setPageNumber((p) => (p > 1 ? p - 1 : p));
  };

  const nextPage = () => {
    setPageNumber((p) => (p < (numPages || 1) ? p + 1 : p));
  };

  const prevPageDisabled = pageNumber <= 1;
  const nextPageDisabled = pageNumber >= (numPages || 1);

  if (location.state?.pdfUrl == null) {
    return (
      <div
        css={{
          textAlign: "center",
        }}
      >
        Invalid Access
      </div>
    );
  }

  return (
    <div>
      <div css={{ minHeight: "50vh" }}>
        <Document
          file={location.state.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} width={window.innerWidth - 50} />
        </Document>
      </div>
      <div
        css={{
          //   borderTop: "2px solid lightgrey",
          padding: 20,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon
          icon={faChevronCircleLeft}
          onClick={prevPageDisabled ? () => {} : prevPage}
          size="3x"
          css={{
            cursor: prevPageDisabled ? "unset" : "pointer",
            color: prevPageDisabled ? "lightgrey" : "red",
            ":hover": prevPageDisabled ? {} : { color: "black" },
          }}
        />
        <p>
          {pageNumber} / {numPages}
        </p>
        <FontAwesomeIcon
          icon={faChevronCircleRight}
          onClick={nextPageDisabled ? () => {} : nextPage}
          size="3x"
          css={{
            cursor: nextPageDisabled ? "unset" : "pointer",
            color: nextPageDisabled ? "lightgrey" : "red",
            ":hover": nextPageDisabled ? {} : { color: "black" },
          }}
        />
      </div>
    </div>
  );
};

export default PdfView;
