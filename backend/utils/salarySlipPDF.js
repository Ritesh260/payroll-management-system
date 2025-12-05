const PDFDocument = require("pdfkit");

const generateSalarySlipPDF = (slip, res) => {
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=salary-slip-${slip.month}-${slip.year}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("Salary Slip", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Employee Name: ${slip.employee.name}`);
    doc.text(`Employee Email: ${slip.employee.email}`);
    doc.text(`Month: ${slip.month}`);
    doc.text(`Year: ${slip.year}`);
    doc.moveDown();

    doc.text(`Basic Salary: ₹${slip.basic}`);
    doc.text(`HRA: ₹${slip.hra}`);
    doc.text(`Allowances: ₹${slip.allowances}`);
    doc.text(`Deductions: ₹${slip.deductions}`);
    doc.moveDown();

    doc.fontSize(14).text(`Net Salary: ₹${slip.netSalary}`, {
        underline: true,
    });

    doc.end();
};

module.exports = generateSalarySlipPDF;
