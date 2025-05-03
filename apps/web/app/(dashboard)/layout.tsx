import Navbar from "../../components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2 h-screen">
      <div className="border w-full h-full rounded-md">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
