"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useMutation } from "@tanstack/react-query";
import { ImageUp, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { UploadFile } from "../../../actions/uploadFile";
import { toast } from "sonner";
import { CreateTask } from "../../../actions/createTask";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState("");
  const [images, setImages] = useState<{ imageUrl: string }[]>([]);

  const token = localStorage.getItem("authToken");

  const { mutate } = useMutation({
    mutationFn: CreateTask,
    onMutate: () => {
      toast.loading("Creating task...", { id: "create-task" });
    },
    onSuccess: (taskId) => {
      toast.success("Task created", { id: "create-task" });
      router.push(`/task/${taskId}`);
    },
    onError: () => {
      toast.error("Task not created", { id: "create-task" });
    },
  });

  if (!token) {
    return toast.error("Token not provided");
  }

  return (
    <section className="p-2 max-w-3xl mx-auto flex flex-col gap-2">
      <h2 className="font-semibold text-xl md:text-3xl tracking-tight">
        Create a Task
      </h2>
      <Input
        placeholder="What is your task?"
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <div>
        <div className="w-full flex flex-col items-center mt-5">
          <h2 className="self-start font-semibold tracking-tight text-xl">
            Add images
          </h2>
          <FileUpload setImages={setImages} />
        </div>
        <Button
          variant={"secondary"}
          className="border"
          disabled={images.length < 2}
          onClick={() => mutate({ taskTitle, images, token })}
        >
          Create Task
        </Button>
      </div>
    </section>
  );
};

function FileUpload({
  setImages,
}: {
  setImages: React.Dispatch<React.SetStateAction<{ imageUrl: string }[]>>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImg, setUploadedImg] = useState<string[]>([]);
  let token = localStorage.getItem("authToken");

  if (!token) token = "ljsdfkljdsf";

  useEffect(() => {
    console.log(uploadedImg);
    uploadedImg.map((image) => {
      setImages((prev) => [...prev, { imageUrl: image }]);
    });
  }, [setImages, uploadedImg]);

  const { mutate } = useMutation({
    mutationFn: UploadFile,
    onMutate: () => {
      toast.loading("Uploading...", { id: "upload-file" });
    },
    onSuccess: (url) => {
      if (url) setUploadedImg((prev) => [...prev, url]);
      toast.success("Uploaded", { id: "upload-file" });
    },
    onError: () => {
      toast.error("Not uploaded", { id: "upload-file" });
    },
  });

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            mutate({ file, token });
          }
        }}
        className="hidden"
      />
      <Button
        variant={"outline"}
        className="border-dashed max-w-3xl min-h-44 h-full w-full hover:dark:bg-zinc-900/20"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <div className="w-full flex flex-col items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-full dark:bg-neutral-950 border">
            <ImageUp size={20} />
          </div>
          <p>Drop your image here of click to browser</p>
          <span className="text-xs text-muted-foreground font-normal">
            Max size: 5MB
          </span>
        </div>
      </Button>
      <div className="w-fit grid sm:grid-cols-2 gap-2 my-3 max-h-96 rounded-md overflow-y-auto p-2">
        {uploadedImg.map((img, idx) => (
          <div key={idx} className="relative border rounded-md">
            <Image
              height={400}
              width={400}
              src={`${img}`}
              alt="image"
              className="w-full rounded-t-md"
            />
            <button className="absolute right-1 top-1 p-1 rounded-full text-xs bg-white hover:bg-white/90 hover:text-black text-black border">
              <X className="h-3 w-3" />
            </button>
            <div className="py-1 px-3 border-t">
              <p className="text-xs font-semibold">filename</p>
              <p className="text-xs text-muted-foreground">filesize</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
