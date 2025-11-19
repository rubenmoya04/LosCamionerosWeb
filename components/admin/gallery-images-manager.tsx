"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Upload, Edit2, Check, X, Plus } from 'lucide-react';
import { toast } from "sonner";
import Image from "next/image";

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  description: string;
  badge: string;
}

const AVAILABLE_BADGES = ["Principal", "Popular", "Favorito"];

const BADGE_COLORS: Record<string, string> = {
  Principal: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
  Popular: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  Favorito: "bg-gradient-to-r from-red-500 to-orange-500 text-white",
};

export default function GalleryImagesManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({});

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/adminCamioneros/gallery");
      if (response.ok) {
        const data = await response.json();
        console.log("[v0] Gallery images loaded:", data);
        setImages(data);
      } else {
        toast.error("Error cargando galerías");
      }
    } catch (error) {
      console.error("Error loading gallery:", error);
      toast.error("Error al cargar galerías");
    } finally {
      setLoading(false);
    }
  };

  const startNewImage = () => {
    const newId = images.length > 0 ? Math.max(...images.map(i => i.id)) + 1 : 1;
    setEditingId(-1);
    setFormData({
      id: newId,
      src: "",
      title: "",
      description: "",
      badge: AVAILABLE_BADGES[0],
    });
  };

  const startEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setFormData({ ...image });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveImage = async () => {
    if (!formData.src || !formData.title) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    try {
      const response = await fetch("/api/adminCamioneros/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Foto guardada exitosamente");
        await loadImages();
        setEditingId(null);
        setFormData({});
      } else {
        toast.error("Error guardando foto");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      toast.error("Error al guardar");
    }
  };

  const deleteImage = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta foto?")) return;

    try {
      const response = await fetch(`/api/adminCamioneros/gallery/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Foto eliminada");
        await loadImages();
      } else {
        toast.error("Error eliminando foto");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error al eliminar");
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }

    setUploadingId(editingId === -1 ? 0 : editingId);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const response = await fetch("/api/adminCamioneros/upload-gallery-image", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, src: data.imagePath });
        toast.success("Imagen subida");
      } else {
        toast.error("Error subiendo imagen");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir imagen");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(editingId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Cargando fotos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Fotos del Local</h2>
          <p className="text-muted-foreground">
            Total: {images.length} fotos | Gestiona las fotos de la galería
          </p>
        </div>
        <Button
          onClick={startNewImage}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold h-12 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Añadir Foto
        </Button>
      </div>

      {images.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay fotos registradas</p>
          <Button onClick={startNewImage} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Subir primera foto
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {images.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {editingId === image.id ? (
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Título *</label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Ej: Los Camioneros Rubi"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Descripción</label>
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe la foto..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Etiqueta *</label>
                    <Select
                      value={formData.badge || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, badge: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una etiqueta" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_BADGES.map((badge) => (
                          <SelectItem key={badge} value={badge}>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${BADGE_COLORS[badge]}`}
                            >
                              {badge}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Imagen *</label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragOverId === image.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        id={`image-upload-${image.id}`}
                        disabled={uploadingId === image.id}
                      />
                      <label
                        htmlFor={`image-upload-${image.id}`}
                        className="cursor-pointer block"
                      >
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {uploadingId === image.id
                            ? "Subiendo..."
                            : "Arrastra una imagen o haz clic"}
                        </p>
                      </label>
                    </div>

                    {formData.src && (
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={formData.src || "/placeholder.svg"}
                          alt={formData.title || ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={saveImage}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${BADGE_COLORS[image.badge]}`}
                      >
                        {image.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {image.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {image.description}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => startEdit(image)}
                        variant="default"
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => deleteImage(image.id)}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}

          {editingId === -1 && (
            <Card className="overflow-hidden border-2 border-dashed border-green-300">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-green-700">Nueva Foto</h3>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Título *</label>
                  <Input
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ej: Los Camioneros Rubi"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Descripción</label>
                  <Textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe la foto..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Etiqueta *</label>
                  <Select
                    value={formData.badge || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, badge: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una etiqueta" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_BADGES.map((badge) => (
                        <SelectItem key={badge} value={badge}>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${BADGE_COLORS[badge]}`}
                          >
                            {badge}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Imagen *</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOverId === -1
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="image-upload-gallery-new"
                      disabled={uploadingId === 0}
                    />
                    <label
                      htmlFor="image-upload-gallery-new"
                      className="cursor-pointer block"
                    >
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {uploadingId === 0
                          ? "Subiendo..."
                          : "Arrastra una imagen o haz clic"}
                      </p>
                    </label>
                  </div>

                  {formData.src && (
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={formData.src || "/placeholder.svg"}
                        alt={formData.title || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={saveImage}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Crear Foto
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
