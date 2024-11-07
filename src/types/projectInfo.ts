// Common interfaces for project-related data
export interface ProjectFile {
    fileName: string;
    fileLink: string;
    receivedOn: string;
    status: string;
  }
  
  export interface ProjectMessage {
    message: string;
    date: string;
    messageBy: string;
  }
  
  export interface ProjectInfo {
    _id: string;
    projectName: string;
    category: string;
    createdAt: string;
    completion: string;
    projectStatus: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
    deadline: string;
    invoice: boolean;
    riForm: string;
    files: ProjectFile[];
    messages: ProjectMessage[];
    user: {
      name: string;
      email: string;
    };
    uploadedArticles: { _id: string; filename: string; filepath: string }[]; // Added Field
    numberOfWords: number; // Added Field
    projectDetails: string; // Added Field
  }  
  
export  interface ProjectOverviewProps {
    projectId: string | undefined;
    projectData?: ProjectInfo;
  }
  
  export  interface ProjectFilesAndCorrespondenceProps {
    projectId: string | undefined;
    projectData?: ProjectInfo;
  }