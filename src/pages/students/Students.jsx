import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { SearchBar, Pagination, EmptyState, LoadingState } from '../../components/common/CommonStates';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

export default function Students() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Deactivation confirmation modal state
  const [studentToDeactivate, setStudentToDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [studentList, classList] = await Promise.all([
          studentService.getStudents(),
          classService.getClasses(),
        ]);
        setStudents(studentList);
        setClasses(classList);
      } catch (err) {
        showToast('Failed loading students.', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Update search state if URL changes
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // Apply filters
  const filteredStudents = students.filter((student) => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = student.fullName?.toLowerCase().includes(q);
      const matchId = student.studentId?.toLowerCase().includes(q);
      const matchParent = student.parentName?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchParent) return false;
    }
    if (selectedClass && student.classSimple !== selectedClass && student.classId !== selectedClass) {
      return false;
    }
    if (selectedSection && student.section !== selectedSection) {
      return false;
    }
    if (selectedStatus && student.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeactivateConfirm = async () => {
    if (!studentToDeactivate) return;
    try {
      setDeactivating(true);
      await studentService.deactivateStudent(studentToDeactivate.id);
      setStudents((prev) =>
        prev.map((s) => (s.id === studentToDeactivate.id ? { ...s, status: 'Inactive' } : s))
      );
      showToast(`Student ${studentToDeactivate.fullName} was marked inactive.`, 'success');
      setStudentToDeactivate(null);
    } catch (err) {
      showToast(err.message || 'Failed to deactivate student', 'error');
    } finally {
      setDeactivating(false);
    }
  };

  // Distinct classes for dropdown
  const classOptions = Array.from(new Set(classes.map((c) => c.className)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-[#131b2e] tracking-tight">
            Students Directory
          </h1>
          <p className="text-xs text-[#434655] mt-1 font-medium">
            St. Jude International Academy • {students.length} Total Student Records
          </p>
        </div>

        <Button
          variant="primary"
          materialIcon="person_add"
          onClick={() => navigate('/students/new')}
        >
          Add New Student
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:flex-1">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search by student name, parent, or GR number..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white text-[#131b2e] rounded-lg border border-[#cbd5e1] text-xs font-semibold focus:outline-none focus:border-[#2563eb]"
          >
            <option value="">All Classes</option>
            {classOptions.map((cName) => (
              <option key={cName} value={cName}>
                {cName}
              </option>
            ))}
          </select>

          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white text-[#131b2e] rounded-lg border border-[#cbd5e1] text-xs font-semibold focus:outline-none focus:border-[#2563eb]"
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white text-[#131b2e] rounded-lg border border-[#cbd5e1] text-xs font-semibold focus:outline-none focus:border-[#2563eb]"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Student Directory Table */}
      {loading ? (
        <LoadingState message="Loading student roster..." />
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          title="No students found"
          description="Try adjusting your search criteria or enroll a new student."
          actionLabel="Enroll Student"
          onAction={() => navigate('/students/new')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#737686] uppercase tracking-wider font-semibold border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">GR / Roll</th>
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Guardian / Contact</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Fee Status</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-[#faf8ff] transition-colors group"
                  >
                    {/* Student Avatar + Name */}
                    <td
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="py-3 px-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.fullName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-[#cbd5e1]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#eaedff] text-[#004ac6] font-bold text-xs flex items-center justify-center">
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[#131b2e] group-hover:text-[#2563eb] transition-colors">
                            {student.fullName}
                          </div>
                          <div className="text-[11px] text-[#737686]">
                            {student.gender} • {student.bloodGroup || 'O+'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* GR Number */}
                    <td className="py-3 px-4 font-mono font-semibold text-[#131b2e]">
                      {student.studentId}
                    </td>

                    {/* Class */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#131b2e]">
                        {student.classSimple} - {student.section}
                      </div>
                      <div className="text-[10px] text-[#737686]">{student.academicYear || '2024–25'}</div>
                    </td>

                    {/* Guardian */}
                    <td className="py-3 px-4">
                      <div className="text-[#131b2e] font-medium">{student.parentName}</div>
                      <div className="text-[11px] text-[#737686]">{student.phone}</div>
                    </td>

                    {/* Attendance */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold tabular-nums text-[#131b2e]">
                          {student.attendanceRate}%
                        </span>
                        <div className="w-12 bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              student.attendanceRate >= 90 ? 'bg-[#059669]' : 'bg-[#dc2626]'
                            }`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Fee Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={student.feeStatus} />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={student.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="p-1.5 rounded hover:bg-[#eaedff] text-[#2563eb] transition-colors"
                          title="View Profile"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => navigate(`/students/edit/${student.id}`)}
                          className="p-1.5 rounded hover:bg-[#f1f5f9] text-[#434655] transition-colors"
                          title="Edit Student"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        {student.status === 'Active' && (
                          <button
                            onClick={() => setStudentToDeactivate(student)}
                            className="p-1.5 rounded hover:bg-[#ffdad6] text-[#dc2626] transition-colors"
                            title="Deactivate Student"
                          >
                            <span className="material-symbols-outlined text-[18px]">person_off</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStudents.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Confirmation Modal for Deactivation */}
      <ConfirmationModal
        isOpen={!!studentToDeactivate}
        onClose={() => setStudentToDeactivate(null)}
        onConfirm={handleDeactivateConfirm}
        isDanger={true}
        loading={deactivating}
        title="Deactivate Student"
        message={`Are you sure you want to deactivate ${studentToDeactivate?.fullName} (${studentToDeactivate?.studentId})? The student will no longer appear in active attendance rosters, but all financial and academic archives will be preserved.`}
        confirmLabel="Deactivate Student"
      />
    </div>
  );
}
