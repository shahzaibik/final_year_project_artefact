import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface AddManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ManagementFormData) => void;
  defaultValues?: ManagementFormData | null;
}

export interface ManagementFormData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  permissions?: string[];
}
// for adding or editing a management/admin user
const AddManagementModal: React.FC<AddManagementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = null,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm<ManagementFormData>();
// form when editing, reset when adding new
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) =>
        setValue(key as keyof ManagementFormData, value)
      );
    } else {
      reset(); // Clear the form for adding a new management entity
    }
  }, [defaultValues, setValue, reset]);
// handle form submission
  const handleFormSubmit: SubmitHandler<ManagementFormData> = (data) => {
    onSubmit({ ...data });
    reset(); // Reset the form fields
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white w-full text-primary max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Add Management</h2>
          <button className="text-white" onClick={onClose}>
            <span className="bg-primary px-2 py-1 rounded-md">x</span>
          </button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                {...register("name", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                {...register("phone")}
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Assign Permissions</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center">
                <input
                  {...register("permissions")}
                  type="checkbox"
                  value="Dashboard"
                  className="mr-2"
                />
                Dashboard
              </label>
              <label className="flex items-center">
                <input
                  {...register("permissions")}
                  type="checkbox"
                  value="Tenants"
                  className="mr-2"
                />
                Tenants
              </label>
              <label className="flex items-center">
                <input
                  {...register("permissions")}
                  type="checkbox"
                  value="Handyman"
                  className="mr-2"
                />
                Handyman
              </label>
              <label className="flex items-center">
                <input
                  {...register("permissions")}
                  type="checkbox"
                  value="Management"
                  className="mr-2"
                />
                Management
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddManagementModal;
