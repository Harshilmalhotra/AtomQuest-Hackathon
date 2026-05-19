"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminClient({ initialUsers, managers }: { initialUsers: any[], managers: any[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpdate = async (userId: string, updates: any) => {
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u.id === userId ? { ...u, ...updates, manager: managers.find(m => m.id === updates.managerId) || null } : u));
        router.refresh();
      } else {
        alert("Failed to update user");
      }
    } catch (e) {
      alert("Error updating user");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Reporting Manager</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-slate-900">{user.name || "Unnamed User"}</div>
                </td>
                <td className="p-4 text-slate-500">{user.email}</td>
                <td className="p-4">
                  <select
                    className="p-2 bg-white border border-slate-300 rounded-lg text-sm"
                    value={user.role}
                    onChange={(e) => handleUpdate(user.id, { role: e.target.value })}
                    disabled={loadingId === user.id}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <select
                    className="p-2 bg-white border border-slate-300 rounded-lg text-sm max-w-[200px]"
                    value={user.managerId || ""}
                    onChange={(e) => handleUpdate(user.id, { managerId: e.target.value || null })}
                    disabled={loadingId === user.id || user.role === "ADMIN"}
                  >
                    <option value="">-- Unassigned --</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id} disabled={m.id === user.id}>
                        {m.name || m.email}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-sm text-slate-400">
                  {loadingId === user.id ? "Saving..." : "Auto-saves"}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
