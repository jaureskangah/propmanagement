export interface TenantTranslations {
  // Liste des locataires
  tenantsList: string;
  tenantsSubtitle: string;
  addTenant: string;
  editTenant: string;
  deleteTenant: string;
  searchTenants: string;
  noTenants: string;
  noTenantsFiltered: string;
  leaseStatus: string;
  filterByStatus: string;
  allStatuses: string;
  active: string;
  expiring: string;
  expired: string;

  // Statut du bail détaillé
  leaseStatusActive: string;
  leaseStatusExpiringDays: string;
  leaseStatusExpired: string;
  daysLeft: string;
  daysAgo: string;

  // Formulaire locataire
  personalInfo: string;
  propertyInfo: string;
  leaseInfo: string;
  name: string;
  nameLabel: string;
  namePlaceholder: string;
  email: string;
  emailLabel: string;
  emailPlaceholder: string;
  phone: string;
  phoneLabel: string;
  phonePlaceholder: string;
  selectProperty: string;
  propertyLabel: string;
  propertyPlaceholder: string;
  unitNumber: string;
  unitLabel: string;
  unitPlaceholder: string;
  leaseStart: string;
  leaseStartLabel: string;
  leaseEnd: string;
  leaseEndLabel: string;
  rentAmount: string;
  rentLabel: string;
  rentPlaceholder: string;
  saveTenant: string;
  saveChanges: string;
  cancel: string;
  required: string;
  optional: string;

  // Documents
  documents: string;
  uploadDocument: string;
  uploading: string;
  documentDeleted: string;
  confirmDeleteDocument: string;
  documentDeleteWarning: string;
  noDocuments: string;
  generateDocument: string;
  downloadDocument: string;
  openDocument: string;

  // Communication
  communications: string;
  newMessage: string;
  inviteTenant: string;
  subject: string;
  content: string;
  send: string;
  sending: string;
  messageType: string;
  messageCategory: string;
  general: string;
  urgent: string;
  maintenance: string;
  noCommunications: string;

  // Paiements
  payments: string;
  addPayment: string;
  editPayment: string;
  deletePayment: string;
  paymentDate: string;
  amount: string;
  paymentStatus: string;
  noPayments: string;
  pending: string;
  completed: string;
  failed: string;
  paid: string;
  overdue: string;
  confirmDeletePayment: string;
  paymentDeleteWarning: string;
  paymentDeleted: string;
  paymentAdded: string;
  paymentUpdated: string;
  paymentError: string;
  selectPaymentStatus: string;

  // Profile
  noTenantSelected: string;
  selectTenantToView: string;
  notLinkedToTenant: string;
  contactManager: string;
  linkAccountRequired: string;
  profileSection: string;
  emailLabel: string;
  phoneLabel: string;
  unitLabel: string;
  rentAmountLabel: string;
  leaseStartLabel: string;
  leaseEndLabel: string;
  notAvailable: string;
  perMonth: string;

  // Messages de confirmation/succès
  tenantAdded: string;
  tenantUpdated: string;
  tenantDeleted: string;
  confirmDelete: string;
  deleteWarning: string;
  invitationSent: string;
  messageSent: string;

  // Messages de validation
  fieldRequired: string;
  invalidEmail: string;
  invalidAmount: string;
}
