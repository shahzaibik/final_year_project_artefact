"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import APIRoutes from "@/constants/apiRoutes";
import { DEFAULT_AVATAR_URL } from "@/constants/assets";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTenant?: TenantFormData & { _id?: string }) => void;
  defaultValues?: TenantFormData | null;
}

export interface TenantFormData {
  id?: number | string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber: string;
  ssn?: string;
  address: string;
  profession: string;
  emergencyContact: string;
  photo?: string | null;
  agreement?: string | null;
  lastName?: string;
}

const PASSWORD_RULES = {
  regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  message:
    "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
};
// for adding or editing a tenant
const AddTenantModal: React.FC<AddTenantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = null,
}) => {
  // initialize react-hook-form

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TenantFormData>();
  // local state for image & agreement handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [clearProfileImage, setClearProfileImage] = useState(false);
  const [agreementFile, setAgreementFile] = useState<File | null>(null);
  const [clearAgreement, setClearAgreement] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(defaultValues && (defaultValues._id || defaultValues.id));
  const existingAgreementUrl = (defaultValues as { agreement?: string | null })?.agreement ?? null;
// Watch password for confirm validation
  const watchPassword = watch("password");

  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name);
      setValue("email", defaultValues.email);
      setValue("phoneNumber", defaultValues.phoneNumber || "");
      setValue("ssn", defaultValues.ssn || "");
      setValue("address", defaultValues.address || "");
      setValue("profession", defaultValues.profession || "");
      setValue("emergencyContact", defaultValues.emergencyContact || "");
      setValue("lastName", defaultValues.lastName || "");
      const existingPhoto = defaultValues.photo ?? (defaultValues as { profileImage?: string }).profileImage;
      if (existingPhoto) {
        setImagePreview(existingPhoto);
        setClearProfileImage(false);
      } else {
        setImagePreview(null);
        setClearProfileImage(false);
      }
      setAgreementFile(null);
      setClearAgreement(false);
    } else {
      reset();
      setImagePreview(null);
      setSelectedPhotoFile(null);
      setClearProfileImage(false);
      setAgreementFile(null);
      setClearAgreement(false);
    }
    setApiError(null);
  }, [defaultValues, setValue, reset, isOpen]);

  const handleFormSubmit: SubmitHandler<TenantFormData> = async (data) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      if (isEdit && (defaultValues?._id || defaultValues?.id)) {
        const id = defaultValues._id || defaultValues.id;
        let profileImagePayload: string | null | undefined = undefined;
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
        let agreementPayload: string | null | undefined = undefined;
        if (clearAgreement) agreementPayload = null;
        else if (agreementFile) {
          const agreementFormData = new FormData();
          agreementFormData.append("file", agreementFile);
          const uploadRes = await fetch(APIRoutes.AUTH_UPLOAD_AGREEMENT, {
            method: "POST",
            credentials: "include",
            body: agreementFormData,
          });
          if (!uploadRes.ok) {
            const uploadJson = await uploadRes.json().catch(() => ({}));
            setApiError(uploadJson.message || "Failed to upload agreement");
            return;
          }
          const uploadJson = await uploadRes.json();
          agreementPayload = uploadJson.agreementUrl ?? null;
        }
        // send PATCH request to update tenant
        const res = await fetch(`${APIRoutes.TENANTS}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            lastName: data.lastName || "",
            email: data.email,
            phoneNumber: data.phoneNumber || "",
            ssn: data.ssn || "",
            address: data.address || "",
            profession: data.profession || "",
            emergencyContact: data.emergencyContact || "",
            ...(profileImagePayload !== undefined && { profileImage: profileImagePayload }),
            ...(agreementPayload !== undefined && { agreement: agreementPayload }),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setApiError(json.message || "Failed to update tenant");
          return;
        }
        onSubmit();
        onClose();
        reset();
        setImagePreview(null);
        setSelectedPhotoFile(null);
        setClearProfileImage(false);
        setAgreementFile(null);
        setClearAgreement(false);
      } else {
        if (!data.password || !data.confirmPassword) {
          setApiError("Password and confirm password are required");
          return;
        }
        if (data.password !== data.confirmPassword) {
          setApiError("Passwords do not match");
          return;
        }
        if (!PASSWORD_RULES.regex.test(data.password)) {
          setApiError(PASSWORD_RULES.message);
          return;
        }
        // upload optional profile image
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
        // upload optional agreement
        let agreementUrl: string | null = null;
        if (agreementFile) {
          const agreementFormData = new FormData();
          agreementFormData.append("file", agreementFile);
          const uploadRes = await fetch(APIRoutes.AUTH_UPLOAD_AGREEMENT, {
            method: "POST",
            credentials: "include",
            body: agreementFormData,
          });
          if (!uploadRes.ok) {
            const uploadJson = await uploadRes.json().catch(() => ({}));
            setApiError(uploadJson.message || "Failed to upload agreement");
            return;
          }
          const uploadJson = await uploadRes.json();
          agreementUrl = uploadJson.agreementUrl ?? null;
        }
        // add new tenant
        const res = await fetch(APIRoutes.TENANTS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            lastName: data.lastName || "",
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            phoneNumber: data.phoneNumber || "",
            ssn: data.ssn || "",
            address: data.address || "",
            profession: data.profession || "",
            emergencyContact: data.emergencyContact || "",
            ...(profileImageUrl && { profileImage: profileImageUrl }),
            ...(agreementUrl && { agreement: agreementUrl }),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setApiError(json.message || "Failed to add tenant");
          return;
        }
        const created = json.tenant ? { ...json.tenant, name: json.tenant.name, email: json.tenant.email, phoneNumber: "", address: "", profession: "", emergencyContact: "", lastName: json.tenant.lastName || "" } : undefined;
        onSubmit(created);
        onClose();
        reset();
        setImagePreview(null);
        setSelectedPhotoFile(null);
        setAgreementFile(null);
        setClearAgreement(false);
      }
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleRemovePhoto = () => {
    setImagePreview(null);
    setSelectedPhotoFile(null);
    setClearProfileImage(true);
  };

  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setApiError("Only PDF files are allowed for the agreement.");
        return;
      }
      setAgreementFile(file);
      setClearAgreement(false);
      setApiError(null);
    } else {
      setAgreementFile(null);
    }
  };

  const handleRemoveAgreement = () => {
    setAgreementFile(null);
    setClearAgreement(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white w-full text-primary max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Tenant" : "Add Tenant"}</h2>
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
              {errors.name && <p className="text-red-500 text-xs mt-1">Required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Email *</label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">Required</p>}
            </div>

            {!isEdit && (
              <>
                <div>
                  <label className="block text-sm font-medium">Password *</label>
                  <input
                    {...register("password", {
                      required: !isEdit,
                      minLength: 8,
                      pattern: {
                        value: PASSWORD_RULES.regex,
                        message: PASSWORD_RULES.message,
                      },
                    })}
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="8+ chars, upper, lower, number, special"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message || (errors.password.type === "minLength" ? "Min 8 characters" : "Required")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Confirm Password *</label>
                  <input
                    {...register("confirmPassword", {
                      required: !isEdit,
                      validate: (v) => v === watchPassword || "Passwords do not match",
                    })}
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                {...register("phoneNumber")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">SSN</label>
              <input
                {...register("ssn")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div className="sm:col-span-2">
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
              <label className="block text-sm font-medium">Emergency Contact</label>
              <input
                {...register("emergencyContact")}
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
            <div>
              <label className="block text-sm font-medium">Upload Agreement (PDF only)</label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleAgreementChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {(agreementFile || (existingAgreementUrl && !clearAgreement)) && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {agreementFile ? agreementFile.name : "Current agreement attached"}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveAgreement}
                    className="text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Remove agreement
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg"
              onClick={onClose}
            >
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

export default AddTenantModal;
