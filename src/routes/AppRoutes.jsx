import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import Students from '../pages/students/Students';
import AddStudent from '../pages/students/AddStudent';
import EditStudent from '../pages/students/EditStudent';
import StudentDetails from '../pages/students/StudentDetails';
import Parents from '../pages/parents/Parents';
import Classes from '../pages/classes/Classes';
import Attendance from '../pages/attendance/Attendance';
import AttendanceHistory from '../pages/attendance/AttendanceHistory';
import FeeStructure from '../pages/fees/FeeStructure';
import FeeCollection from '../pages/fees/FeeCollection';
import PendingFees from '../pages/fees/PendingFees';
import PaymentHistory from '../pages/payments/PaymentHistory';
import Reports from '../pages/reports/Reports';
import Settings from '../pages/settings/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes inside AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Student Management */}
          <Route path="/students" element={<Students />} />
          <Route path="/students/new" element={<AddStudent />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/students/edit/:id" element={<EditStudent />} />

          {/* Parents Management */}
          <Route path="/parents" element={<Parents />} />

          {/* Academic Classes */}
          <Route path="/classes" element={<Classes />} />

          {/* Daily Attendance */}
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance/history" element={<AttendanceHistory />} />

          {/* Fees & Collections */}
          <Route path="/fees" element={<FeeStructure />} />
          <Route path="/fees/collection" element={<FeeCollection />} />
          <Route path="/fees/pending" element={<PendingFees />} />

          {/* Payment Receipts */}
          <Route path="/payments" element={<PaymentHistory />} />

          {/* Institutional Reports */}
          <Route path="/reports" element={<Reports />} />

          {/* School Settings */}
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
