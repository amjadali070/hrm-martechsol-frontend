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
import { FaUser, FaPhoneAlt, FaGraduationCap, FaHeartbeat, FaFileAlt, FaFolderOpen, FaMoneyCheckAlt, FaMoneyBillWave, FaLock, FaChevronRight } from "react-icons/fa";

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
    shiftStartTime: "",
    shiftEndTime: "",
    jobStatus: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (user) {
      setEmployee({
        name: user.name,
        department: user.personalDetails?.department || "N/A",
        jobCategory: user.personalDetails?.jobCategory || "",
        jobTitle: user.personalDetails?.jobTitle || "N/A",
        jobType: user.personalDetails?.jobType || "N/A",
        profilePicture:
          user.personalDetails?.profilePicture || profilePlaceHolder,
        shiftStartTime: user.personalDetails?.shiftStartTime || "",
        shiftEndTime: user.personalDetails?.shiftEndTime || "",
        jobStatus: user.personalDetails?.jobStatus || "Probation",
        gender: user.personalDetails?.gender || "N/A",
        dateOfBirth: user.personalDetails?.dateOfBirth || "",
      });
    }
  }, [user]);

  const handleUpdatePersonalDetails = async (
    updatedEmployee: typeof employee
  ) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.put(
        `${backendUrl}/api/users/personal-details`,
        updatedEmployee,
        config
      );

      setEmployee((prev) => ({ ...prev, ...data }));
      toast.success("Personal details updated successfully");
      await refetchUser();
    } catch (error) {
      toast.error("Failed to update personal details");
    }
  };

  const handleProfilePictureChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      };
      await axios.put(
        `${backendUrl}/api/users/profile-picture`,
        formData,
        config
      );
      await refetchUser();
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to update profile picture");
    }
  };

  const handleUpdateContactDetails = async (details: any) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      await axios.put(
        `${backendUrl}/api/users/contact-details`,
        details,
        config
      );
      toast.success("Contact details updated successfully");
      await refetchUser();
    } catch (error) {
      toast.error("Failed to update contact details");
    }
  };

  const handleUpdateEducation = async (details: any) => {
    try {
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };
        await axios.put(`${backendUrl}/api/users/education`, details, config);
        toast.success("Education details updated successfully");
        await refetchUser();
    } catch (error) {
        toast.error("Failed to update Education details");
    }
  };

    const handleUpdateEmergencyContacts = async (contacts: any) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            await axios.put(
                `${backendUrl}/api/users/emergency-contacts`,
                contacts,
                config
            );
            toast.success("Emergency details updated successfully");
            await refetchUser();
        } catch (error) {
             toast.error("Failed to update Emergency details");
        }
    };

    const handleResumeUpdate = async (file: File) => {
        try {
             const formData = new FormData();
             formData.append("resume", file);
             const config = {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
             };
             await axios.put(`${backendUrl}/api/users/resume`, formData, config);
             await refetchUser();
             toast.success("Resume updated successfully");
        } catch (error) {
            toast.error("Failed to update resume");
        }
    };

    const handleUpdateBankDetails = async (details: any) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            await axios.put(`${backendUrl}/api/users/bank-details`, details, config);
            toast.success("Bank account details updated successfully");
            await refetchUser();
        } catch (error) {
             toast.error("Failed to update bank account details");
        }
    };

    const handleUpdateSalaryDetails = async (details: any) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            await axios.put(
                `${backendUrl}/api/users/salary-details`,
                details,
                config
            );
            toast.success("Salary details updated successfully");
            await refetchUser();
        } catch (error) {
            toast.error("Failed to update salary details");
        }
    };

    const documents: {
        name: string;
        type: "image" | "pdf";
        fileUrl: string | null;
      }[] = [
        { name: "NIC", type: "image", fileUrl: user?.documents?.NIC || null },
        { name: "Experience Letter", type: "pdf", fileUrl: user?.documents?.experienceLetter || null },
        { name: "Salary Slip", type: "pdf", fileUrl: user?.documents?.salarySlip || null },
        { name: "Academic Document", type: "image", fileUrl: user?.documents?.academicDocuments || null },
        { name: "Non Disclosure Agreement (NDA)", type: "pdf", fileUrl: user?.documents?.NDA || null },
      ];

      const handleDocumentUpdate = async (name: string, file: File) => {
        try {
          const formData = new FormData();
          const backendFieldName = name === "Non Disclosure Agreement (NDA)" ? "Non Disclosure Agreement (NDA)" : name;
    
          formData.append(backendFieldName, file);
    
          const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          };
    
          await axios.put(`${backendUrl}/api/users/documents`, formData, config);
    
          await refetchUser();
          toast.success("Document uploaded successfully");
        } catch (error) {
          toast.error("Failed to upload document");
        }
      };


  const menuItems = [
    { name: "Personal Details", icon: <FaUser /> },
    { name: "Contact Details", icon: <FaPhoneAlt /> },
    { name: "Education", icon: <FaGraduationCap /> },
    { name: "Emergency Contact", icon: <FaHeartbeat /> },
    { name: "Resume", icon: <FaFileAlt /> },
    { name: "Document", icon: <FaFolderOpen /> },
    { name: "Bank Account Details", icon: <FaMoneyCheckAlt /> },
    { name: "Salary Details", icon: <FaMoneyBillWave /> },
    { name: "Update Password", icon: <FaLock /> },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case "Personal Details":
        return <PersonalDetails
            employee={employee}
            departments={[
              "Account Management", "Project Management", "Content Production", "Book Marketing",
              "Design Production", "SEO", "Creative Media", "Web Development", "Paid Advertising",
              "Software Production", "IT & Networking", "Human Resource", "Training & Development",
              "Admin", "Finance", "Brand Development", "Corporate Communication", "Lead Generation",
            ]}
            jobTitles={[
              "Executive", "Senior Executive", "Assistant Manager", "Associate Manager", "Manager",
              "Senior Manager", "Assistant Vice President", "Associate Vice President", "Vice President",
              "Senior Vice President", "President", "Head of Department",
            ]}
            onProfilePictureChange={handleProfilePictureChange}
            isEditable={user?.role === "HR" || user?.role === "SuperAdmin"}
            onUpdate={handleUpdatePersonalDetails}
          />;
      case "Contact Details":
        return <ContactDetails
            phoneNumber1={user?.contactDetails?.phoneNumber1 || ""}
            phoneNumber2={user?.contactDetails?.phoneNumber2 || ""}
            email={user?.contactDetails?.email || user?.email || ""}
            currentCity={user?.contactDetails?.currentCity || ""}
            currentAddress={user?.contactDetails?.currentAddress || ""}
            permanentCity={user?.contactDetails?.permanentCity || ""}
            permanentAddress={user?.contactDetails?.permanentAddress || ""}
            onUpdate={handleUpdateContactDetails}
          />;
      case "Education":
        return <Education
            institute={user?.education?.[0]?.institute || "N/A"}
            degree={user?.education?.[0]?.degree || "N/A"}
            fieldOfStudy={user?.education?.[0]?.fieldOfStudy || "N/A"}
            GPA={user?.education?.[0]?.GPA || "N/A"}
            yearOfCompletion={String(user?.education?.[0]?.yearOfCompletion) || "N/A"}
            onUpdate={handleUpdateEducation}
          />;
      case "Emergency Contact":
        return <EmergencyContact
            name1={user?.emergencyContacts?.[0]?.name1 || ""}
            relation1={user?.emergencyContacts?.[0]?.relation1 || ""}
            contactNumber1={user?.emergencyContacts?.[0]?.contactNumber1 || ""}
            name2={user?.emergencyContacts?.[0]?.name2 || ""}
            relation2={user?.emergencyContacts?.[0]?.relation2 || ""}
            contactNumber2={user?.emergencyContacts?.[0]?.contactNumber2 || ""}
            onUpdate={handleUpdateEmergencyContacts}
          />;
      case "Resume":
        return <Resume resumeUrl={user?.resume || null} onUpdate={handleResumeUpdate} />;
      case "Document":
        return <Documents documents={documents} onUpdate={handleDocumentUpdate} />;
      case "Bank Account Details":
        return <BankAccountDetails
            bankName={user?.bankAccountDetails?.bankName || ""}
            branchName={user?.bankAccountDetails?.branchName || ""}
            accountTitle={user?.bankAccountDetails?.accountTitle || ""}
            accountNumber={user?.bankAccountDetails?.accountNumber || ""}
            ibanNumber={user?.bankAccountDetails?.IBANNumber || ""}
            onUpdate={handleUpdateBankDetails}
          />;
      case "Salary Details":
        return <SalaryDetails
            basicSalary={user?.salaryDetails?.basicSalary || 0}
            medicalAllowance={user?.salaryDetails?.medicalAllowance || 0}
            mobileAllowance={user?.salaryDetails?.mobileAllowance || 0}
            fuelAllowance={user?.salaryDetails?.fuelAllowance || 0}
            onUpdate={handleUpdateSalaryDetails}
          />;
      case "Update Password":
        return <UpdatePassword />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden sticky top-8">
               <div className="p-6 bg-alabaster-grey-50 border-b border-platinum-200">
                    <h3 className="font-bold text-gunmetal-900">Profile Settings</h3>
                    <p className="text-sm text-slate-grey-500">Manage your information</p>
               </div>
               <ul className="p-3 space-y-1">
                {menuItems.map((item) => (
                    <li key={item.name}>
                        <button
                            onClick={() => setSelectedMenu(item.name)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                            selectedMenu === item.name
                                ? "bg-gunmetal-900 text-white shadow-md shadow-gunmetal-500/20"
                                : "text-slate-grey-600 hover:bg-gunmetal-50 hover:text-gunmetal-900"
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className={`text-lg transition-colors ${selectedMenu === item.name ? "text-gunmetal-100" : "text-slate-grey-400 group-hover:text-gunmetal-500"}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </span>
                             {selectedMenu === item.name && <FaChevronRight size={12} />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      <div className="flex-1 w-full min-w-0">
         {renderContent()}
      </div>
    </div>
  );
};

export default EditProfilePage;
