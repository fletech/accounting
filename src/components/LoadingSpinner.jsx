import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "default", centered = false }) {
  const sizes = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <div
      className={`text-blue-500 animate-spin ${sizes[size]} ${
        centered ? "mx-auto" : ""
      }`}
    >
      <Loader2 className="w-full h-full" />
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="large" />
      <p className="text-gray-500 animate-pulse">Loading...</p>
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/80 flex items-start justify-center z-50 h-screen pt-[20%]">
      <LoadingSpinner size="large" />
    </div>
  );
}
