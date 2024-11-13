// frontend/src/components/ProjectForm.jsx

import React, { useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Select, { StylesConfig, SingleValue } from 'react-select';
import { AuthContext } from './AuthContext';

interface ProjectFormData {
  category: string;
  // Standard Fields
  projectName?: string;
  projectDetails?: string;
  completion?: string;
  projectStatus?: string;
  invoice?: boolean;
  riForm?: string;
  // Category-Specific Fields
  numberOfArticles?: number;
  numberOfWords?: number;
  numberOfChapters?: number;
  deadline?: string;
  urgent?: boolean;
  recurring?: boolean;
  // Business Plan & Proposal
  packageOption?: string;
  packageType?: string;
  // Animated Videos
  videoType?: string;
  numberOfVideos?: number;
  duration?: string;
  // Ebook Writing
  numberOfChaptersEbook?: number;
  // Logo Design
  logoType?: string;
  numberOfLogos?: number;
  // Social Media Ads and similar
  numberOfSocialMediaPosts?: number;
  manageSocialMedia?: boolean;
  // Children's Book Illustrations
  numberOfIllustrations?: number;
  // Web Design & Development
  websiteType?: string;
  numberOfPages?: number;
  hosting?: boolean;
  themeBased?: boolean;
  needContent?: boolean;
  // File Upload Fields
  uploadedArticles?: FileList | null;
  uploadedBusinessPlan?: FileList | null;
  uploadedProposal?: FileList | null;
  uploadedBookCover?: FileList | null;
  uploadedBookTrailer?: FileList | null;
  uploadedChildrenBook?: FileList | null;
  uploadedAudioBook?: FileList | null;
  uploadedFormattingServices?: FileList | null;
  uploadedDocuments?: FileList | null;
  numberOfDocuments?: number;
}

interface CategoryOption {
  value: string;
  label: string;
  fields: Array<Field>;
  requiresRedirect?: boolean;
}

interface Field {
  name: keyof ProjectFormData;
  label: string;
  type: 'text' | 'number' | 'date' | 'checkbox' | 'select' | 'file';
  required: boolean;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  showWhen?: (formData: ProjectFormData) => boolean;
}

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageDetails: { name: string; link: string; description: string } | null;
}

// Package Data
const packagesData: { [key: string]: Array<{ name: string; link: string; description: string }> } = {
  'business-plan-writing': [
    { name: 'Basic Plan', link: '#', description: 'Basic Business Plan Writing Package' },
    { name: 'Premium Plan', link: '#', description: 'Premium Business Plan Writing Package' },
  ],
  'business-proposal-writing': [
    { name: 'Standard Proposal', link: '#', description: 'Standard Business Proposal Writing Package' },
    { name: 'Comprehensive Proposal', link: '#', description: 'Comprehensive Business Proposal Writing Package' },
  ],
  'book-marketing': [
    { name: 'Starter Pack', link: '#', description: 'Starter Book Marketing Package' },
    { name: 'Growth Pack', link: '#', description: 'Growth Book Marketing Package' },
  ],
  'author-marketing': [
    { name: 'Author Starter', link: '#', description: 'Starter Author Marketing Package' },
    { name: 'Author Growth', link: '#', description: 'Growth Author Marketing Package' },
  ],
  'digital-marketing': [
    { name: 'Digital Basic', link: '#', description: 'Basic Digital Marketing Package' },
    { name: 'Digital Advanced', link: '#', description: 'Advanced Digital Marketing Package' },
  ],
  'web-content-writing': [
    { name: 'Web Content Basic', link: '#', description: 'Basic Web Content Writing Package' },
    { name: 'Web Content Pro', link: '#', description: 'Professional Web Content Writing Package' },
  ],
  'book-publishing': [
    { name: 'Self-Publish', link: '#', description: 'Self-Publishing Package' },
    { name: 'Full-Service Publish', link: '#', description: 'Full-Service Book Publishing Package' },
  ],
  'book-promotion': [
    { name: 'Local Promotion', link: '#', description: 'Local Book Promotion Package' },
    { name: 'Global Promotion', link: '#', description: 'Global Book Promotion Package' },
  ],
  'book-cover-design': [
    { name: 'Basic Cover', link: '#', description: 'Basic Book Cover Design Package' },
    { name: 'Premium Cover', link: '#', description: 'Premium Book Cover Design Package' },
  ],
  'book-trailer': [
    { name: 'Standard Trailer', link: '#', description: 'Standard Book Trailer Package' },
    { name: 'Enhanced Trailer', link: '#', description: 'Enhanced Book Trailer Package' },
  ],
  'children-book-publication': [
    { name: 'Illustrated Edition', link: '#', description: 'Illustrated Children\'s Book Publication Package' },
    { name: 'Standard Edition', link: '#', description: 'Standard Children\'s Book Publication Package' },
  ],
  'childrens-book-illustrations': [
    { name: 'Basic Illustrations', link: '#', description: 'Basic Illustrations for Children\'s Books' },
    { name: 'Advanced Illustrations', link: '#', description: 'Advanced Illustrations for Children\'s Books' },
  ],
  'formatting-services': [
    { name: 'Basic Formatting', link: '#', description: 'Basic Formatting Services' },
    { name: 'Advanced Formatting', link: '#', description: 'Advanced Formatting Services' },
  ],
  'audio-book-recording': [
    { name: 'Standard Recording', link: '#', description: 'Standard Audio Book Recording Package' },
    { name: 'Professional Recording', link: '#', description: 'Professional Audio Book Recording Package' },
  ],
  // Add more packages for other new categories as needed
};

