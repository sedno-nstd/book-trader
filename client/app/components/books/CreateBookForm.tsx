import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "../ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "../ui/Button";

interface CreateBookFormProps {
  onBookAdded: () => void;
}

export function CreateBookForm({ onBookAdded }: CreateBookFormProps) {
  const { token } = useAuthStore();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [photo, setPhoto] = useState<null | string>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setError("File size should be less than 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, photo }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create book");
      }

      setTitle("");
      setAuthor("");
      setPhoto("");
      setIsLoading(false);
      onBookAdded();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col">
      <h2 className="text-xl font-bold tracking-tight text-[#292d28] mb-5">
        Add a New Book
      </h2>

      {error && (
        <div className="mb-4 px-4 py-3 bg-[#f8eeeb] border border-[#ead5ce] text-[#96594e] rounded-md text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-[#faf9f6] border border-[#e8e5df] p-6 rounded-lg"
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Title"
          placeholder="Enter book title"
        />

        <Input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          label="Author"
          placeholder="Enter author's name"
        />

        <div className="flex flex-col gap-3">
          <label className="font-medium text-sm text-[#454a43]">
            Book Cover Image
          </label>

          <div className="flex flex-col gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm  text-[#777b73] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-[#d8ddd3] file:bg-[#edf0e9] file:text-[#4c634d] file:font-medium hover:file:bg-[#e3e9de] file:transition-colors cursor-pointer"
            />

            {photo && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-16 rounded overflow-hidden border border-[#e8e5df]">
                  <img
                    src={photo}
                    alt="Book cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-[#777b73]">Image selected</span>
              </div>
            )}

            <p className="text-xs text-[#92958d]">
              JPG, PNG or WEBP. Maximum file size: 3MB.
            </p>
          </div>
        </div>

        <Button variant="primary" type="submit">
          {isLoading ? "Creating..." : "Create Book"}
        </Button>
      </form>
    </div>
  );
}
