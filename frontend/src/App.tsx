import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/dashboard/Index";
import NotFound from "./pages/dashboard/NotFound";
import { Toaster } from "sileo";

// Coordinador Practicas

// Profesor
import Dashboard_profesor from "./pages/roles/profesor/Dashboard-profesor";
import Portfolio_profesor from "./pages/roles/profesor/Portfolio-profesor";
import ClinicalPractice_profesor from "./pages/roles/profesor/ClinicalPractice-profesor";
import Evaluations_profesor from "./pages/roles/profesor/Evaluations-profesor";
import AcademicProgress_profesor from "./pages/roles/profesor/AcademicProgress-profesor";
import Students_profesor from "./pages/roles/profesor/Students-profesor";
import Settings_profesor from "./pages/roles/profesor/Settings-profesor";

// Estudiante
import Dashboard_estudiante from "./pages/roles/estudiante/Dashboard-estudiante"; 
import Portfolio_estudiante from "./pages/roles/estudiante/Portfolio-estudiante";
import ClinicalPractice_estudiante from "./pages/roles/estudiante/ClinicalPractice-estudiante";
import Evaluations_estudiante from "./pages/roles/estudiante/Evaluations-estudiante";
import AcademicProgress_estudiante from "./pages/roles/estudiante/AcademicProgress-estudiante";
import Settings_estudiante from "./pages/roles/estudiante/Settings-estudiante";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>  
    <TooltipProvider>
      <Toaster
        position="top-center"
        options={{
          fill: "#171717",
          styles: { description: "text-white/75!"},
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Director Programa */}

          {/* Coordinador Practicas 
          <Route path="/coord-prac/dashboard" element={<Dashboard />} />
          <Route path="/coord-prac/portfolio" element={<Portfolio />} />
          <Route path="/coord-prac/clinical-practice" element={<ClinicalPractice />} />
          <Route path="/coord-prac/evaluations" element={<Evaluations />} />
          <Route path="/coord-prac/academic-progress" element={<AcademicProgress />} />
          <Route path="/coord-prac/settings" element={<Settings />} />*/}

          {/* Coordinador Curso */}
          {/* Profesor */}
          <Route path="/profesor/dashboard" element={<Dashboard_profesor />} />
          <Route path="/profesor/portfolio" element={<Portfolio_profesor />} />
          <Route path="/profesor/clinical-practice" element={<ClinicalPractice_profesor />} />
          <Route path="/profesor/evaluations" element={<Evaluations_profesor />} />
          <Route path="/profesor/academic-progress" element={<AcademicProgress_profesor />} />
          <Route path="/profesor/students" element={<Students_profesor />} />
          <Route path="/profesor/settings" element={<Settings_profesor />} />

          {/* Estudiante */}
          <Route path="/estudiante/dashboard" element={<Dashboard_estudiante />} />
          <Route path="/estudiante/portfolio" element={<Portfolio_estudiante />} />
          <Route path="/estudiante/clinical-practice" element={<ClinicalPractice_estudiante />} />
          <Route path="/estudiante/evaluations" element={<Evaluations_estudiante />} />
          <Route path="/estudiante/academic-progress" element={<AcademicProgress_estudiante />} />
          <Route path="/estudiante/settings" element={<Settings_estudiante />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
