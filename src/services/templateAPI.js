const FASTAPI_BASE_URL = 'http://localhost:8000';

// Template API functions that match the backend schema
export const templateAPI = {
  // Get all templates
  getTemplates: async () => {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/templates`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  // Get template by ID
  getTemplate: async (templateId) => {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/templates/${templateId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  // Create new template
  createTemplate: async (templateData) => {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/templates`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Update template
  updateTemplate: async (templateId, templateData) => {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // Delete template
  deleteTemplate: async (templateId) => {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // DELETE typically returns no content
      return;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};