// Category Options
const categoryOptions: CategoryOption[] = [
  {
    value: 'book-publishing',
    label: 'Book Publishing',
    fields: [
      {
        name: 'packageOption',
        label: 'Choose Option for Packages',
        type: 'select',
        required: true,
        options: [
          { value: 'original', label: 'Original' },
          { value: 'templated', label: 'Templated' },
        ],
      },
      {
        name: 'packageType',
        label: 'Select Package',
        type: 'select',
        required: true,
        options: [], 
        showWhen: (formData) => formData.packageOption !== undefined,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'uploadedBusinessPlan',
        label: 'Upload Business Plan',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'book-promotion',
    label: 'Book Promotion',
    fields: [
      {
        name: 'packageType',
        label: 'Select Promotion Package',
        type: 'select',
        required: true,
        options: [],
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'uploadedProposal',
        label: 'Upload Promotion Proposal',
        type: 'file',
        required: true,
      },
    ],
    requiresRedirect: false,
  },
  {
    value: 'book-writing',
    label: 'Book Writing',
    fields: [
      {
        name: 'numberOfChapters',
        label: 'Number Of Chapters',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'numberOfWords',
        label: 'Number Of Words Per Chapter',
        type: 'number',
        required: true,
        min: 1000,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'recurring',
        label: 'Recurring',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'uploadedArticles',
        label: 'Upload Chapters',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'book-editing',
    label: 'Book Editing',
    fields: [
      {
        name: 'numberOfChapters',
        label: 'Number Of Chapters to Edit',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'numberOfWords',
        label: 'Number Of Words Per Chapter',
        type: 'number',
        required: true,
        min: 1000,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'uploadedArticles',
        label: 'Upload Chapters for Editing',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'book-marketing',
    label: 'Book Marketing',
    fields: [
      {
        name: 'packageType',
        label: 'Select Marketing Package',
        type: 'select',
        required: true,
        options: [], // Populated based on selected category
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
    ],
  },
  {
    value: 'proofreading-services',
    label: 'Proofreading Services',
    fields: [
      {
        name: 'numberOfDocuments',
        label: 'Number Of Documents',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'numberOfWords',
        label: 'Number Of Words Per Document',
        type: 'number',
        required: true,
        min: 100,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'uploadedDocuments',
        label: 'Upload Documents for Proofreading',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'article-writing',
    label: 'Article Writing',
    fields: [
      {
        name: 'numberOfArticles',
        label: 'Number Of Articles / files',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'numberOfWords',
        label: 'Number Of Words For each Article',
        type: 'number',
        required: true,
        min: 100,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'recurring',
        label: 'Recurring',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'uploadedArticles',
        label: 'Upload Articles',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'blog-writing',
    label: 'Blog Writing',
    fields: [
      {
        name: 'numberOfArticles',
        label: 'Number Of Blog Posts',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'numberOfWords',
        label: 'Number Of Words Per Post',
        type: 'number',
        required: true,
        min: 300,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'recurring',
        label: 'Recurring',
        type: 'checkbox',
        required: false,
      },
    ],
  },
  {
    value: 'book-cover-design',
    label: 'Book Cover Design',
    fields: [
      {
        name: 'packageType',
        label: 'Select Cover Design Package',
        type: 'select',
        required: true,
        options: [], // Populated based on selected category
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'uploadedBookCover',
        label: 'Upload Existing Cover (if any)',
        type: 'file',
        required: false,
      },
    ],
  },
  {
    value: 'book-trailer',
    label: 'Book Trailer',
    fields: [
      {
        name: 'packageType',
        label: 'Select Trailer Package',
        type: 'select',
        required: true,
        options: [], // Populated based on selected category
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'uploadedBookTrailer',
        label: 'Upload Script or Assets',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'business-plan-writing',
    label: 'Business Plan Writing',
    fields: [
      {
        name: 'packageOption',
        label: 'Choose Option for Packages',
        type: 'select',
        required: true,
        options: [
          { value: 'original', label: 'Original' },
          { value: 'templated', label: 'Templated' },
        ],
      },
      {
        name: 'packageType',
        label: 'Select Package',
        type: 'select',
        required: true,
        options: [], // Will be populated based on selected category
        showWhen: (formData) => formData.packageOption !== undefined,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'uploadedBusinessPlan',
        label: 'Upload Business Plan',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'children-book-publication',
    label: 'Children Book Publication',
    fields: [
      {
        name: 'packageType',
        label: 'Select Publication Package',
        type: 'select',
        required: true,
        options: [], // Populated based on selected category
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'uploadedChildrenBook',
        label: 'Upload Book Files',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'author-marketing',
    label: 'Author Marketing',
    fields: [
      {
        name: 'packageType',
        label: 'Select Marketing Package',
        type: 'select',
        required: true,
        options: [], // Populated based on selected category
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
    ],
  },
  {
    value: 'childrens-book-illustrations',
    label: 'Children\'s Book Illustrations',
    fields: [
      {
        name: 'numberOfIllustrations',
        label: 'Number Of Illustrations',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'uploadedChildrenBook',
        label: 'Upload Book for Illustration',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'digital-marketing',
    label: 'Digital Marketing',
    fields: [
      {
        name: 'packageType',
        label: 'Select Marketing Package',
        type: 'select',
        required: true,
        options: [], // Populated based on selected category
      },
      {
        name: 'manageSocialMedia',
        label: 'Do you want us to manage your Social Media Handles?',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'recurring',
        label: 'Recurring',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
    ],
  },
  {
    value: 'ebook-writing',
    label: 'Ebook Writing',
    fields: [
      {
        name: 'numberOfChaptersEbook',
        label: 'Number Of Chapters',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'numberOfWords',
        label: 'Number Of Words Per Chapter',
        type: 'number',
        required: true,
        min: 1000,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'uploadedArticles',
        label: 'Upload Chapters',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'formatting-services',
    label: 'Formatting Services',
    fields: [
      {
        name: 'packageType',
        label: 'Select Formatting Package',
        type: 'select',
        required: true,
        options: [], // Populated based on selected category
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'uploadedFormattingServices',
        label: 'Upload Document for Formatting',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'audio-book-recording',
    label: 'Audio Book Recording',
    fields: [
      {
        name: 'packageType',
        label: 'Select Recording Package',
        type: 'select',
        required: true,
        options: [], // Populated based on selected category
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'uploadedAudioBook',
        label: 'Upload Script or Assets',
        type: 'file',
        required: true,
      },
    ],
  },
  {
    value: 'web-content-writing',
    label: 'Web Content Writing',
    fields: [
      {
        name: 'packageType',
        label: 'Select Content Writing Package',
        type: 'select',
        required: true,
        options: [], // Populated based on selected category
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
      {
        name: 'urgent',
        label: 'Urgent',
        type: 'checkbox',
        required: false,
      },
    ],
  },
  {
    value: 'author-website-design',
    label: 'Author Website Design',
    fields: [
      {
        name: 'websiteType',
        label: 'Website Type',
        type: 'select',
        required: true,
        options: [
          { value: 'portfolio', label: 'Portfolio' },
          { value: 'blog', label: 'Blog' },
          { value: 'ecommerce', label: 'E-commerce' },
          { value: 'custom', label: 'Custom' },
        ],
      },
      {
        name: 'numberOfPages',
        label: 'Number Of Pages',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'hosting',
        label: 'Require Hosting',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'themeBased',
        label: 'Theme Based Design',
        type: 'select',
        required: true,
        options: [
          { value: 'theme', label: 'Theme' },
          { value: 'custom', label: 'Custom' },
        ],
      },
      {
        name: 'needContent',
        label: 'Need Content Writing',
        type: 'checkbox',
        required: false,
      },
      {
        name: 'deadline',
        label: 'Deadline',
        type: 'date',
        required: true,
      },
    ],
    requiresRedirect: false,
  },
  // Add more new categories with their fields as needed
];

const customSelectStyles: StylesConfig<{ value: string; label: string }, false> = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
    '&:hover': {
      borderColor: '#3b82f6',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 10,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#e0e7ff'
      : 'white',
    color: state.isSelected ? 'white' : 'black',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'black',
  }),
};

// Package Modal Component
const PackageModal: React.FC<PackageModalProps> = ({ isOpen, onClose, packageDetails }) => {
  if (!isOpen || !packageDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-11/12 md:w-1/2 lg:w-1/3">
        <h3 className="text-xl font-semibold mb-4">{packageDetails.name}</h3>
        <p className="mb-4">{packageDetails.description}</p>
        <a href={packageDetails.link} className="text-blue-500 underline mb-4 block" target="_blank" rel="noopener noreferrer">
          Visit Package Link
        </a>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-[#f6f6f6]0 text-white rounded-md hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ProjectForm: React.FC = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    category: '',
  });

  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<{ value: string; label: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalPackageDetails, setModalPackageDetails] = useState<{ name: string; link: string; description: string } | null>(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Helper to get package options based on category
  const getPackageOptions = (categoryValue: string): Array<{ value: string; label: string }> => {
    const packages = packagesData[categoryValue];
    if (!packages) return [];
    return packages.map((pkg) => ({ value: pkg.name, label: pkg.name }));
  };

  const validateForm = (): boolean => {
    if (!selectedCategory) {
      setError('Please select a category.');
      return false;
    }

    if (selectedCategory.requiresRedirect) {
      setError('');
      return true;
    }

    if (!formData.projectName || formData.projectName.trim() === '') {
      setError('Please enter the Project Name.');
      return false;
    }

    if (!formData.projectDetails || formData.projectDetails.trim() === '') {
      setError('Please enter the Project Details.');
      return false;
    }

    for (const field of selectedCategory.fields) {
      if (field.showWhen && !field.showWhen(formData)) {
        continue;
      }

      const value = formData[field.name];

      if (field.required) {
        if (field.type === 'checkbox') {
          if (typeof value !== 'boolean') {
            setError(`Please provide a value for ${field.label}.`);
            return false;
          }
        } else if (field.type === 'select') {
          if (!value) {
            setError(`Please select ${field.label}.`);
            return false;
          }
        } else if (field.type === 'file') {
          if (!value || (value instanceof FileList && value.length === 0)) {
            setError(`Please upload a file for ${field.label}.`);
            return false;
          }
        } else {
          if (value === '' || value === null || value === undefined) {
            setError(`Please fill in the ${field.label}.`);
            return false;
          }
        }
      }

      if (field.type === 'number' && value !== undefined) {
        if (field.min !== undefined && Number(value) < field.min) {
          setError(`${field.label} must be at least ${field.min}.`);
          return false;
        }
      }

      if (field.type === 'date' && value) {
        const selectedDate = new Date(value as string | number);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(selectedDate.getTime()) || selectedDate < today) {
          setError(`${field.label} must be a valid future date.`);
          return false;
        }
      }
    }

    setError('');
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files || null,
    }));
  };

  const handleCategoryChange = (option: SingleValue<CategoryOption>) => {
    setSelectedCategory(option);
    if (option) {
      setFormData((prevData) => ({
        ...prevData,
        category: option.value,
        ...Object.keys(prevData)
          .filter((key) => key !== 'category' && key !== 'projectName' && key !== 'projectDetails')
          .reduce((acc, key) => ({ ...acc, [key]: undefined }), {}),
      }));
    } else {
      setFormData({
        category: '',
        projectName: '',
        projectDetails: '',
      });
    }
    setError('');
    setSelectedPackage(null);
  };

  // Handle package selection
  const handlePackageChange = (option: SingleValue<{ value: string; label: string }>) => {
    setSelectedPackage(option);
  };

  const handleViewPackage = (packageName: string) => {
    const categoryValue = selectedCategory?.value || '';
    const pkg = packagesData[categoryValue]?.find((p) => p.name === packageName);
    if (pkg) {
      setModalPackageDetails(pkg);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (selectedCategory?.requiresRedirect) {
      toast.info('Redirecting to Account Manager for a custom quote.');
      navigate('/contact');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('projectName', formData.projectName || '');
      formDataToSend.append('projectDetails', formData.projectDetails || '');

      selectedCategory?.fields.forEach((field) => {
        if (field.showWhen && !field.showWhen(formData)) {
          return;
        }

        const value = formData[field.name];

        if (value === undefined || value === null || value === '') {
          return;
        }

        if (field.type === 'checkbox') {
          formDataToSend.append(field.name, String(value));
        } else if (field.type === 'file') {
          if (field.name === 'uploadedArticles' && value instanceof FileList) {
            Array.from(value).forEach((file) => {
              formDataToSend.append('uploadedArticles', file);
            });
          } else if (value instanceof FileList && value.length > 0) {
            formDataToSend.append(field.name, value[0]);
          }
        } else {
          formDataToSend.append(field.name, String(value));
        }
      });

      const response = await axiosInstance.post('/projects', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      toast.success('Project created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create project.');
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full md:w-8/2 lg:w-8/2 mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6">Add New Project</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Category<span className="text-red-500">*</span>
          </label>
          <Select<CategoryOption>
            id="category"
            name="category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Select Category..."
            isSearchable
          />
        </div>

        {selectedCategory && (
          <div>
            <label htmlFor="projectName" className="block text-gray-700 font-medium mb-2">
              Project Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName || ''}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                error.toLowerCase().includes('project name') ? 'border-red-500' : ''
              }`}
            />
          </div>
        )}

        {selectedCategory && (
          <div>
            <label htmlFor="projectDetails" className="block text-gray-700 font-medium mb-2">
              Project Details<span className="text-red-500">*</span>
            </label>
            <textarea
              id="projectDetails"
              name="projectDetails"
              value={formData.projectDetails || ''}
              onChange={handleChange}
              required
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                error.toLowerCase().includes('project details') ? 'border-red-500' : ''
              }`}
              placeholder="Provide a detailed description of your project..."
            ></textarea>
          </div>
        )}

        {selectedCategory && (
          <>
            {selectedCategory.fields.map((field) => {
              if (field.showWhen && !field.showWhen(formData)) {
                return null;
              }

              switch (field.type) {
                case 'text':
                  return (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-gray-700 font-medium mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] as string || ''}
                        onChange={handleChange}
                        required={field.required}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                          error.toLowerCase().includes(field.label.toLowerCase()) ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                  );
                case 'number':
                  return (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-gray-700 font-medium mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="number"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] as number || ''}
                        onChange={handleChange}
                        required={field.required}
                        min={field.min}
                        className={`w-[30%] px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                          error.toLowerCase().includes(field.label.toLowerCase()) ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                  );
                case 'date':
                  return (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-gray-700 font-medium mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="date"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] as string || ''}
                        onChange={handleChange}
                        required={field.required}
                        className={`w-[30%] px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                          error.toLowerCase().includes(field.label.toLowerCase()) ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                  );
                case 'checkbox':
                  return (
                    <div key={field.name} className="flex items-center">
                      <input
                        type="checkbox"
                        id={field.name}
                        name={field.name}
                        checked={formData[field.name] as boolean || false}
                        onChange={handleChange}
                        className="mr-2 h-5 w-5"
                      />
                      <label htmlFor={field.name} className="text-gray-700 font-medium">
                        {field.label}
                      </label>
                    </div>
                  );
                case 'select':
                  return (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-gray-700 font-medium mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <Select
                        id={field.name}
                        name={field.name}
                        options={field.options && field.options.length > 0 ? field.options : getPackageOptions(selectedCategory.value)}
                        value={
                          field.type === 'select' && typeof formData[field.name] === 'string'
                            ? { value: formData[field.name] as string, label: formData[field.name] as string }
                            : null
                        }
                        onChange={(option: SingleValue<{ value: string; label: string }>) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            [field.name]: option ? option.value : '',
                          }));
                        }}
                        styles={customSelectStyles}
                        placeholder={`Select ${field.label}...`}
                        isSearchable
                      />

                      {field.name === 'packageType' && formData['packageType'] && (
                        <button
                          type="button"
                          onClick={() => handleViewPackage(formData['packageType'] as string)}
                          className="mt-2 text-blue-500 underline"
                        >
                          View Package Details
                        </button>
                      )}
                    </div>
                  );
                case 'file':
                  return (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-gray-700 font-medium mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="file"
                        id={field.name}
                        name={field.name}
                        onChange={handleFileChange}
                        required={field.required}
                        className={`w-[30%] px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                          error.toLowerCase().includes(field.label.toLowerCase()) ? 'border-red-500' : ''
                        }`}
                        multiple={field.name === 'uploadedArticles' || field.name === 'uploadedFormattingServices'}
                      />
                    </div>
                  );
                default:
                  return null;
              }
            })}

            {selectedCategory.requiresRedirect && (
              <div className="mt-4">
                <p className="text-gray-700">
                  Please contact our Account Manager for a custom quote.
                </p>
              </div>
            )}

            {!selectedCategory.requiresRedirect && (
              <div className="flex justify-left">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-[30%] md:w-3/2 py-2 px-4 bg-[#ff6600] text-white font-semibold rounded-md transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#ff6600]'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Project'}
                </button>
              </div>
            )}
          </>
        )}

      </form>

      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageDetails={modalPackageDetails}
      />
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ProjectForm;