"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Upload } from 'lucide-react';
import { toast } from "sonner";
import Image from "next/image";

interface PhotoUploadSectionProps {
  section: "menu" | "gallery";
}

interface UploadedPhoto {
  id: string;
  filename: string;
  path: string;
  uploadedAt: string;
  type: "menu" | "gallery";
}

export default function PhotoUploadSection({
  section,
}: PhotoUploadSectionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Load existing photos
  useEffect(() => {
    loadPhotos();
  }, [section]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/adminCamioneros/photos?type=${section}`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error loading photos:", error);
      toast.error("Error cargando fotos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Selecciona al menos una imagen");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("type", section);

    try {
      const response = await fetch("/api/adminCamioneros/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success(`${files.length} imagen(es) subida(s) correctamente`);
        setFiles([]);
        // Reset file input
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        await loadPhotos();
      } else {
        toast.error("Error al subir las imágenes");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error en la subida");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      const response = await fetch(`/api/adminCamioneros/photos/${photoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Foto eliminada");
        setPhotos(photos.filter((p) => p.id !== photoId));
      } else {
        toast.error("Error al eliminar la foto");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error en la eliminación");
    }
  };

  const sectionTitle =
    section === "menu" ? "Fotos de la Carta" : "Fotos del Local";
  const sectionDescription =
    section === "menu"
      ? "Sube imágenes relacionadas con los platos y menú"
      : "Sube fotos de la galería del local";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{sectionTitle}</h2>
        <p className="text-muted-foreground">{sectionDescription}</p>
      </div>

      {/* Upload Card */}
      <Card className="p-8 border-2 border-dashed bg-slate-50">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Upload className="w-12 h-12 text-muted-foreground" />
          </div>

          <div>
            <label className="text-sm font-medium">
              Selecciona imágenes para subir
            </label>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="mt-2 w-full"
            />
            {files.length > 0 && (
              <p className="text-sm text-primary mt-2">
                {files.length} archivo(s) seleccionado(s)
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              size="lg"
              className="flex-1"
            >
              {uploading ? "Subiendo..." : "Subir Fotos"}
            </Button>
            {files.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setFiles([]);
                  const fileInput = document.getElementById(
                    "fileInput"
                  ) as HTMLInputElement;
                  if (fileInput) fileInput.value = "";
                }}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Photos Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Fotos Subidas</h3>

        {loading ? (
          <p className="text-muted-foreground">Cargando fotos...</p>
        ) : photos.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No hay fotos subidas aún
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative aspect-square bg-slate-100">
                  <Image
                    src={photo.path || "/placeholder.svg"}
                    alt={photo.filename}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium truncate">
                    {photo.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDelete(photo.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
