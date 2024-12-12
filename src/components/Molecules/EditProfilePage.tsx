import React, { useEffect, useState } from "react";
import profilePlaceHolder from "../../assets/placeholder.png";
import BankAccountDetails from "../atoms/EditProfile/BankAccountDetails";
import ContactDetails from "../atoms/EditProfile/ContactDetails";
import Documents from "../atoms/EditProfile/Documents";
import Education from "../atoms/EditProfile/Education";
import EmergencyContact from "../atoms/EditProfile/EmergencyContact";
import PersonalDetails from "../atoms/EditProfile/PersonalDetails";
import Resume from "../atoms/EditProfile/Resume";
import UpdatePassword from "../atoms/EditProfile/UpdatePassword";
import useUser from "../../hooks/useUser";
import axios from "axios";
import { toast } from "react-toastify";
import SalaryDetails from "../atoms/EditProfile/SalaryDetails";

const EditProfilePage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("Personal Details");
  const { user, refetchUser } = useUser();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [employee, setEmployee] = useState({
    name: "",
    department: "",
    jobTitle: "",
    jobCategory: "",
    jobType: "",
    profilePicture: "",
    shiftTimings: "",
    jobStatus: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (user) {
      setEmployee({
        name: user.name,
        department: user.personalDetails?.department || "N/A",
        jobCategory: user.personalDetails?.jobCategory || "N/A",
        jobTitle: user.personalDetails?.jobTitle || "N/A",
        jobType: user.personalDetails?.jobType || "N/A",
        profilePicture:
          user.personalDetails?.profilePicture || profilePlaceHolder,
        shiftTimings: user.personalDetails?.shiftTimings || "N/A",
        jobStatus: user.personalDetails?.jobStatus || "Probation",
        gender: user.personalDetails?.gender || "N/A",
        dateOfBirth: user.personalDetails?.dateOfBirth || "N/A",
      });
    }
  }, [user]);

  const handleUpdatePersonalDetails = async (
    updatedEmployee: typeof employee
  ) => {
    try {
      const {
        name,
        department,
        jobTitle,
        jobCategory,
        jobType,
        shiftTimings,
        jobStatus,
        gender,
        dateOfBirth,
      } = updatedEmployee;

      const updatedDetails = {
        name,
        department,
        jobTitle,
        jobCategory,
        jobType,
        shiftTimings,
        jobStatus,
        gender,
        dateOfBirth,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const { data } = await axios.put(
        `${backendUrl}/api/users/personal-details`,
        updatedDetails,
        config
      );

      setEmployee((prev) => ({
        ...prev,
        name: data.name,
        department: data.department,
        jobTitle: data.jobTitle,
        jobCategory: data.jobCategory,
        jobType: data.jobType,
        shiftTimings: data.shiftTimings,
        jobStatus: data.jobStatus,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
      }));

      toast.success("Personal details updated successfully");
    } catch (error) {
      toast.error("Failed to update personal details");
      console.error("Update error:", error);
    }
  };

  const handleProfilePictureChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      await axios.put(
        `${backendUrl}/api/users/profile-picture`,
        formData,
        config
      );

      // Refetch user data after successful upload
      await refetchUser();
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to update profile picture");
    }
  };

  const handleUpdateContactDetails = async (details: {
    phoneNumber1: string;
    phoneNumber2?: string;
    email: string;
    currentCity: string;
    currentAddress: string;
    permanentCity: string;
    permanentAddress: string;
  }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      await axios.put(
        `${backendUrl}/api/users/contact-details`,
        details,
        config
      );

      toast.success("Contact details updated successfully");
    } catch (error) {
      toast.error("Failed to update contact details");
    }
  };

  const handleUpdateEducation = async (details: {
    institute: string;
    degree: string;
    fieldOfStudy: string;
    GPA: string;
    yearOfCompletion: string;
  }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      await axios.put(`${backendUrl}/api/users/education`, details, config);

      toast.success("Education details updated successfully");
    } catch (error) {
      toast.error("Failed to update Education details");
    }
  };

  const handleUpdateEmergencyContacts = async (contacts: {
    name1: string;
    relation1: string;
    contactNumber1: string;
    name2: string;
    relation2: string;
    contactNumber2: string;
  }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      await axios.put(
        `${backendUrl}/api/users/emergency-contacts`,
        contacts,
        config
      );

      toast.success("Emergency details updated successfully");
    } catch (error) {
      toast.error("Both Contacts are required");
    }
  };

  const handleResumeUpdate = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };

      await axios.put(`${backendUrl}/api/users/resume`, formData, config);

      // Refetch user data after successful upload
      await refetchUser();
      toast.success("Resume updated successfully");
    } catch (error) {
      toast.error("Failed to update resume");
    }
  };

  const handleUpdateBankDetails = async (contacts: {
    bankName: string;
    branchName: string;
    accountTitle: string;
    accountNumber: string;
    ibanNumber: string;
  }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      await axios.put(`${backendUrl}/api/users/bank-details`, contacts, config);

      toast.success("Emergency details updated successfully");
    } catch (error) {
      toast.error("Both Contacts are required");
    }
  };

  const documents: {
    name: string;
    type: "image" | "pdf";
    fileUrl: string | null;
  }[] = [
    { name: "NIC", type: "image", fileUrl: user?.documents?.NIC || null },
    {
      name: "Experience Letter",
      type: "pdf",
      fileUrl: user?.documents?.experienceLetter || null,
    },
    {
      name: "Salary Slip",
      type: "pdf",
      fileUrl: user?.documents?.salarySlip || null,
    },
    {
      name: "Academic Document",
      type: "image",
      fileUrl: user?.documents?.academicDocuments || null,
    },
    {
      name: "Non Disclosure Agreement (NDA)",
      type: "pdf",
      fileUrl: user?.documents?.NDA || null,
    },
  ];

  const handleDocumentUpdate = async (name: string, file: File) => {
    try {
      const formData = new FormData();

      const backendFieldName =
        name === "Non Disclosure Agreement (NDA)"
          ? "Non Disclosure Agreement (NDA)"
          : name;

      formData.append(backendFieldName, file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };

      await axios.put(`${backendUrl}/api/users/documents`, formData, config);

      // Refetch user data after successful upload
      await refetchUser();
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload document");
      console.error("Error uploading document:", error);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Personal Details":
        return (
          <PersonalDetails
            employee={employee}
            departments={[
              "Account Management",
              "Project Management",
              "Content Production",
              "Book Marketing",
              "Design Production",
              "SEO",
              "Creative Media",
              "Web Development",
              "Paid Advertising",
              "Software Production",
              "IT & Networking",
              "Human Resource",
              "Training & Development",
              "Admin",
              "Finance",
              "Brand Development",
              "Corporate Communication",
            ]}
            jobTitles={[
              "Executive",
              "Senior Executive",
              "Assistant Manager",
              "Associate Manager",
              "Manager",
              "Senior Manager",
              "Assistant Vice President",
              "Associate Vice President",
              "Vice President",
              "Senior Vice President",
            ]}
            // jobCategories={[
            //   'Digital Marketing', 'Book Marketing', 'Software Application',
            //   'Mobile Application', 'SEO Content', 'Technical Content',
            //   'Book Formatting & Publishing', 'Book Editing', 'Graphic Design',
            //   'Web Design', 'UI/UX Design', 'Infographic', '2D Animation',
            //   'Illustrator', '3D Animation', 'VoiceOver', 'CMS Development',
            //   'Frontend Development', 'Backend Development', 'Social Media Marketing',
            //   'SMS Marketing', 'Software Development', 'Game Development',
            //   'Android Development', 'iOS Development', 'Digital Marketing',
            //   'Social Media Marketing'
            // ]}
            onProfilePictureChange={handleProfilePictureChange}
            isEditable={user?.role === "HR" || user?.role === "SuperAdmin"}
            onUpdate={handleUpdatePersonalDetails}
          />
        );
      case "Contact Details":
        return (
          <ContactDetails
            phoneNumber1={user?.contactDetails?.phoneNumber1 || ""}
            phoneNumber2={user?.contactDetails?.phoneNumber2 || ""}
            email={user?.contactDetails?.email || user?.email || ""}
            currentCity={user?.contactDetails?.currentCity || ""}
            currentAddress={user?.contactDetails?.currentAddress || ""}
            permanentCity={user?.contactDetails?.permanentCity || ""}
            permanentAddress={user?.contactDetails?.permanentAddress || ""}
            onUpdate={handleUpdateContactDetails}
          />
        );
      case "Education":
        return (
          <Education
            institute={user?.education?.[0]?.institute || "N/A"}
            degree={user?.education?.[0]?.degree || "N/A"}
            fieldOfStudy={user?.education?.[0]?.fieldOfStudy || "N/A"}
            GPA={user?.education?.[0]?.GPA || "N/A"}
            yearOfCompletion={
              String(user?.education?.[0]?.yearOfCompletion) || "N/A"
            }
            onUpdate={handleUpdateEducation}
          />
        );
      case "Emergency Contact":
        return (
          <EmergencyContact
            name1={user?.emergencyContacts?.[0]?.name1 || ""}
            relation1={user?.emergencyContacts?.[0]?.relation1 || ""}
            contactNumber1={user?.emergencyContacts?.[0]?.contactNumber1 || ""}
            name2={user?.emergencyContacts?.[0]?.name2 || ""}
            relation2={user?.emergencyContacts?.[0]?.relation2 || ""}
            contactNumber2={user?.emergencyContacts?.[0]?.contactNumber2 || ""}
            onUpdate={handleUpdateEmergencyContacts}
          />
        );

      case "Resume":
        return (
          <Resume
            resumeUrl={user?.resume?.resume || null}
            onUpdate={handleResumeUpdate}
          />
        );

      case "Document":
        return (
          <Documents documents={documents} onUpdate={handleDocumentUpdate} />
        );

      case "Bank Account Details":
        return (
          <BankAccountDetails
            bankName={user?.bankAccountDetails?.bankName || ""}
            branchName={user?.bankAccountDetails?.branchName || ""}
            accountTitle={user?.bankAccountDetails?.accountTitle || ""}
            accountNumber={user?.bankAccountDetails?.accountNumber || ""}
            ibanNumber={user?.bankAccountDetails?.IBANNumber || ""}
            onUpdate={handleUpdateBankDetails}
          />
        );
      case "Salary Details":
        return (
          <SalaryDetails
            basicSalary={""}
            allowances={{
              medical: "",
              mobile: "",
              fuel: "",
            }}
            onUpdate={function (details: {
              basicSalary: string;
              allowances: { medical: string; mobile: string; fuel: string };
            }): void {
              throw new Error("Function not implemented.");
            }}
          />
        );
      case "Update Password":
        return <UpdatePassword />;
      default:
        return <div className="p-6">Select a menu item to view details.</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="bg-white w-full lg:w-1/4 p-6 rounded-xl">
        <ul className="space-y-4">
          {[
            "Personal Details",
            "Contact Details",
            "Education",
            "Emergency Contact",
            "Resume",
            "Document",
            "Bank Account Details",
            "Salary Details",
            "Update Password",
          ].map((item, index) => (
            <li
              key={index}
              onClick={() => setSelectedMenu(item)}
              className={`py-3 px-4 rounded-lg text-left cursor-pointer ${
                selectedMenu === item
                  ? "bg-purple-900 font-bold text-white"
                  : "bg-gray-100"
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
