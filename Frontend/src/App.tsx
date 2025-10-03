import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStickyTabs from "@/components/GlobalStickyTabs";
import Index from "./pages/Index";
import Track from "./pages/Track";
import TrackWhatsApp from "./pages/TrackWhatsApp";
import Serviceability from "./pages/Serviceability";
import LocationFinder from "./pages/LocationFinder";
import VolumetricCalculator from "./pages/VolumetricCalculator";
import ShippingRates from "./pages/ShippingRates";
import FuelSurcharge from "./pages/FuelSurcharge";
import RestrictedItems from "./pages/RestrictedItems";
import About from "./pages/About";
import Journey from "./pages/Journey";
import Vision from "./pages/Vision";
import GST from "./pages/GST";
import HSN from "./pages/HSN";
import Clients from "./pages/Clients";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SchedulePickup from "./pages/SchedulePickup";
import ViewBills from "./pages/ViewBills";
import Courier from "./pages/services/Courier";
import Logistics from "./pages/services/Logistics";
import OCLNews from "./pages/OCLNews";
import MyShipments from "./pages/MyShipments";
import CreditAccount from "./pages/CreditAccount";
import ContactOCL from "./pages/support/ContactOCL";
import WriteToUs from "./pages/support/WriteToUs";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import OfficeLogin from "./pages/office/OfficeLogin";
import OfficeDashboard from "./pages/office/OfficeDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalStickyTabs>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/track" element={<Track />} />
          <Route path="/track/whatsapp" element={<TrackWhatsApp />} />
          <Route path="/serviceability" element={<Serviceability />} />
          <Route path="/location" element={<LocationFinder />} />
          <Route path="/tools/volumetric" element={<VolumetricCalculator />} />
          <Route path="/rates" element={<ShippingRates />} />
          <Route path="/fuel" element={<FuelSurcharge />} />
          <Route path="/restricted" element={<RestrictedItems />} />
          <Route path="/about" element={<About />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/gst" element={<GST />} />
          <Route path="/hsn" element={<HSN />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/schedule-pickup" element={<SchedulePickup />} />
          <Route path="/bills" element={<ViewBills />} />
          <Route path="/services/courier" element={<Courier />} />
          <Route path="/services/logistics" element={<Logistics />} />
          <Route path="/news" element={<OCLNews />} />
          <Route path="/my-shipments" element={<MyShipments />} />
          <Route path="/credit-account" element={<CreditAccount />} />
          <Route path="/support/contact" element={<ContactOCL />} />
          <Route path="/support/write" element={<WriteToUs />} />
          
          {/* Office/Staff Portal Routes */}
          <Route path="/office" element={<OfficeLogin />} />
          <Route 
            path="/office/dashboard" 
            element={
              <ProtectedRoute>
                <OfficeDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Portal Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </GlobalStickyTabs>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
