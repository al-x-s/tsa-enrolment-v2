import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <Skeleton className="flex flex-col  w-[200px] p-6" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="flex flex-col w-[400px] p-6" />
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
        <Skeleton className="flex flex-col  w-[500px] p-6" />
        <Skeleton className="flex flex-col  w-[100px] p-6" />
      </CardFooter>
    </Card>
  );
};

export default Loading;
