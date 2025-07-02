import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "react-toastify";

interface GenericFormProps<T> {
  apiBase: string; // e.g., "clients" or "consignees"
  defaultValues: T;
  selectedItem: T | null;
  setSelectedItem: (val: T | null) => void;
  addItem: (val: T) => void;
  updateItem: (val: T) => void;
  renderFields: (
    register: ReturnType<typeof useForm>["register"],
    errors: unknown
  ) => React.ReactNode;
}

export function GenericForm<T extends { _id?: string }>({
  apiBase,
  defaultValues,
  selectedItem,
  setSelectedItem,
  addItem,
  updateItem,
  renderFields,
}: GenericFormProps<T>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({ defaultValues });

  useEffect(() => {
    if (selectedItem) {
      reset(selectedItem);
    } else {
      reset(defaultValues);
    }
  }, [selectedItem, reset, defaultValues]);

  const onSubmit = async (data: T) => {
    try {
      if (selectedItem?._id) {
        const res = await api.patch(`/${apiBase}/${selectedItem._id}`, data);
        updateItem(res.data.data);
        toast.success("Updated successfully");
      } else {
        const res = await api.post(`/${apiBase}`, data);
        addItem(res.data.data);
        toast.success("Created successfully");
      }
      reset(defaultValues);
      setSelectedItem(null);
    } catch (error) {
      toast.error("Failed to submit");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {renderFields(register, errors)}

      <div className="flex gap-2">
        <Button type="submit">{selectedItem ? "Update" : "Create"}</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset(defaultValues);
            setSelectedItem(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
