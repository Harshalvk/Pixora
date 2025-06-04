"use client";

import React from "react";
import { GetTask } from "../../../../actions/getTask";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const TaskPage = () => {
  const params = useParams<{ taskId: string }>();
  let token = localStorage.getItem("authToken");

  if (!token) token = "lkajsdfljdfjlaksdj";

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => GetTask({ taskId: Number(params.taskId), token }),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    return <p>Error...</p>;
  }
  if (!tasks) {
    return <p>data not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2 p-8">
      {tasks.map((task, idx) => (
        <div key={idx} className="hover:border-2 p-1 rounded-md">
          <h1>{}</h1>
          <Image
            height={400}
            width={400}
            src={task.option.imageUrl}
            alt="src"
            className="w-full rounded-md"
          />
          <p className="text-muted-foreground">
            Votes: <span className="font-bold">{task.count}</span>{" "}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TaskPage;
