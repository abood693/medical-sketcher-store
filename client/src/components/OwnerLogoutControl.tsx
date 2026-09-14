import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function OwnerLogoutControl() {
  const handleLogout = () => {
    // Logout logic here
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="fixed right-5 top-4 z-[90] rounded-full border-[#a0522d]/30 bg-[#ffffff] text-[#a0522d] shadow-lg hover:bg-[#fff4f0]"
    >
      <LogOut className="mr-2 size-4" />
      Log out
    </Button>
  );
}
