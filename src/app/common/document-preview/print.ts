export const printCss = `
  .invoice-preview {
    font-family: "San Francisco", "Open Sans", Roboto, "Helvetica Neue", sans-serif;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
    -webkit-print-color-adjust: exact;
  }

  .invoice-preview > .preview-header {
    display: flex;
    flex-direction: column;
  }

  .invoice-preview > .preview-header > span {
    margin-left: auto;
    margin-right: auto;
  }

  .invoice-preview > .preview-header > .preview-header-patient {
    display: flex;
    flex-direction: row;
  }

  .invoice-preview > .address, .invoice-date {
    margin-left: auto;
    margin-right: auto;
  }

  .vseparator {
    border-bottom: solid 1px #888;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .invoice-preview > table {
    margin-bottom: 16px;
    margin-top: 16px;
    width: 100%;
    height: fit-content;
    border: solid 1px #555;
    border-spacing: 0;
    border-collapse: collapse;
  }

  .table-header, thead {
    background-color: #9E9E9E;
    -webkit-print-color-adjust: exact;
    font-weight: 500;
  }

  tr {
    border-top: solid 1px #555;
    border-bottom: solid 1px #555;
  }

  td {
    text-align: center;
  }

  .last-cell {
    border-left: solid 1px #555
  }

  .invoice-preview > .span {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
`;
