import { useNavigate } from "react-router-dom";
import { DesktopNav } from "./DesktopNav";

export const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="hidden md:block sticky top-0 bg-card border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <h1 
          className="text-xl font-bold cursor-pointer hover:scale-105 transition-transform"
          onClick={() => navigate("/")}
        >
          GardenPro
        </h1>
        <DesktopNav />
      </div>
    </header>
  );
};
