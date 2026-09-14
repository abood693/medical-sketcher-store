import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function OwnerLogoutControl() {
  const { logout } = useAuth();
  const [, navigate] = useLocation();
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <Button
      onClick={() => void handleLogout()}
      variant="outline"
      className="fixed right-5 top-4 z-[90] rounded-full border-[#a0522d]/30 bg-[#ffffff] text-[#a0522d] shadow-lg hover:bg-[#fff4f0]"
    >
      <LogOut className="mr-2 size-4" />
      Log out
    </Button>
  );
}
