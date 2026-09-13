import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { LogOut } from "lucide-react";

export default function OwnerLogoutControl() {
  const { isAuthenticated, loading, logout } = useAuth();
  if (loading || !isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    window.location.assign("/");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="fixed right-5 top-4 z-[90] rounded-full border-[#8d4133]/30 bg-[#ffffff] text-[#8d4133] shadow-lg hover:bg-[#fff4f0]"
    >
      <LogOut className="mr-2 size-4" />
      Log out
    </Button>
  );
}
