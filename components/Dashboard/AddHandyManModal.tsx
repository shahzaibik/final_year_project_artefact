"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import APIRoutes from "@/constants/apiRoutes";
import { DEFAULT_AVATAR_URL } from "@/constants/assets";

interface AddHandyManModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  defaultValues?: HandyManFormData | null;
}

export interface HandyManFormData {
  id?: number | string;
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  ssn?: string;
  address: string;
  profession: string;
  emergencyContact?: string;
  photo?: string | null;
  agreement?: string | null;
}
// for adding or editing a handyman
const AddHandyManModal: React.FC<AddHandyManModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = null,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm<HandyManFormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [clearProfileImage, setClearProfileImage] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(defaultValues && (defaultValues._id || defaultValues.id));
//  form when editing an handyman
  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name);
      setValue("email", defaultValues.email);
      setValue("phoneNumber", defaultValues.phoneNumber || "");
      setValue("address", defaultValues.address || "");
      setValue("profession", defaultValues.profession || "");
      setValue("emergencyContact", defaultValues.emergencyContact || "");
      const existingPhoto = defaultValues.photo ?? (defaultValues as { profileImage?: string }).profileImage;
      if (existingPhoto) {
        setImagePreview(existingPhoto);
        setClearProfileImage(false);
      } else {
        setImagePreview(null);
        setClearProfileImage(false);
      }
    } else {
      reset();
      setImagePreview(null);
      setSelectedPhotoFile(null);
      setClearProfileImage(false);
    }
    setApiError(null);
  }, [defaultValues, setValue, reset, isOpen]);
 // add/update submission
  const handleFormSubmit: SubmitHandler<HandyManFormData> = async (data) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      if (isEdit && (defaultValues?._id || defaultValues?.id)) {
        const id = defaultValues._id || defaultValues.id;
        let profileImagePayload: string | null | undefined = undefined;
        // to check image behavior clear, upload new, or keep existing
        if (clearProfileImage) {
          profileImagePayload = null;
        } else if (selectedPhotoFile) {
          const formData = new FormData();
          formData.append("file", selectedPhotoFile);
          const uploadRes = await fetch(APIRoutes.AUTH_UPLOAD_PROFILE_IMAGE, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
          if (!uploadRes.ok) {
            const uploadJson = await uploadRes.json().catch(() => ({}));
            setApiError(uploadJson.message || "Failed to upload photo");
            return;
          }
          const uploadJson = await uploadRes.json();
          profileImagePayload = uploadJson.profileImageUrl ?? null;
        }
        // update existing handyman
        const res = await fetch(`${APIRoutes.HANDYMEN}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            profession: data.profession || "",
            ...(profileImagePayload !== undefined && { profileImage: profileImagePayload }),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setApiError(json.message || "Failed to update handyman");
          return;
        }
        onSubmit();
        onClose();
        reset();
        setSelectedPhotoFile(null);
        setClearProfileImage(false);
      } else {
        // add new handyman
        let profileImageUrl: string | null = null;
        if (selectedPhotoFile) {
          const formData = new FormData();
          formData.append("file", selectedPhotoFile);
          const uploadRes = await fetch(APIRoutes.AUTH_UPLOAD_PROFILE_IMAGE, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
          if (!uploadRes.ok) {
            const uploadJson = await uploadRes.json().catch(() => ({}));
            setApiError(uploadJson.message || "Failed to upload photo");
            return;
          }
          const uploadJson = await uploadRes.json();
          profileImageUrl = uploadJson.profileImageUrl ?? null;
        }
        const res = await fetch(APIRoutes.HANDYMEN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            profession: data.profession || "",
            ...(profileImageUrl && { profileImage: profileImageUrl }),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setApiError(json.message || "Failed to add handyman");
          return;
        }
        onSubmit();
        onClose();
        reset();
        setSelectedPhotoFile(null);
      }
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
// to handle image selectionand preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhotoFile(file);
      setClearProfileImage(false);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedPhotoFile(null);
    }
  };
// to remove current image for edit mode
  const handleRemovePhoto = () => {
    setImagePreview(null);
    setSelectedPhotoFile(null);
    setClearProfileImage(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white w-full text-primary max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Handyman" : "Add Handyman"}</h2>
          <button type="button" className="text-white" onClick={onClose}>
            <span className="bg-primary px-2 py-1 rounded-md">×</span>
          </button>
        </div>

        {apiError && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{apiError}</p>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name *</label>
              <input
                {...register("name", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email *</label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                {...register("phoneNumber")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                {...register("address")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Profession</label>
              <input
                {...register("profession")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={imagePreview ?? DEFAULT_AVATAR_URL}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-full"
                />
                {(imagePreview || isEdit) && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHandyManModal;
