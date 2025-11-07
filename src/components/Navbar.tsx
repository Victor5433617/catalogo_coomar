import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import logoCoomar from "@/assets/logo-coomar.png";

const Navbar = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={logoCoomar} alt="Cooperativa Mar Internacional" className="h-14 w-auto" />
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;