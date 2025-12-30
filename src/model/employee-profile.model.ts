import {
  EmergencyContact,
  EmployeeProfile,
  Reference,
} from 'src/app/interfaces/employee-profile.interface';
import { formatDate, formatWorkAuth } from 'src/app/utils/employee';

export class EmployeeProfileObject {
  // ===== Basic info =====
  _id: string;
  _firstName: string;
  _middleName: string;
  _lastName: string;
  _preferredName: string;
  _gender: string;
  _dateOfBirth: string;
  _ssn: string;

  // ===== Contact =====
  _cellPhone: string;
  _workPhone: string;

  // ===== Address =====
  _address: string;

  // ===== Car =====
  _carInformation: string;
  _driverLicenseExpDate: string;
  _driverLicenseNumber: string;

  // ===== Work authorization =====
  _workAuthorizationType: string;
  _workAuthorizationStart: string | null;
  _workAuthorizationEnd: string | null;
  _otherWorkAuthorizationTitle: string;

  // ===== Emergency contacts =====
  _emergencyContacts: Array<EmergencyContact>;

  // ===== Reference =====
  _referenceFirstName: string;
  _referenceLastName: string;
  _referenceMiddleName: string;
  _referencePhone: string;
  _referenceEmail: string;
  _referenceRelationship: string;

  constructor(raw: EmployeeProfile) {
    this._id = raw._id;
    this._firstName = raw.firstName;
    this._middleName = raw.middleName !== '' ? raw.middleName : 'N/A';
    this._lastName = raw.lastName;
    this._preferredName = raw.preferredName !== '' ? raw.preferredName : 'N/A';
    this._gender =
      raw.gender.slice(0, 1).toUpperCase() +
      raw.gender.slice(1).toLowerCase().replace('_', ' ');
    this._dateOfBirth = formatDate(raw.dateOfBirth);
    this._ssn = raw.ssn;

    this._cellPhone = raw.cellPhone;
    this._workPhone = raw.workPhone !== '' ? raw.workPhone : 'N/A';

    const currAddress =
      raw.address.buildingApt +
      ' ' +
      raw.address.street +
      ', ' +
      raw.address.city +
      ', ' +
      raw.address.state +
      ' ' +
      raw.address.zip;
    this._address = currAddress.trim() === '' ? 'N/A' : currAddress.trim();

    const currCarInformation =
      raw.carInformation.make +
      ' ' +
      raw.carInformation.model +
      ' ' +
      raw.carInformation.color;
    this._carInformation =
      currCarInformation.trim() === '' ? 'N/A' : currCarInformation.trim();
    this._driverLicenseExpDate = raw.driverLicense
      ? formatDate(raw.driverLicense.expirationDate)
      : 'N/A';
    this._driverLicenseNumber = raw.driverLicense
      ? raw.driverLicense.number
      : 'N/A';

    this._workAuthorizationType = formatWorkAuth(raw.workAuthorizationType);
    this._workAuthorizationStart = raw.workAuthorizationStart
      ? formatDate(raw.workAuthorizationStart)
      : 'N/A';
    this._workAuthorizationEnd = raw.workAuthorizationEnd
      ? formatDate(raw.workAuthorizationEnd)
      : 'N/A';
    this._otherWorkAuthorizationTitle = raw.otherWorkAuthorizationTitle;

    this._emergencyContacts = raw.emergencyContacts;
    this._referenceFirstName =
      raw.reference.firstName !== '' ? raw.reference.firstName : 'N/A';
    this._referenceLastName =
      raw.reference.lastName !== '' ? raw.reference.lastName : 'N/A';
    this._referenceMiddleName =
      raw.reference.middleName !== '' ? raw.reference.middleName : 'N/A';
    this._referencePhone =
      raw.reference.phone !== '' ? raw.reference.phone : 'N/A';
    this._referenceEmail =
      raw.reference.email !== '' ? raw.reference.email : 'N/A';
    this._referenceRelationship =
      raw.reference.relationship !== '' ? raw.reference.relationship : 'N/A';
  }
}
