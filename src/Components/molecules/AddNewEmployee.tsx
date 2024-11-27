import { useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddNewEmployee: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Engineering',
    jobTitle: '',
    jobCategory: 'Full-Time',
    userRole: 'normal',  // New user role field
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, department, jobTitle, jobCategory, userRole } = formData;

    if (!name || !email || !password || !confirmPassword || !department || !jobTitle || !jobCategory || !userRole) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      await axiosInstance.post('/users', {
        name,
        email,
        password,
        department,
        jobTitle,
        jobCategory,
        userRole,  // Send userRole to backend
      }, config);

      toast.success('Employee added successfully!');
      navigate('/organization/employee-management');
    } catch (error: any) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to add employee. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[50%] mx-auto my-10 p-6 bg-white rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="name" className="block text-gray-600 font-medium mb-1">
            Employee Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-600 font-medium mb-1">
            Employee Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            placeholder="example@company.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-600 font-medium mb-1">
            Password<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            placeholder="Create a strong password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-gray-600 font-medium mb-1">
            Confirm Password<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            placeholder="Re-enter your password"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-gray-600 font-medium mb-1">
            Department<span className="text-red-500">*</span>
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-gray-600 font-medium mb-1">
            Job Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div>
          <label htmlFor="jobCategory" className="block text-gray-600 font-medium mb-1">
            Job Category<span className="text-red-500">*</span>
          </label>
          <select
            id="jobCategory"
            name="jobCategory"
            value={formData.jobCategory}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Remote">Remote</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label htmlFor="userRole" className="block text-gray-600 font-medium mb-1">
            User Role<span className="text-red-500">*</span>
          </label>
          <select
            id="userRole"
            name="userRole"
            value={formData.userRole}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="normal">Normal</option>
            <option value="HR">HR</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default AddNewEmployee;