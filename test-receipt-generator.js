// Test script to generate a sample receipt PDF
const { generatePDF } = require('./src/lib/receipt-pdf.ts');

// Sample receipt data for testing
const sampleReceipt = {
  _id: "67062b9939dad6427b2b99430",
  amount: 2500,
  name: "Salman Faizy",
  phone: "+918129489071",
  type: "General",
  district: "Malappuram",
  panchayat: "Kavanur",
  razorpayPaymentId: "pay_RGHp0QRAsREgZL",
  razorpayOrderId: "order_RGHp0QRAsREgZL",
  instituteId: "AIC_INST_001",
  createdAt: new Date().toISOString()
};

// Generate the PDF
async function testReceiptGeneration() {
  try {
    console.log('Generating sample receipt PDF...');
    console.log('Sample data:', JSON.stringify(sampleReceipt, null, 2));
    
    await generatePDF(sampleReceipt);
    console.log('✅ Sample receipt PDF generated successfully!');
    console.log(`📄 File saved as: receipt_${sampleReceipt._id}.pdf`);
  } catch (error) {
    console.error('❌ Error generating sample receipt:', error);
  }
}

// Run the test
testReceiptGeneration();