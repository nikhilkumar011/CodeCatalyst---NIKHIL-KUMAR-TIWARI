import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <Sidebar />
      <main className="ml-[260px] min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}