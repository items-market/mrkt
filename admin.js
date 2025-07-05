// Simulated database (in a real app, this would be a backend API)
let users = [
  {
    id: "123456789",
    username: "johndoe",
    first_name: "John",
    last_name: "Doe",
    balance: 15.75,
    last_active: "2023-06-15T10:30:00Z"
  },
  {
    id: "987654321",
    username: "janedoe",
    first_name: "Jane",
    last_name: "Doe",
    balance: 42.50,
    last_active: "2023-06-14T15:45:00Z"
  },
  {
    id: "555555555",
    username: "bobsmith",
    first_name: "Bob",
    last_name: "Smith",
    balance: 3.20,
    last_active: "2023-06-10T08:15:00Z"
  }
];

// DOM elements
const usersTableBody = document.getElementById('users-table-body');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const addUserBtn = document.getElementById('add-user-btn');
const editBalanceModal = document.getElementById('edit-balance-modal');
const addUserModal = document.getElementById('add-user-modal');
const editBalanceForm = document.getElementById('edit-balance-form');
const addUserForm = document.getElementById('add-user-form');
const alertMessage = document.getElementById('alert-message');

// Current page and items per page
let currentPage = 1;
const itemsPerPage = 10;
let filteredUsers = [...users];

// Initialize the admin panel
function init() {
  renderUsersTable();
  setupEventListeners();
}

// Render users table with pagination
function renderUsersTable() {
  usersTableBody.innerHTML = '';
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToDisplay = filteredUsers.slice(startIndex, endIndex);
  
  if (usersToDisplay.length === 0) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center;">No users found</td>
      </tr>
    `;
    return;
  }
  
  usersToDisplay.forEach(user => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username || '-'}</td>
      <td>${user.first_name}</td>
      <td>${user.last_name || '-'}</td>
      <td>${user.balance.toFixed(2)}</td>
      <td>${formatDate(user.last_active)}</td>
      <td>
        <button class="btn btn-primary btn-sm edit-btn" data-id="${user.id}">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">Delete</button>
      </td>
    `;
    
    usersTableBody.appendChild(row);
  });
  
  renderPagination();
}

// Render pagination controls
function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  if (totalPages <= 1) return;
  
  // Previous button
  const prevBtn = document.createElement('div');
  prevBtn.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevBtn.textContent = '«';
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderUsersTable();
    }
  });
  pagination.appendChild(prevBtn);
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('div');
    pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
    pageItem.textContent = i;
    pageItem.addEventListener('click', () => {
      currentPage = i;
      renderUsersTable();
    });
    pagination.appendChild(pageItem);
  }
  
  // Next button
  const nextBtn = document.createElement('div');
  nextBtn.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  nextBtn.textContent = '»';
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderUsersTable();
    }
  });
  pagination.appendChild(nextBtn);
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Show alert message
function showAlert(message, type = 'success') {
  alertMessage.textContent = message;
  alertMessage.className = `alert alert-${type}`;
  alertMessage.style.display = 'block';
  
  setTimeout(() => {
    alertMessage.style.display = 'none';
  }, 5000);
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
      filteredUsers = [...users];
    } else {
      filteredUsers = users.filter(user => 
        (user.username && user.username.toLowerCase().includes(searchTerm)) ||
        user.first_name.toLowerCase().includes(searchTerm) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm)) ||
        user.id.includes(searchTerm)
      );
    }
    
    currentPage = 1;
    renderUsersTable();
  });
  
  // Add user button
  addUserBtn.addEventListener('click', () => {
    addUserModal.style.display = 'flex';
  });
  
  // Close modals
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      editBalanceModal.style.display = 'none';
      addUserModal.style.display = 'none';
    });
  });
  
  // Click outside modal to close
  window.addEventListener('click', (e) => {
    if (e.target === editBalanceModal) {
      editBalanceModal.style.display = 'none';
    }
    if (e.target === addUserModal) {
      addUserModal.style.display = 'none';
    }
  });
  
  // Edit balance form submission
  editBalanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('edit-user-id').value;
    const newBalance = parseFloat(document.getElementById('edit-balance').value);
    
    // Find user and update balance
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].balance = newBalance;
      renderUsersTable();
      editBalanceModal.style.display = 'none';
      showAlert('Balance updated successfully');
    }
  });
  
  // Add user form submission
  addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newUser = {
      id: document.getElementById('add-user-id').value,
      username: document.getElementById('add-username').value || null,
      first_name: document.getElementById('add-first-name').value,
      last_name: document.getElementById('add-last-name').value || null,
      balance: parseFloat(document.getElementById('add-balance').value),
      last_active: new Date().toISOString()
    };
    
    // Check if user already exists
    if (users.some(u => u.id === newUser.id)) {
      showAlert('User with this ID already exists', 'danger');
      return;
    }
    
    users.push(newUser);
    filteredUsers = [...users];
    renderUsersTable();
    addUserModal.style.display = 'none';
    addUserForm.reset();
    showAlert('User added successfully');
  });
  
  // Edit and delete buttons (delegated events)
  usersTableBody.addEventListener('click', (e) => {
    const target = e.target;
    
    // Edit button
    if (target.classList.contains('edit-btn')) {
      const userId = target.getAttribute('data-id');
      const user = users.find(u => u.id === userId);
      
      if (user) {
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-username').value = user.username || '';
        document.getElementById('edit-balance').value = user.balance.toFixed(2);
        editBalanceModal.style.display = 'flex';
      }
    }
    
    // Delete button
    if (target.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete this user?')) {
        const userId = target.getAttribute('data-id');
        users = users.filter(u => u.id !== userId);
        filteredUsers = filteredUsers.filter(u => u.id !== userId);
        renderUsersTable();
        showAlert('User deleted successfully');
      }
    }
  });
}

// Initialize the admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', init);