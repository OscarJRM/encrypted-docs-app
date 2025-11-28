"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Users, Plus } from "lucide-react";
import { useUsers } from "@/features/admin/dashboard/presentation/views/users/hooks/useUsers";
import { UsersTable, UserDialog,
  PermissionsInfo, } from "@/features/admin/dashboard/presentation/views/users/components";

export default function UsersPage() {
  const {
    users,
    dialogOpen,
    setDialogOpen,
    editingUser,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    openNewDialog,
    openEditDialog,
    saveUser,
    deleteUser,
    toggleActive,
  } = useUsers();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[color:var(--palette-primary)]/10">
            <Users className="size-6 text-[color:var(--palette-primary)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              Gestión de Usuarios
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Administrar usuarios y permisos del sistema
            </p>
          </div>
        </div>
        <Button
          onClick={openNewDialog}
          className="gap-2 bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-[color:var(--bg-dark)]"
        >
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card className="border-border/70 bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle style={{ color: "var(--text)" }}>
              Usuarios del Sistema
            </CardTitle>
            <CardDescription style={{ color: "var(--text-muted)" }}>
              Total: {users.length} usuarios registrados
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            onEdit={openEditDialog}
            onDelete={deleteUser}
            onToggleActive={toggleActive}
          />
          <PermissionsInfo />
        </CardContent>
      </Card>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSave={saveUser}
      />
    </div>
  );
}