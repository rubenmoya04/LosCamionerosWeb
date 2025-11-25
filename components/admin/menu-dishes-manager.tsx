"use client";

import { useState, useEffect, useRef } from "react";
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
import { useRouter } from "next/navigation";

interface Dish {
  id: number;
  name: string;
  description: string;
  image: string;
  badge: string;
}

const AVAILABLE_BADGES = [
  "Más vendido",
  "Especialidad",
  "Tradicional",
  "Premium",
  "Postre",
  "Tapas",
];

const BADGE_COLORS: Record<string, string> = {
  "Más vendido": "bg-gradient-to-r from-red-500 to-orange-500 text-white",
  Especialidad: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  Tradicional: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
  Premium: "bg-gradient-to-r from-gray-800 to-gray-900 text-white",
  Postre: "bg-gradient-to-r from-pink-400 to-rose-400 text-white",
  Tapas: "bg-gradient-to-r from-lime-600 via-emerald-600 to-green-700 text-white shadow-md shadow-lime-800/30",
};

function DishModal({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  saveDish, 
  isNewDish, 
  uploadingId, 
  handleImageUpload, 
  handleDragOver, 
  handleDragLeave, 
  handleDrop, 
  dragOverId,
  idEditMode,
  tempId,
  setTempId,
  startIdEdit,
  validateAndUpdateId,
  setIdEditMode
}: {
  isOpen: boolean;
  onClose: () => void;
  formData: Partial<Dish>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Dish>>>;
  saveDish: () => void;
  isNewDish: boolean;
  uploadingId: number | null;
  handleImageUpload: (file: File, dishId: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  dragOverId: number | null;
  idEditMode: number | null;
  tempId: string;
  setTempId: React.Dispatch<React.SetStateAction<string>>;
  startIdEdit: (currentId: number) => void;
  validateAndUpdateId: () => void;
  setIdEditMode: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {isNewDish ? "Añadir Nuevo Plato" : "Editar Plato"}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* ID */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">ID</label>
            <div className="flex gap-2">
              {idEditMode === (formData.id || 0) ? (
                <>
                  <Input
                    type="number"
                    value={tempId}
                    onChange={(e) => setTempId(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={validateAndUpdateId} className="bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIdEditMode(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Input type="number" value={formData.id || ""} disabled={isNewDish} className="flex-1 bg-slate-100" />
                  {!isNewDish && (
                    <Button size="sm" variant="outline" onClick={() => startIdEdit(formData.id || 0)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Resto del formulario (igual que tenías) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Nombre del Plato *</label>
            <Input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Pincho camionero" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Descripción *</label>
            <Textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe el plato..." rows={4} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Etiqueta *</label>
            <Select value={formData.badge || ""} onValueChange={(value) => setFormData({ ...formData, badge: value })}>
              <SelectTrigger><SelectValue placeholder="Selecciona una etiqueta" /></SelectTrigger>
              <SelectContent>
                {AVAILABLE_BADGES.map((badge) => (
                  <SelectItem key={badge} value={badge}>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${BADGE_COLORS[badge]}`}>{badge}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Imagen con drag & drop */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Imagen *</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOverId === (isNewDish ? -1 : formData.id) ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], isNewDish ? 0 : (formData.id || 0))}
                className="hidden"
                id={`image-upload-${isNewDish ? 'new' : formData.id}`}
                disabled={uploadingId === (isNewDish ? 0 : formData.id)}
              />
              <label htmlFor={`image-upload-${isNewDish ? 'new' : formData.id}`} className="cursor-pointer block">
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {uploadingId === (isNewDish ? 0 : formData.id) ? "Subiendo..." : "Arrastra una imagen o haz clic"}
                </p>
              </label>
            </div>

            {formData.image && (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image src={formData.image} alt={formData.name || ""} fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={saveDish} className={`flex-1 ${isNewDish ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}>
              <Check className="w-4 h-4 mr-2" />
              {isNewDish ? "Crear Plato" : "Guardar Cambios"}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenuDishesManager() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [idEditMode, setIdEditMode] = useState<number | null>(null);
  const [tempId, setTempId] = useState<string>("");
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Dish>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/adminCamioneros/dishes", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setDishes(Array.isArray(data) ? data : data.dishes || []);
      } else {
        toast.error("Error cargando platos");
      }
    } catch (error) {
      toast.error("Error al cargar platos");
    } finally {
      setLoading(false);
    }
  };

  const startNewDish = () => {
    const newId = dishes.length > 0 ? Math.max(...dishes.map(d => d.id)) + 1 : 1;
    setEditingId(-1);
    setFormData({ id: newId, name: "", description: "", image: "", badge: AVAILABLE_BADGES[0] });
    setIsModalOpen(true);
  };

  const startEdit = (dish: Dish) => {
    setEditingId(dish.id);
    setFormData({ ...dish });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({});
    setIdEditMode(null);
  };

  const startIdEdit = (currentId: number) => {
    setIdEditMode(currentId);
    setTempId(currentId.toString());
  };

  const validateAndUpdateId = async () => {
    const newId = parseInt(tempId);
    if (isNaN(newId)) return toast.error("ID debe ser un número");
    if (newId === formData.id) return setIdEditMode(null);
    if (dishes.some(d => d.id === newId && d.id !== editingId)) return toast.error("Este ID ya existe");
    setFormData({ ...formData, id: newId });
    setIdEditMode(null);
    toast.success("ID actualizado");
  };

  const saveDish = async () => {
    if (!formData.name || !formData.description || !formData.image || !formData.badge) {
      return toast.error("Completa todos los campos requeridos");
    }

    try {
      const isNewDish = editingId === -1;
      const action = isNewDish ? "add" : "update";
      const dishData = { ...formData, id: Number(formData.id) };

      const response = await fetch("/api/adminCamioneros/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dish: dishData, action }),
      });

      if (response.ok) {
        toast.success(isNewDish ? "Plato creado" : "Plato actualizado");
        await loadDishes();
        router.refresh(); // Extra seguro
        closeModal();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error al guardar plato");
    }
  };

const deleteDish = async (id: number) => {
  if (!confirm("¿Seguro que quieres eliminar este plato?")) return;

  try {
    const res = await fetch(`/api/adminCamioneros/dishes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      // EN LOCAL: borramos directamente del estado (aunque no se guarde en KV)
      setDishes(prev => prev.filter(dish => dish.id !== id));
      
      toast.success(
        process.env.NODE_ENV === "development" 
          ? "Plato eliminado (solo en local, se pierde al recargar)" 
          : "Plato eliminado permanentemente"
      );
    } else {
      const err = await res.json();
      toast.error(err.error || "Error al eliminar");
    }
  } catch (err) {
    toast.error("Error de conexión");
  }
};

  const handleImageUpload = async (file: File, dishId: number) => {
    if (!file.type.startsWith("image/")) return toast.error("Solo se permiten imágenes");
    setUploadingId(dishId);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("dishId", dishId.toString());

    try {
      const response = await fetch("/api/adminCamioneros/upload-dish-image", {
        method: "POST",
        body: uploadFormData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, image: data.imagePath });
        toast.success("Imagen subida");
      } else {
        toast.error("Error subiendo imagen");
      }
    } catch (error) {
      toast.error("Error al subir imagen");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOverId(editingId); };
  const handleDragLeave = () => setDragOverId(null);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(null);
    const files = e.dataTransfer.files;
    if (files.length > 0 && editingId) {
      handleImageUpload(files[0], editingId === -1 ? 0 : editingId);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><p className="text-muted-foreground">Cargando platos...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Gestor de Platos</h2>
          <p className="text-muted-foreground">Total: {dishes.length} platos</p>
        </div>
        <Button onClick={startNewDish} className="bg-gradient-to-r from-[#486399] to-[#1A202C] hover:from-[#2e384c] hover:to-[#486399] text-white font-bold h-12 px-6 hover:scale-102 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" />
          Añadir Plato
        </Button>
      </div>

      {dishes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay platos registrados</p>
          <Button onClick={startNewDish} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Crear primer plato
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <Image src={dish.image || "/placeholder.svg"} alt={dish.name} fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${BADGE_COLORS[dish.badge] || "bg-gray-500"}`}>
                    {dish.badge}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">ID: {dish.id}</p>
                  <h3 className="text-lg font-bold text-gray-900">{dish.name}</h3>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{dish.description}</p>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => startEdit(dish)} variant="default" size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Edit2 className="w-4 h-4 mr-2" /> Editar
                  </Button>
                  <Button onClick={() => deleteDish(dish.id)} variant="destructive" size="sm" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <DishModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        setFormData={setFormData}
        saveDish={saveDish}
        isNewDish={editingId === -1}
        uploadingId={uploadingId}
        handleImageUpload={handleImageUpload}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        dragOverId={dragOverId}
        idEditMode={idEditMode}
        tempId={tempId}
        setTempId={setTempId}
        startIdEdit={startIdEdit}
        validateAndUpdateId={validateAndUpdateId}
        setIdEditMode={setIdEditMode}
      />
    </div>
  );
}