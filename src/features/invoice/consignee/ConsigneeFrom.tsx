import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GenericForm } from "@/features/components/GenericFrom";
import { useConsigneeStore } from "@/store/consigneeStore";

export function ConsigneeForm() {
  const {
    selectedConsignee,
    setSelectedConsignee,
    addConsignee,
    updateConsignee,
  } = useConsigneeStore();

  const defaultConsignee = {
    consigneeName: "",
    consigneeCompanyName: "",
    email: "",
    contact: "",
    company: "",
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
  };

  return (
    <GenericForm
      apiBase="consignees"
      defaultValues={defaultConsignee}
      selectedItem={selectedConsignee}
      setSelectedItem={setSelectedConsignee}
      addItem={addConsignee}
      updateItem={updateConsignee}
      renderFields={(register) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                {...register("consigneeCompanyName", { required: true })}
              />
            </div>

            <div>
              <Label>Consignee Name</Label>
              <Input {...register("consigneeName")} />
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
              <Label>Address Line 3</Label>
              <Input {...register("address.add3")} />
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
        </>
      )}
    />
  );
}
