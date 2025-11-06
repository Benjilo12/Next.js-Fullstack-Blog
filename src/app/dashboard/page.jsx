// ==================== app/dashboard/page.jsx ====================
import { Suspense } from "react";
import DashboardContent from "./DashBoardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="md:w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>
      </div>
    </div>
  );
}
