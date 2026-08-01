import { ReactNode } from "react";
import { auth } from "@/auth";
import WorkspaceLayoutClient from "./WorkspaceLayoutClient";

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export default async function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  const session = await auth();

  return (
    <WorkspaceLayoutClient user={session?.user}>
      {children}
    </WorkspaceLayoutClient>
  );
}