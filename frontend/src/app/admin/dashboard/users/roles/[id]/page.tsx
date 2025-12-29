"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Check, 
  X,
  Shield,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { userAPI, roleAPI } from "@/services/api";

// Define permission and role types based on backend
interface Permission {
  name: string;
  value: string;
}

interface Role {
  name: string;
  permissions: string[];
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  isActive: boolean;
}

// Permission categories for better organization
const PERMISSION_CATEGORIES = {
  'Vehicle Management': [
    'view_vehicles',
    'create_vehicle', 
    'edit_vehicle',
    'delete_vehicle',
    'feature_vehicle'
  ],
  'User Management': [
    'view_users',
    'create_user',
    'edit_user', 
    'delete_user'
  ],
  'Dashboard & Reports': [
    'view_dashboard',
    'view_statistics'
  ],
  'Settings': [
    'manage_settings'
  ]
};

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

export default function ManageUserRolesPage() {
  const params = useParams();
  const router = useRouter();
  const userId = (params?.id ?? '') as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);
  const [hasCustomPermissions, setHasCustomPermissions] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user and roles data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch roles and permissions in parallel
        const [rolesResponse, permissionsResponse, userResponse] = await Promise.all([
          roleAPI.getRoles(),
          roleAPI.getPermissions(),
          userAPI.getUserPermissions(userId)
        ]);
        
        setRoles(rolesResponse.data);
        setAllPermissions(permissionsResponse.data);
        
        const userData = userResponse.data.user;
        if (!userData) {
          setErrorMessage("User not found");
          setLoading(false);
          return;
        }
        
        setUser(userData);
        setSelectedRole(userData.role);
        setCustomPermissions(userData.permissions || []);
        
        // Check if user has custom permissions that don't match their role
        const rolePermissions = rolesResponse.data.find((r: Role) => r.name.toLowerCase() === userData.role.toLowerCase())?.permissions || [];
        setHasCustomPermissions(!arraysEqual(userData.permissions || [], rolePermissions));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load user data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  // Helper function to compare arrays
  const arraysEqual = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, index) => val === sorted2[index]);
  };

  // Handle role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    
    // Update permissions based on the selected role if not using custom permissions
    if (!hasCustomPermissions) {
      const rolePermissions = roles.find(r => r.name.toLowerCase() === newRole.toLowerCase())?.permissions || [];
      setCustomPermissions([...rolePermissions]);
    }
  };

  // Toggle custom permissions mode
  const toggleCustomPermissions = () => {
    const newState = !hasCustomPermissions;
    setHasCustomPermissions(newState);
    
    if (!newState) {
      // Reset to role-based permissions
      const rolePermissions = roles.find(r => r.name.toLowerCase() === selectedRole.toLowerCase())?.permissions || [];
      setCustomPermissions([...rolePermissions]);
    }
  };

  // Check if a permission is granted
  const hasPermission = (permission: string): boolean => {
    return customPermissions.includes(permission);
  };

  // Toggle a specific permission
  const togglePermission = (permission: string) => {
    setCustomPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  // Save changes
  const saveChanges = async () => {
    try {
      setSaving(true);
      setSuccessMessage("");
      setErrorMessage("");
      
      // Update role first
      await roleAPI.updateUserRole(userId, selectedRole);
      
      // Update permissions if custom permissions are enabled
      if (hasCustomPermissions) {
        await roleAPI.updateUserPermissions(userId, customPermissions);
      }
      
      setSuccessMessage("User permissions updated successfully");
      setSaving(false);
    } catch (error) {
      console.error("Error saving permissions:", error);
      setErrorMessage("Failed to update user permissions");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">User not found</h3>
              <p className="text-sm text-red-700 mt-1">
                The requested user could not be found. Please check the user ID and try again.
              </p>
              <div className="mt-3">
                <Link
                  href="/admin/dashboard/users"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Users
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage roles and permissions for this user
          </p>
        </div>
        <Link
          href="/admin/dashboard/users"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Link>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <X className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Role Assignment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                User Role
              </label>
              <select
                id="role"
                name="role"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedRole}
                onChange={handleRoleChange}
              >
                {roles.map((role) => (
                  <option key={role.name} value={role.name.toLowerCase()}>
                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Current role: {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Permission Mode
                </label>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={toggleCustomPermissions}
                  className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium ${
                    !hasCustomPermissions
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Role-based
                </button>
                <button
                  type="button"
                  onClick={toggleCustomPermissions}
                  className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium ${
                    hasCustomPermissions
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Custom
                </button>
              </div>
              
              <p className="mt-2 text-sm text-gray-500">
                {hasCustomPermissions
                  ? "Custom permissions override the default role permissions"
                  : "User inherits all permissions from their assigned role"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {hasCustomPermissions ? "Custom Permissions" : "Role Permissions"}
            </h3>
            {hasCustomPermissions && (
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-amber-500 mr-1" />
                <span className="text-sm text-amber-500 font-medium">Custom permissions enabled</span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
              <div key={category} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">{category}</h4>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.map((permission) => (
                      <div key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          id={permission}
                          checked={hasPermission(permission)}
                          onChange={() => hasCustomPermissions && togglePermission(permission)}
                          disabled={!hasCustomPermissions}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={permission}
                          className={`ml-2 block text-sm ${
                            hasCustomPermissions ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {PERMISSION_LABELS[permission] || permission}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={saveChanges}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 