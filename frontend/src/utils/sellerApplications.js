// Seller Applications Management Utility
// Stores seller applications for admin review

export const sellerApplications = {
  // Get all seller applications
  getAll: () => {
    const applications = localStorage.getItem('sellerApplications');
    return applications ? JSON.parse(applications) : [];
  },

  // Get applications by status
  getByStatus: (status) => {
    const all = sellerApplications.getAll();
    return all.filter(app => app.status === status);
  },

  // Get pending applications
  getPending: () => {
    return sellerApplications.getByStatus('pending');
  },

  // Get approved applications
  getApproved: () => {
    return sellerApplications.getByStatus('approved');
  },

  // Get rejected applications
  getRejected: () => {
    return sellerApplications.getByStatus('rejected');
  },

  // Add a new seller application
  add: (applicationData) => {
    const applications = sellerApplications.getAll();
    const newApplication = {
      id: Date.now(),
      userId: applicationData.userId,
      userEmail: applicationData.userEmail,
      userName: applicationData.userName,
      businessName: applicationData.businessName,
      businessType: applicationData.businessType,
      description: applicationData.description,
      address: applicationData.address,
      gstNumber: applicationData.gstNumber,
      bankAccount: applicationData.bankAccount,
      ifscCode: applicationData.ifscCode,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      reviewNotes: null,
    };
    applications.push(newApplication);
    localStorage.setItem('sellerApplications', JSON.stringify(applications));
    return newApplication;
  },

  // Update application status (approve/reject)
  updateStatus: (applicationId, status, reviewedBy, reviewNotes = '') => {
    const applications = sellerApplications.getAll();
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      application.status = status;
      application.reviewedAt = new Date().toISOString();
      application.reviewedBy = reviewedBy;
      application.reviewNotes = reviewNotes;
      localStorage.setItem('sellerApplications', JSON.stringify(applications));
      return application;
    }
    return null;
  },

  // Approve application
  approve: (applicationId, reviewedBy, notes = '') => {
    return sellerApplications.updateStatus(applicationId, 'approved', reviewedBy, notes);
  },

  // Reject application
  reject: (applicationId, reviewedBy, notes = '') => {
    return sellerApplications.updateStatus(applicationId, 'rejected', reviewedBy, notes);
  },

  // Get application by ID
  getById: (id) => {
    const applications = sellerApplications.getAll();
    return applications.find(app => app.id === parseInt(id));
  },

  // Delete application
  delete: (applicationId) => {
    const applications = sellerApplications.getAll();
    const filtered = applications.filter(app => app.id !== applicationId);
    localStorage.setItem('sellerApplications', JSON.stringify(filtered));
    return true;
  },

  // Get application by user ID
  getByUserId: (userId) => {
    const applications = sellerApplications.getAll();
    return applications.find(app => app.userId === userId);
  },
};

