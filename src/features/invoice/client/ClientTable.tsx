import { useClientStore } from "@/store/clientStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ClientTable() {
  const { clients, setSelectedClient, removeClient } = useClientStore();

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/clients/${id}`);
      removeClient(id);
      toast.success("Client deleted.");
    } catch (error) {
      toast.error("Failed to delete client.");
      console.error(error);
    }
  };

  if (!clients.length) {
    return <p className="text-muted-foreground text-sm">No clients found.</p>;
  }

  return (
    <ScrollArea className="rounded-md border mt-6">
      <table className="w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Company</th>
            <th className="px-4 py-2 text-left">Contact</th>
            <th className="px-4 py-2 text-left">GST No</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id} className="border-b hover:bg-accent">
              <td className="px-4 py-2">{client.clientCompanyName}</td>
              <td className="px-4 py-2">{client.contact || "-"}</td>
              <td className="px-4 py-2">{client.address?.gstNo || "-"}</td>
              <td className="px-4 py-2 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedClient(client)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(client._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
