import api from './api';
import { initialPayments } from './mockData';
import { studentService } from './studentService';

const STORAGE_KEY = 'schoolerp_payments';

function getStoredPayments() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPayments));
    return initialPayments;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialPayments;
  }
}

function savePayments(payments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
}

export const paymentService = {
  async getPayments(params = {}) {
    try {
      const res = await api.get('/payments', { params });
      return res.data;
    } catch {
      let list = getStoredPayments();
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.receiptNumber?.toLowerCase().includes(q) ||
            p.studentName?.toLowerCase().includes(q) ||
            p.transactionRef?.toLowerCase().includes(q)
        );
      }
      if (params.paymentMode) {
        list = list.filter((p) => p.paymentMode === params.paymentMode);
      }
      if (params.studentId) {
        list = list.filter((p) => p.studentId === params.studentId);
      }
      if (params.date) {
        list = list.filter((p) => p.paymentDate === params.date);
      }
      return list;
    }
  },

  async recordPayment(paymentData) {
    try {
      const res = await api.post('/payments', paymentData);
      return res.data;
    } catch {
      const amount = Number(paymentData.amountPaid);
      if (!amount || amount <= 0) {
        throw new Error('Please enter a valid positive payment amount.');
      }

      // Fetch student to validate business rules
      const student = await studentService.getStudentById(paymentData.studentId);
      if (!student) {
        throw new Error('Student record not found.');
      }

      // Business Rule: Amount cannot exceed pending fee
      if (amount > student.pendingFee) {
        throw new Error(
          `Payment amount (${amount}) cannot exceed the pending balance (${student.pendingFee}).`
        );
      }

      const receiptNumber =
        paymentData.receiptNumber || `REC-2024-${Math.floor(1000 + Math.random() * 9000)}`;

      const newPayment = {
        id: 'pay-' + Date.now(),
        receiptNumber,
        studentId: student.id,
        studentName: student.fullName,
        className: student.className,
        amountPaid: amount,
        paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
        paymentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        paymentMode: paymentData.paymentMode || 'Cash',
        transactionRef: paymentData.transactionRef || 'N/A',
        remarks: paymentData.remarks || 'Tuition fee installment',
        status: 'Completed',
      };

      // Save payment
      const list = getStoredPayments();
      const updatedPayments = [newPayment, ...list];
      savePayments(updatedPayments);

      // Update student fee calculations
      const newPaid = student.paidFee + amount;
      const newPending = Math.max(0, student.totalFee - newPaid);
      let feeStatus = 'Partial';
      if (newPending === 0) feeStatus = 'Paid in Full';
      else if (student.overdueDays > 0) feeStatus = 'Overdue';

      await studentService.updateStudent(student.id, {
        paidFee: newPaid,
        pendingFee: newPending,
        feeStatus,
      });

      return newPayment;
    }
  }
};
