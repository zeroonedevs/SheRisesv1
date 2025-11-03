// Mentorship Management Utility
// Stores mentorship connections and requests

export const mentorship = {
  // Create a mentorship request
  createRequest: (requestData) => {
    const requests = mentorship.getAllRequests();
    const newRequest = {
      id: Date.now(),
      menteeId: requestData.menteeId,
      menteeName: requestData.menteeName,
      menteeAvatar: requestData.menteeAvatar || '/default-user.svg',
      mentorId: requestData.mentorId,
      mentorName: requestData.mentorName,
      mentorAvatar: requestData.mentorAvatar || '/default-user.svg',
      message: requestData.message || '',
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date().toISOString(),
      respondedAt: null
    };
    requests.push(newRequest);
    localStorage.setItem('mentorshipRequests', JSON.stringify(requests));
    return newRequest;
  },

  // Get all requests
  getAllRequests: () => {
    const requests = localStorage.getItem('mentorshipRequests');
    return requests ? JSON.parse(requests) : [];
  },

  // Get requests for a mentor
  getRequestsForMentor: (mentorId) => {
    return mentorship.getAllRequests().filter(r => r.mentorId === mentorId);
  },

  // Get requests from a mentee
  getRequestsFromMentee: (menteeId) => {
    return mentorship.getAllRequests().filter(r => r.menteeId === menteeId);
  },

  // Accept a mentorship request
  acceptRequest: (requestId) => {
    const requests = mentorship.getAllRequests();
    const request = requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'accepted';
      request.respondedAt = new Date().toISOString();
      localStorage.setItem('mentorshipRequests', JSON.stringify(requests));
      return request;
    }
    return null;
  },

  // Reject a mentorship request
  rejectRequest: (requestId) => {
    const requests = mentorship.getAllRequests();
    const request = requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'rejected';
      request.respondedAt = new Date().toISOString();
      localStorage.setItem('mentorshipRequests', JSON.stringify(requests));
      return request;
    }
    return null;
  },

  // Get active mentorships
  getActiveMentorships: (userId) => {
    return mentorship.getAllRequests().filter(r => 
      r.status === 'accepted' && 
      (r.menteeId === userId || r.mentorId === userId)
    );
  },

  // Check if there's already a request
  hasExistingRequest: (menteeId, mentorId) => {
    return mentorship.getAllRequests().some(r => 
      r.menteeId === menteeId && r.mentorId === mentorId && r.status === 'pending'
    );
  }
};

