export type Project = {
  title: string;
  description: string;
  stack: string[];
  href?: string;
  repo?: string;
};

// Add projects here. The section shows an empty state while this is empty.
export const projects: Project[] = [];
