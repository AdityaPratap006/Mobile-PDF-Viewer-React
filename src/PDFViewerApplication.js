import { getCustomIdname } from "./App.style";

const USE_ONLY_CSS_ZOOM = true;
const TEXT_LAYER_MODE = 0; // DISABLE
const MAX_IMAGE_SIZE = 1024 * 1024;
const CMAP_URL = "../node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;

const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.25;
const MAX_SCALE = 10.0;
const DEFAULT_SCALE_VALUE = "page-height";

export const PDFViewerApplicationFactory = ({
  pdfjsLib,
  pdfjsViewer,
  uniqueContainerId,
  onLoaded,
}) => {
  const PDFViewerApplication = {
    pdfLoadingTask: null,
    pdfDocument: null,
    pdfViewer: null,
    pdfHistory: null,
    pdfLinkService: null,
    eventBus: null,

    /**
     * Opens PDF document specified by URL.
     * @returns {Promise} - Returns the promise, which is resolved when document
     *                      is opened.
     */
    open: function (params) {
      if (this.pdfLoadingTask) {
        // We need to destroy already opened document
        return this.close().then(
          function () {
            // ... and repeat the open() call.
            return this.open(params);
          }.bind(this)
        );
      }

      const url = params.url;
      const self = this;
      this.setTitleUsingUrl(url);

      // Loading document.
      const loadingTask = pdfjsLib.getDocument({
        url: url,
        maxImageSize: MAX_IMAGE_SIZE,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
      });
      this.pdfLoadingTask = loadingTask;

      loadingTask.onProgress = function (progressData) {
        self.progress(progressData.loaded / progressData.total);
      };

      return loadingTask.promise.then(
        function (pdfDocument) {
          // if(pdfDocument) {

          // }
          // Document loaded, specifying document for the viewer.
          self.pdfDocument = pdfDocument;
          self.pdfViewer.setDocument(pdfDocument);
          self.pdfLinkService.setDocument(pdfDocument);
          self.pdfHistory.initialize({
            fingerprint: pdfDocument.fingerprint,
          });

          self.loadingBar.hide();

          onLoaded();

          self.setTitleUsingMetadata(pdfDocument);
        },
        function (exception) {
          const message = exception && exception.message;

          // const l10n = self.l10n;
          // let loadingErrorMessage;

          // if (exception instanceof pdfjsLib.InvalidPDFException) {
          //  // change error message also for other builds
          //  loadingErrorMessage = l10n.get(
          //    'invalid_file_error',
          //    null,
          //    'Invalid or corrupted PDF file.',
          //  );
          // } else if (exception instanceof pdfjsLib.MissingPDFException) {
          //  // special message for missing PDFs
          //  loadingErrorMessage = l10n.get(
          //    'missing_file_error',
          //    null,
          //    'Missing PDF file.',
          //  );
          // } else if (exception instanceof pdfjsLib.UnexpectedResponseException) {
          //  loadingErrorMessage = l10n.get(
          //    'unexpected_response_error',
          //    null,
          //    'Unexpected server response.',
          //  );
          // } else {
          //  loadingErrorMessage = l10n.get(
          //    'loading_error',
          //    null,
          //    'An error occurred while loading the PDF.',
          //  );
          // }

          // loadingErrorMessage.then(function (msg) {
          //  self.error(msg, { message: message });
          // });
          self.loadingBar.hide();
        }
      );
    },

    /**
     * Closes opened PDF document.
     * @returns {Promise} - Returns the promise, which is resolved when all
     *                      destruction is completed.
     */
    close: function () {
      const errorWrapper = document.getElementById(
        `errorWrapper-${uniqueContainerId}`
      );
      errorWrapper.setAttribute("hidden", "true");

      if (!this.pdfLoadingTask) {
        return Promise.resolve();
      }

      const promise = this.pdfLoadingTask.destroy();
      this.pdfLoadingTask = null;

      if (this.pdfDocument) {
        this.pdfDocument = null;

        this.pdfViewer.setDocument(null);
        this.pdfLinkService.setDocument(null, null);

        if (this.pdfHistory) {
          this.pdfHistory.reset();
        }
      }

      return promise;
    },

    get loadingBar() {
      const bar = new pdfjsViewer.ProgressBar(
        `#loadingBar${getCustomIdname({
          uniqueContainerId,
        })}`,
        {}
      );

      return pdfjsLib.shadow(this, "loadingBar", bar);
    },

    setTitleUsingUrl: function pdfViewSetTitleUsingUrl(url) {
      this.url = url;
      const title = pdfjsLib.getFilenameFromUrl(url) || url;
      try {
        title = decodeURIComponent(title);
      } catch (e) {
        // decodeURIComponent may throw URIError,
        // fall back to using the unprocessed url in that case
      }
      this.setTitle(title);
    },

    setTitleUsingMetadata: function (pdfDocument) {
      const self = this;
      pdfDocument.getMetadata().then(function (data) {
        const info = data.info,
          metadata = data.metadata;
        self.documentInfo = info;
        self.metadata = metadata;

        // Provides some basic debug information
        console.log(
          "PDF " +
            pdfDocument.fingerprint +
            " [" +
            info.PDFFormatVersion +
            " " +
            (info.Producer || "-").trim() +
            " / " +
            (info.Creator || "-").trim() +
            "]" +
            " (PDF.js: " +
            (pdfjsLib.version || "-") +
            ")"
        );

        let pdfTitle;
        if (metadata && metadata.has("dc:title")) {
          const title = metadata.get("dc:title");
          // Ghostscript sometimes returns 'Untitled', so prevent setting the
          // title to 'Untitled.
          if (title !== "Untitled") {
            pdfTitle = title;
          }
        }

        if (!pdfTitle && info && info.Title) {
          pdfTitle = info.Title;
        }

        if (pdfTitle) {
          self.setTitle(pdfTitle + " - " + document.title);
        }
      });
    },

    setTitle: function pdfViewSetTitle(title) {
      document.title = title;
      document.getElementById(`title-${uniqueContainerId}`).textContent = title;
    },

    error: function pdfViewError(message, moreInfo) {
      const l10n = this.l10n;
      const moreInfoText = [
        l10n.get(
          "error_version_info",
          { version: pdfjsLib.version || "?", build: pdfjsLib.build || "?" },
          "PDF.js v{{version}} (build: {{build}})"
        ),
      ];

      if (moreInfo) {
        moreInfoText.push(
          l10n.get(
            "error_message",
            { message: moreInfo.message },
            "Message: {{message}}"
          )
        );
        if (moreInfo.stack) {
          moreInfoText.push(
            l10n.get(
              "error_stack",
              { stack: moreInfo.stack },
              "Stack: {{stack}}"
            )
          );
        } else {
          if (moreInfo.filename) {
            moreInfoText.push(
              l10n.get(
                "error_file",
                { file: moreInfo.filename },
                "File: {{file}}"
              )
            );
          }
          if (moreInfo.lineNumber) {
            moreInfoText.push(
              l10n.get(
                "error_line",
                { line: moreInfo.lineNumber },
                "Line: {{line}}"
              )
            );
          }
        }
      }

      const errorWrapper = document.getElementById(
        `errorWrapper-${uniqueContainerId}`
      );
      errorWrapper.removeAttribute("hidden");

      const errorMessage = document.getElementById(
        `errorMessage-${uniqueContainerId}`
      );
      errorMessage.textContent = message;

      const closeButton = document.getElementById(
        `errorClose-${uniqueContainerId}`
      );
      closeButton.onclick = function () {
        errorWrapper.setAttribute("hidden", "true");
      };

      const errorMoreInfo = document.getElementById(
        `errorMoreInfo-${uniqueContainerId}`
      );
      const moreInfoButton = document.getElementById(
        `errorShowMore-${uniqueContainerId}`
      );
      const lessInfoButton = document.getElementById(
        `errorShowLess-${uniqueContainerId}`
      );
      moreInfoButton.onclick = function () {
        errorMoreInfo.removeAttribute("hidden");
        moreInfoButton.setAttribute("hidden", "true");
        lessInfoButton.removeAttribute("hidden");
        errorMoreInfo.style.height = errorMoreInfo.scrollHeight + "px";
      };
      lessInfoButton.onclick = function () {
        errorMoreInfo.setAttribute("hidden", "true");
        moreInfoButton.removeAttribute("hidden");
        lessInfoButton.setAttribute("hidden", "true");
      };
      moreInfoButton.removeAttribute("hidden");
      lessInfoButton.setAttribute("hidden", "true");
      Promise.all(moreInfoText).then(function (parts) {
        errorMoreInfo.value = parts.join("\n");
      });
    },

    progress: function pdfViewProgress(level) {
      const percent = Math.round(level * 100);
      // Updating the bar if value increases.
      if (percent > this.loadingBar.percent || isNaN(percent)) {
        this.loadingBar.percent = percent;
      }
    },

    get pagesCount() {
      return this.pdfDocument.numPages;
    },

    get page() {
      return this.pdfViewer.currentPageNumber;
    },

    set page(val) {
      this.pdfViewer.currentPageNumber = val;
    },

    zoomIn: function pdfViewZoomIn(ticks) {
      let newScale = this.pdfViewer.currentScale;
      do {
        newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
        newScale = Math.ceil(newScale * 10) / 10;
        newScale = Math.min(MAX_SCALE, newScale);
      } while (--ticks && newScale < MAX_SCALE);
      this.pdfViewer.currentScaleValue = newScale;
    },

    zoomOut: function pdfViewZoomOut(ticks) {
      let newScale = this.pdfViewer.currentScale;
      do {
        newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
        newScale = Math.floor(newScale * 10) / 10;
        newScale = Math.max(MIN_SCALE, newScale);
      } while (--ticks && newScale > MIN_SCALE);
      this.pdfViewer.currentScaleValue = newScale;
    },

    initUI: function pdfViewInitUI() {
      const eventBus = new pdfjsViewer.EventBus();
      this.eventBus = eventBus;

      const linkService = new pdfjsViewer.PDFLinkService({
        eventBus: eventBus,
      });
      this.pdfLinkService = linkService;

      this.l10n = pdfjsViewer.NullL10n;

      const container = document.getElementById(
        `viewerContainer-${uniqueContainerId}`
      );
      const pdfViewer = new pdfjsViewer.PDFViewer({
        container: container,
        eventBus: eventBus,
        linkService: linkService,
        l10n: this.l10n,
        useOnlyCssZoom: USE_ONLY_CSS_ZOOM,
        textLayerMode: TEXT_LAYER_MODE,
      });
      this.pdfViewer = pdfViewer;

      linkService.setViewer(pdfViewer);

      this.pdfHistory = new pdfjsViewer.PDFHistory({
        eventBus: eventBus,
        linkService: linkService,
      });
      linkService.setHistory(this.pdfHistory);

      document
        .getElementById(`previous-${uniqueContainerId}`)
        .addEventListener("click", function () {
          PDFViewerApplication.page--;
        });

      document
        .getElementById(`next-${uniqueContainerId}`)
        .addEventListener("click", function () {
          PDFViewerApplication.page++;
        });

      document
        .getElementById(`zoomIn-${uniqueContainerId}`)
        .addEventListener("click", function () {
          PDFViewerApplication.zoomIn();
        });

      document
        .getElementById(`zoomOut-${uniqueContainerId}`)
        .addEventListener("click", function () {
          PDFViewerApplication.zoomOut();
        });

      document
        .getElementById(`pageNumber-${uniqueContainerId}`)
        .addEventListener("click", function () {
          this.select();
        });

      document
        .getElementById(`pageNumber-${uniqueContainerId}`)
        .addEventListener("change", function () {
          PDFViewerApplication.page = this.value | 0;

          // Ensure that the page number input displays the correct value,
          // even if the value entered by the user was invalid
          // (e.g. a floating point number).
          if (this.value !== PDFViewerApplication.page.toString()) {
            this.value = PDFViewerApplication.page;
          }
        });

      eventBus.on("pagesinit", function () {
        // We can use pdfViewer now, e.g. let's change default scale.
        pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE;
      });

      eventBus.on(
        "pagechanging",
        function (evt) {
          const page = evt.pageNumber;
          const numPages = PDFViewerApplication.pagesCount;

          document.getElementById(`pageNumber-${uniqueContainerId}`).value =
            page;
          document.getElementById(`previous-${uniqueContainerId}`).disabled =
            page <= 1;
          document.getElementById(`next-${uniqueContainerId}`).disabled =
            page >= numPages;
        },
        true
      );
    },
  };

  return PDFViewerApplication;
};
