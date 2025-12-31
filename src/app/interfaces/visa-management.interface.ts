export interface VMPendingEmployeesResponse {
  employees: VMPendingEmployees[];
}

export interface VMPendingEmployeesName {
  firstName: string;
  lastName: string;
  preferredName: string;
  legalFullName: string;
}

export interface VMPendingEmployeesWorkAuth {
  title: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface VMPendingEmployeesPendingDoc {
  documentId: string;
  documentType: string;
  status: string;
  documentKey: string;
  uploadedAt: string;
}

export interface VMPendingEmployees {
  employeeId: string;
  name: VMPendingEmployeesName;
  workAuthorization: VMPendingEmployeesWorkAuth;
  nextStep: string;
  actionType: string;
  pendingDocument: VMPendingEmployeesPendingDoc | null;
}

// "employees": [
//     {
//       "employeeId": "694d9e808caa54d758c7a8b7",
//       "name": {
//         "firstName": "Alice",
//         "lastName": "Wu",
//         "preferredName": "Alice",
//         "legalFullName": "Alice Wu"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2024-03-08T00:00:00.000Z",
//         "endDate": "2029-03-08T00:00:00.000Z",
//         "daysRemaining": 1164
//       },
//       "nextStep": "Employee needs to upload OPT_RECEIPT",
//       "actionType": "SEND_NOTIFICATION",
//       "pendingDocument": null
//     },
//     {
//       "employeeId": "69537be907770e078b778b28",
//       "name": {
//         "firstName": "John",
//         "lastName": "Doe",
//         "preferredName": "John",
//         "legalFullName": "John Doe"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2000-06-29T00:00:00.000Z",
//         "endDate": "2005-06-29T00:00:00.000Z",
//         "daysRemaining": -7489
//       },
//       "nextStep": "Waiting for HR approval: OPT_RECEIPT",
//       "actionType": "REVIEW_DOC",
//       "pendingDocument": {
//         "documentId": "69537c241b441e2f1ad156cc",
//         "documentType": "OPT_RECEIPT",
//         "status": "PENDING",
//         "documentKey": "users/69537be907770e078b778b28/opt_receipt.pdf",
//         "uploadedAt": "2025-12-30T07:15:48.420Z"
//       }
//     },
//     {
//       "employeeId": "69537c6907770e078b778b4d",
//       "name": {
//         "firstName": "Stella",
//         "lastName": "Hie",
//         "preferredName": "John",
//         "legalFullName": "Stella Hie"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2000-06-29T00:00:00.000Z",
//         "endDate": "2000-06-29T00:00:00.000Z",
//         "daysRemaining": -9315
//       },
//       "nextStep": "Waiting for HR approval: OPT_RECEIPT",
//       "actionType": "REVIEW_DOC",
//       "pendingDocument": {
//         "documentId": "69537cab1b441e2f1ad156d9",
//         "documentType": "OPT_RECEIPT",
//         "status": "PENDING",
//         "documentKey": "users/69537c6907770e078b778b4d/opt_receipt.pdf",
//         "uploadedAt": "2025-12-30T07:18:03.668Z"
//       }
//     },
//     {
//       "employeeId": "69537d1a07770e078b778b75",
//       "name": {
//         "firstName": "Theodore",
//         "lastName": "Hartanto",
//         "preferredName": "John",
//         "legalFullName": "Theodore Hartanto"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2000-06-29T00:00:00.000Z",
//         "endDate": "2005-06-29T00:00:00.000Z",
//         "daysRemaining": -7489
//       },
//       "nextStep": "Waiting for HR approval: OPT_RECEIPT",
//       "actionType": "REVIEW_DOC",
//       "pendingDocument": {
//         "documentId": "69537dbb1b441e2f1ad156f9",
//         "documentType": "OPT_RECEIPT",
//         "status": "PENDING",
//         "documentKey": "users/69537d1a07770e078b778b75/opt_receipt.pdf",
//         "uploadedAt": "2025-12-30T07:22:35.550Z"
//       }
//     },
//     {
//       "employeeId": "69537dfd07770e078b778b9c",
//       "name": {
//         "firstName": "Jen",
//         "lastName": "Helga",
//         "preferredName": "Jen",
//         "legalFullName": "Jen Helga"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2000-06-29T00:00:00.000Z",
//         "endDate": "2005-06-29T00:00:00.000Z",
//         "daysRemaining": -7489
//       },
//       "nextStep": "Waiting for HR approval: OPT_RECEIPT",
//       "actionType": "REVIEW_DOC",
//       "pendingDocument": {
//         "documentId": "69537e491b441e2f1ad1570d",
//         "documentType": "OPT_RECEIPT",
//         "status": "PENDING",
//         "documentKey": "users/69537dfd07770e078b778b9c/opt_receipt.pdf",
//         "uploadedAt": "2025-12-30T07:24:57.903Z"
//       }
//     }
//   ]

export interface VMAllEmployeesResponse {
  employees: VMAllEmployees[];
}

export interface VMAllEmployeesName {
  firstName: string;
  lastName: string;
  preferredName: string;
  legalFullName: string;
}

export interface VMAllEmployeesWorkAuth {
  title: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface VMAllEmployeesNextStep {
  nextStep: string;
  actionType: string;
  pendingDocument: VMAllEmployeesPendingDoc | null;
}

export interface VMAllEmployeesPendingDoc {
  documentId: string;
  documentType: string;
  status: string;
  documentKey: string;
  uploadedAt: string;
}

export interface VMAllEmployeesApprovedDoc {
  // documentId: string;
  documentType: string;
  status: string;
  documentKey: string;
  uploadedAt: string;
  reviewedAt: string;
}

export interface VMAllEmployees {
  employeeId: string;
  name: VMAllEmployeesName;
  workAuthorization: VMAllEmployeesWorkAuth;
  nextStep: VMAllEmployeesNextStep;
  approvedDocuments: VMAllEmployeesApprovedDoc[];
}

// "employees": [
//     {
//       "employeeId": "694d9e808caa54d758c7a8b7",
//       "name": {
//         "firstName": "Alice",
//         "lastName": "Wu",
//         "preferredName": "Alice",
//         "legalFullName": "Alice Wu"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2024-03-08T00:00:00.000Z",
//         "endDate": "2029-03-08T00:00:00.000Z",
//         "daysRemaining": 1164
//       },
//       "nextStep": {
//         "nextStep": "Employee needs to upload OPT_RECEIPT",
//         "actionType": "SEND_NOTIFICATION",
//         "pendingDocument": null
//       },
//       "approvedDocuments": []
//     },
//     {
//       "employeeId": "69537be907770e078b778b28",
//       "name": {
//         "firstName": "John",
//         "lastName": "Doe",
//         "preferredName": "John",
//         "legalFullName": "John Doe"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2000-06-29T00:00:00.000Z",
//         "endDate": "2005-06-29T00:00:00.000Z",
//         "daysRemaining": -7489
//       },
//       "nextStep": {
//         "nextStep": "Waiting for HR approval: OPT_RECEIPT",
//         "actionType": "REVIEW_DOC",
//         "pendingDocument": {
//           "documentId": "69537c241b441e2f1ad156cc",
//           "documentType": "OPT_RECEIPT",
//           "status": "PENDING",
//           "documentKey": "users/69537be907770e078b778b28/opt_receipt.pdf",
//           "uploadedAt": "2025-12-30T07:15:48.420Z"
//         }
//       },
//       "approvedDocuments": []
//     },
//     {
//       "employeeId": "69537c6907770e078b778b4d",
//       "name": {
//         "firstName": "Stella",
//         "lastName": "Hie",
//         "preferredName": "John",
//         "legalFullName": "Stella Hie"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2000-06-29T00:00:00.000Z",
//         "endDate": "2000-06-29T00:00:00.000Z",
//         "daysRemaining": -9315
//       },
//       "nextStep": {
//         "nextStep": "Waiting for HR approval: OPT_RECEIPT",
//         "actionType": "REVIEW_DOC",
//         "pendingDocument": {
//           "documentId": "69537cab1b441e2f1ad156d9",
//           "documentType": "OPT_RECEIPT",
//           "status": "PENDING",
//           "documentKey": "users/69537c6907770e078b778b4d/opt_receipt.pdf",
//           "uploadedAt": "2025-12-30T07:18:03.668Z"
//         }
//       },
//       "approvedDocuments": []
//     },
//     {
//       "employeeId": "69537d1a07770e078b778b75",
//       "name": {
//         "firstName": "Theodore",
//         "lastName": "Hartanto",
//         "preferredName": "John",
//         "legalFullName": "Theodore Hartanto"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2000-06-29T00:00:00.000Z",
//         "endDate": "2005-06-29T00:00:00.000Z",
//         "daysRemaining": -7489
//       },
//       "nextStep": {
//         "nextStep": "Waiting for HR approval: OPT_RECEIPT",
//         "actionType": "REVIEW_DOC",
//         "pendingDocument": {
//           "documentId": "69537dbb1b441e2f1ad156f9",
//           "documentType": "OPT_RECEIPT",
//           "status": "PENDING",
//           "documentKey": "users/69537d1a07770e078b778b75/opt_receipt.pdf",
//           "uploadedAt": "2025-12-30T07:22:35.550Z"
//         }
//       },
//       "approvedDocuments": []
//     },
//     {
//       "employeeId": "69537dfd07770e078b778b9c",
//       "name": {
//         "firstName": "Jen",
//         "lastName": "Helga",
//         "preferredName": "Jen",
//         "legalFullName": "Jen Helga"
//       },
//       "workAuthorization": {
//         "title": "F1_CPT_OPT",
//         "startDate": "2000-06-29T00:00:00.000Z",
//         "endDate": "2005-06-29T00:00:00.000Z",
//         "daysRemaining": -7489
//       },
//       "nextStep": {
//         "nextStep": "Waiting for HR approval: OPT_RECEIPT",
//         "actionType": "REVIEW_DOC",
//         "pendingDocument": {
//           "documentId": "69537e491b441e2f1ad1570d",
//           "documentType": "OPT_RECEIPT",
//           "status": "PENDING",
//           "documentKey": "users/69537dfd07770e078b778b9c/opt_receipt.pdf",
//           "uploadedAt": "2025-12-30T07:24:57.903Z"
//         }
//       },
//       "approvedDocuments": []
//     }
//   ]
