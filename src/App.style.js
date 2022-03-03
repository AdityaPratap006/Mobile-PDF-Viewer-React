import styled from "styled-components";

export function getCustomIdname(props) {
  return props.uniqueContainerId ? `-${props.uniqueContainerId}` : "-";
}

export const isDesktop = () => `(min-width: 640px)`;

export const isMobile = () => `(min-width: 300px)`;

export const PDFViewCustomContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  header {
    background-color: rgba(244, 244, 244, 1);
  }

  #title${getCustomIdname} {
    display: none;
  }
  header h1 {
    border-bottom: 1px solid rgba(216, 216, 216, 1);
    color: rgba(133, 133, 133, 1);
    font-size: 23px;
    font-style: italic;
    font-weight: normal;
    overflow: hidden;
    padding: 10px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  body {
    /* background: url(/images/document_bg.png);
   color: rgba(255, 255, 255, 1);
   font-family: sans-serif;
   font-size: 10px;
   height: 100%;
   width: 100%;
   overflow: hidden;
   padding-bottom: 5rem; */
  }

  section {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 2rem;
  }

  footer {
    background-image: url(/images/toolbar_background.png);
    height: 4rem;
    width: 80%;
    position: absolute;
    bottom: 5rem;
    left: 50%;
    transform: translateX(-50%);
    right: 0;
    z-index: 1;
    box-shadow: 0 -0.2rem 0.5rem rgba(50, 50, 50, 0.75);
  }

  .toolbarButton {
    display: block;
    padding: 0;
    margin: 0;
    border-width: 0;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: rgba(0, 0, 0, 0);
  }

  .toolbarButton.pageUp {
    position: absolute;
    width: 18%;
    height: 100%;
    left: 0;
    background-image: url(/images/icon_previous_page.png);
    // background-size: 2rem;
  }

  .toolbarButton.pageDown {
    position: absolute;
    width: 18%;
    height: 100%;
    left: 18%;
    background-image: url(/images/icon_next_page.png);
    // background-size: 2rem;
  }

  #pageNumber${getCustomIdname} {
    -moz-appearance: textfield; /* hides the spinner in moz */
    position: absolute;
    width: 28%;
    height: 100%;
    left: 36%;
    text-align: center;
    border: 0;
    background-color: rgba(0, 0, 0, 0);
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 1);
    /* background-image: url(/images/div_line_left.png),
      url(/images/div_line_right.png);
    background-repeat: no-repeat;
    background-position: left, right;
    background-size: 0.2rem, 0.2rem; */
  }

  .toolbarButton.zoomOut {
    position: absolute;
    width: 18%;
    height: 100%;
    left: 64%;
    background-image: url(/images/icon_zoom_out.png);
    // background-size: 2.4rem;
  }

  .toolbarButton.zoomIn {
    position: absolute;
    width: 18%;
    height: 100%;
    left: 82%;
    background-image: url(/images/icon_zoom_in.png);
    // background-size: 2.4rem;
  }

  .toolbarButton[disabled] {
    opacity: 0.3;
  }

  .hidden {
    display: none;
  }
  [hidden] {
    display: none !important;
  }

  #viewerContainer${getCustomIdname} {
    position: absolute;
    overflow: auto;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: gray;
  }

  canvas {
    margin: 2rem auto;
    display: block;
    /* width: 100% !important; */
  }

  .pdfViewer {
    .page {
      margin: 10px auto;
      /* width: 100% !important; */

      .canvasWrapper {
        /* width: 100% !important; */
      }

      .loadingIcon {
        width: 2.9rem;
        height: 2.9rem;
        background: url("/images/spinner.png") no-repeat left top / 38rem;
        border: medium none;
        animation: 1s steps(10, end) 0s normal none infinite moveDefault;
        display: block;
        position: absolute;
        top: calc((100% - 2.9rem) / 2);
        left: calc((100% - 2.9rem) / 2);
        display: none;
      }
    }
  }

  @keyframes moveDefault {
    from {
      background-position: 0 top;
    }

    to {
      background-position: -39rem top;
    }
  }

  #loadingBar${getCustomIdname} {
    position: relative;
    height: 0.6rem;
    background-color: rgba(51, 51, 51, 1);
    border-bottom: 1px solid rgba(51, 51, 51, 1);
    margin-top: 5rem;
  }

  #loadingBar${getCustomIdname} .progress {
    position: absolute;
    left: 0;
    width: 0;
    height: 100%;
    background-color: rgba(221, 221, 221, 1);
    overflow: hidden;
    transition: width 200ms;
  }

  @keyframes progressIndeterminate {
    0% {
      left: 0;
    }
    50% {
      left: 100%;
    }
    100% {
      left: 100%;
    }
  }

  #loadingBar${getCustomIdname} .progress.indeterminate {
    background-color: rgba(153, 153, 153, 1);
    transition: none;
  }

  #loadingBar${getCustomIdname} .indeterminate .glimmer {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 5rem;
    background-image: linear-gradient(
      to right,
      rgba(153, 153, 153, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(153, 153, 153, 1) 100%
    );
    background-size: 100% 100%;
    background-repeat: no-repeat;
    animation: progressIndeterminate 2s linear infinite;
  }

  #errorWrapper${getCustomIdname} {
    background: none repeat scroll 0 0 rgba(255, 85, 85, 1);
    color: rgba(255, 255, 255, 1);
    left: 0;
    position: absolute;
    right: 0;
    top: 3.2rem;
    z-index: 1000;
    padding: 0.3rem;
    font-size: 0.8em;
  }

  #errorMessageLeft${getCustomIdname} {
    float: left;
  }

  #errorMessageRight${getCustomIdname} {
    float: right;
  }

  #errorMoreInfo${getCustomIdname} {
    background-color: rgba(255, 255, 255, 1);
    color: rgba(0, 0, 0, 1);
    padding: 0.3rem;
    margin: 0.3rem;
    width: 98%;
  }
  ${(props) => props.styles || ""}
`;
