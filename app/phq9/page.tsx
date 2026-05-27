"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHQ9Survey } from "@/components/phq9-survey";
import { useAppStore } from "@/lib/store";

export default function PHQ9Page() {
  const router = useRouter();
  const { user } = useAppStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!user || !user.isOnboarded) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen py-8 px-4">
      {/* Header */}
      <div className="container mx-auto max-w-2xl mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="dipeluk logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-blue-700">dipeluk</h1>
              <p className="text-sm text-gray-500">Survei PHQ-9</p>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Component */}
      <PHQ9Survey />
    </main>
  );
}
