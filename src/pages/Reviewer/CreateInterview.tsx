import React, { useEffect } from "react";
import { Plus, Video, Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { createInterview, updateInterview } from "../../api/interview";
import { useUser } from "../../context/UserContext";

export interface Interview {
  _id?: string;
  title: string;
  description: string;
  questions: string[];
  createdBy?: string;
  userId?: string;
}

interface CreateInterviewProps {
  setCurrentView: (view: string) => void;
  newInterview: Interview;
  setNewInterview: (interview: Interview) => void;
  addQuestion: () => void;
  updateQuestion: (index: number, value: string) => void;
  removeQuestion: (index: number) => void;
  selectedInterview: Interview | null;
  isEditMode: boolean;
}

const CreateInterview: React.FC<CreateInterviewProps> = ({
  setCurrentView,
  newInterview,
  setNewInterview,
  addQuestion,
  updateQuestion,
  removeQuestion,
  isEditMode,
  selectedInterview,
}) => {
  const { user } = useUser();

  // Pre-fill when editing
  useEffect(() => {
    if (isEditMode && selectedInterview) {
      setNewInterview({
        _id: selectedInterview._id,
        title: selectedInterview.title,
        description: selectedInterview.description,
        questions: selectedInterview.questions,
        createdBy: selectedInterview.createdBy,
      });
    }
  }, [isEditMode, selectedInterview, setNewInterview]);

  const mutation = useMutation({
    mutationFn: (data: Interview) =>
      isEditMode && data._id
        ? updateInterview(data._id, data)
        : createInterview(data),
    onSuccess: () => {
      toast.success(isEditMode ? "Interview updated successfully!" : "Interview created successfully!");
      setNewInterview({ title: "", description: "", questions: [""] });
      setCurrentView("dashboard");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Something went wrong!");
    },
  });

  const handleSave = () => {
    if (!newInterview.title || !newInterview.description || newInterview.questions.length === 0) {
      toast.error("Please fill all required fields!");
      return;
    }

    mutation.mutate({
      ...newInterview,
      createdBy: user?._id || "",
      userId: user?._id || ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button onClick={() => setCurrentView("dashboard")} className="text-gray-500 hover:text-gray-700">
                ← Back
              </button>
              <div className="bg-purple-600 p-2 rounded-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditMode ? "Edit Interview" : "Create New Interview"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Interview Title *</label>
            <input
              type="text"
              value={newInterview.title}
              onChange={(e) => setNewInterview({ ...newInterview, title: e.target.value })}
              placeholder="e.g., Frontend Developer Position"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={newInterview.description}
              onChange={(e) => setNewInterview({ ...newInterview, description: e.target.value })}
              placeholder="Describe the role and what you're looking for..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Questions */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">Interview Questions *</label>
              <button
                onClick={addQuestion}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-4">
              {newInterview.questions.map((question, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      placeholder={`Question ${index + 1}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {newInterview.questions.length > 1 && (
                    <button onClick={() => removeQuestion(index)} className="p-2 text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
            >
              {isEditMode ? "Update Interview" : "Create Interview"}
            </button>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default CreateInterview;
