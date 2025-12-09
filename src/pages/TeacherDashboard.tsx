import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassAnalytics from '@/components/teacher/ClassAnalytics';
import AssignmentManager from '@/components/teacher/AssignmentManager'; // <--- IMPORTED
import { GraduationCap, Users, FileText, BarChart3, Globe } from 'lucide-react';

const TeacherDashboard = () => {
  const { state } = useAppContext();
  const { currentUser, isLoading } = state;
  const navigate = useNavigate();

  // Redirect students away from teacher dashboard
  useEffect(() => {
    if (!isLoading && currentUser && currentUser.role !== 'teacher' && currentUser.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return <MainLayout><div className="p-12 text-center">Loading...</div></MainLayout>;
  }

  if (!currentUser || currentUser.role !== 'teacher') {
    return null;
  }

  return (
    <MainLayout>
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Manage your class, create assignments, and track progress.</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg text-blue-700 border border-blue-100">
            <GraduationCap className="h-5 w-5" />
            <span className="font-medium">Class 10-A</span>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-white border p-1 rounded-xl">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <BarChart3 className="w-4 h-4 mr-2"/> Analytics
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <FileText className="w-4 h-4 mr-2"/> Assignments
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              <Users className="w-4 h-4 mr-2"/> Students
            </TabsTrigger>
            <TabsTrigger value="nep-audit" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
              <Globe className="w-4 h-4 mr-2"/> NEP Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-0">
            <ClassAnalytics />
          </TabsContent>

          {/* === PLUG IN THE MANAGER === */}
          <TabsContent value="assignments" className="mt-0">
            <AssignmentManager />
          </TabsContent>

          <TabsContent value="students" className="mt-0">
            <div className="p-12 text-center border rounded-lg border-dashed bg-gray-50 text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Student roster management coming soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="nep-audit" className="mt-0">
            <div className="p-12 text-center border rounded-lg border-dashed bg-orange-50 text-orange-600">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="mb-4 font-semibold">NEP 2020 Auditor - Global Standards Evaluation</p>
              <button
                onClick={() => navigate('/nep-auditor')}
                className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
              >
                Open NEP Auditor
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;