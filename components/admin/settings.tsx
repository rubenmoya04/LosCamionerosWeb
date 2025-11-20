"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Upload, 
  Save, 
  Palette, 
  Clock, 
  Phone, 
  MapPin, 
  Globe, 
  Download, 
  Trash2,
  Building,
  Mail,
  Instagram,
  Facebook,
  Settings
} from "lucide-react";

// ... (las interfaces se mantienen igual)
interface GeneralSettings {
  restaurantName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  websiteUrl: string;
}

interface AppearanceSettings {
  logoUrl: string;
  primaryColor: string;
  heroTitle: string;
  heroDescription: string;
}

interface OpeningHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Estados para cada sección de configuración
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    restaurantName: "Los Camioneros Rubí",
    contactPhone: "+34 651 509 877",
    contactEmail: "hola@loscamionerosrubi.com",
    address: "Calle de la Buena Mesa, 123, 08191 Rubí, Barcelona",
    websiteUrl: "https://loscamionerosrubi.com",
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    logoUrl: "/logoCamioneros.svg",
    primaryColor: "#0f172a",
    heroTitle: "Te damos la bienvenida a Los Camioneros",
    heroDescription: "Un lugar delicioso para disfrutar cada día.",
  });

  const [openingHours, setOpeningHours] = useState<OpeningHours>({
    monday: { open: "12:00", close: "16:00", closed: false },
    tuesday: { open: "12:00", close: "16:00", closed: false },
    wednesday: { open: "12:00", close: "16:00", closed: false },
    thursday: { open: "12:00", close: "16:00", closed: false },
    friday: { open: "12:00", close: "23:00", closed: false },
    saturday: { open: "12:00", close: "23:00", closed: false },
    sunday: { open: "", close: "", closed: true },
  });

  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/loscamioneros",
    facebook: "https://facebook.com/loscamioneros",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- Handlers (sin cambios) ---
  const handleSaveGeneral = () => {
    console.log("Guardando Configuración General:", generalSettings);
    toast.success("Configuración general guardada correctamente.");
  };

  const handleSaveAppearance = () => {
    console.log("Guardando Apariencia:", appearanceSettings);
    toast.success("Apariencia guardada correctamente.");
  };

  const handleSaveHours = () => {
    console.log("Guardando Horario:", openingHours);
    toast.success("Horario de apertura guardado correctamente.");
  };

  const handleSaveSocial = () => {
    console.log("Guardando Redes Sociales:", socialLinks);
    toast.success("Redes sociales guardadas correctamente.");
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppearanceSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
        toast.success("Vista previa del logo actualizada.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    toast.info("Función de exportación de datos (próximamente).");
  };

  const handleClearCache = () => {
    if (confirm("¿Estás seguro de que quieres limpiar la caché del sitio?")) {
      toast.success("Caché limpiada correctamente.");
    }
  };
  
  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  return (
    <div className="space-y-6">
      {/* ... (Las tarjetas de General y Horario se mantienen igual) */}
      {/* Configuración General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Información General
          </CardTitle>
          <CardDescription>
            Gestiona la información básica de tu restaurante.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="restaurantName">Nombre del Restaurante</Label>
              <Input
                id="restaurantName"
                value={generalSettings.restaurantName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, restaurantName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
              <Input
                id="contactPhone"
                value={generalSettings.contactPhone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Email de Contacto</Label>
              <Input
                id="contactEmail"
                type="email"
                value={generalSettings.contactEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl">Sitio Web</Label>
              <Input
                id="websiteUrl"
                value={generalSettings.websiteUrl}
                onChange={(e) => setGeneralSettings({ ...generalSettings, websiteUrl: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={generalSettings.address}
              onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
            />
          </div>
          <Button onClick={handleSaveGeneral} className="mt-4">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </CardContent>
      </Card>

      {/* Apariencia - SECCIÓN MODIFICADA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Apariencia del Sitio
          </CardTitle>
          <CardDescription>
            Personaliza el aspecto visual de tu página web.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Logo del Restaurante</Label>
            <div className="flex items-center gap-4 mt-2">
              {/* La imagen se renderiza condicionalmente para evitar el error */}
              {isMounted && (
                <img 
                  src={appearanceSettings.logoUrl} 
                  alt="Logo" 
                  className="w-20 h-20 object-contain border rounded-lg p-2"
                  suppressHydrationWarning // Añadido como medida de seguridad
                />
              )}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Nuevo Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Formato recomendado: SVG o PNG transparente.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">Color Principal</Label>
              <div className="flex gap-2 mt-2">
                {/* 
                  ESTRATEGIA CLAVE:
                  - En el servidor, renderiza un div que simula el input de color.
                  - En el cliente (cuando isMounted es true), renderiza el input real.
                  Esto evita la discrepancia de HTML.
                */}
                {isMounted ? (
                  <>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                      placeholder="#000000"
                    />
                  </>
                ) : (
                  <>
                    <div 
                      className="w-20 h-10 p-1 border rounded-md cursor-pointer" 
                      style={{ backgroundColor: appearanceSettings.primaryColor }}
                    />
                    <Input
                      value={appearanceSettings.primaryColor}
                      disabled // Se deshabilita en el servidor para evitar interacciones
                      placeholder="#000000"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="heroTitle">Título Principal (Página de Inicio)</Label>
            <Input
              id="heroTitle"
              value={appearanceSettings.heroTitle}
              onChange={(e) => setAppearanceSettings({ ...appearanceSettings, heroTitle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="heroDescription">Descripción Principal (Página de Inicio)</Label>
            <Textarea
              id="heroDescription"
              value={appearanceSettings.heroDescription}
              onChange={(e) => setAppearanceSettings({ ...appearanceSettings, heroDescription: e.target.value })}
              rows={3}
            />
          </div>
          <Button onClick={handleSaveAppearance} className="mt-4">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </CardContent>
      </Card>

      {/* ... (El resto de las tarjetas se mantienen igual) */}
      {/* Horario de Apertura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horario de Apertura
          </CardTitle>
          <CardDescription>
            Define tus horas de atención al público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {daysOfWeek.map(({ key, label }) => {
              const dayHours = openingHours[key as keyof OpeningHours];
              return (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2">
                  <Label className="font-medium">{label}</Label>
                  <Input
                    type="time"
                    value={dayHours.open}
                    onChange={(e) => setOpeningHours({ ...openingHours, [key]: { ...dayHours, open: e.target.value } })}
                    disabled={dayHours.closed}
                  />
                  <Input
                    type="time"
                    value={dayHours.close}
                    onChange={(e) => setOpeningHours({ ...openingHours, [key]: { ...dayHours, close: e.target.value } })}
                    disabled={dayHours.closed}
                  />
                  <Button
                    variant={dayHours.closed ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOpeningHours({ ...openingHours, [key]: { ...dayHours, closed: !dayHours.closed } })}
                  >
                    {dayHours.closed ? "Abierto" : "Cerrado"}
                  </Button>
                </div>
              );
            })}
          </div>
          <Button onClick={handleSaveHours} className="mt-4">
            <Save className="w-4 h-4 mr-2" />
            Guardar Horario
          </Button>
        </CardContent>
      </Card>

      {/* Redes Sociales y Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Redes Sociales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
              />
            </div>
            <Button onClick={handleSaveSocial} className="w-full mt-4">
              <Save className="w-4 h-4 mr-2" />
              Guardar Redes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Aquí puedes realizar acciones de mantenimiento del sistema.
            </p>
            <Button variant="outline" onClick={handleExportData} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Exportar Todos los Datos
            </Button>
            <Button variant="destructive" onClick={handleClearCache} className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar Caché del Sitio
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
