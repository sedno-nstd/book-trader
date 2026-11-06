export interface Book {
  id: number;
  title: string;
  author: string;
  photo?: string | null;
  ownerId: number;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  createdAt?: Date;
}
