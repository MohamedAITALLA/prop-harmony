
import React from "react";
import { useNavigate } from "react-router-dom";

interface EditFormActionsProps {
  propertyId: string;
}

export function EditFormActions({ propertyId }: EditFormActionsProps) {
  const navigate = useNavigate();
  
  const handleCancel = () => {
    navigate(`/properties/${propertyId}`);
  };

  return (
    <div className="flex justify-end gap-4 pt-4">
      <button
        type="button"
        className="px-4 py-2 border rounded-md hover:bg-gray-100"
        onClick={handleCancel}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Update Property
      </button>
    </div>
  );
}
