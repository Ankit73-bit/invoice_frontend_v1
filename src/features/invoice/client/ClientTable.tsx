import { useClientStore } from "@/store/clientStore";
import { useClients } from "@/hooks/useClients";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/features/components/GenericTable";
import TableCellViewer from "@/features/components/TableCellViewer";
import type { Client } from "@/lib/types";

export interface ColumnConfig<T> {
  label: string;
  accessor: keyof T | string;
  customCell?: (item: T) => React.ReactNode;
}

export default function ClientTable() {
  useClients();
  const { clients, setSelectedClient, removeClient } = useClientStore();

  return (
    <GenericTable<Client>
      items={clients}
      endpoint="clients"
      itemName="client"
      getRowKey={(client) => client._id}
      setSelectedItem={setSelectedClient}
      removeItem={removeClient}
      columns={[
        {
          label: "Client Company",
          accessor: "clientCompanyName",
          customCell: (client: Client) => (
            <TableCellViewer
              item={client}
              title={client.clientCompanyName}
              description={client.clientName}
              trigger={
                <Button variant="link" className="p-0 text-left text-primary">
                  {client.clientCompanyName}
                </Button>
              }
              renderDetails={(client) => (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Email:</strong>
                    <div className="text-muted-foreground">
                      {client.email || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>Contact:</strong>
                    <div className="text-muted-foreground">
                      {client.contact || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>GST No:</strong>
                    <div className="text-muted-foreground">
                      {client.address?.gstNo || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>PAN No:</strong>
                    <div className="text-muted-foreground">
                      {client.address?.panNo || "-"}
                    </div>
                  </div>
                  <div>
                    <strong>State Code:</strong>
                    <div className="text-muted-foreground">
                      {client.address?.stateCode || "-"}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <strong>Full Address:</strong>
                    <div className="text-muted-foreground">
                      {[
                        client.address?.add1,
                        client.address?.add2,
                        client.address?.add3,
                        client.address?.city,
                        client.address?.state,
                        client.address?.pinCode,
                        client.address?.country,
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
        { label: "Client Name", accessor: "clientName" },
        { label: "GST No", accessor: "address.gstNo" },
        { label: "Email", accessor: "email" },
      ]}
    />
  );
}
