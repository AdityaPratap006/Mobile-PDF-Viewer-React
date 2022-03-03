/* eslint-disable */

/**
 * More work need to be done to make it npmable, so that other projects might also use this
 * 
 * THis code is only working because we have added follwing code snippets here in index.html
 *  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/build/pdf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.1.266/web/pdf_viewer.min.js"></script>
 */
/**
 * Code source: https://github.com/mozilla/pdf.js/blob/master/examples/mobile-viewer/viewer.js
 */

/**
  * Why so much effort ?

  Pdf preview doesnot works constitently for the browsers across mobile and desktop clients.
  Mozilla have done a great job of wrting a pdf previewer based on readable steam.
  There are no good ports available. There was one(https://github.com/mikecousins/react-pdf-js/blob/master/README.md) , but was very restrictive in the way you can use it.
  Hence I have to write my own port of mozilla pdf.js
  */
import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import {
  PDFViewCustomContainer,
  isDesktop,
  getCustomIdname,
} from "./App.style";
import { PDFViewerApplicationFactory } from "./PDFViewerApplication";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function PdfPreview(props) {
  const [loaded, setLoaded] = React.useState(false);

  const {
    docUrl,
    uniqueContainerId = "pdf-preview",
    footerStyles,
    styles,
  } = props;

  useEffect(() => {
    /**
     * [description]
     */
    // const pdfjsLib = window.pdfjsLib;
    // const pdfjsViewer = window.pdfjsViewer;

    // document.addEventListener(
    //  'DOMContentLoaded',
    //  function () {
    //    PDFViewerApplication.initUI();
    //  },
    //  true,
    // );

    const onLoaded = () => {
      setLoaded(true);
    };

    const PDFViewerApplication = PDFViewerApplicationFactory({
      pdfjsLib,
      pdfjsViewer,
      uniqueContainerId,
      onLoaded,
    });

    (function animationStartedClosure() {
      // The offsetParent is not set until the PDF.js iframe or object is visible.
      // Waiting for first animation.
      PDFViewerApplication.animationStartedPromise = new Promise(function (
        resolve
      ) {
        window.requestAnimationFrame(resolve);
      });
    })();

    // We need to delay opening until all HTML is loaded.
    if (docUrl) {
      PDFViewerApplication.animationStartedPromise.then(function () {
        const loadingIconArr = document.querySelectorAll(".loadingIcon");
        // console.log(
        //  '🚀 ~ file: PreviewTest.js ~ line 690 ~ loadingIconArr',
        //  loadingIconArr,
        // );

        // if (loadingIconArr && loadingIconArr[0]) {
        //  loadingIconArr[0].style.display = 'none';
        // }

        PDFViewerApplication.open({
          url: docUrl,
        });
      });
    }

    /**
     * [des
     * cription]
     */

    if (docUrl) {
      PDFViewerApplication.initUI();
    }

    return () => {};
  }, [docUrl]);

  return (
    <PDFViewCustomContainer
      // styles={styles}
      uniqueContainerId={uniqueContainerId}
      id={`preview-container-${
        uniqueContainerId ? `${uniqueContainerId}` : ""
      }`}
    >
      <header>
        <h1 id={`title-${uniqueContainerId}`} />
      </header>
      <div
        id={`viewerContainer-${uniqueContainerId}`}
        className="viewerContainer"
      >
        <div id="viewer" className="pdfViewer" />
      </div>
      <div id={`loadingBar-${uniqueContainerId}`}>
        <div className="progress" />
        <div className="glimmer" />
      </div>
      <div id={`errorWrapper-${uniqueContainerId}`} hidden="true">
        <div id={`errorMessageLeft-${uniqueContainerId}`}>
          <span id={`errorMessage-${uniqueContainerId}`} />
          <button id={`errorShowMore-${uniqueContainerId}`}>
            More Information
          </button>
          <button id={`errorShowLess-${uniqueContainerId}`}>
            Less Information
          </button>
        </div>
        <div id={`errorMessageRight-${uniqueContainerId}`}>
          <button id={`errorClose-${uniqueContainerId}`}>Close</button>
        </div>
        <div className="clearBoth" />
        <textarea
          id={`errorMoreInfo-${uniqueContainerId}`}
          hidden="true"
          readOnly="readonly"
          defaultValue={""}
        />
      </div>
      <footer>
        <button
          className="toolbarButton pageUp"
          title="Previous Page"
          id={`previous-${uniqueContainerId}`}
        />
        <button
          className="toolbarButton pageDown"
          title="Next Page"
          id={`next-${uniqueContainerId}`}
        />
        <input
          type="number"
          id={`pageNumber-${uniqueContainerId}`}
          className="toolbarField pageNumber"
          defaultValue={1}
          size={4}
          min={1}
        />
        <button
          className="toolbarButton zoomOut"
          title="Zoom Out"
          id={`zoomOut-${uniqueContainerId}`}
        />
        <button
          className="toolbarButton zoomIn"
          title="Zoom In"
          id={`zoomIn-${uniqueContainerId}`}
        />
      </footer>
    </PDFViewCustomContainer>
  );
}

function App() {
  const url = `https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf`;
  return (
    <div
      style={{
        height: "70vh",
        width: "100vw",
        maxWidth: "100%",
      }}
    >
      <PdfPreview
        docUrl={url}
        styles={css`
          #loadingBar-pdf-preview {
            width: 80%;
            margin: 0px auto;
            margin-top: 50px;
          }

          footer {
            height: 30px;
            bottom: 0px;
            @media ${isDesktop} {
              height: 4rem;
              bottom: 0px;
            }
            button {
              transform: scale(0.8);
            }
          }
        `}
      />
    </div>
  );
}

/**
 * Feels like this code is lot complicated. Yes, You are right. Read more at the top of the file
 * to get complete context of what and whys.
 */

export default App;
