"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Shield, 
  Plus,
  AlertTriangle,
  Loader2,
  Eye
} from "lucide-react";
import { roleAPI } from "@/services/api";

interface Role {
  name: string;
  permissions: string[];
}

interface Permission {
  name: string;
  value: string;
}

// Permission labels for display
const PERMISSION_LABELS: Record<string, string> = {
  'view_vehicles': 'View Vehicles',
  'create_vehicle': 'Create Vehicle',
  'edit_vehicle': 'Edit Vehicle', 
  'delete_vehicle': 'Delete Vehicle',
  'feature_vehicle': 'Feature Vehicle',
  'view_users': 'View Users',
  'create_user': 'Create User',
  'edit_user': 'Edit User',
  'delete_user': 'Delete User',
  'view_dashboard': 'View Dashboard',
  'view_statistics': 'View Statistics',
  'manage_settings': 'Manage Settings'
};

export default function RolesManagementPage() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [rolesResponse, permissionsResponse] = await Promise.all([
          roleAPI.getRoles(),
          roleAPI.getPermissions()
        ]);
        
        setRoles(rolesResponse.data);
        setAllPermissions(permissionsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setErrorMessage("Failed to load roles data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getRoleDescription = (roleName: string): string => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'Full system access with all permissions';
      case 'manager':
        return 'Can manage vehicles and view users with limited settings access';
      case 'editor':
        return 'Can create and edit vehicles with dashboard access';
      case 'user':
        return 'Basic access with view-only permissions';
      default:
        return 'Custom role with specific permissions';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user roles and their permissions
          </p>
        </div>
        <Link
          href="/admin/dashboard/users"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Users className="mr-2 h-4 w-4" />
          Back to Users
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Roles</h2>
          <p className="mt-1 text-sm text-gray-500">
            These are the predefined roles in the system with their associated permissions.
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {roles.map((role) => (
            <div key={role.name} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getRoleDescription(role.name)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {role.permissions.length} permissions assigned
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 ml-14">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {PERMISSION_LABELS[permission] || permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {roles.length === 0 && (
          <div className="p-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No roles are currently defined in the system.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              About Role Management
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Roles define sets of permissions that can be assigned to users. The system comes with predefined roles:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Admin:</strong> Complete system access</li>
                <li><strong>Manager:</strong> Can manage vehicles and view users</li>
                <li><strong>Editor:</strong> Can create and edit content</li>
                <li><strong>User:</strong> Basic view-only access</li>
              </ul>
              <p className="mt-2">
                You can assign these roles to users and optionally customize their permissions on a per-user basis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 