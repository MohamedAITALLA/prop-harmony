
import { Building } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarHeader as Header, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const SidebarHeader = () => {
  return (
    <Header className="px-4 py-3 border-b flex items-center justify-between">
      <motion.div 
        className="flex items-center space-x-2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Building className="h-6 w-6 text-primary" />
        <span className="font-semibold text-xl">PropertySync</span>
      </motion.div>
      <SidebarTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SidebarTrigger>
    </Header>
  );
};
