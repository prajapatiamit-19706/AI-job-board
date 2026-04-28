import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

export const exportInterviewPDF = (interviewData, jobTitle, candidateName) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  let yPos = 25;
  const margin = 20;
  const pageWidth = 210;
  const pageHeight = 297;
  const maxWidth = pageWidth - margin * 2;
  
  const addBackgroundAndHeader = () => {
    // Dark background
    doc.setFillColor(9, 9, 11);
    doc.fillRect(0, 0, pageWidth, pageHeight);
    
    // Subtle header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(39, 39, 42);
    doc.text(`AI Job Board — ${jobTitle}`, margin, 15);
  };

  const checkPageBreak = (neededSpace) => {
    if (yPos + neededSpace > pageHeight - margin) {
      doc.addPage();
      addBackgroundAndHeader();
      yPos = 25;
    }
  };

  // COVER PAGE
  doc.setFillColor(9, 9, 11);
  doc.fillRect(0, 0, pageWidth, pageHeight);
  
  // Top accent bar
  doc.setFillColor(124, 58, 237);
  doc.fillRect(0, 0, pageWidth, 2);
  
  // Logo text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(124, 58, 237);
  doc.text("AI Job Board", margin, 15);
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(250, 250, 250);
  doc.text("INTERVIEW QUESTION SET", pageWidth / 2, 100, { align: 'center' });
  
  // Purple underline
  doc.setFillColor(124, 58, 237);
  doc.fillRect(85, 108, 40, 1);
  
  // Job title
  doc.setFontSize(16);
  doc.setTextColor(167, 139, 250);
  doc.text(jobTitle, pageWidth / 2, 125, { align: 'center' });
  
  // Candidate name
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(113, 113, 122);
  doc.text(`Prepared for: ${candidateName}`, pageWidth / 2, 145, { align: 'center' });
  
  // Divider line
  doc.setDrawColor(39, 39, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, 160, pageWidth - margin, 160);
  
  // Stats section
  const questions = interviewData.questions || [];
  const stats = {
    technical: questions.filter(q => q.category === 'technical').length,
    behavioral: questions.filter(q => q.category === 'behavioral').length,
    'gap-based': questions.filter(q => q.category === 'gap-based').length
  };
  
  // Box 1
  doc.setFillColor(24, 24, 27);
  doc.setDrawColor(39, 39, 42);
  doc.roundedRect(20, 175, 55, 40, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(167, 139, 250);
  doc.text(stats.technical.toString(), 20 + 55/2, 195, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122);
  doc.text("Technical", 20 + 55/2, 205, { align: 'center' });
  
  // Box 2
  doc.setFillColor(24, 24, 27);
  doc.roundedRect(80, 175, 55, 40, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(167, 139, 250);
  doc.text(stats.behavioral.toString(), 80 + 55/2, 195, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122);
  doc.text("Behavioral", 80 + 55/2, 205, { align: 'center' });
  
  // Box 3
  doc.setFillColor(24, 24, 27);
  doc.roundedRect(140, 175, 55, 40, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(167, 139, 250);
  doc.text(stats['gap-based'].toString(), 140 + 55/2, 195, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122);
  doc.text("Gap-based", 140 + 55/2, 205, { align: 'center' });
  
  // Generated date
  doc.setFontSize(9);
  doc.text(`Generated on ${format(new Date(interviewData.generatedAt), 'MMMM dd, yyyy')}`, pageWidth / 2, 240, { align: 'center' });
  
  // AI score badge
  if (interviewData.aiScore !== undefined) {
    doc.setFillColor(124, 58, 237);
    doc.roundedRect((pageWidth/2) - 30, 250, 60, 10, 5, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(250, 250, 250);
    doc.text(`AI Match Score: ${interviewData.aiScore}/100`, pageWidth / 2, 256.5, { align: 'center' });
  }
  
  // Footer cover
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(39, 39, 42);
  doc.text("Confidential — AI Job Board", pageWidth / 2, 285, { align: 'center' });

  // Pages 2+ Loop
  const categories = ['technical', 'behavioral', 'gap-based'];
  let questionIndex = 1;
  
  categories.forEach(cat => {
    const catQuestions = questions.filter(q => q.category === cat);
    if (catQuestions.length === 0) return;
    
    doc.addPage();
    yPos = 25;
    addBackgroundAndHeader();
    
    // Category header
    const catColors = {
      'technical': [124, 58, 237],
      'behavioral': [59, 130, 246],
      'gap-based': [245, 158, 11]
    };
    doc.setFillColor(...catColors[cat]);
    doc.fillRect(0, yPos, pageWidth, 12);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(250, 250, 250);
    doc.text(cat.toUpperCase(), 25, yPos + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`${catQuestions.length} Questions`, pageWidth - 25, yPos + 8, { align: 'right' });
    
    yPos += 20;
    
    catQuestions.forEach(q => {
      const wrappedQ = doc.splitTextToSize(q.question, maxWidth - 20);
      let qHeight = wrappedQ.length * 5;
      
      let purposeWrapped = [];
      let hintWrapped = [];
      if (q.purpose) {
        purposeWrapped = doc.splitTextToSize(`💡 ${q.purpose}`, maxWidth - 20);
        qHeight += purposeWrapped.length * 4 + 8;
      }
      if (q.hint) {
        hintWrapped = doc.splitTextToSize(`✓ ${q.hint}`, maxWidth - 20);
        qHeight += hintWrapped.length * 4 + 8;
      }
      
      const cardHeight = qHeight + 15;
      checkPageBreak(cardHeight + 5);
      
      // Card bg
      doc.setFillColor(24, 24, 27);
      doc.roundedRect(margin, yPos, maxWidth, cardHeight, 3, 3, 'F');
      
      // Left bar
      doc.setFillColor(...catColors[cat]);
      doc.fillRect(margin, yPos, 3, cardHeight);
      
      // Number circle
      doc.setFillColor(39, 39, 42);
      doc.circle(margin + 10, yPos + 8, 4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(167, 139, 250);
      doc.text(questionIndex.toString(), margin + 10, yPos + 10.5, { align: 'center' });
      
      // Difficulty badge
      const diffColors = {
        'easy': [74, 222, 128],
        'medium': [251, 191, 36],
        'hard': [248, 113, 113]
      };
      doc.setFillColor(...diffColors[q.difficulty]);
      doc.roundedRect(margin + maxWidth - 25, yPos + 5, 20, 6, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(18, 18, 27);
      doc.text(q.difficulty.toUpperCase(), margin + maxWidth - 15, yPos + 9, { align: 'center' });
      
      // Question Text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(250, 250, 250);
      doc.text(wrappedQ, margin + 18, yPos + 9);
      
      let currentCardY = yPos + wrappedQ.length * 5 + 9;
      
      if (q.purpose) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(124, 58, 237);
        doc.text("WHY ASK THIS", margin + 18, currentCardY);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(113, 113, 122);
        doc.text(purposeWrapped, margin + 18, currentCardY + 4);
        currentCardY += purposeWrapped.length * 4 + 6;
      }
      
      if (q.hint) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(74, 222, 128);
        doc.text("STRONG ANSWER", margin + 18, currentCardY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(113, 113, 122);
        doc.text(hintWrapped, margin + 18, currentCardY + 4);
      }
      
      yPos += cardHeight + 5;
      
      // Thin separator line
      doc.setDrawColor(39, 39, 42);
      doc.setLineWidth(0.3);
      doc.line(margin + 5, yPos, margin + maxWidth - 5, yPos);
      yPos += 5;
      
      questionIndex++;
    });
  });
  
  // Last page footer
  yPos = Math.max(yPos + 10, pageHeight - 40);
  checkPageBreak(30); // in case we just breached
  doc.setDrawColor(39, 39, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(39, 39, 42);
  doc.text("This document was generated by AI Job Board", pageWidth / 2, yPos + 10, { align: 'center' });
  doc.setFontSize(7);
  doc.text("Questions are AI-generated and tailored to this specific candidate", pageWidth / 2, yPos + 15, { align: 'center' });
  
  // Page numbers loop
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(39, 39, 42);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
  }

  doc.save(`interview-questions-${candidateName.replace(/\s+/g, '-')}-${jobTitle.replace(/\s+/g, '-')}.pdf`);
};
