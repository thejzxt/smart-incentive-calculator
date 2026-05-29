import React, { useState } from "react";
import Modal from "../shared/Modal";

export default function CarModelTable({ carModels, setCarModels, triggerToast }) {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  const [editingModel, setEditingModel] = useState(null);
  const [modelName, setModelName] = useState("");
  const [baseSuffix, setBaseSuffix] = useState("");
  const [variant, setVariant] = useState("");
  const [formError, setFormError] = useState("");


  const [deletingModelId, setDeletingModelId] = useState(null);


  const handleOpenAdd = () => {
    setEditingModel(null);
    setModelName("");
    setBaseSuffix("");
    setVariant("");
    setFormError("");
    setIsEditModalOpen(true);
  };


  const handleOpenEdit = (model) => {
    setEditingModel(model);
    setModelName(model.name);
    setBaseSuffix(model.suffix);
    setVariant(model.variant);
    setFormError("");
    setIsEditModalOpen(true);
  };


  const handleSave = (e) => {
    e.preventDefault();
    setFormError("");

    const nameVal = modelName.trim();
    const suffixVal = baseSuffix.trim();
    const variantVal = variant.trim();

    if (!nameVal || !suffixVal || !variantVal) {
      setFormError("All fields are required. Please fill in all fields.");
      return;
    }

    if (editingModel) {

      const updatedModels = carModels.map((m) =>
        m.id === editingModel.id
          ? { ...m, name: nameVal, suffix: suffixVal, variant: variantVal }
          : m
      );
      setCarModels(updatedModels);
      triggerToast("Car model updated successfully!", "success");
    } else {

      const newId = `model-${Date.now()}`;
      const newModel = { id: newId, name: nameVal, suffix: suffixVal, variant: variantVal };
      setCarModels([...carModels, newModel]);
      triggerToast("New car model added successfully!", "success");
    }

    setIsEditModalOpen(false);
  };


  const handleRequestDelete = (id) => {
    setDeletingModelId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const updatedModels = carModels.filter((m) => m.id !== deletingModelId);
    setCarModels(updatedModels);
    setIsDeleteModalOpen(false);
    setDeletingModelId(null);
    triggerToast("Car model deleted.", "success");
  };

  return (
    <div className="bg-white dark:bg-toyota-charcoal rounded-xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Car Inventory Manager</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Configure models available for sales entries</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-toyota-red hover:bg-toyota-redHover text-white font-bold text-sm rounded-lg shadow-sm hover:shadow-red-600/10 active:scale-[0.98] transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Model
        </button>
      </div>

      <div className="overflow-x-auto">
        {carModels.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white">No Models Found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
              No car models are configured in the inventory. Click "Add Model" to insert the first vehicle type.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-100/50 dark:bg-gray-800/80 text-xs text-gray-700 dark:text-gray-300 uppercase font-semibold">
              <tr>
                <th scope="col" className="px-6 py-3">Model Name</th>
                <th scope="col" className="px-6 py-3">Base Suffix</th>
                <th scope="col" className="px-6 py-3">Variant</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {carModels.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/35 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{model.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {model.suffix}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{model.variant}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(model)}
                      className="p-1.5 text-gray-500 hover:text-toyota-red dark:hover:text-toyota-red hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit Model"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRequestDelete(model.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete Model"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingModel ? "Edit Car Model" : "Add Car Model"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-xs font-semibold animate-fade-in">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Model Name
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-toyota-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-toyota-red focus:border-transparent transition-all"
              placeholder="e.g. Fortuner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Base Suffix
            </label>
            <input
              type="text"
              value={baseSuffix}
              onChange={(e) => setBaseSuffix(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-toyota-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-toyota-red focus:border-transparent transition-all"
              placeholder="e.g. SUV, MPV, Sedan"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Variant Detail
            </label>
            <input
              type="text"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-toyota-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-toyota-red focus:border-transparent transition-all"
              placeholder="e.g. 2.8L 4x4 MT"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-toyota-red hover:bg-toyota-redHover text-white font-bold text-sm rounded-lg shadow-sm transition-colors"
            >
              {editingModel ? "Save Changes" : "Create Model"}
            </button>
          </div>
        </form>
      </Modal>


      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this car model? This will remove it from the sales officer entry form.
          </p>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors animate-pulse"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
