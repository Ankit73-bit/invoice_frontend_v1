import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useClientStore, type Client } from "@/store/clientStore";
import { api } from "@/lib/api";
import { toast } from "react-toastify";

export default function ClientForm() {
  const { selectedClient, setSelectedClient, addClient, updateClient } =
    useClientStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Client>({
    defaultValues: {
      clientCompanyName: "",
      clientName: "",
      email: "",
      contact: "",
      address: {
        add1: "",
        add2: "",
        add3: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
        gstNo: "",
        panNo: "",
        stateCode: "",
      },
    },
  });

  useEffect(() => {
    if (selectedClient) reset(selectedClient);
  }, [selectedClient, reset]);

  const onSubmit = async (data: Client) => {
    try {
      if (selectedClient) {
        const res = await api.patch(`/clients/${selectedClient._id}`, data);
        updateClient(res.data.data);
        toast.success("Client updated!");
      } else {
        const res = await api.post("/clients", data);
        console.log(res.data.data);
        addClient(res.data.data);
        toast.success("Client created!");
      }
      reset();
      setSelectedClient(null);
    } catch (error) {
      toast.error("Failed to save client.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Company Name</Label>
          <Input {...register("clientCompanyName", { required: true })} />
        </div>

        <div>
          <Label>Client Name</Label>
          <Input {...register("clientName")} />
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
        </div>

        <div>
          <Label>Phone</Label>
          <Input {...register("contact")} />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-muted-foreground pt-4">
        Address
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Address Line 1</Label>
          <Input {...register("address.add1")} />
        </div>
        <div>
          <Label>Address Line 2</Label>
          <Input {...register("address.add2")} />
        </div>
        <div>
          <Label>City</Label>
          <Input {...register("address.city")} />
        </div>
        <div>
          <Label>State</Label>
          <Input {...register("address.state")} />
        </div>
        <div>
          <Label>Pin Code</Label>
          <Input {...register("address.pinCode")} />
        </div>
        <div>
          <Label>Country</Label>
          <Input {...register("address.country")} />
        </div>
        <div>
          <Label>GST No</Label>
          <Input {...register("address.gstNo")} />
        </div>
        <div>
          <Label>PAN No</Label>
          <Input {...register("address.panNo")} />
        </div>
        <div>
          <Label>State Code</Label>
          <Input {...register("address.stateCode")} />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit">
          {selectedClient ? "Update Client" : "Add Client"}
        </Button>
        {selectedClient && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setSelectedClient(null);
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
