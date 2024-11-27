import React, { useEffect, useState } from 'react';
import profilePlaceHolder from '../../assets/placeholder.png';
import BankAccountDetails from '../atoms/EditProfile/BankAccountDetails';
import ContactDetails from '../atoms/EditProfile/ContactDetails';
import Documents from '../atoms/EditProfile/Documents';
import Education from '../atoms/EditProfile/Education';
import EmergencyContact from '../atoms/EditProfile/EmergencyContact';
import PersonalDetails from '../atoms/EditProfile/PersonalDetails';
import Resume from '../atoms/EditProfile/Resume';
import UpdatePassword from '../atoms/EditProfile/UpdatePassword';
import useUser from '../../hooks/useUser';


const EditProfilePage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('Personal Details');
  const { user } = useUser(); 

  const [employee, setEmployee] = useState({
    name: '',
    department: '',
    jobTitle: '',
    jobCategory: '',
    profilePicture: '',
    shiftTimings: '',
  });

  useEffect(() => {
    if (user) {
      setEmployee({
        name: user.name,
        department: user.personalDetails?.department || 'N/A',
        jobTitle: user.personalDetails?.jobTitle || 'N/A',
        jobCategory: user.personalDetails?.jobType || 'N/A',
        profilePicture: user.personalDetails?.profilePicture || profilePlaceHolder,
        shiftTimings: user.personalDetails?.shiftTimings || 'N/A',
      });
    }
  }, [user]);

  const handleUpdatePersonalDetails = (updatedEmployee: typeof employee) => {
    console.log('Updated Personal Details:', updatedEmployee);
    setEmployee(updatedEmployee);
  };
  
  const handleProfilePictureChange = (file: File) => {
    console.log('New profile picture:', file);
  };

  const handleUpdateContactDetails = (details: {
    phoneNumber1: string;
    phoneNumber2?: string;
    email: string;
    currentCity: string;
    currentAddress: string;
    permanentCity: string;
    permanentAddress: string;
  }) => {
    console.log('Updated Contact Details:', details);
  };

  const handleUpdateEducation = (details: {
    institute: string;
    degree: string;
    fieldOfStudy: string;
    gpa: string;
    yearOfCompletion: string;
  }) => {
    console.log('Updated Education Details:', details);
  };

  const handleUpdateEmergencyContacts = (contacts: {
    name: string;
    contactNumber: string;
    relation: string;
  }[]) => {
    console.log('Updated Emergency Contacts:', contacts);
  };

  const handleResumeUpdate = (file: File) => {
    console.log('Updated Resume:', file);
  };

  const documents: { name: string; type: 'image' | 'pdf'; fileUrl: string | null }[] = [
    { name: 'NIC', type: 'image', fileUrl: null },
    { name: 'Experience Letter', type: 'pdf', fileUrl: 'https://example.com/experience.pdf' },
    { name: 'Salary Slip', type: 'pdf', fileUrl: null },
    { name: 'Academic Document', type: 'image', fileUrl: null },
    { name: 'Non Disclosure Agreement (NDA)', type: 'pdf', fileUrl: 'https://example.com/nda.pdf' },
  ];

  const handleDocumentUpdate = (name: string, file: File) => {
    console.log(`Updated Document: ${name}`, file);
  };

  const handleUpdate = (details: {
    bankName: string;
    branchName: string;
    accountTitle: string;
    accountNumber: string;
    ibanNumber: string;
  }) => {
    console.log('Updated Bank Account Details:', details);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'Personal Details':
        return (
          <PersonalDetails
            employee={employee}
            onProfilePictureChange={handleProfilePictureChange}
            isEditable={user?.role === 'HR' || user?.role === 'SuperAdmin'}
            onUpdate={handleUpdatePersonalDetails}
          />
        );
      case 'Contact Details':
        return (
          <ContactDetails
            phoneNumber1="099344434"
            phoneNumber2=""
            email="waqas@gmail.com"
            currentCity="Karachi"
            currentAddress="Defence View Phase 2"
            permanentCity="Lahore"
            permanentAddress="Gulberg"
            onUpdate={handleUpdateContactDetails}
          />
        );
        case 'Education':
          return (
            <Education
              institute="Harvard University"
              degree="Bachelor of Science"
              fieldOfStudy="Computer Science"
              gpa="3.8"
              yearOfCompletion="2020"
              onUpdate={handleUpdateEducation}
            />
          );
      case 'Emergency Contact':
        return (
          <EmergencyContact
            contacts={[
              { name: 'Alice', contactNumber: '1234567890', relation: 'Spouse' },
              { name: 'Bob', contactNumber: '0987654321', relation: 'Sibling' },
            ]}
            onUpdate={handleUpdateEmergencyContacts}
          />
        );

      case 'Resume':
        return (
          <Resume
              resumeUrl="https://resources.workable.com/wp-content/uploads/2017/09/Employee-Handbook.pdf"
              onUpdate={handleResumeUpdate}
           />
        );

      case 'Document':
        return  (<Documents documents={documents} onUpdate={handleDocumentUpdate} />);

      case 'Bank Account Details':
        return (
          <BankAccountDetails
            bankName="HBL Bank"
            branchName="Main Branch"
            accountTitle="John Doe"
            accountNumber="1234567890"
            ibanNumber="PK12HBL1234567890"
            onUpdate={handleUpdate}
        />
        );
      case 'Update Password':
        return (<UpdatePassword/>);
      default:
        return <div className="p-6">Select a menu item to view details.</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="bg-white w-full lg:w-1/4 p-6 rounded-xl">
        <ul className="space-y-4">
          {[
            'Personal Details',
            'Contact Details',
            'Education',
            'Emergency Contact',
            'Resume',
            'Document',
            'Bank Account Details',
            'Update Password',
          ].map((item, index) => (
            <li
              key={index}
              onClick={() => setSelectedMenu(item)}
              className={`py-3 px-4 rounded-lg text-left cursor-pointer ${
                selectedMenu === item
                  ? 'bg-purple-900 font-bold text-white'
                  : 'bg-gray-100'
              } hover:bg-purple-900 hover:text-white transition-all duration-200`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full">{renderContent()}</div>
    </div>
  );
};

export default EditProfilePage;