import { Button } from "@/components/ui/button";
import config from "@/config";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-2">{config.appName}</h1>
      <h2 className="text-2xl font-medium text-gray-600">{config.appTitle}</h2>

      <div className="m-4">
        <Button>Get started</Button>
      </div>
    </div>
  );
}
