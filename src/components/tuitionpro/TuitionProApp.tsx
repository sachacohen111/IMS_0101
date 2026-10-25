import React, { useState } from 'react';
import { useIMS } from '../../context/IMSContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  CheckSquare,
  Calendar,
  FileCheck,
  BarChart3,
  TrendingUp,
  BookOpen,
  FolderTree,
  MessageCircle,
  DollarSign,
  ShieldCheck,
  HeartHandshake,
  Download,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Moon,
  Sun,
  AlertTriangle,
  Receipt,
  BellRing,
  Send,
  X,
  Clock,
  Wifi,
  BatteryCharging,
  Signal,
  MoreHorizontal,
  Sparkles,
  Check,
  Copy,
  Terminal,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const TuitionProApp: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    isDarkMode,
    toggleDarkMode,
    viewportMode,
    setViewportMode,
    toastMessage,
    showToast,
    institute,
    students,
    courses,
    batches,
    teachers,
    inquiries,
    timetable,
    tests,
    testResults,
    feePayments,
    studyMaterials,
    ptmMeetings,
    financeTransactions,
    substitutes,
    auditLogs,
    attendanceRecords,
    notices,
    getStudentPaidAmount,
    getStudentBalance,
    markBatchAttendance,
    importBiometricAttendance,
    createTest,
    saveTestMarks,
    togglePublishTest,
    cancelTest,
    collectFee,
    sendFeeReminders,
    enrollStudent,
    updateStudentStatus,
    addInquiry,
    updateInquiryStatus,
    updateInquiryFollowUp,
    addStudyMaterial,
    deleteStudyMaterial,
    schedulePTM,
    cancelPTM,
    addFinanceTransaction,
    assignSubstitute,
    addCourse,
    toggleCourseStatus,
    addBatch,
    addTimetableSlot
  } = useIMS();

  const [activeTab, setActiveTab] = useState<string>('dash');
  const [searchQuery, setSearchQuery] = useState('');
  const [profileModalStudent, setProfileModalStudent] = useState<any | null>(null);
  const [receiptModalStudent, setReceiptModalStudent] = useState<string | null>(null);
  const [exportModalContent, setExportModalContent] = useState<string | null>(null);

  // Mobile App & APK Modal States
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [activeApkTab, setActiveApkTab] = useState<'apk' | 'pwa' | 'github' | 'studio'>('pwa');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Attendance controls
  const [attendanceBatch, setAttendanceBatch] = useState('10-A');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceInputs, setAttendanceInputs] = useState<Record<string, 'P' | 'A' | 'L'>>({});
  const [biometricText, setBiometricText] = useState('');

  // Marks controls
  const [selectedExamIndex, setSelectedExamIndex] = useState(0);
  const [marksInputs, setMarksInputs] = useState<Record<string, number>>({});

  // Progress student selector
  const [progressStudent, setProgressStudent] = useState('Aarav');
  const [progressFilter, setProgressFilter] = useState<'All' | 'Last 4'>('All');

  // Parent portal child
  const [parentChild, setParentChild] = useState('Aarav');

  // Finance filter
  const [financeFrom, setFinanceFrom] = useState('');
  const [financeTo, setFinanceTo] = useState('');

  // Substitute finder modal
  const [substituteModalData, setSubstituteModalData] = useState<{ teacher: string; day: string; time: string; affected: any[] } | null>(null);

  // Forms
  const [newStudentForm, setNewStudentForm] = useState({ name: '', gradeLevel: '10', batchName: '10-A', parentName: '', phone: '', totalFee: 24000 });
  const [newInquiryForm, setNewInquiryForm] = useState({ name: '', phone: '', course: 'Class 10 Boards', source: 'Walk-in' as any, assignedTo: 'Admin', followUpDate: new Date().toISOString().split('T')[0] });
  const [newFeeForm, setNewFeeForm] = useState({ studentName: 'Aarav', amount: 12000, mode: 'UPI' as any, ref: '' });
  const [newSlotForm, setNewSlotForm] = useState({ dayName: 'Mon', dayOfWeek: 1, startTime: '16:00', endTime: '17:30', batchId: 'batch-10a', subjectName: 'Maths', teacherName: 'Mehta', classroom: 'R1' });
  const [newExamForm, setNewExamForm] = useState({ title: '', batchId: 'batch-10a', subjectId: 'sub-maths', subjectName: 'Maths', maxMarks: 50, passingMarks: 17, testDate: new Date().toISOString().split('T')[0], testTime: '10:00' });
  const [newMaterialForm, setNewMaterialForm] = useState({ type: 'Notes' as any, title: '', subject: 'Maths', batch: '10-A', url: '' });
  const [newPTMForm, setNewPTMForm] = useState({ date: new Date().toISOString().split('T')[0], time: '17:30', location: 'Hall A', batch: '10-A' });
  const [newFinanceForm, setNewFinanceForm] = useState({ type: 'Debit' as any, category: 'Rent' as any, amount: 30000, date: new Date().toISOString().split('T')[0], description: '', mode: 'Bank' as any });
  const [newCourseName, setNewCourseName] = useState('');
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchCourse, setNewBatchCourse] = useState('Class 10 Boards');
  const [newBatchTeacher, setNewBatchTeacher] = useState('Mehta');

  // Helper INR formatter
  const inr = (n: number) => Number(n).toLocaleString('en-IN');
  const gradeLetter = (p: number) => p >= 90 ? 'A+' : p >= 75 ? 'A' : p >= 60 ? 'B' : p >= 45 ? 'C' : p >= 33 ? 'D' : 'F';

  // Test APK Package Generator & Downloader
  const handleDownloadTestApk = () => {
    // 1. Direct static download from pre-compiled APK in public/
    try {
      const a = document.createElement('a');
      a.href = '/ims-mobile-v1.0-test.apk';
      a.download = 'ims-mobile-v1.0-test.apk';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 1500);
      showToast('Starting download for ims-mobile-v1.0-test.apk');
    } catch {
      window.open('/ims-mobile-v1.0-test.apk', '_blank');
    }
  };

  // Navigation Items according to TuitionPro
  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stu', label: 'Students', icon: Users },
    { id: 'inq', label: 'Inquiries', icon: UserPlus },
    { id: 'fee', label: 'Fees', icon: CreditCard },
    { id: 'att', label: 'Attendance', icon: CheckSquare },
    { id: 'tb', label: 'Timetable', icon: Calendar },
    { id: 'ex', label: 'Exams', icon: FileCheck },
    { id: 'mk', label: 'Marks & Results', icon: BarChart3 },
    { id: 'pf', label: 'Progress', icon: TrendingUp },
    { id: 'mat', label: 'Study Material', icon: BookOpen },
    { id: 'crs', label: 'Courses & Batches', icon: FolderTree },
    { id: 'ptm', label: 'PTM Meetings', icon: MessageCircle },
    { id: 'fin', label: 'Finance & Accounts', icon: DollarSign },
    { id: 'usr', label: 'Users & Audit', icon: ShieldCheck },
    { id: 'por', label: 'Parent Portal', icon: HeartHandshake }
  ];

  // Role access control
  const accessibleTabs = role === 'ADMIN' || role === 'SUPER_ADMIN'
    ? navItems.map(n => n.id)
    : role === 'TEACHER'
    ? ['att', 'tb', 'ex', 'mk', 'pf', 'mat']
    : ['por'];

  const filteredNavItems = navItems.filter(n => accessibleTabs.includes(n.id));

  // Compute at-risk students
  const riskStudents = students.filter(s => s.status === 'Active').flatMap(s => {
    const reasons: string[] = [];
    const studentTests = testResults.filter(r => r.studentName === s.name);
    if (studentTests.length > 1) {
      const last = studentTests[studentTests.length - 1];
      const prev = studentTests[studentTests.length - 2];
      const testLast = tests.find(t => t.id === last.testId);
      const testPrev = tests.find(t => t.id === prev.testId);
      const pLast = testLast ? Math.round((last.marksObtained / testLast.maxMarks) * 100) : 0;
      const pPrev = testPrev ? Math.round((prev.marksObtained / testPrev.maxMarks) * 100) : 0;
      if (pLast < 40 && pPrev < 40) reasons.push('Below 40% twice');
      else if (pPrev - pLast >= 10) reasons.push(`Dropped ${pPrev - pLast} points`);
    }
    const studentAtt = attendanceRecords.filter(a => a.studentName === s.name);
    const presentAtt = studentAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attPct = studentAtt.length > 0 ? Math.round((presentAtt / studentAtt.length) * 100) : 100;
    if (attPct < 75) reasons.push(`Attendance ${attPct}%`);

    return reasons.length ? [{ name: `${s.name} (${s.batchName})`, reasons: reasons.join('; ') }] : [];
  });

  const totalFeesPending = students.reduce((acc, s) => acc + getStudentBalance(s.name), 0);
  const pendingFollowups = inquiries.filter(i => i.status !== 'Admitted' && i.status !== 'Lost').length;
  const currentExam = tests[selectedExamIndex] || tests[0];

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Top Device Viewport Switcher & Quick Controls Bar */}
      <div className="w-full bg-slate-900 text-white px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs z-30">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            IMS
          </span>
          <span className="text-slate-400 hidden sm:inline">| Institute Management System</span>
        </div>

        {/* Viewport Screen Size Switcher (Mobile App 390px vs Tablet 768px vs Desktop 100%) */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => setViewportMode('mobile')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewportMode === 'mobile' ? 'bg-[#0f766e] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
            title="Switch to Mobile App screen size (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App</span>
          </button>
          <button
            type="button"
            onClick={() => setViewportMode('tablet')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewportMode === 'tablet' ? 'bg-[#0f766e] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
            title="Switch to Tablet App screen size (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewportMode('desktop')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewportMode === 'desktop' ? 'bg-[#0f766e] text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
            title="Switch to Full Width Desktop view"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Screen</span>
          </button>
        </div>

        {/* Role & Theme & APK Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsApkModalOpen(true)}
            className="px-2.5 py-1 rounded bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            title="Build & Download Test APK"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Build Test APK</span>
          </button>
          <select
            value={role}
            onChange={e => setRole(e.target.value as any)}
            className="px-2 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-white focus:outline-none"
          >
            <option value="ADMIN">Admin View</option>
            <option value="TEACHER">Teacher View (Mehta)</option>
            <option value="PARENT">Parent View (Aarav)</option>
          </select>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* App Container Sized According to Viewport Mode */}
      <div
        className={`w-full transition-all duration-300 my-auto ${
          viewportMode === 'mobile'
            ? 'max-w-[420px] my-4 rounded-[38px] border-[8px] border-slate-800 shadow-2xl bg-white dark:bg-[#111615] overflow-hidden'
            : viewportMode === 'tablet'
            ? 'max-w-[780px] my-4 rounded-2xl border-2 border-slate-700 shadow-xl bg-white dark:bg-[#111615] overflow-hidden'
            : 'max-w-7xl px-4 py-4'
        }`}
      >
        {/* Realistic Mobile Status Bar & Notch */}
        {viewportMode === 'mobile' && (
          <div className="w-full bg-slate-950 px-5 pt-3 pb-2 flex items-center justify-between text-[11px] text-slate-300 font-mono select-none border-b border-slate-900">
            <span className="font-semibold text-white tracking-tight">9:41</span>
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <span className="text-[10px] font-bold">100%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        )}

        {/* App Header */}
        <header className="px-4 py-3 bg-white dark:bg-[#18211f] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              IMS
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 dark:text-slate-100">IMS Mobile</span>
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-mono">
                {role}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsApkModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              <Smartphone className="w-3 h-3" />
              <span>Test APK</span>
            </button>
            <div className="text-xs text-slate-500 font-mono hidden sm:inline">
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* App Navigation (Horizontal scroll on mobile, responsive) */}
        <nav className="flex gap-1.5 overflow-x-auto px-3 py-2 bg-slate-50 dark:bg-[#151c1b] border-b border-slate-200 dark:border-slate-800 text-xs no-scrollbar">
          {filteredNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setProfileModalStudent(null);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-[#0f766e] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Workspace */}
        <main className="p-4 space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dash' && (
            <div className="space-y-4">
              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                  <span className="text-[11px] text-slate-500 block">Active students</span>
                  <div className="text-xl font-bold font-mono mt-0.5">{students.filter(s => s.status === 'Active').length}</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                  <span className="text-[11px] text-slate-500 block">Fees pending</span>
                  <div className="text-xl font-bold font-mono mt-0.5 text-amber-600">₹{inr(totalFeesPending)}</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                  <span className="text-[11px] text-slate-500 block">Follow-ups due</span>
                  <div className="text-xl font-bold font-mono mt-0.5">{pendingFollowups}</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                  <span className="text-[11px] text-slate-500 block">At-risk students</span>
                  <div className="text-xl font-bold font-mono mt-0.5 text-rose-600">{riskStudents.length}</div>
                </div>
              </div>

              {/* Overdue fees strip */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Overdue fees</h3>
                  <button
                    type="button"
                    onClick={sendFeeReminders}
                    className="text-[11px] text-teal-700 dark:text-teal-400 font-medium hover:underline flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send WhatsApp Reminders</span>
                  </button>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400 font-medium">
                        <th className="py-1">Student</th>
                        <th className="py-1">Balance</th>
                        <th className="py-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.filter(s => getStudentBalance(s.name) > 0).map(s => (
                        <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800/60">
                          <td className="py-1.5 font-medium">{s.name} ({s.batchName})</td>
                          <td className="py-1.5 font-mono text-rose-600 font-semibold">₹{inr(getStudentBalance(s.name))}</td>
                          <td className="py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setNewFeeForm({ studentName: s.name, amount: getStudentBalance(s.name), mode: 'UPI', ref: '' });
                                setActiveTab('fee');
                              }}
                              className="px-2 py-0.5 text-[11px] rounded bg-teal-600 text-white"
                            >
                              Collect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* At-risk students */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">At-risk students</h3>
                {riskStudents.length === 0 ? (
                  <p className="text-xs text-slate-500">No students currently flagged as at-risk.</p>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    {riskStudents.map((r, i) => (
                      <div key={i} className="p-2 rounded bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex justify-between">
                        <span className="font-medium text-rose-800 dark:text-rose-300">{r.name}</span>
                        <span className="text-slate-600 dark:text-slate-400">{r.reasons}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Exams */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Upcoming exams</h3>
                <div className="space-y-1.5 text-xs">
                  {tests.filter(t => !t.isCancelled).map(t => (
                    <div key={t.id} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span>{t.title} ({t.batchId.replace('batch-', '')})</span>
                      <span className="font-mono text-slate-500">{t.testDate} {t.testTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS */}
          {activeTab === 'stu' && (
            <div className="space-y-4">
              {/* Profile Card if student selected */}
              {profileModalStudent && (
                <div className="p-4 rounded-xl border-2 border-teal-600 bg-teal-50/30 dark:bg-teal-950/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm">{profileModalStudent.name}, Batch {profileModalStudent.batchName} ({profileModalStudent.status})</h3>
                      <p className="text-xs text-slate-500">Parent: {profileModalStudent.parentName}, {profileModalStudent.phone}. Admitted: {profileModalStudent.admissionDate}</p>
                    </div>
                    <button type="button" onClick={() => setProfileModalStudent(null)} className="text-xs px-2 py-0.5 rounded border">
                      Close
                    </button>
                  </div>
                  <div className="text-xs flex gap-3 flex-wrap">
                    <span>Total Fee: <strong>₹{inr(profileModalStudent.totalFee)}</strong></span>
                    <span>Paid: <strong>₹{inr(getStudentPaidAmount(profileModalStudent.name))}</strong></span>
                    <span className="text-rose-600 font-bold">Pending: ₹{inr(getStudentBalance(profileModalStudent.name))}</span>
                  </div>
                  {/* Results table */}
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-slate-400">
                          <th className="py-1">Exam</th>
                          <th className="py-1">Marks</th>
                          <th className="py-1">Percent</th>
                          <th className="py-1">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testResults.filter(r => r.studentName === profileModalStudent.name).map(r => {
                          const t = tests.find(test => test.id === r.testId);
                          const pct = t ? Math.round((r.marksObtained / t.maxMarks) * 100) : 0;
                          return (
                            <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                              <td className="py-1 font-medium">{t?.title}</td>
                              <td className="py-1 font-mono">{r.marksObtained}/{t?.maxMarks}</td>
                              <td className="py-1 font-mono font-bold">{pct}%</td>
                              <td className="py-1 font-mono">{gradeLetter(pct)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Register Student Form */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Register student</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newStudentForm.name) return showToast('Enter student name');
                    enrollStudent(newStudentForm);
                    setNewStudentForm({ name: '', gradeLevel: '10', batchName: '10-A', parentName: '', phone: '', totalFee: 24000 });
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Name
                    <input
                      required
                      placeholder="Student Name"
                      value={newStudentForm.name}
                      onChange={e => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Class
                    <input
                      value={newStudentForm.gradeLevel}
                      onChange={e => setNewStudentForm({ ...newStudentForm, gradeLevel: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Batch
                    <select
                      value={newStudentForm.batchName}
                      onChange={e => setNewStudentForm({ ...newStudentForm, batchName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Parent or Guardian
                    <input
                      placeholder="Parent Name"
                      value={newStudentForm.parentName}
                      onChange={e => setNewStudentForm({ ...newStudentForm, parentName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Phone
                    <input
                      placeholder="Phone number"
                      value={newStudentForm.phone}
                      onChange={e => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Total Fee (₹)
                    <input
                      type="number"
                      value={newStudentForm.totalFee}
                      onChange={e => setNewStudentForm({ ...newStudentForm, totalFee: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-3 flex justify-end mt-1">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white font-medium text-xs">
                      Add Student
                    </button>
                  </div>
                </form>
              </div>

              {/* Student Directory Table with live search */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-2">
                <input
                  type="text"
                  placeholder="Search name, class, batch or status..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-transparent"
                />
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Name</th>
                        <th className="py-1">Class</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1">Parent</th>
                        <th className="py-1">Phone</th>
                        <th className="py-1">Status</th>
                        <th className="py-1 text-right">Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students
                        .filter(s => `${s.name} ${s.batchName} ${s.gradeLevel} ${s.status}`.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(s => (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2 font-medium">{s.name}</td>
                            <td className="py-2">{s.gradeLevel}</td>
                            <td className="py-2 font-mono">{s.batchName}</td>
                            <td className="py-2 text-slate-500">{s.parentName}</td>
                            <td className="py-2 font-mono text-slate-500">{s.phone}</td>
                            <td className="py-2">
                              <select
                                value={s.status}
                                onChange={e => updateStudentStatus(s.id, e.target.value as any)}
                                className="px-1.5 py-0.5 rounded text-[11px] border bg-transparent"
                              >
                                <option value="Admission">Admission</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Leaving">Leaving</option>
                              </select>
                            </td>
                            <td className="py-2 text-right">
                              <button
                                type="button"
                                onClick={() => setProfileModalStudent(s)}
                                className="px-2 py-0.5 text-[11px] rounded border hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INQUIRIES & ADMISSIONS PIPELINE */}
          {activeTab === 'inq' && (
            <div className="space-y-4">
              {/* New inquiry */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">New inquiry</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newInquiryForm.name) return showToast('Enter name');
                    addInquiry({ ...newInquiryForm, status: 'New' });
                    setNewInquiryForm({ name: '', phone: '', course: 'Class 10 Boards', source: 'Walk-in', assignedTo: 'Admin', followUpDate: new Date().toISOString().split('T')[0] });
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Student or parent
                    <input
                      required
                      placeholder="Name"
                      value={newInquiryForm.name}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, name: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Phone
                    <input
                      required
                      placeholder="Phone"
                      value={newInquiryForm.phone}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, phone: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Course
                    <select
                      value={newInquiryForm.course}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, course: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Source
                    <select
                      value={newInquiryForm.source}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, source: e.target.value as any })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      <option value="Walk-in">Walk-in</option>
                      <option value="Call">Call</option>
                      <option value="Website">Website</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Assigned to
                    <input
                      value={newInquiryForm.assignedTo}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, assignedTo: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Follow-up date
                    <input
                      type="date"
                      value={newInquiryForm.followUpDate}
                      onChange={e => setNewInquiryForm({ ...newInquiryForm, followUpDate: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-3 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Add Inquiry
                    </button>
                  </div>
                </form>
              </div>

              {/* Inquiry Pipeline Table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Pipeline</h3>
                  <span className="text-[11px] text-slate-500">
                    Conversion: {inquiries.length ? Math.round((inquiries.filter(i => i.status === 'Admitted').length / inquiries.length) * 100) : 0}%
                  </span>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Name</th>
                        <th className="py-1">Phone</th>
                        <th className="py-1">Course</th>
                        <th className="py-1">Source</th>
                        <th className="py-1">Follow-up</th>
                        <th className="py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inq => (
                        <tr key={inq.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 font-medium">{inq.name}</td>
                          <td className="py-2 font-mono text-slate-500">{inq.phone}</td>
                          <td className="py-2">{inq.course}</td>
                          <td className="py-2 text-slate-500">{inq.source}</td>
                          <td className="py-2 font-mono">
                            <input
                              type="date"
                              value={inq.followUpDate}
                              onChange={e => updateInquiryFollowUp(inq.id, e.target.value)}
                              className="px-1 py-0.5 rounded border bg-transparent text-xs"
                            />
                          </td>
                          <td className="py-2">
                            <select
                              value={inq.status}
                              onChange={e => updateInquiryStatus(inq.id, e.target.value as any)}
                              className="px-1.5 py-0.5 rounded text-[11px] border bg-transparent"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Demo Scheduled">Demo Scheduled</option>
                              <option value="Follow-Up">Follow-Up</option>
                              <option value="Admitted">Admitted</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FEES */}
          {activeTab === 'fee' && (
            <div className="space-y-4">
              {/* Record Payment Form */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Record payment</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newFeeForm.amount) return showToast('Enter payment amount');
                    collectFee(newFeeForm.studentName, Number(newFeeForm.amount), newFeeForm.mode, newFeeForm.ref);
                  }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Student
                    <select
                      value={newFeeForm.studentName}
                      onChange={e => setNewFeeForm({ ...newFeeForm, studentName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.batchName})</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Amount (₹)
                    <input
                      type="number"
                      required
                      value={newFeeForm.amount}
                      onChange={e => setNewFeeForm({ ...newFeeForm, amount: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Mode
                    <select
                      value={newFeeForm.mode}
                      onChange={e => setNewFeeForm({ ...newFeeForm, mode: e.target.value as any })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank Transfer</option>
                      <option value="Card">Card</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Reference no.
                    <input
                      placeholder="e.g. U1001"
                      value={newFeeForm.ref}
                      onChange={e => setNewFeeForm({ ...newFeeForm, ref: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-4 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Save Payment
                    </button>
                  </div>
                </form>
              </div>

              {/* Reminders strip */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span>Due Date: <strong className="font-mono">2026-11-05</strong></span>
                <button
                  type="button"
                  onClick={sendFeeReminders}
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Remind parents with pending fees
                </button>
              </div>

              {/* Fee status table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Fee status</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Student</th>
                        <th className="py-1">Total</th>
                        <th className="py-1">Paid</th>
                        <th className="py-1">Balance</th>
                        <th className="py-1">Status</th>
                        <th className="py-1 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const paid = getStudentPaidAmount(s.name);
                        const bal = getStudentBalance(s.name);
                        return (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2 font-medium">{s.name}</td>
                            <td className="py-2 font-mono">₹{inr(s.totalFee)}</td>
                            <td className="py-2 font-mono text-emerald-600">₹{inr(paid)}</td>
                            <td className="py-2 font-mono font-bold text-rose-600">₹{inr(bal)}</td>
                            <td className="py-2">
                              {bal <= 0 ? (
                                <span className="text-emerald-600 font-semibold">Paid</span>
                              ) : paid > 0 ? (
                                <span className="text-amber-600 font-semibold">Partial</span>
                              ) : (
                                <span className="text-rose-600 font-semibold">Unpaid</span>
                              )}
                            </td>
                            <td className="py-2 text-right">
                              <button
                                type="button"
                                onClick={() => setReceiptModalStudent(s.name)}
                                className="px-2 py-0.5 rounded border text-[11px]"
                              >
                                Receipt
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment history */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Payment history</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Date</th>
                        <th className="py-1">Student</th>
                        <th className="py-1">Amount</th>
                        <th className="py-1">Mode</th>
                        <th className="py-1">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feePayments.map(p => (
                        <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-mono text-slate-400">{p.date}</td>
                          <td className="py-1.5 font-medium">{p.studentName}</td>
                          <td className="py-1.5 font-mono font-bold text-emerald-600">₹{inr(p.amount)}</td>
                          <td className="py-1.5">{p.mode}</td>
                          <td className="py-1.5 font-mono text-slate-500">{p.referenceNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ATTENDANCE */}
          {activeTab === 'att' && (
            <div className="space-y-4">
              {/* Mark Attendance Box */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Mark attendance</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <select
                      value={attendanceBatch}
                      onChange={e => setAttendanceBatch(e.target.value)}
                      className="px-2 py-1 rounded border bg-transparent font-medium"
                    >
                      <option value="10-A">Batch 10-A</option>
                      <option value="JEE-1">Batch JEE-1</option>
                    </select>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={e => setAttendanceDate(e.target.value)}
                      className="px-2 py-1 rounded border bg-transparent font-mono"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Student</th>
                        <th className="py-1">Status (P: Present, A: Absent, L: Leave)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.filter(s => s.batchName === attendanceBatch).map(s => {
                        const existing = attendanceRecords.find(a => a.date === attendanceDate && (a.studentName === s.name || a.studentId === s.id));
                        const val = attendanceInputs[s.id] || (existing?.status === 'ABSENT' ? 'A' : existing?.status === 'LATE' ? 'L' : 'P');
                        return (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-2 font-medium">{s.name}</td>
                            <td className="py-2">
                              <select
                                value={val}
                                onChange={e => setAttendanceInputs({ ...attendanceInputs, [s.id]: e.target.value as any })}
                                className="px-2 py-1 rounded border bg-transparent font-bold"
                              >
                                <option value="P">P (Present)</option>
                                <option value="A">A (Absent)</option>
                                <option value="L">L (Leave)</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const batchStudents = students.filter(s => s.batchName === attendanceBatch);
                    const recordsToSave: Record<string, any> = {};
                    batchStudents.forEach(s => {
                      const v = attendanceInputs[s.id] || 'P';
                      recordsToSave[s.id] = v === 'P' ? 'PRESENT' : v === 'A' ? 'ABSENT' : 'LATE';
                    });
                    markBatchAttendance(attendanceBatch, attendanceDate, recordsToSave);
                  }}
                  className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium"
                >
                  Save Attendance
                </button>
              </div>

              {/* Monthly Attendance Sheet */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Monthly sheet (October 2026)</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const rows = students.filter(s => s.batchName === attendanceBatch).map(s => {
                        const recs = attendanceRecords.filter(a => a.studentName === s.name);
                        const p = recs.filter(a => a.status === 'PRESENT').length;
                        const a = recs.filter(a => a.status === 'ABSENT').length;
                        return `${s.name},${p},${a}`;
                      });
                      setExportModalContent(`Student,Present,Absent\n${rows.join('\n')}`);
                    }}
                    className="text-xs px-2 py-1 rounded border"
                  >
                    Export sheet
                  </button>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Student</th>
                        <th className="py-1">Present</th>
                        <th className="py-1">Absent</th>
                        <th className="py-1">Percent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.filter(s => s.batchName === attendanceBatch).map(s => {
                        const recs = attendanceRecords.filter(a => a.studentName === s.name);
                        const p = recs.filter(a => a.status === 'PRESENT').length;
                        const a = recs.filter(a => a.status === 'ABSENT').length;
                        const total = recs.length || 1;
                        const pct = Math.round((p / total) * 100);
                        return (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-1.5 font-medium">{s.name}</td>
                            <td className="py-1.5 font-mono text-emerald-600">{p}</td>
                            <td className="py-1.5 font-mono text-rose-600">{a}</td>
                            <td className="py-1.5 font-mono font-bold">{pct}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Biometric Device Import */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-2">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Biometric device import</h3>
                <p className="text-[11px] text-slate-500">
                  Paste device export as Name,Date,Status (e.g., Aarav,2026-10-24,P). Manual roll call stays available as fallback.
                </p>
                <textarea
                  rows={3}
                  value={biometricText}
                  onChange={e => setBiometricText(e.target.value)}
                  placeholder="Aarav,2026-10-24,P&#10;Diya,2026-10-24,P&#10;Kabir,2026-10-24,A"
                  className="w-full p-2 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!biometricText) return showToast('Please paste biometric CSV lines');
                    importBiometricAttendance(biometricText);
                    setBiometricText('');
                  }}
                  className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium"
                >
                  Import and check
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: TIMETABLE & SUBSTITUTE FINDER */}
          {activeTab === 'tb' && (
            <div className="space-y-4">
              {/* Add slot form */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Add class slot</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addTimetableSlot(newSlotForm);
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Day
                    <select
                      value={newSlotForm.dayName}
                      onChange={e => {
                        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        setNewSlotForm({ ...newSlotForm, dayName: e.target.value, dayOfWeek: days.indexOf(e.target.value) + 1 });
                      }}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      <option value="Mon">Mon</option>
                      <option value="Tue">Tue</option>
                      <option value="Wed">Wed</option>
                      <option value="Thu">Thu</option>
                      <option value="Fri">Fri</option>
                      <option value="Sat">Sat</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Time
                    <input
                      type="time"
                      value={newSlotForm.startTime}
                      onChange={e => setNewSlotForm({ ...newSlotForm, startTime: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Batch
                    <select
                      value={newSlotForm.batchId}
                      onChange={e => setNewSlotForm({ ...newSlotForm, batchId: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Subject
                    <input
                      value={newSlotForm.subjectName}
                      onChange={e => setNewSlotForm({ ...newSlotForm, subjectName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Teacher
                    <select
                      value={newSlotForm.teacherName}
                      onChange={e => setNewSlotForm({ ...newSlotForm, teacherName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {teachers.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.specialization})</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Room
                    <input
                      value={newSlotForm.classroom}
                      onChange={e => setNewSlotForm({ ...newSlotForm, classroom: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-3 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Add Slot
                    </button>
                  </div>
                </form>
              </div>

              {/* Weekly Timetable Table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Weekly timetable</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Day</th>
                        <th className="py-1">Time</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1">Subject</th>
                        <th className="py-1">Teacher</th>
                        <th className="py-1">Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map(slot => (
                        <tr key={slot.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-medium">{slot.dayName}</td>
                          <td className="py-1.5 font-mono text-slate-500">{slot.startTime}</td>
                          <td className="py-1.5 font-mono">{slot.batchId.replace('batch-', '')}</td>
                          <td className="py-1.5">{slot.subjectName}</td>
                          <td className="py-1.5 font-semibold text-teal-700 dark:text-teal-400">{slot.teacherName}</td>
                          <td className="py-1.5 font-mono text-slate-400">{slot.classroom}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Teacher Absent / Substitute Finder */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-2">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Teacher absent (Find substitute)</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select id="sub-teacher" className="px-2 py-1 rounded border bg-transparent">
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                  <select id="sub-day" className="px-2 py-1 rounded border bg-transparent">
                    <option value="Mon">Mon</option>
                    <option value="Tue">Tue</option>
                    <option value="Wed">Wed</option>
                  </select>
                  <input id="sub-time" type="time" defaultValue="16:00" className="px-2 py-1 rounded border bg-transparent font-mono" />
                  <button
                    type="button"
                    onClick={() => {
                      const t = (document.getElementById('sub-teacher') as HTMLSelectElement).value;
                      const day = (document.getElementById('sub-day') as HTMLSelectElement).value;
                      const time = (document.getElementById('sub-time') as HTMLInputElement).value;
                      const affected = timetable.filter(s => s.teacherName === t && s.dayName === day && s.startTime === time);
                      if (!affected.length) return showToast('No class found for that teacher in this slot');
                      setSubstituteModalData({ teacher: t, day, time, affected });
                    }}
                    className="px-3 py-1 rounded bg-[#0f766e] text-white"
                  >
                    Find substitutes
                  </button>
                </div>

                {/* Assigned substitutes list */}
                {substitutes.length > 0 && (
                  <div className="pt-2 border-t text-xs">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Active Substitute Assignments:</span>
                    {substitutes.map(s => (
                      <div key={s.id} className="flex justify-between py-1 border-b">
                        <span>Slot: {s.slot} ({s.batch})</span>
                        <span className="font-semibold text-emerald-600">Assigned: {s.substituteTeacher}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: EXAMS */}
          {activeTab === 'ex' && (
            <div className="space-y-4">
              {/* Schedule Exam */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Schedule exam</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newExamForm.title) return showToast('Enter exam title');
                    createTest({
                      batchId: newExamForm.batchId,
                      subjectId: newExamForm.subjectId,
                      subjectName: newExamForm.subjectName,
                      teacherId: 'tp-mehta',
                      title: newExamForm.title,
                      maxMarks: Number(newExamForm.maxMarks),
                      passingMarks: Number(newExamForm.passingMarks),
                      testDate: newExamForm.testDate,
                      testTime: newExamForm.testTime,
                      isPublished: false
                    });
                    setNewExamForm({ title: '', batchId: 'batch-10a', subjectId: 'sub-maths', subjectName: 'Maths', maxMarks: 50, passingMarks: 17, testDate: new Date().toISOString().split('T')[0], testTime: '10:00' });
                  }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Exam title
                    <input
                      required
                      placeholder="e.g. Unit Test 4"
                      value={newExamForm.title}
                      onChange={e => setNewExamForm({ ...newExamForm, title: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Batch
                    <select
                      value={newExamForm.batchId}
                      onChange={e => setNewExamForm({ ...newExamForm, batchId: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Subject
                    <input
                      value={newExamForm.subjectName}
                      onChange={e => setNewExamForm({ ...newExamForm, subjectName: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Date
                    <input
                      type="date"
                      value={newExamForm.testDate}
                      onChange={e => setNewExamForm({ ...newExamForm, testDate: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Max Marks
                    <input
                      type="number"
                      value={newExamForm.maxMarks}
                      onChange={e => setNewExamForm({ ...newExamForm, maxMarks: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Pass Marks
                    <input
                      type="number"
                      value={newExamForm.passingMarks}
                      onChange={e => setNewExamForm({ ...newExamForm, passingMarks: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-2 flex items-end justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Schedule Exam
                    </button>
                  </div>
                </form>
              </div>

              {/* Exam Schedule Table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Scheduled exams</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Exam</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1">Subject</th>
                        <th className="py-1">When</th>
                        <th className="py-1">Max/Pass</th>
                        <th className="py-1">Status</th>
                        <th className="py-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.map(test => (
                        <tr key={test.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-2 font-medium">{test.title}</td>
                          <td className="py-2 font-mono">{test.batchId.replace('batch-', '')}</td>
                          <td className="py-2">{test.subjectName}</td>
                          <td className="py-2 font-mono text-slate-500">{test.testDate}</td>
                          <td className="py-2 font-mono">{test.maxMarks}/{test.passingMarks}</td>
                          <td className="py-2">
                            {test.isCancelled ? (
                              <span className="text-rose-600 font-semibold">Cancelled</span>
                            ) : test.isPublished ? (
                              <span className="text-emerald-600 font-semibold">Published</span>
                            ) : (
                              <span className="text-amber-600 font-semibold">Scheduled</span>
                            )}
                          </td>
                          <td className="py-2 text-right">
                            {!test.isCancelled && (
                              <button
                                type="button"
                                onClick={() => cancelTest(test.id)}
                                className="px-2 py-0.5 rounded border text-[11px] text-rose-600 hover:bg-rose-50"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MARKS & RESULTS */}
          {activeTab === 'mk' && (
            <div className="space-y-4">
              {/* Exam selector */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Marks entry</h3>
                  <select
                    value={selectedExamIndex}
                    onChange={e => setSelectedExamIndex(Number(e.target.value))}
                    className="px-2 py-1 rounded border bg-transparent text-xs font-medium"
                  >
                    {tests.map((t, idx) => (
                      <option key={t.id} value={idx}>{t.title} ({t.batchId.replace('batch-', '')})</option>
                    ))}
                  </select>
                </div>
                <div className="text-[11px] text-slate-500">
                  Max Marks: <strong>{currentExam?.maxMarks}</strong> · Passing: <strong>{currentExam?.passingMarks}</strong>
                </div>

                {/* Entry inputs */}
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Student</th>
                        <th className="py-1">Marks Obtained</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.filter(s => s.batchName === currentExam?.batchId.replace('batch-', '') || currentExam?.batchId.includes(s.batchName.toLowerCase())).map(s => {
                        const existingResult = testResults.find(r => r.testId === currentExam?.id && (r.studentName === s.name || r.studentId === s.id));
                        const currentVal = marksInputs[s.id] ?? existingResult?.marksObtained ?? '';
                        return (
                          <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-1.5 font-medium">{s.name}</td>
                            <td className="py-1.5">
                              <input
                                type="number"
                                min={0}
                                max={currentExam?.maxMarks}
                                value={currentVal}
                                onChange={e => setMarksInputs({ ...marksInputs, [s.id]: Number(e.target.value) })}
                                className="w-20 px-2 py-1 rounded border bg-transparent font-mono"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentExam) return;
                      const batchStudents = students.filter(s => s.batchName === currentExam.batchId.replace('batch-', '') || currentExam.batchId.includes(s.batchName.toLowerCase()));
                      const resultsToSave = batchStudents.map(s => ({
                        studentId: s.id,
                        marksObtained: marksInputs[s.id] ?? 0
                      }));
                      saveTestMarks(currentExam.id, resultsToSave);
                    }}
                    className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium"
                  >
                    Save Marks
                  </button>

                  <button
                    type="button"
                    onClick={() => currentExam && togglePublishTest(currentExam.id)}
                    className="px-3 py-1 rounded border text-xs"
                  >
                    {currentExam?.isPublished ? 'Unpublish' : 'Publish Result'}
                  </button>
                </div>
              </div>

              {/* Visual Grade Distribution Chart using Recharts */}
              {(() => {
                const examResults = testResults.filter(r => r.testId === currentExam?.id);
                const gradeCounts: Record<string, number> = {
                  'A+': 0,
                  'A': 0,
                  'B': 0,
                  'C': 0,
                  'D': 0,
                  'F': 0
                };

                examResults.forEach(r => {
                  const pct = currentExam && currentExam.maxMarks > 0 ? Math.round((r.marksObtained / currentExam.maxMarks) * 100) : 0;
                  const g = gradeLetter(pct);
                  if (gradeCounts[g] !== undefined) {
                    gradeCounts[g]++;
                  }
                });

                const gradeDistributionData = [
                  { grade: 'A+', label: '≥ 90%', count: gradeCounts['A+'], fill: '#10b981' },
                  { grade: 'A', label: '75–89%', count: gradeCounts['A'], fill: '#059669' },
                  { grade: 'B', label: '60–74%', count: gradeCounts['B'], fill: '#0d9488' },
                  { grade: 'C', label: '45–59%', count: gradeCounts['C'], fill: '#f59e0b' },
                  { grade: 'D', label: '33–44%', count: gradeCounts['D'], fill: '#ea580c' },
                  { grade: 'F', label: '< 33%', count: gradeCounts['F'], fill: '#dc2626' }
                ];

                const totalEvaluated = examResults.length;
                const passingCount = examResults.filter(r => currentExam && r.marksObtained >= currentExam.passingMarks).length;
                const passRate = totalEvaluated > 0 ? Math.round((passingCount / totalEvaluated) * 100) : 0;

                return (
                  <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Grade Distribution ({currentExam?.title})</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Breakdown across grade ranges (A+, A, B, C, D, F) · Pass Rate: <strong className="font-mono text-emerald-600">{passRate}%</strong> ({passingCount}/{totalEvaluated})
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="text-slate-500">Evaluated: <strong className="text-slate-800 dark:text-slate-200">{totalEvaluated}</strong></span>
                      </div>
                    </div>

                    {/* Grade Range Count Strip */}
                    <div className="grid grid-cols-6 gap-1.5 text-center text-[11px]">
                      {gradeDistributionData.map(d => (
                        <div
                          key={d.grade}
                          className="p-1.5 rounded border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40"
                        >
                          <div className="font-bold" style={{ color: d.fill }}>{d.grade}</div>
                          <div className="text-slate-400 text-[9px] font-mono">{d.label}</div>
                          <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">{d.count}</div>
                        </div>
                      ))}
                    </div>

                    {/* Recharts Bar Chart */}
                    <div className="h-44 w-full pt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.4} stroke="#cbd5e1" />
                          <XAxis
                            dataKey="grade"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0F172A',
                              borderColor: '#1E293B',
                              borderRadius: '8px',
                              color: '#F8FAFC',
                              fontSize: '12px'
                            }}
                            formatter={(value: any, _name: any, item: any) => [
                              `${value} student${value === 1 ? '' : 's'} (${totalEvaluated > 0 ? Math.round((Number(value) / totalEvaluated) * 100) : 0}%)`,
                              `Grade ${item.payload.grade} (${item.payload.label})`
                            ]}
                          />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {gradeDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })()}

              {/* Result Leaderboard Table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Result: {currentExam?.title}</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Rank</th>
                        <th className="py-1">Student</th>
                        <th className="py-1">Marks</th>
                        <th className="py-1">Percent</th>
                        <th className="py-1">Grade</th>
                        <th className="py-1">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults
                        .filter(r => r.testId === currentExam?.id)
                        .sort((a, b) => b.marksObtained - a.marksObtained)
                        .map((r, idx) => {
                          const pct = currentExam ? Math.round((r.marksObtained / currentExam.maxMarks) * 100) : 0;
                          const passed = currentExam && r.marksObtained >= currentExam.passingMarks;
                          return (
                            <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                              <td className="py-1.5 font-mono text-slate-400">{idx + 1}</td>
                              <td className="py-1.5 font-medium">{r.studentName}</td>
                              <td className="py-1.5 font-mono">{r.marksObtained}/{currentExam?.maxMarks}</td>
                              <td className="py-1.5 font-mono font-bold">{pct}%</td>
                              <td className="py-1.5 font-mono">{gradeLetter(pct)}</td>
                              <td className="py-1.5">
                                <span className={passed ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                                  {passed ? 'Pass' : 'Fail'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PROGRESS & GROWTH CURVES */}
          {activeTab === 'pf' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Student progress chart</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <select
                      value={progressStudent}
                      onChange={e => setProgressStudent(e.target.value)}
                      className="px-2 py-1 rounded border bg-transparent font-medium"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.batchName})</option>
                      ))}
                    </select>
                    <select
                      value={progressFilter}
                      onChange={e => setProgressFilter(e.target.value as any)}
                      className="px-2 py-1 rounded border bg-transparent"
                    >
                      <option value="All">All Exams</option>
                      <option value="Last 4">Last 4</option>
                    </select>
                  </div>
                </div>

                {/* Growth SVG Bar Chart */}
                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={testResults
                        .filter(r => r.studentName === progressStudent)
                        .map(r => {
                          const t = tests.find(test => test.id === r.testId);
                          return {
                            name: t?.title.slice(0, 10) || 'Test',
                            score: t ? Math.round((r.marksObtained / t.maxMarks) * 100) : 0
                          };
                        })}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(val) => [`${val}%`, 'Score']} />
                      <Bar dataKey="score" fill="#0f766e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Batch Summary */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Batch summary (Staff only)</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Exam</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1">Average</th>
                        <th className="py-1">Highest</th>
                        <th className="py-1">Lowest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.map(test => {
                        const scores = testResults.filter(r => r.testId === test.id).map(r => r.marksObtained);
                        if (!scores.length) return null;
                        const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length / test.maxMarks) * 100);
                        return (
                          <tr key={test.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-1.5 font-medium">{test.title}</td>
                            <td className="py-1.5 font-mono">{test.batchId.replace('batch-', '')}</td>
                            <td className="py-1.5 font-mono font-bold text-teal-700 dark:text-teal-400">{avg}%</td>
                            <td className="py-1.5 font-mono text-emerald-600">{Math.max(...scores)}</td>
                            <td className="py-1.5 font-mono text-rose-600">{Math.min(...scores)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: STUDY MATERIAL */}
          {activeTab === 'mat' && (
            <div className="space-y-4">
              {/* Add Material */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Add material</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newMaterialForm.title) return showToast('Enter title');
                    addStudyMaterial(newMaterialForm);
                    setNewMaterialForm({ type: 'Notes', title: '', subject: 'Maths', batch: '10-A', url: '' });
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Type
                    <select
                      value={newMaterialForm.type}
                      onChange={e => setNewMaterialForm({ ...newMaterialForm, type: e.target.value as any })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      <option value="Notes">Notes</option>
                      <option value="Worksheet">Worksheet</option>
                      <option value="Video">Video Link</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Title
                    <input
                      required
                      placeholder="Title"
                      value={newMaterialForm.title}
                      onChange={e => setNewMaterialForm({ ...newMaterialForm, title: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Subject
                    <input
                      value={newMaterialForm.subject}
                      onChange={e => setNewMaterialForm({ ...newMaterialForm, subject: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Batch
                    <select
                      value={newMaterialForm.batch}
                      onChange={e => setNewMaterialForm({ ...newMaterialForm, batch: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    >
                      {batches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500 col-span-2">
                    File name or link (YouTube / PDF)
                    <input
                      placeholder="e.g. trig-notes.pdf or https://youtube.com"
                      value={newMaterialForm.url}
                      onChange={e => setNewMaterialForm({ ...newMaterialForm, url: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-transparent mt-0.5"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-3 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Add Material
                    </button>
                  </div>
                </form>
              </div>

              {/* Study Material Table */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Available materials</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Type</th>
                        <th className="py-1">Title</th>
                        <th className="py-1">Subject</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1">Open</th>
                        <th className="py-1 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studyMaterials.map(m => (
                        <tr key={m.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-mono text-slate-500">{m.type}</td>
                          <td className="py-1.5 font-medium">{m.title}</td>
                          <td className="py-1.5">{m.subject}</td>
                          <td className="py-1.5 font-mono">{m.batch}</td>
                          <td className="py-1.5">
                            {m.url.startsWith('http') ? (
                              <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline flex items-center gap-1">
                                <span>Open</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="font-mono text-slate-400">{m.url}</span>
                            )}
                          </td>
                          <td className="py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => deleteStudyMaterial(m.id)}
                              className="text-rose-600 hover:text-rose-700"
                            >
                              <Trash2 className="w-3.5 h-3.5 ml-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: COURSES & BATCHES */}
          {activeTab === 'crs' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Courses</h3>
                <div className="flex gap-2 text-xs">
                  <input
                    placeholder="New course name"
                    value={newCourseName}
                    onChange={e => setNewCourseName(e.target.value)}
                    className="flex-1 px-2 py-1 rounded border bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCourseName) return;
                      addCourse(newCourseName);
                      setNewCourseName('');
                    }}
                    className="px-3 py-1 rounded bg-[#0f766e] text-white"
                  >
                    Add course
                  </button>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <tbody>
                      {courses.map(c => (
                        <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-medium">{c.name}</td>
                          <td className="py-1.5">{c.isActive ? 'Active' : 'Inactive'}</td>
                          <td className="py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => toggleCourseStatus(c.id)}
                              className="px-2 py-0.5 rounded border text-[11px]"
                            >
                              {c.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Batches</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    placeholder="Batch name (e.g. 10-B)"
                    value={newBatchName}
                    onChange={e => setNewBatchName(e.target.value)}
                    className="px-2 py-1 rounded border bg-transparent"
                  />
                  <select
                    value={newBatchCourse}
                    onChange={e => setNewBatchCourse(e.target.value)}
                    className="px-2 py-1 rounded border bg-transparent"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <select
                    value={newBatchTeacher}
                    onChange={e => setNewBatchTeacher(e.target.value)}
                    className="px-2 py-1 rounded border bg-transparent"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newBatchName) return;
                        addBatch(newBatchName, newBatchCourse, newBatchTeacher);
                        setNewBatchName('');
                      }}
                      className="px-3 py-1 rounded bg-[#0f766e] text-white"
                    >
                      Add batch
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Batch</th>
                        <th className="py-1">Course</th>
                        <th className="py-1">Teacher</th>
                        <th className="py-1">Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map(b => (
                        <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-bold">{b.name}</td>
                          <td className="py-1.5">{b.courseName}</td>
                          <td className="py-1.5">{b.teacherName}</td>
                          <td className="py-1.5 font-mono">{students.filter(s => s.batchName === b.name).length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: PTM (Parent-Teacher Meetings) */}
          {activeTab === 'ptm' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Schedule parent-teacher meeting</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    schedulePTM(newPTMForm);
                  }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Date
                    <input
                      type="date"
                      value={newPTMForm.date}
                      onChange={e => setNewPTMForm({ ...newPTMForm, date: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Time
                    <input
                      type="time"
                      value={newPTMForm.time}
                      onChange={e => setNewPTMForm({ ...newPTMForm, time: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Location or mode
                    <input
                      value={newPTMForm.location}
                      onChange={e => setNewPTMForm({ ...newPTMForm, location: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Batch
                    <select
                      value={newPTMForm.batch}
                      onChange={e => setNewPTMForm({ ...newPTMForm, batch: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    >
                      <option value="All">All Batches</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </label>
                  <div className="col-span-2 sm:col-span-4 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Schedule PTM
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Scheduled PTMs</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Date</th>
                        <th className="py-1">Time</th>
                        <th className="py-1">Where</th>
                        <th className="py-1">Batch</th>
                        <th className="py-1 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ptmMeetings.map(p => (
                        <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-mono">{p.date}</td>
                          <td className="py-1.5 font-mono">{p.time}</td>
                          <td className="py-1.5">{p.location}</td>
                          <td className="py-1.5 font-mono">{p.batch}</td>
                          <td className="py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => cancelPTM(p.id)}
                              className="text-rose-600 hover:underline"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: FINANCE & ACCOUNTS */}
          {activeTab === 'fin' && (
            <div className="space-y-4">
              {/* Add Entry */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Add finance entry</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newFinanceForm.amount) return showToast('Enter amount');
                    addFinanceTransaction({ ...newFinanceForm, amount: Number(newFinanceForm.amount) });
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
                >
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Type
                    <select
                      value={newFinanceForm.type}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, type: e.target.value as any })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    >
                      <option value="Debit">Debit (Expense)</option>
                      <option value="Credit">Credit (Income)</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Category
                    <select
                      value={newFinanceForm.category}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, category: e.target.value as any })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    >
                      <option value="Rent">Rent</option>
                      <option value="Salaries">Salaries</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Amount (₹)
                    <input
                      type="number"
                      required
                      value={newFinanceForm.amount}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, amount: Number(e.target.value) })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5 font-mono"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Date
                    <input
                      type="date"
                      value={newFinanceForm.date}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, date: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    />
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Mode
                    <select
                      value={newFinanceForm.mode}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, mode: e.target.value as any })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    >
                      <option value="Bank">Bank</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-[11px] text-slate-500">
                    Description
                    <input
                      placeholder="e.g. Branch electrical bill"
                      value={newFinanceForm.description}
                      onChange={e => setNewFinanceForm({ ...newFinanceForm, description: e.target.value })}
                      className="px-2 py-1 rounded border bg-transparent mt-0.5"
                    />
                  </label>
                  <div className="col-span-2 sm:col-span-3 flex justify-end">
                    <button type="submit" className="px-3 py-1.5 rounded bg-[#0f766e] text-white text-xs font-medium">
                      Add Entry
                    </button>
                  </div>
                </form>
              </div>

              {/* Finance Balance Strip */}
              {(() => {
                const allFin = [
                  ...financeTransactions,
                  ...feePayments.map(p => ({
                    id: p.id,
                    type: 'Credit' as const,
                    category: 'Student fees' as const,
                    amount: p.amount,
                    date: p.date,
                    description: p.studentName,
                    mode: p.mode
                  }))
                ].filter(x => (!financeFrom || x.date >= financeFrom) && (!financeTo || x.date <= financeTo));

                const feeCollections = allFin.filter(x => x.category === 'Student fees').reduce((a, b) => a + b.amount, 0);
                const otherCredits = allFin.filter(x => x.type === 'Credit' && x.category !== 'Student fees').reduce((a, b) => a + b.amount, 0);
                const totalExpenses = allFin.filter(x => x.type === 'Debit').reduce((a, b) => a + b.amount, 0);
                const netOperating = feeCollections + otherCredits - totalExpenses;

                return (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                        <span className="text-[11px] text-slate-400">Fee collections</span>
                        <div className="text-lg font-bold font-mono text-emerald-600">₹{inr(feeCollections)}</div>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                        <span className="text-[11px] text-slate-400">Other credits</span>
                        <div className="text-lg font-bold font-mono">₹{inr(otherCredits)}</div>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                        <span className="text-[11px] text-slate-400">Expenses</span>
                        <div className="text-lg font-bold font-mono text-rose-600">₹{inr(totalExpenses)}</div>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                        <span className="text-[11px] text-slate-400">Net operating</span>
                        <div className={`text-lg font-bold font-mono ${netOperating >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          ₹{inr(netOperating)}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Ledger report</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const lines = allFin.map(x => `${x.date},${x.type},${x.category},${x.description},${x.amount}`);
                            setExportModalContent(`Date,Type,Category,Description,Amount\n${lines.join('\n')}`);
                          }}
                          className="px-2 py-0.5 rounded border text-xs"
                        >
                          Export report
                        </button>
                      </div>
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b text-slate-400">
                              <th className="py-1">Date</th>
                              <th className="py-1">Type</th>
                              <th className="py-1">Category</th>
                              <th className="py-1">Description</th>
                              <th className="py-1">Mode</th>
                              <th className="py-1 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allFin.map(f => (
                              <tr key={f.id} className="border-b border-slate-100 dark:border-slate-800">
                                <td className="py-1.5 font-mono text-slate-400">{f.date}</td>
                                <td className="py-1.5 font-mono">
                                  <span className={f.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}>{f.type}</span>
                                </td>
                                <td className="py-1.5">{f.category}</td>
                                <td className="py-1.5 text-slate-500">{f.description}</td>
                                <td className="py-1.5 text-slate-400">{f.mode}</td>
                                <td className="py-1.5 font-mono font-bold text-right">₹{inr(f.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* TAB 14: USERS & AUDIT */}
          {activeTab === 'usr' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Staff accounts and permissions</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Name</th>
                        <th className="py-1">Role</th>
                        <th className="py-1">Permitted Modules</th>
                        <th className="py-1">Subject</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map(t => (
                        <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-medium">{t.name}</td>
                          <td className="py-1.5">Teacher</td>
                          <td className="py-1.5 text-slate-500">{t.permittedModules}</td>
                          <td className="py-1.5 font-semibold text-teal-700 dark:text-teal-400">{t.specialization}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Audit history</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-slate-400">
                        <th className="py-1">Time</th>
                        <th className="py-1">User Role</th>
                        <th className="py-1">Action & Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(l => (
                        <tr key={l.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-1.5 font-mono text-slate-400">{l.timestamp}</td>
                          <td className="py-1.5 font-semibold text-teal-700 dark:text-teal-400">{l.userName}</td>
                          <td className="py-1.5 text-slate-700 dark:text-slate-300">{l.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: PARENT PORTAL */}
          {activeTab === 'por' && (
            <div className="space-y-4">
              {(() => {
                const s = students.find(st => st.name === parentChild) || students[0];
                const studentAtt = attendanceRecords.filter(a => a.studentName === s.name);
                const p = studentAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
                const attRate = studentAtt.length ? Math.round((p / studentAtt.length) * 100) : 100;
                const bal = getStudentBalance(s.name);

                return (
                  <>
                    <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Parent portal</h3>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-500">Child:</span>
                          <select
                            value={parentChild}
                            onChange={e => setParentChild(e.target.value)}
                            className="px-2 py-0.5 rounded border bg-transparent font-medium"
                          >
                            {students.map(st => (
                              <option key={st.id} value={st.name}>{st.name} ({st.batchName})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                          <span className="text-slate-500 text-[11px]">Attendance</span>
                          <div className="text-xl font-bold font-mono text-emerald-600">{attRate}%</div>
                        </div>
                        <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                          <span className="text-slate-500 text-[11px]">Fee balance</span>
                          <div className="text-xl font-bold font-mono text-rose-600">₹{inr(bal)}</div>
                        </div>
                      </div>
                      {bal > 0 && (
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                          Fee payment due by 2026-11-05
                        </div>
                      )}
                    </div>

                    {/* Published Exam Results */}
                    <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f]">
                      <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-2">Published results</h3>
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b text-slate-400">
                              <th className="py-1">Exam</th>
                              <th className="py-1">Marks</th>
                              <th className="py-1">Percent</th>
                            </tr>
                          </thead>
                          <tbody>
                            {testResults.filter(r => r.studentName === s.name).map(r => {
                              const t = tests.find(test => test.id === r.testId);
                              const pct = t ? Math.round((r.marksObtained / t.maxMarks) * 100) : 0;
                              return (
                                <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                                  <td className="py-1 font-medium">{t?.title}</td>
                                  <td className="py-1 font-mono">{r.marksObtained}/{t?.maxMarks}</td>
                                  <td className="py-1 font-mono font-bold">{pct}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Upcoming schedule & announcements */}
                    <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] space-y-2">
                      <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">Announcements</h3>
                      {notices.map(n => (
                        <div key={n.id} className="text-xs p-2 rounded bg-slate-50 dark:bg-slate-900">
                          <span className="font-semibold">{n.title}:</span> {n.content}
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation Bar for Smartphone Ergonomics */}
        {viewportMode === 'mobile' && (
          <nav className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#18211f]/95 backdrop-blur-md px-2 py-1 flex items-center justify-around text-[10px] select-none">
            {[
              { id: 'dash', label: 'Home', icon: LayoutDashboard },
              { id: 'stu', label: 'Students', icon: Users },
              { id: 'att', label: 'Attendance', icon: CheckSquare },
              { id: 'fee', label: 'Fees', icon: CreditCard },
              { id: 'more', label: 'More', icon: MoreHorizontal }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = tab.id === 'more' ? isMoreSheetOpen : activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id === 'more') {
                      setIsMoreSheetOpen(!isMoreSheetOpen);
                    } else {
                      setActiveTab(tab.id);
                      setIsMoreSheetOpen(false);
                      setProfileModalStudent(null);
                    }
                  }}
                  className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                    isActive
                      ? 'text-teal-600 dark:text-teal-400 font-bold scale-105'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Mobile Home Gesture Indicator Bar */}
        {viewportMode === 'mobile' && (
          <div className="w-full bg-white dark:bg-[#18211f] pb-2 pt-1 flex justify-center">
            <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        )}
      </div>

      {/* Payment Receipt Modal */}
      {receiptModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] p-5 shadow-2xl text-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-600" />
              <span>Official Payment Receipt</span>
            </h3>
            {(() => {
              const lastPay = feePayments.filter(p => p.studentName === receiptModalStudent).slice(-1)[0];
              const st = students.find(s => s.name === receiptModalStudent);
              if (!lastPay || !st) {
                return <p className="text-slate-500">No payment transaction recorded for {receiptModalStudent} yet.</p>;
              }
              return (
                <div className="space-y-1.5 p-3 rounded bg-slate-50 dark:bg-slate-900 border">
                  <div>Student: <strong>{receiptModalStudent}</strong></div>
                  <div>Date: <span className="font-mono">{lastPay.date}</span></div>
                  <div>Amount: <strong className="font-mono text-emerald-600 font-bold">₹{inr(lastPay.amount)}</strong></div>
                  <div>Mode: <span>{lastPay.mode} (Ref: {lastPay.referenceNo})</span></div>
                  <div className="pt-1 border-t text-rose-600 font-bold">Remaining Balance: ₹{inr(getStudentBalance(receiptModalStudent))}</div>
                </div>
              );
            })()}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReceiptModalStudent(null)}
                className="px-3 py-1.5 rounded bg-[#0f766e] text-white"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Substitute Assignment Modal */}
      {substituteModalData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] p-5 shadow-2xl text-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Affected Classes & Available Substitutes</h3>
            <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200">
              Teacher <strong>{substituteModalData.teacher}</strong> has {substituteModalData.affected.length} class(es) on {substituteModalData.day} {substituteModalData.time}:
              {substituteModalData.affected.map(a => (
                <div key={a.id} className="mt-1 font-mono font-medium">{a.batchId.replace('batch-', '')}: {a.subjectName} ({a.classroom})</div>
              ))}
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-slate-400 block">Available faculty substitutes:</span>
              {teachers.filter(t => t.name !== substituteModalData.teacher).map(t => (
                <div key={t.id} className="p-2 rounded border flex justify-between items-center">
                  <div>
                    <span className="font-medium">{t.name}</span>
                    <span className="text-slate-400 text-[11px] block">{t.specialization}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      assignSubstitute(substituteModalData.affected[0].batchId.replace('batch-', ''), `${substituteModalData.day} ${substituteModalData.time}`, t.name, substituteModalData.teacher);
                      setSubstituteModalData(null);
                    }}
                    className="px-2.5 py-1 rounded bg-[#0f766e] text-white text-[11px]"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setSubstituteModalData(null)}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Copy Modal */}
      {exportModalContent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] p-5 shadow-2xl text-xs space-y-3">
            <h3 className="font-bold text-sm">Export: copy into Excel / CSV</h3>
            <textarea
              rows={8}
              readOnly
              value={exportModalContent}
              className="w-full p-2 font-mono text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(exportModalContent);
                  showToast('Copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded bg-teal-600 text-white"
              >
                Copy to Clipboard
              </button>
              <button
                type="button"
                onClick={() => setExportModalContent(null)}
                className="px-3 py-1.5 rounded border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile "More" Drawer / Bottom Sheet */}
      {isMoreSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] p-4 shadow-2xl text-xs space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-[10px]">
                  IMS
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">All Modules & Tools</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick APK Banner inside More Sheet */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-teal-900/40 to-slate-900/60 border border-teal-500/30 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-teal-300 block">Mobile APK Center</span>
                <span className="text-[11px] text-slate-300">Install app or build test APK</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  setIsApkModalOpen(true);
                }}
                className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-medium text-[11px] flex items-center gap-1 shadow-xs"
              >
                <Download className="w-3 h-3" />
                <span>Open Hub</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {filteredNavItems
                .filter(item => !['dash', 'stu', 'att', 'fee'].includes(item.id))
                .map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMoreSheetOpen(false);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/30 text-left flex items-center gap-2 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                    </button>
                  );
                })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMoreSheetOpen(false)}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMS Mobile App & Test APK Center Modal */}
      {isApkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18211f] shadow-2xl text-xs overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>IMS Mobile & Test APK Center</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      v1.0.0
                    </span>
                  </h3>
                  <span className="text-slate-400 text-[11px]">Android Package (APK), WebAPK, and Cloud Build</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsApkModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hub Tab Bar */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-2 pt-2 gap-1 text-[11px] overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveApkTab('apk')}
                className={`px-3 py-1.5 rounded-t-lg font-medium transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeApkTab === 'apk'
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-white dark:bg-[#18211f]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Test APK Package</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveApkTab('pwa')}
                className={`px-3 py-1.5 rounded-t-lg font-medium transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeApkTab === 'pwa'
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-white dark:bg-[#18211f]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click WebAPK</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveApkTab('github')}
                className={`px-3 py-1.5 rounded-t-lg font-medium transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeApkTab === 'github'
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-white dark:bg-[#18211f]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Cloud CI/CD Build</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveApkTab('studio')}
                className={`px-3 py-1.5 rounded-t-lg font-medium transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeApkTab === 'studio'
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400 bg-white dark:bg-[#18211f]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Android Studio</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
              {/* TAB 1: TEST APK PACKAGE */}
              {activeApkTab === 'apk' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          APK
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">ims-mobile-v1.0-test.apk</span>
                          <span className="text-[11px] text-slate-500 font-mono">Package ID: com.ims.institute</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                        Ready to Test
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                        <span className="text-slate-400 block text-[10px]">Target SDK</span>
                        <strong>Android 14 (API 34)</strong>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                        <span className="text-slate-400 block text-[10px]">Min Android</span>
                        <strong>Android 7.0 (API 24)</strong>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                        <span className="text-slate-400 block text-[10px]">Architecture</span>
                        <strong>Universal (ARM64/x86)</strong>
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                        <span className="text-slate-400 block text-[10px]">Engine</span>
                        <strong>Capacitor 6 + PWA</strong>
                      </div>
                    </div>

                    {/* Direct Native HTML Download Button */}
                    <a
                      href="/ims-mobile-v1.0-test.apk"
                      download="ims-mobile-v1.0-test.apk"
                      onClick={() => showToast('Downloading ims-mobile-v1.0-test.apk...')}
                      className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 text-xs text-center"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Test APK Package (.apk)</span>
                    </a>

                    {/* Secondary Mirror & Local Path Options */}
                    <div className="flex gap-2 pt-1">
                      <a
                        href="/ims-mobile-v1.0-test.apk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-center font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-teal-600" />
                        <span>Direct URL Mirror</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText('C:\\Users\\IT\'s phoenix\\antigravity\\IMS-–-Institute-Management-System\\public\\ims-mobile-v1.0-test.apk');
                          setCopiedCmd('path');
                          setTimeout(() => setCopiedCmd(null), 2000);
                          showToast('Copied local APK file path!');
                        }}
                        className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-center font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Copy className="w-3 h-3 text-emerald-600" />
                        <span>{copiedCmd === 'path' ? 'Copied Path!' : 'Copy File Path'}</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 text-slate-300 text-[10px] font-mono leading-relaxed border border-slate-800">
                      <span className="text-slate-400 block font-semibold mb-0.5">Physical File on Local Disk:</span>
                      <span className="text-emerald-400 break-all select-all">public/ims-mobile-v1.0-test.apk</span>
                    </div>

                    {/* Clarification Alert on Android Package Installer Error */}
                    <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-[11px] space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Why phones say "There's a problem with the app file"</span>
                      </div>
                      <p className="leading-relaxed text-[11px] text-slate-700 dark:text-slate-300">
                        Android's Package Installer strictly blocks APKs that were not compiled with Android SDK bytecode (DEX) and signed by a Java keystore.
                      </p>
                      <div className="pt-1 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-teal-700 dark:text-teal-300">
                          Recommended: Use the 1-Click WebAPK install tab $\to$
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveApkTab('pwa')}
                          className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] shadow-xs"
                        >
                          Switch to 1-Click Install
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">Included Test Modules in APK:</span>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Instant Attendance & Biometric scan simulation</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Fee Collection & Instant Digital Receipt generator</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Exam Marks & Recharts Grade Distribution analytics</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Faculty substitution & conflict alert resolution</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: 1-CLICK WEBAPK INSTALL */}
              {activeApkTab === 'pwa' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-teal-500/30 bg-teal-500/5 space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-500" />
                      <span>Android WebAPK & iOS Home App</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Android devices equipped with Google Play Services automatically convert and sign installable Progressive Web Apps into official native <strong>WebAPKs</strong> directly from your browser without needing to enable developer mode or sideloading!
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        showToast('To install: In Chrome/Safari, tap Share or 3 dots -> "Add to Home screen" / "Install app"');
                      }}
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Install IMS Mobile on Device</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-1">
                      <strong className="text-teal-600 dark:text-teal-400 block font-semibold">Android Chrome / Edge:</strong>
                      <ol className="list-decimal list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                        <li>Tap the three vertical dots (⋮)</li>
                        <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong></li>
                        <li>Play Services builds & installs the native APK</li>
                      </ol>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-1">
                      <strong className="text-teal-600 dark:text-teal-400 block font-semibold">Apple iOS Safari:</strong>
                      <ol className="list-decimal list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                        <li>Tap the Share icon at bottom</li>
                        <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                        <li>Opens as standalone native iOS app</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GITHUB ACTIONS CI/CD */}
              {activeApkTab === 'github' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      Automated Cloud APK Builder Workflow
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      We configured a pre-built GitHub Actions pipeline at <code className="font-mono text-teal-600 dark:text-teal-400">.github/workflows/build-apk.yml</code>. Whenever you push to your repository, GitHub's Ubuntu cloud runners automatically setup JDK 17, Android SDK, Gradle, and compile <code className="font-mono">app-debug.apk</code> directly into GitHub Artifacts!
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] space-y-1">
                      <div className="flex justify-between items-center text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                        <span>Terminal Commands</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cmd = 'git add .\ngit commit -m "Build test APK"\ngit push origin main';
                            navigator.clipboard?.writeText(cmd);
                            setCopiedCmd('git');
                            setTimeout(() => setCopiedCmd(null), 2000);
                            showToast('Copied git push commands!');
                          }}
                          className="hover:text-white flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCmd === 'git' ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="text-emerald-400">git add .</div>
                      <div className="text-emerald-400">git commit -m "Build test APK"</div>
                      <div className="text-emerald-400">git push origin main</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ANDROID STUDIO & CAPACITOR */}
              {activeApkTab === 'studio' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      Local Compilation via Capacitor & Android Studio
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      All Capacitor 6 configuration files (<code className="font-mono text-teal-600 dark:text-teal-400">capacitor.config.ts</code> and <code className="font-mono text-teal-600 dark:text-teal-400">android/app/src/main/AndroidManifest.xml</code>) are pre-configured in your workspace.
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] space-y-1">
                      <div className="flex justify-between items-center text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                        <span>Terminal Commands</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cmd = 'npm run build\nnpx cap sync android\nnpx cap open android';
                            navigator.clipboard?.writeText(cmd);
                            setCopiedCmd('cap');
                            setTimeout(() => setCopiedCmd(null), 2000);
                            showToast('Copied Capacitor commands!');
                          }}
                          className="hover:text-white flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCmd === 'cap' ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="text-slate-400"># 1. Build optimized web bundle</div>
                      <div className="text-emerald-400">npm run build</div>
                      <div className="text-slate-400 pt-1"># 2. Sync to Android project</div>
                      <div className="text-emerald-400">npx cap sync android</div>
                      <div className="text-slate-400 pt-1"># 3. Open in Android Studio & Compile APK</div>
                      <div className="text-emerald-400">npx cap open android</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-mono">App ID: com.ims.institute</span>
              <button
                type="button"
                onClick={() => setIsApkModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors font-medium text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xl border border-slate-700 animate-in fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
