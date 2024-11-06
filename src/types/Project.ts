// frontend/src/types/Project.ts

export interface Project {
    _id: string;
    projectName: string;
    category: string;
    completion: string;
    projectStatus: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
    deadline: string;
    invoice: boolean;
    riForm: string;
    user: {
      name: string;
      email: string;
    };
  }  