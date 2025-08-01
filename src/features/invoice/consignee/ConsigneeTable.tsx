import { useConsigneeStore } from "@/store/consigneeStore";
import { useConsignees } from "@/hooks/useConsignees";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/features/components/GenericTable";
import TableCellViewer from "@/features/components/TableCellViewer";
import type { Consignee } from "@/lib/types";

export interface ColumnConfig<T> {
  label: string;
  accessor: keyof T | string;
  customCell?: (item: T) => React.ReactNode;
}

export default function ConsigneeTable() {
  useConsignees();
  const { consignees, setSelectedConsignee, removeConsignee } =
    useConsigneeStore();

  return (
    <GenericTable<Consignee>
      items={consignees}
      endpoint="consignees"
      itemName="consignee"
      getRowKey={(consignee) => consignee._id}
      setSelectedItem={setSelectedConsignee}
      removeItem={removeConsignee}
      columns={[
        {
          label: "Consignee Company",
          accessor: "consigneeCompanyName",
          customCell: (consignee: Consignee) => (
            <TableCellViewer
              item={consignee}
              title={consignee.consigneeCompanyName}
              description={consignee.consigneeName}
              trigger={
                <Button variant="link" className="p-0 text-left text-primary">
                  {consignee.consigneeCompanyName}
                </Button>
              }
              renderDetails={(consignee) => (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Email:</strong>
                    <div className="text-muted-foreground">
                      {consignee.email || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>Contact:</strong>
                    <div className="text-muted-foreground">
                      {consignee.contact || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>GST No:</strong>
                    <div className="text-muted-foreground">
                      {consignee.address?.gstNo || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>PAN No:</strong>
                    <div className="text-muted-foreground">
                      {consignee.address?.panNo || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>State Code:</strong>
                    <div className="text-muted-foreground">
                      {consignee.address?.stateCode || "-"}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <strong>Full Address:</strong>
                    <div className="text-muted-foreground">
                      {[
                        consignee.address?.add1,
                        consignee.address?.add2,
                        consignee.address?.add3,
                        consignee.address?.city,
                        consignee.address?.state,
                        consignee.address?.pinCode,
                        consignee.address?.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </div>
                  </div>
                </div>
              )}
            />
          ),
        },
        { label: "Consignee Name", accessor: "consigneeName" },
        { label: "GST No", accessor: "address.gstNo" },
        { label: "Email", accessor: "email" },
      ]}
    />
  );
}
