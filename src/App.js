import { useRef } from "react";
import "./App.css"
import { firstTableHeader, firstTableContent, secondTableHeader, secondTableData, user, deliveryTo, TERMS } from './DummyData';
import logo from "./image.png"
import kajukatli from "./kajukatli.jpg"

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function App() {

  function numberToWords(number) {
    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];

    const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    const convertChunk = (num) => {
      if (num === 0) return '';
      if (num < 20) return ones[num];
      if (num < 100) {
        const ten = Math.floor(num / 10);
        const remainder = num % 10;
        return tens[ten] + (remainder > 0 ? ' ' + ones[remainder] : '');
      }
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return ones[hundred] + ' Hundred' + (remainder > 0 ? ' ' + convertChunk(remainder) : '');
    };

    if (number === 0) return 'Zero';

    let result = '';
    let chunkCount = 0;

    while (number > 0) {
      const chunk = number % 1000;
      if (chunk > 0) {
        result = convertChunk(chunk) + (chunkCount > 0 ? ' ' + thousands[chunkCount] : '') + ' ' + result;
      }
      number = Math.floor(number / 1000);
      chunkCount++;
    }

    return result.trim();
  }

  const pdfRef = useRef()

  const downloadPDF = () => {
    const input = pdfRef.current
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4', true)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth , pdfHeight / imgHeight)
      const imgX = (pdfWidth -imgWidth * ratio) / 2
      const imgY = 30
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save('invoice.pdf')
    })
  }

  return (
    <div>

      <button 
      onClick={downloadPDF}
      className="btn btn-primary" style={{position: "absolute", right: "20px", top: "10px"}}
      >Download PDF</button>


      <div className="wrapper" ref={pdfRef}>
        <img src={logo} className="w-50" />


        <h6 className="mt-4 fw-bold">QUOTATION-ISH/RRN-3135</h6>
        <div className="line"></div>




        <div className="d-flex flex-row justify-content-between w-100 mt-4">
          <div class="position-relative w-25" style={{ left: "36px" }}>
            <div className="fw-bold">BILL TO,</div>
            <div>{user.NAME}</div>
            <div>{user.ADDRESS}</div>
          </div>

          <div className="fw-bold position-relative" style={{ right: "36px" }}>Date: {user.DATE}</div>
        </div>




        <table className="table table-bordered border-dark mt-4">
          <thead>
            <tr>
              {firstTableHeader.map((header) => {
                return (
                  <td>{header}</td>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {firstTableContent.map((data) => {
              return (
                <tr>
                  <td>{data.SNo}</td>
                  <td>{data.PARTICULARS}</td>
                  <td>{data.HSN}</td>
                  <td>{data.UOM}</td>
                  <td>{data.QTY}</td>
                  <td>{data.BASIC}</td>
                  <td>{data.GST}</td>
                  <td>{data.CGST}</td>
                  <td>{data.SGST}</td>
                  <td>{data.AMOUNT}</td>
                </tr>
              )
            })}
            <tr>
              <td colSpan={firstTableHeader.length} className="fw-bold">AMOUNT IN WORDS : &nbsp;
                {numberToWords(firstTableContent[firstTableContent.length - 1].AMOUNT).toLocaleUpperCase()}</td>
            </tr>
          </tbody>
        </table>


        <div className="mt-5 fw-bold">TABLE OF CONTENT</div>


        <div className="d-flex flex-row border border-dark">

          <div className="d-flex flex-column justify-content-center align-items-center px-5">
            <div>VAIDURYA-500</div>
            <img src={kajukatli} width={300} />
          </div>


          <table className="table table-bordered border-dark px-5">
            <thead>
              <tr>
                {secondTableHeader.map((header) => {
                  return (
                    <td>{header}</td>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {secondTableData.map((data, index) => {
                return (
                  <tr>
                    <td>{data.SNo}</td>
                    <td>{data.PRODUCTS}</td>
                    <td>{data.QTY}</td>
                    <td>{data.GRM}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

        </div>



        <div className="d-flex flex-row justify-content-between w-100 mt-5">
          <div class="position-relative w-50" style={{ left: "36px" }}>
            <div className="fw-bold">DELIVERY TO,</div>
            <div>{deliveryTo.NAME}</div>
            <div>STORE : &nbsp; {deliveryTo.STORE}</div>
            <div>PRIMARY_CONTACT : &nbsp; {deliveryTo.PRIMARY_CONTACT}</div>
            <div>SECONDARY_CONTACT : &nbsp; {deliveryTo.SECONDARY_CONTACT}</div>
          </div>

          <div className="position-relative" style={{ right: "36px" }}>
            <div><span class="fw-bold">DELIVERY_DATE : </span> {deliveryTo.DELIVERY_DATE}</div>
            <div><span class="fw-bold">DELIVERY_TIME : </span> {deliveryTo.DELIVERY_TIME}</div>

          </div>
        </div>




        <div className="d-flex flex-column align-items-start">
          <h4 className="mt-5 fw-bold ">TERMS :</h4>
          {TERMS.map((term) => {
            return (
              <span>{term}</span>
            )
          })}
        </div>


        <h3 className="marginn fw-bold">THANK YOU FOR ENQUIRY </h3>
        <h3 className="mt-3">--------THIS IS SYSTEM-GENERATED QUOTATION--------</h3>







      </div>

    </div>
  )
}


export default App